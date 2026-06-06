export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { query, location } = req.query;
  if (!query) return res.status(400).json({ error: "query parameter required" });

  const rapidApiKey = process.env.JSEARCH_API_KEY;
  if (!rapidApiKey) return res.status(500).json({ error: "JSEARCH_API_KEY not configured" });

  const [jsearchResult, linkedinResult] = await Promise.allSettled([
    fetchJSearch(query, location, rapidApiKey),
    fetchLinkedIn(query, location, rapidApiKey),
  ]);

  const jsearchJobs  = jsearchResult.status  === "fulfilled" ? jsearchResult.value  : [];
  const linkedinJobs = linkedinResult.status === "fulfilled" ? linkedinResult.value : [];

  const jobs = dedup([...jsearchJobs, ...linkedinJobs]).slice(0, 10);

  if (!jobs.length) {
    return res.status(502).json({
      error: "No results from any source",
      sources: buildSourcesMeta(jsearchResult, linkedinResult, jsearchJobs, linkedinJobs),
    });
  }

  return res.status(200).json({
    jobs,
    sources: buildSourcesMeta(jsearchResult, linkedinResult, jsearchJobs, linkedinJobs),
  });
}

// ── JSearch ──────────────────────────────────────────────────────────────────

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
    remuneration: formatSalary(job),
    matchScore: null,
    myTimeScore: null,
  }));
}

// ── LinkedIn Jobs Search (jaypat87) ──────────────────────────────────────────

async function fetchLinkedIn(query, location, apiKey) {
  const url = new URL("https://linkedin-jobs-search.p.rapidapi.com/");
  url.searchParams.set("keywords", query);
  url.searchParams.set("location", location || "");
  url.searchParams.set("dateSincePosted", "past month");
  url.searchParams.set("limit", "6");

  const res = await fetch(url.toString(), {
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": "linkedin-jobs-search.p.rapidapi.com",
    },
  });
  const data = await res.json();

  if (data.message && data.message.includes("not subscribed")) {
    throw new Error("LinkedIn: not subscribed");
  }
  if (!Array.isArray(data)) throw new Error("LinkedIn: unexpected response");

  return data.slice(0, 6).map((job, i) => ({
    id: `linkedin-${i}`,
    source: "LinkedIn",
    title: job.title || "Poste sans titre",
    org: job.company || "Organisation",
    organization: job.company || "Organisation",
    location: job.location || "—",
    type: "—",
    duration: job.jobType || "—",
    tags: [],
    deadline: "Non précisée",
    url: job.jobUrl || "",
    description: (job.description || "").slice(0, 350).replace(/\s+/g, " ").trim() + "…",
    remuneration: job.salary || "",
    matchScore: null,
    myTimeScore: null,
  }));
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function dedup(jobs) {
  const seen = new Set();
  return jobs.filter((j) => {
    const key = `${j.title.toLowerCase().trim()}|${j.org.toLowerCase().trim()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildSourcesMeta(jsearchResult, linkedinResult, jsearchJobs, linkedinJobs) {
  return {
    jsearch:  jsearchResult.status  === "fulfilled" ? jsearchJobs.length  : "error",
    linkedin: linkedinResult.status === "fulfilled" ? linkedinJobs.length : "not subscribed",
  };
}

function formatType(type) {
  const map = { FULLTIME: "Full-time", PARTTIME: "Part-time", CONTRACTOR: "Contract", INTERN: "Stage" };
  return map[type] || type || "—";
}

function formatSalary(job) {
  if (!job.job_min_salary) return "";
  const min = Math.round(job.job_min_salary / 1000);
  const max = Math.round(job.job_max_salary / 1000);
  const curr = job.job_salary_currency || "";
  const period = job.job_salary_period === "YEAR" ? "/an" : job.job_salary_period === "MONTH" ? "/mois" : "";
  return `${min}k–${max}k ${curr}${period}`.trim();
}
