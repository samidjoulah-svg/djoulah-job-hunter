export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { query, location } = req.query;
  if (!query) return res.status(400).json({ error: "query parameter required" });

  const rapidApiKey = process.env.JSEARCH_API_KEY;
  if (!rapidApiKey) return res.status(500).json({ error: "JSEARCH_API_KEY not configured" });

  const [jsearchResult, remoteokResult] = await Promise.allSettled([
    fetchJSearch(query, location, rapidApiKey),
    fetchRemoteOK(query),
  ]);

  const jsearchJobs  = jsearchResult.status  === "fulfilled" ? jsearchResult.value  : [];
  const remoteokJobs = remoteokResult.status === "fulfilled" ? remoteokResult.value : [];

  const jobs = dedup([...jsearchJobs, ...remoteokJobs]).slice(0, 10);

  if (!jobs.length) {
    return res.status(502).json({
      error: "No results from any source",
      sources: buildMeta(jsearchResult, remoteokResult, jsearchJobs, remoteokJobs),
    });
  }

  return res.status(200).json({
    jobs,
    sources: buildMeta(jsearchResult, remoteokResult, jsearchJobs, remoteokJobs),
  });
}

// ── JSearch ───────────────────────────────────────────────────────────────────

async function fetchJSearch(query, location, apiKey) {
  const fullQuery = location ? `${query} ${location}` : query;
  const url = new URL("https://jsearch.p.rapidapi.com/search");
  url.searchParams.set("query", fullQuery);
  url.searchParams.set("page", "1");
  url.searchParams.set("num_pages", "1");

  const res = await fetch(url.toString(), {
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": "jsearch.p.rapidapi.com",
    },
  });
  const data = await res.json();
  if (!Array.isArray(data.data)) throw new Error("JSearch: unexpected response");

  return data.data.slice(0, 6).map((job, i) => ({
    id: `jsearch-${i}`,
    source: "JSearch",
    title: job.job_title || "Poste sans titre",
    org: job.employer_name || "Organisation",
    organization: job.employer_name || "Organisation",
    location: [job.job_city, job.job_country].filter(Boolean).join(", ") || "—",
    type: formatType(job.job_employment_type),
    duration: formatType(job.job_employment_type),
    tags: [],
    deadline: job.job_offer_expiration_datetime_utc
      ? new Date(job.job_offer_expiration_datetime_utc).toLocaleDateString("fr-FR")
      : "Non précisée",
    url: job.job_apply_link || job.job_google_link || "",
    description: (job.job_description || "").slice(0, 350).replace(/\s+/g, " ").trim() + "…",
    remuneration: formatSalaryJSearch(job),
    matchScore: null,
    myTimeScore: null,
  }));
}

// ── RemoteOK (remoteok.com/api — free, no key, real tag filtering) ───────────

// Map query keywords to RemoteOK tags
const QUERY_TAG_MAP = [
  [["health", "who", "oms", "epidemiology", "infectious", "disease"], "healthcare"],
  [["biotech", "diagnostics", "molecular", "biology", "ngs", "genomics", "bioinformatics", "laboratory"], "biotech"],
  [["science", "research", "professor", "university"], "science"],
  [["medical", "clinical"], "medical"],
];

function queryToTag(query) {
  const lower = query.toLowerCase();
  for (const [keywords, tag] of QUERY_TAG_MAP) {
    if (keywords.some((kw) => lower.includes(kw))) return tag;
  }
  return "science";
}

async function fetchRemoteOK(query) {
  const tag = queryToTag(query);
  const res = await fetch(`https://remoteok.com/api?tag=${tag}`, {
    headers: { "User-Agent": "DjoulahJobHunter/1.0" },
  });
  const data = await res.json();

  const jobs = data.filter((j) => typeof j === "object" && j.position);
  if (!jobs.length) throw new Error("RemoteOK: empty response");

  // Title keyword filter for extra relevance
  const STOP = new Set(["with", "from", "that", "this", "have", "will", "senior"]);
  const keywords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !STOP.has(w));

  const scored = jobs.map((job) => {
    const title = (job.position || "").toLowerCase();
    const hits = keywords.filter((kw) => title.includes(kw)).length;
    return { job, hits };
  });

  // Sort by keyword hits descending, keep top 6
  const top = scored
    .sort((a, b) => b.hits - a.hits)
    .slice(0, 6)
    .map(({ job }, i) => {
      const salMin = job.salary_min ? Math.round(job.salary_min / 1000) : null;
      const salMax = job.salary_max ? Math.round(job.salary_max / 1000) : null;
      const remuneration = salMin ? `${salMin}k–${salMax}k USD/an` : "";
      return {
        id: `remoteok-${i}`,
        source: "RemoteOK",
        title: job.position || "Poste sans titre",
        org: job.company || "Organisation",
        organization: job.company || "Organisation",
        location: job.location || "Remote",
        type: "Remote",
        duration: "Remote",
        tags: job.tags || [],
        deadline: "Non précisée",
        url: job.url || job.apply_url || "",
        description: (job.description || "").replace(/<[^>]+>/g, "").slice(0, 350).trim() + "…",
        remuneration,
        matchScore: null,
        myTimeScore: null,
      };
    });

  return top;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function dedup(jobs) {
  const seen = new Set();
  return jobs.filter((j) => {
    const key = `${j.title.toLowerCase().trim()}|${j.org.toLowerCase().trim()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildMeta(jsearchResult, remoteokResult, jsearchJobs, remoteokJobs) {
  return {
    jsearch:  jsearchResult.status  === "fulfilled" ? jsearchJobs.length  : "error",
    remoteok: remoteokResult.status === "fulfilled" ? remoteokJobs.length : "error",
  };
}

function formatType(type) {
  const map = { FULLTIME: "Full-time", PARTTIME: "Part-time", CONTRACTOR: "Contract", INTERN: "Stage" };
  return map[type] || type || "—";
}

function formatSalaryJSearch(job) {
  if (!job.job_min_salary) return "";
  const min = Math.round(job.job_min_salary / 1000);
  const max = Math.round(job.job_max_salary / 1000);
  const curr = job.job_salary_currency || "";
  const period = job.job_salary_period === "YEAR" ? "/an" : job.job_salary_period === "MONTH" ? "/mois" : "";
  return `${min}k–${max}k ${curr}${period}`.trim();
}
