const DR_SAMI_PROFILE = `PhD Immunogenetics (Paris VI, Pr Dausset Nobel Prize). PhD Molecular Biology (Oran). 30+ years: PCR/NGS expert, IVD CE development (Abbott/Omixon), lab deployments in 5 countries (Congo, DRC, Guinea, Germany, France), AI/ML genomics, epidemic response. Founder Wiratech Europe (Genopole Evry). Published Ebola Cell Mol Immunol 2021. GENOMSURV-DRC network. ISO 13485, Johns Hopkins Clinical Trials 2024. French (native), English (fluent), Arabic.`;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { query, location } = req.query;
  if (!query) return res.status(400).json({ error: "query parameter required" });

  const jsearchKey = process.env.JSEARCH_API_KEY;
  if (!jsearchKey) return res.status(500).json({ error: "JSEARCH_API_KEY not configured" });

  const fullQuery = location ? `${query} ${location}` : query;

  try {
    const url = new URL("https://jsearch.p.rapidapi.com/search");
    url.searchParams.set("query", fullQuery);
    url.searchParams.set("page", "1");
    url.searchParams.set("num_pages", "1");

    const jsearchRes = await fetch(url.toString(), {
      headers: {
        "x-rapidapi-key": jsearchKey,
        "x-rapidapi-host": "jsearch.p.rapidapi.com",
      },
    });

    const data = await jsearchRes.json();
    if (!data.data) return res.status(502).json({ error: "Upstream API error", details: data });

    const jobs = data.data.slice(0, 8).map((job, i) => ({
      id: `jsearch-${i}`,
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
      distanceFlag: "🌍",
    }));

    return res.status(200).json({ jobs });
  } catch {
    return res.status(500).json({ error: "Failed to reach JSearch API" });
  }
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
