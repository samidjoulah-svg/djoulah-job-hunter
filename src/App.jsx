import { useState } from "react";

const MOCK_JOBS = [
  {
    id: 1,
    title: "Technical Officer – Genomic Surveillance",
    org: "WHO",
    location: "Geneva, Switzerland",
    type: "Full-time",
    tags: ["OMS", "NGS", "Épidémie Ebola"],
    deadline: "2026-07-15",
    url: "https://careers.who.int",
    description:
      "Lead genomic surveillance initiatives for emerging pathogens in Africa and coordinate with regional reference laboratories on NGS data analysis and reporting.",
  },
  {
    id: 2,
    title: "Senior Advisor – Molecular Diagnostics",
    org: "UNDP",
    location: "Nairobi, Kenya",
    type: "Contract",
    tags: ["UNP", "PCR", "Africa CDC"],
    deadline: "2026-07-30",
    url: "https://jobs.undp.org",
    description:
      "Provide expert guidance on deployment of molecular diagnostics platforms in Sub-Saharan Africa, including PCR and NGS systems for infectious disease monitoring.",
  },
  {
    id: 3,
    title: "IVD Regulatory Affairs Manager – EMEA",
    org: "BioTech Europe GmbH",
    location: "Berlin, Germany",
    type: "Full-time",
    tags: ["Biotech Europe", "CE-IVD", "NGS"],
    deadline: "2026-08-10",
    url: "https://biotecheurope.com/careers",
    description:
      "Manage CE-IVD regulatory submissions and post-market surveillance for NGS-based diagnostic kits distributed across European and African markets.",
  },
  {
    id: 4,
    title: "Ebola Response Coordinator – DRC",
    org: "Africa CDC",
    location: "Kinshasa, DRC",
    type: "Contract",
    tags: ["Épidémie Ebola", "Africa CDC", "PCR"],
    deadline: "2026-07-20",
    url: "https://africacdc.org/careers",
    description:
      "Coordinate Ebola outbreak response activities in DRC including laboratory capacity building, PCR testing scale-up, and genomic sequencing for variant tracking.",
  },
  {
    id: 5,
    title: "Professor – Genomic Medicine & Immunogenetics",
    org: "Université Nouveaux Horizons",
    location: "Lubumbashi, DRC",
    type: "Full-time",
    tags: ["Enseignement universitaire", "NGS", "Enseignement international"],
    deadline: "2026-09-01",
    url: "https://unh-lubumbashi.org",
    description:
      "Lead the genomic medicine and immunogenetics department, develop NGS curriculum, supervise doctoral students, and collaborate on GENOMSURV-DRC national surveillance network.",
  },
  {
    id: 6,
    title: "Scientific Director – Precision Diagnostics",
    org: "Institut Pasteur",
    location: "Paris, France",
    type: "Full-time",
    tags: ["NGS", "Biotech Europe", "OMS"],
    deadline: "2026-08-25",
    url: "https://pasteur.fr/careers",
    description:
      "Direct precision diagnostics research programs combining NGS, AI/ML analysis and clinical validation, with a focus on infectious disease and oncology applications.",
  },
];

const ALL_TAGS = ["OMS", "UNP", "Africa CDC", "Biotech Europe", "Épidémie Ebola", "NGS", "Enseignement universitaire", "Enseignement international"];

const DR_SAMI_PROFILE = `Dr. Sami Djoulah — PhD Immunogenetics (Paris VI, Pr Dausset Nobel Prize) & PhD Molecular Biology (Oran, Algeria).
Fondateur de Wiratech Europe (Genopole Évry). 30+ ans d'expérience en immunogénétique, biologie moléculaire, développement de kits DIV (CE/Abbott/Omixon), déploiement terrain PCR/NGS en Afrique et Europe, IA/ML pour l'analyse génomique, réponse épidémique.
Publications: 20+ articles peer-reviewed, dont Cell Mol Immunol 2021 (épitopes T CD4 Ebola NP/GP).
Certifications: Gestion essais cliniques Johns Hopkins 2024, ISO 13485 QARAD Belgique 2012.
Projet phare: GENOMSURV-DRC — réseau national de surveillance génomique des pathogènes émergents en RDC.
Langues: Français (natif), Anglais (courant), Arabe (conversationnel).`;

export default function App() {
  const [activeTab, setActiveTab] = useState("search");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [offerText, setOfferText] = useState("");
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [trackedJobs, setTrackedJobs] = useState([]);
  const [pitchJob, setPitchJob] = useState(null);
  const [generatedPitch, setGeneratedPitch] = useState("");
  const [isPitching, setIsPitching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const TAG_QUERIES = {
    "OMS": "global health senior consultant laboratory",
    "UNP": "international organization health program senior consultant",
    "Africa CDC": "epidemiology laboratory public health senior",
    "Biotech Europe": "biotech diagnostics molecular senior director",
    "Épidémie Ebola": "infectious disease outbreak response laboratory",
    "NGS": "NGS genomics senior scientist laboratory diagnostics",
    "Enseignement universitaire": "molecular biology professor university",
    "Enseignement international": "genomics bioinformatics senior scientist",
  };

  const toggleTag = async (tag) => {
    const nowSelected = !selectedTags.includes(tag);
    setSelectedTags(nowSelected ? [tag] : []);
    if (!nowSelected) { setSearchResults(null); setSearchError(""); return; }
    setIsSearching(true);
    setSearchError("");
    setSearchResults(null);
    try {
      const query = TAG_QUERIES[tag] || tag;
      const resp = await fetch(`/api/jobs?query=${encodeURIComponent(query)}`);
      const data = await resp.json();
      setSearchResults(data.jobs?.length > 0 ? data.jobs : []);
      if (!data.jobs?.length) setSearchError("Aucune offre trouvée — offres de démonstration affichées.");
    } catch {
      setSearchResults([]);
      setSearchError("Erreur API — offres de démonstration affichées.");
    }
    setIsSearching(false);
  };

  const displayJobs = (searchResults !== null && searchResults.length > 0)
    ? searchResults
    : (selectedTags.length === 0
        ? MOCK_JOBS
        : MOCK_JOBS.filter((job) => selectedTags.some((tag) => job.tags.includes(tag))));

  const toggleTrack = (job) => {
    setTrackedJobs((prev) =>
      prev.find((j) => j.id === job.id)
        ? prev.filter((j) => j.id !== job.id)
        : [...prev, { ...job, status: "À postuler", notes: "" }]
    );
  };

  const isTracked = (id) => trackedJobs.some((j) => j.id === id);

  const generateLetter = async () => {
    if (!offerText.trim()) {
      setError("Veuillez coller le texte de l'offre d'emploi.");
      return;
    }
    setIsGenerating(true);
    setError("");
    setGeneratedLetter("");
    try {
      const response = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `Tu es un expert en rédaction de lettres de motivation pour des postes scientifiques et médicaux internationaux.

Voici le profil du candidat:
${DR_SAMI_PROFILE}

Voici l'offre d'emploi:
${offerText}

Rédige une lettre de motivation professionnelle et percutante en français (ou en anglais si l'offre est en anglais), d'environ 350 mots. 
- Commence par "Madame, Monsieur," ou "Dear Hiring Committee,"
- Mets en avant les expériences les plus pertinentes par rapport à l'offre
- Cite des réalisations concrètes (GENOMSURV-DRC, LNSP Congo, kits CE/Abbott, publication Cell Mol Immunol 2021)
- Termine par une formule de politesse professionnelle
- Signe: Dr. Sami Djoulah`,
            },
          ],
        }),
      });
      const data = await response.json();
      if (data.content && data.content[0]) {
        setGeneratedLetter(data.content[0].text);
      } else {
        setError("Erreur lors de la génération. Réessayez.");
      }
    } catch (err) {
      setError("Erreur de connexion à l'API Anthropic.");
    }
    setIsGenerating(false);
  };

  const generatePitch = async (job) => {
    setIsPitching(true);
    setPitchJob(job);
    setGeneratedPitch("");
    try {
      const response = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `Profil candidat: ${DR_SAMI_PROFILE}

Poste: ${job.title} chez ${job.org} (${job.location})
Description: ${job.description}

Rédige un pitch de candidature percutant en 5 points clés (bullet points), en français, montrant pourquoi Dr. Djoulah est le candidat idéal. Sois concis et impactant.`,
            },
          ],
        }),
      });
      const data = await response.json();
      if (data.content && data.content[0]) {
        setGeneratedPitch(data.content[0].text);
      }
    } catch (err) {
      setGeneratedPitch("Erreur de connexion.");
    }
    setIsPitching(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f1117", color: "#e8eaf0", fontFamily: "'Georgia', serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1a1f35 0%, #0f1117 100%)", borderBottom: "1px solid #2a3050", padding: "24px 32px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#7eb8f7", letterSpacing: 1 }}>
            🔬 Julia Job Hunter
          </h1>
          <p style={{ margin: "4px 0 0", color: "#8892b0", fontSize: 13 }}>
            Dr. Sami Djoulah — Molecular Diagnostics · NGS · AI/ML · Africa & Europe
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: "#161b2e", borderBottom: "1px solid #2a3050" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex" }}>
          {[
            { id: "search", label: "🔍 Recherche" },
            { id: "offer", label: "📝 Mon offre" },
            { id: "track", label: `📌 Suivi (${trackedJobs.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "14px 24px",
                background: "none",
                border: "none",
                borderBottom: activeTab === tab.id ? "2px solid #7eb8f7" : "2px solid transparent",
                color: activeTab === tab.id ? "#7eb8f7" : "#8892b0",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: activeTab === tab.id ? 600 : 400,
                transition: "all 0.2s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 24px" }}>

        {/* TAB: RECHERCHE */}
        {activeTab === "search" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <p style={{ color: "#8892b0", fontSize: 13, marginBottom: 12 }}>Filtrer par domaine :</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {ALL_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 20,
                      border: selectedTags.includes(tag) ? "1px solid #7eb8f7" : "1px solid #2a3050",
                      background: selectedTags.includes(tag) ? "rgba(126,184,247,0.15)" : "transparent",
                      color: selectedTags.includes(tag) ? "#7eb8f7" : "#8892b0",
                      cursor: "pointer",
                      fontSize: 12,
                      transition: "all 0.2s",
                    }}
                  >
                    {tag}
                  </button>
                ))}
                {selectedTags.length > 0 && (
                  <button
                    onClick={() => { setSelectedTags([]); setSearchResults(null); setSearchError(""); }}
                    style={{ padding: "6px 14px", borderRadius: 20, border: "1px solid #ff6b6b", background: "transparent", color: "#ff6b6b", cursor: "pointer", fontSize: 12 }}
                  >
                    ✕ Effacer
                  </button>
                )}
              </div>
            </div>

            {isSearching && (
              <div style={{ color: "#7eb8f7", fontSize: 13, marginBottom: 16 }}>⏳ Recherche Indeed en cours...</div>
            )}
            {searchError && (
              <div style={{ marginBottom: 12, padding: "6px 10px", background: "rgba(251,191,36,0.08)", border: "1px solid #4a3a1a", borderRadius: 8, fontSize: 12, color: "#fbbf24" }}>⚠️ {searchError}</div>
            )}
            {!isSearching && (
              <p style={{ color: "#8892b0", fontSize: 13, marginBottom: 16 }}>
                {searchResults !== null && searchResults.length > 0
                  ? `${searchResults.length} offre(s) Indeed trouvée(s)`
                  : `${displayJobs.length} offre(s)`}
              </p>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {!isSearching && displayJobs.map((job) => (
                <div
                  key={job.id}
                  style={{
                    background: "#161b2e",
                    border: selectedJob?.id === job.id ? "1px solid #7eb8f7" : "1px solid #2a3050",
                    borderRadius: 12,
                    padding: 20,
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: "0 0 4px", fontSize: 16, color: "#e8eaf0", fontWeight: 600 }}>{job.title}</h3>
                      <p style={{ margin: "0 0 8px", color: "#7eb8f7", fontSize: 13 }}>
                        {job.org} · {job.location} · <span style={{ color: "#64748b" }}>{job.type}</span>
                      </p>
                      <p style={{ margin: "0 0 12px", color: "#8892b0", fontSize: 13, lineHeight: 1.5 }}>{job.description}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                        {job.tags.map((tag) => (
                          <span key={tag} style={{ padding: "3px 10px", borderRadius: 12, background: "rgba(126,184,247,0.1)", color: "#7eb8f7", fontSize: 11 }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p style={{ margin: 0, color: "#64748b", fontSize: 12 }}>⏰ Deadline : {job.deadline}</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 120 }}>
                      <button
                        onClick={() => toggleTrack(job)}
                        style={{
                          padding: "8px 16px",
                          borderRadius: 8,
                          border: isTracked(job.id) ? "1px solid #7eb8f7" : "1px solid #2a3050",
                          background: isTracked(job.id) ? "rgba(126,184,247,0.15)" : "transparent",
                          color: isTracked(job.id) ? "#7eb8f7" : "#8892b0",
                          cursor: "pointer",
                          fontSize: 12,
                        }}
                      >
                        {isTracked(job.id) ? "📌 Suivi" : "+ Suivre"}
                      </button>
                      <button
                        onClick={() => { generatePitch(job); setSelectedJob(job); }}
                        style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #4ade80", background: "transparent", color: "#4ade80", cursor: "pointer", fontSize: 12 }}
                      >
                        ⚡ Pitch IA
                      </button>
                    </div>
                  </div>

                  {pitchJob?.id === job.id && (
                    <div style={{ marginTop: 16, padding: 16, background: "#0f1117", borderRadius: 8, borderLeft: "3px solid #4ade80" }}>
                      {isPitching ? (
                        <p style={{ color: "#4ade80", fontSize: 13 }}>⚡ Génération du pitch en cours...</p>
                      ) : (
                        <div>
                          <p style={{ margin: "0 0 8px", color: "#4ade80", fontSize: 12, fontWeight: 600 }}>PITCH IA</p>
                          <p style={{ margin: 0, color: "#e8eaf0", fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{generatedPitch}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: MON OFFRE */}
        {activeTab === "offer" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ margin: "0 0 8px", fontSize: 18, color: "#e8eaf0" }}>📝 Générer une lettre de motivation</h2>
              <p style={{ margin: 0, color: "#8892b0", fontSize: 13 }}>
                Colle le texte d'une offre réelle (WHO, ONU, LinkedIn...) et Claude génère ta lettre personnalisée.
              </p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", color: "#8892b0", fontSize: 13, marginBottom: 8 }}>
                Texte de l'offre d'emploi *
              </label>
              <textarea
                value={offerText}
                onChange={(e) => setOfferText(e.target.value)}
                placeholder="Colle ici le texte complet de l'offre d'emploi (titre, organisation, description, exigences...)&#10;&#10;Exemple: Technical Officer – Genomic Surveillance, WHO Geneva. The incumbent will lead..."
                style={{
                  width: "100%",
                  minHeight: 200,
                  padding: 16,
                  background: "#161b2e",
                  border: "1px solid #2a3050",
                  borderRadius: 8,
                  color: "#e8eaf0",
                  fontSize: 13,
                  lineHeight: 1.6,
                  resize: "vertical",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {error && (
              <div style={{ padding: 12, background: "rgba(255,107,107,0.1)", border: "1px solid #ff6b6b", borderRadius: 8, color: "#ff6b6b", fontSize: 13, marginBottom: 16 }}>
                {error}
              </div>
            )}

            <button
              onClick={generateLetter}
              disabled={isGenerating}
              style={{
                padding: "12px 28px",
                borderRadius: 8,
                border: "none",
                background: isGenerating ? "#2a3050" : "linear-gradient(135deg, #3b82f6, #7eb8f7)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                cursor: isGenerating ? "not-allowed" : "pointer",
                marginBottom: 24,
              }}
            >
              {isGenerating ? "⏳ Génération en cours..." : "✉️ Générer la lettre avec Claude"}
            </button>

            {generatedLetter && (
              <div style={{ background: "#161b2e", border: "1px solid #2a3050", borderRadius: 12, padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h3 style={{ margin: 0, color: "#7eb8f7", fontSize: 15 }}>✉️ Lettre de motivation générée</h3>
                  <button
                    onClick={() => navigator.clipboard.writeText(generatedLetter)}
                    style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #2a3050", background: "transparent", color: "#8892b0", cursor: "pointer", fontSize: 12 }}
                  >
                    📋 Copier
                  </button>
                </div>
                <div style={{ color: "#e8eaf0", fontSize: 14, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                  {generatedLetter}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: SUIVI */}
        {activeTab === "track" && (
          <div>
            <h2 style={{ margin: "0 0 20px", fontSize: 18, color: "#e8eaf0" }}>📌 Offres suivies</h2>
            {trackedJobs.length === 0 ? (
              <div style={{ textAlign: "center", padding: 60, color: "#8892b0" }}>
                <p style={{ fontSize: 40, margin: "0 0 12px" }}>📭</p>
                <p>Aucune offre suivie pour l'instant.</p>
                <p style={{ fontSize: 13 }}>Clique sur "+ Suivre" dans l'onglet Recherche.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {trackedJobs.map((job) => (
                  <div key={job.id} style={{ background: "#161b2e", border: "1px solid #2a3050", borderRadius: 12, padding: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <h3 style={{ margin: "0 0 4px", fontSize: 15, color: "#e8eaf0" }}>{job.title}</h3>
                        <p style={{ margin: "0 0 8px", color: "#7eb8f7", fontSize: 13 }}>{job.org} · {job.location}</p>
                        <p style={{ margin: 0, color: "#64748b", fontSize: 12 }}>⏰ {job.deadline}</p>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <select
                          value={job.status}
                          onChange={(e) => setTrackedJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: e.target.value } : j))}
                          style={{ padding: "6px 10px", background: "#0f1117", border: "1px solid #2a3050", borderRadius: 6, color: "#e8eaf0", fontSize: 12, cursor: "pointer" }}
                        >
                          <option>À postuler</option>
                          <option>Postulé</option>
                          <option>Entretien</option>
                          <option>Accepté</option>
                          <option>Refusé</option>
                        </select>
                        <button
                          onClick={() => toggleTrack(job)}
                          style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #ff6b6b", background: "transparent", color: "#ff6b6b", cursor: "pointer", fontSize: 12 }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
