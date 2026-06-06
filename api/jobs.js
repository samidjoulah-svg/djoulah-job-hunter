export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { query, location } = req.query;
  if (!query) return res.status(400).json({ error: "query parameter required" });

  const apiKey = process.env.JSEARCH_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "JSEARCH_API_KEY not configured" });

  const fullQuery = location ? `${query} ${location}` : query;

  try {
    const url = new URL("https://jsearch.p.rapidapi.com/search");
    url.searchParams.set("query", fullQuery);
    url.searchParams.set("page", "1");
    url.searchParams.set("num_pages", "1");

    const response = await fetch(url.toString(), {
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "jsearch.p.rapidapi.com",
      },
    });

    const data = await response.json();
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
      remuneration: job.job_min_salary
        ? `${Math.round(job.job_min_salary / 1000)}k–${Math.round(job.job_max_salary / 1000)}k ${job.job_salary_currency}`
        : "",
      matchScore: 75,
      myTimeScore: 70,
      matchReason: "Offre Indeed / JSearch",
      myTimeReason: "",
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
