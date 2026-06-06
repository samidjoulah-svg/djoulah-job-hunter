import { useState } from "react";

const CV_SHORT = `Dr. Sami Djoulah, 58 ans, Paris. PhD Immunogenetique (Paris VI, 1998). Nationalites francaise et algerienne. Expert senior 30+ ans: PCR/NGS, IVD CE (Abbott/Omixon), deploiements laboratoires Afrique/Europe (Congo, DRC, Guinee, Allemagne). Fondateur Wiratech Europe (Genopole Evry). Publication Ebola (Cell Mol Immunol 2021). Reseau 10 partenaires technologiques. GENOMSURV-DRC en developpement. Certifications: Johns Hopkins Clinical Trials 2024, ISO 13485. Enseignement universitaire: ancien assistant. Disponible immediatement. Langues: francais (natif), anglais (courant), arabe.`;

const PITCH = `Expert en diagnostics moleculaires PCR/NGS et developpement IVD CE, avec 30 ans de terrain en Afrique et Europe. J'ai deploye des laboratoires operationnels au Congo, en RDC et en Guinee, developpe des kits distribues par Abbott, et publie sur les epitopes T de l'Ebola (Cell Mol Immunol, 2021). Je dirige Wiratech Europe et coordonne un reseau de 10 partenaires technologiques couvrant toute la chaine diagnostique. Disponible immediatement pour missions seniors ou postes de direction.`;

const SEARCH_THEMES = [
  { id: "who", label: "OMS / WHO", icon: "🌍", query: "WHO OMS senior consultant molecular diagnostics PCR NGS Africa 2026" },
  { id: "undp", label: "UNDP / ONU", icon: "🇺🇳", query: "UNDP senior consultant laboratory diagnostics genomics Africa 2026" },
  { id: "africacdc", label: "Africa CDC", icon: "🏥", query: "Africa CDC senior expert genomic surveillance epidemiology 2026" },
  { id: "biotech", label: "Biotech Europe", icon: "🔬", query: "senior director molecular diagnostics IVD CE biotechnology Europe 2026" },
  { id: "ebola", label: "Epidemies / Ebola", icon: "🧬", query: "senior expert Ebola epidemic response laboratory Africa 2026" },
  { id: "ngs", label: "NGS / Genomique", icon: "🧪", query: "senior expert NGS genomics laboratory Africa Europe 2026" },
  { id: "teach", label: "Enseignement Universitaire", icon: "🎓", query: "professeur associe maitre conferences immunogenetique biologie moleculaire genomique universite 2026" },
  { id: "teachint", label: "Universite Internationale", icon: "🏛️", query: "associate professor molecular biology genomics diagnostics international university Africa 2026" },
];

const SPONTANEOUS_TARGETS = [
  { id: "who_hq", workMode: "🏢 Presentiel 60% / Remote 40%", name: "WHO / OMS", icon: "🌍", domain: "Sante publique mondiale", why: "Tes deployements terrain + publication Ebola + discussions WHO-DRC donnent une legitimite directe.", contact: "careers.who.int", matchScore: 93, myTimeScore: 91, duration: "Consulting / Poste senior", remuneration: "~$100-150k + avantages ONU", distanceFlag: "🟢 Europe/Afrique" },
  { id: "africacdc_hq", workMode: "🏢 Presentiel terrain 80%", name: "Africa CDC", icon: "🏥", domain: "Surveillance epidemique Afrique", why: "GENOMSURV-DRC est exactement leur mandat. Tu as le reseau, les outils, l'experience terrain.", contact: "africacdc.org/careers", matchScore: 95, myTimeScore: 92, duration: "Mission / Poste expert", remuneration: "Package UA attractif", distanceFlag: "🟢 Europe/Afrique" },
  { id: "msf", workMode: "✈️ Terrain 100% - missions", name: "MSF", icon: "🆘", domain: "Urgences epidemiques terrain", why: "Expertise Ebola PCR + deployements rapides laboratoires = profil rare recherche par MSF.", contact: "msf.org/jobs", matchScore: 85, myTimeScore: 78, duration: "Missions 2-6 mois", remuneration: "Indemnites + logement + transport", distanceFlag: "🟢 Europe/Afrique" },
  { id: "pasteur", workMode: "🏢 Presentiel 70% / Remote 30%", name: "Institut Pasteur", icon: "🔬", domain: "Recherche et diagnostics infectieux", why: "Publication Ebola + PCR/NGS + reseau Afrique = profil ideal pour leurs programmes Afrique.", contact: "pasteur.fr/emploi", matchScore: 88, myTimeScore: 85, duration: "CDD / Consulting", remuneration: "Grille Pasteur senior + primes", distanceFlag: "🟢 Europe/Afrique" },
  { id: "gavi", workMode: "🏠 Remote 50% / Hybride 50%", name: "GAVI Alliance Vaccins", icon: "💉", domain: "Sante publique / Diagnostics", why: "Expertise IVD CE + deployements Afrique + reseau partenaires = valeur ajoutee directe.", contact: "gavi.org/careers", matchScore: 80, myTimeScore: 82, duration: "Consulting / Mission", remuneration: "Tarifs ONG internationale", distanceFlag: "🟢 Europe/Afrique" },
  { id: "biopharma", workMode: "🏠 Remote 60% / Hybride 40%", name: "Abbott / bioMerieux / Roche", icon: "💊", domain: "IVD / Diagnostics moleculaires", why: "Ton cycle IVD CE complet + distribution Abbott est une carte maitresse pour ces acteurs EMEA.", contact: "LinkedIn / site carrieres direct", matchScore: 87, myTimeScore: 84, duration: "CDI / Mission senior", remuneration: "90-150k EUR selon poste", distanceFlag: "🟢 Europe/Afrique" },
  { id: "unh", workMode: "✈️ Missions ponctuelles terrain", name: "UNH Lubumbashi DRC", icon: "🎓", domain: "Enseignement et recherche", why: "Relation partenaire deja etablie - candidature spontanee enseignement tres bien recue.", contact: "Contact direct Jean-Marie Kipela", matchScore: 94, myTimeScore: 90, duration: "Missions ponctuelles", remuneration: "Per diem + logement sur place", distanceFlag: "🟢 Europe/Afrique" },
  { id: "worldbank", workMode: "🏠 Remote 70% / Presentiel 30%", name: "Banque Mondiale Health Division", icon: "🏦", domain: "Sante publique / Financement projets", why: "Projets renforcement laboratoires Afrique finances par BM - profil consultant ideal.", contact: "worldbank.org/careers", matchScore: 78, myTimeScore: 80, duration: "Consulting court/moyen terme", remuneration: "Tarifs BM ~$700-1000/jour", distanceFlag: "🟡 Ameriques/Moyen-Orient" },
];

const TEST_JOBS = [
  { title: "Senior Consultant - Molecular Diagnostics & Lab Deployment", organization: "WHO / OMS", location: "Geneve, Suisse", type: "consulting", duration: "3 mois", remuneration: "800-1200 $/jour", workMode: "🏢 Presentiel 80% / Remote 20%", description: "Mission 3 mois pour deployer des solutions PCR/NGS dans des laboratoires de sante publique en Afrique subsaharienne.", matchScore: 95, myTimeScore: 92, myTimeReason: "OMS = reference CV + tarifs eleves + Europe", matchReason: "Profil terrain Afrique + PCR/NGS + deployements laboratoires verifies.", distanceFlag: "🟢 Europe/Afrique", url: "https://careers.who.int", deadline: "Non precisee" },
  { title: "Expert Senior - Surveillance Genomique Pathogenes Emergents", organization: "Africa CDC", location: "Addis-Abeba, Ethiopie", type: "consulting", duration: "6 mois", remuneration: "Package UA competitif", workMode: "🏢 Presentiel terrain 100%", description: "Developper un reseau NGS de surveillance genomique en Afrique de l'Est, formation des equipes locales.", matchScore: 91, myTimeScore: 88, myTimeReason: "Mission strategique, valorise GENOMSURV-DRC directement", matchReason: "GENOMSURV-DRC est exactement ce type de projet.", distanceFlag: "🟢 Europe/Afrique", url: "https://africacdc.org/careers", deadline: "Non precisee" },
  { title: "IVD Scientific Director - EMEA", organization: "Partenaire Abbott / CE-IVD", location: "Paris / Remote", type: "CDI", duration: "CDI", remuneration: "90-130 k EUR/an", workMode: "🏠 Remote 70% / Hybride 30%", description: "Direction scientifique et reglementaire d'une gamme CE-IVD pour le marche EMEA, supervision des validations.", matchScore: 88, myTimeScore: 85, myTimeReason: "Paris + remote = ideal famille, poste permanent stable", matchReason: "Cycle IVD CE Abbott EMEA = parcours exact.", distanceFlag: "🟢 Europe/Afrique", url: "", deadline: "Non precisee" },
  { title: "Senior Technical Advisor - PCR/NGS Lab Setup", organization: "USAID / PATH", location: "Washington DC + missions Afrique", type: "consulting", duration: "2-6 semaines", remuneration: "Tarif senior + vols + per diem", workMode: "✈️ Missions terrain 100%", description: "Conseiller senior pour renforcement des capacites laboratoires en Afrique francophone, missions 2-6 semaines.", matchScore: 78, myTimeScore: 70, myTimeReason: "USA = distance famille, exige package complet transport", matchReason: "Deployements Congo, DRC, Guinee correspondent exactement.", distanceFlag: "🟡 Ameriques/Moyen-Orient", url: "https://www.path.org/careers", deadline: "Non precisee" },
  { title: "Maitre de Conferences - Immunogenetique & Biologie Moleculaire", organization: "Universite Paris-Saclay / Genopole", location: "Evry, France", type: "CDI", duration: "CDI", remuneration: "35-55 k EUR/an", workMode: "🏢 Presentiel 80% / Remote 20%", description: "Enseignant-chercheur en immunogenetique et genomique medicale. Cours Licence/Master, direction TP PCR/NGS.", matchScore: 90, myTimeScore: 82, myTimeReason: "Paris + statut stable, mais salaire MCU limite vs consulting", matchReason: "PhD Paris VI (Pr Dausset) + 20+ publications + experience assistanat.", distanceFlag: "🟢 Europe/Afrique", url: "https://www.galaxie.enseignementsup-recherche.gouv.fr", deadline: "Non precisee" },
  { title: "Professeur Associe - Genetique & Diagnostics Moleculaires", organization: "UNH Lubumbashi DRC", location: "Lubumbashi, DRC", type: "consulting", duration: "Missions ponctuelles", remuneration: "Per diem + logement", workMode: "✈️ Terrain 100% - missions courtes", description: "Enseignement genetique medicale et diagnostics moleculaires. Formation etudiants et techniciens NGS/PCR.", matchScore: 93, myTimeScore: 90, myTimeReason: "Relation existante UNH + impact fort + mission courte possible", matchReason: "Partenaire scientifique actuel - confiance et relation etablies.", distanceFlag: "🟢 Europe/Afrique", url: "", deadline: "Non precisee" },
  { title: "Visiting Professor - Molecular Diagnostics & Genomics", organization: "Johns Hopkins Bloomberg School", location: "Baltimore, USA (cours en ligne possibles)", type: "consulting", duration: "1 semestre", remuneration: "Honoraires + frais couverts", workMode: "💻 Remote 60% / Presentiel 40%", description: "Cours invite en diagnostics moleculaires et surveillance genomique des maladies infectieuses.", matchScore: 72, myTimeScore: 75, myTimeReason: "Johns Hopkins = prestige CV maximal, cours en ligne evite deplacement", matchReason: "Certifications Johns Hopkins 2024 + publication Ebola = credibilite directe.", distanceFlag: "🟡 Ameriques/Moyen-Orient", url: "https://publichealth.jhu.edu", deadline: "Non precisee" },
  { title: "Scientific Director - Genomics & Precision Diagnostics", organization: "Institut de recherche medical", location: "Singapour", type: "CDI", duration: "CDI", remuneration: "SGD 180-220 k/an", workMode: "🏢 Presentiel 90% - expatriation", description: "Direction d'un departement genomique international, equipe 15 personnes, collaborations Asia-Pacifique.", matchScore: 65, myTimeScore: 50, myTimeReason: "Tres loin famille, acceptable seulement si package exceptionnel", matchReason: "Expertise NGS correspond, mais distance familiale a considerer.", distanceFlag: "🔴 Asie/Australie", url: "", deadline: "Non precisee" },
];

const STATUSES = ["A envoyer", "Envoye", "En attente", "Entretien", "Refus"];
const STATUS_COLORS = { "A envoyer": "#5b9bd5", "Envoye": "#fbbf24", "En attente": "#a78bfa", "Entretien": "#4ade80", "Refus": "#f87171" };

const scoreColor = (s) => s >= 75 ? "#4ade80" : s >= 50 ? "#fbbf24" : "#f87171";
const scoreLabel = (s) => s >= 75 ? "Excellent" : s >= 50 ? "Bon" : "Partiel";

const DecisionBadge = ({ matchScore, myTimeScore }) => {
  const combined = Math.round((matchScore + myTimeScore) / 2);
  const bothGreen = matchScore >= 75 && myTimeScore >= 75;
  const bothRed = matchScore < 50 && myTimeScore < 50;
  const label = bothGreen ? "GO" : bothRed ? "PASS" : "?";
  const col = bothGreen ? "#4ade80" : bothRed ? "#f87171" : "#fbbf24";
  const bg = bothGreen ? "rgba(74,222,128,0.15)" : bothRed ? "rgba(248,113,113,0.15)" : "rgba(251,191,36,0.15)";
  const border = bothGreen ? "#2a6a4a" : bothRed ? "#6a2a2a" : "#6a5a2a";
  return (
    <div style={{ textAlign: "center", borderLeft: "1px solid #1e4976", paddingLeft: 6 }}>
      <div style={{ fontSize: 16, fontWeight: "bold", color: col, background: bg, border: "1px solid " + border, borderRadius: 6, padding: "1px 5px" }}>{combined}</div>
      <div style={{ fontSize: 7, color: col, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
    </div>
  );
};

const ScoreBlock = ({ matchScore, myTimeScore }) => (
  <div style={{ display: "flex", gap: 5, marginLeft: 8 }}>
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 16, fontWeight: "bold", color: scoreColor(matchScore) }}>{matchScore}</div>
      <div style={{ fontSize: 7, color: "#4a7a9a", textTransform: "uppercase" }}>Match</div>
    </div>
    <div style={{ textAlign: "center", borderLeft: "1px solid #1e4976", paddingLeft: 5 }}>
      <div style={{ fontSize: 16, fontWeight: "bold", color: scoreColor(myTimeScore) }}>{myTimeScore}</div>
      <div style={{ fontSize: 7, color: "#4a7a9a", textTransform: "uppercase" }}>Mon temps</div>
    </div>
    <DecisionBadge matchScore={matchScore} myTimeScore={myTimeScore} />
  </div>
);

const BadgeRow = ({ duration, remuneration, distanceFlag, workMode }) => (
  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8, alignItems: "center" }}>
    {duration && <span style={{ fontSize: 11, fontWeight: "bold", background: "rgba(251,191,36,0.15)", border: "1px solid #b45309", borderRadius: 8, padding: "3px 10px", color: "#fcd34d" }}>⏱ {duration}</span>}
    {remuneration && <span style={{ fontSize: 11, fontWeight: "bold", background: "rgba(74,222,128,0.12)", border: "1px solid #2a6a4a", borderRadius: 8, padding: "3px 10px", color: "#86efac" }}>💰 {remuneration}</span>}
    {workMode && <span style={{ fontSize: 11, fontWeight: "bold", background: "rgba(168,130,255,0.12)", border: "1px solid #5a3a8a", borderRadius: 8, padding: "3px 10px", color: "#c4a8ff" }}>{workMode}</span>}
    {distanceFlag && <span style={{ fontSize: 10, background: "rgba(255,255,255,0.05)", border: "1px solid #1e4976", borderRadius: 20, padding: "2px 8px", color: "#a8c8e8" }}>{distanceFlag}</span>}
  </div>
);

const CoverLetterBlock = ({ application, onCopy, copied }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
    <div style={{ background: "rgba(13,74,138,0.2)", border: "1px solid #1e4976", borderRadius: 12, padding: "13px" }}>
      <div style={{ fontSize: 10, letterSpacing: 3, color: "#5b9bd5", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8 }}>Points cles</div>
      {(application.keyPoints || []).map((pt, i) => (
        <div key={i} style={{ display: "flex", gap: 7, marginBottom: 6, fontSize: 12, color: "#a8d0f0", lineHeight: 1.5 }}>
          <span style={{ color: "#4ade80", flexShrink: 0 }}>✓</span> {pt}
        </div>
      ))}
    </div>
    <div style={{ background: "rgba(13,40,74,0.6)", border: "1px solid #1e4976", borderRadius: 12, padding: "15px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
        <div style={{ fontSize: 10, letterSpacing: 3, color: "#5b9bd5", textTransform: "uppercase", fontFamily: "monospace" }}>Lettre</div>
        <button onClick={onCopy} style={{ background: copied ? "rgba(74,222,128,0.2)" : "rgba(91,155,213,0.15)", border: "1px solid " + (copied ? "#4ade80" : "#1e4976"), borderRadius: 6, padding: "3px 8px", color: copied ? "#4ade80" : "#5b9bd5", fontSize: 10, cursor: "pointer", fontFamily: "monospace" }}>
          {copied ? "✓ Copie!" : "📋 Copier"}
        </button>
      </div>
      {application.subjectLine && (
        <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 6, padding: "5px 9px", marginBottom: 9, fontSize: 11, color: "#a8d0f0" }}>
          <span style={{ color: "#5b9bd5" }}>Objet : </span>{application.subjectLine}
        </div>
      )}
      <div style={{ fontSize: 13, lineHeight: 1.8, color: "#c8dff0", whiteSpace: "pre-wrap" }}>{application.coverLetter}</div>
    </div>
    {application.tips && application.tips.length > 0 && (
      <div style={{ background: "rgba(13,40,74,0.4)", border: "1px solid #1e4976", borderRadius: 12, padding: "12px 14px" }}>
        <div style={{ fontSize: 10, letterSpacing: 3, color: "#5b9bd5", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 7 }}>💡 Conseils</div>
        {application.tips.map((tip, i) => (
          <div key={i} style={{ fontSize: 11, color: "#8aaec8", marginBottom: 5, paddingLeft: 9, borderLeft: "2px solid #1e4976", lineHeight: 1.5 }}>{tip}</div>
        ))}
      </div>
    )}
  </div>
);

export default function Home() {
  const [step, setStep] = useState("search");
  const [activeTab, setActiveTab] = useState("search");
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [application, setApplication] = useState(null);
  const [loadingApp, setLoadingApp] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pitchCopied, setPitchCopied] = useState(false);
  const [apiError, setApiError] = useState("");
  const [tracker, setTracker] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [spontApp, setSpontApp] = useState(null);
  const [spontTarget, setSpontTarget] = useState(null);
  const [loadingSpontApp, setLoadingSpontApp] = useState(false);
  const [spontCopied, setSpontCopied] = useState(false);

  const callAPI = async (prompt) => {
    const r = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 900,
        messages: [{ role: "user", content: prompt }]
      })
    });
    const d = await r.json();
    const text = (d.content || []).map(i => i.text || "").filter(Boolean).join("");
    const m = text.match(/\{[\s\S]*\}/);
    return m ? JSON.parse(m[0]) : null;
  };

  const fallbackLetter = (title, org, isSpont) => ({
    subjectLine: (isSpont ? "Candidature Spontanee - Expert Senior Diagnostics Moleculaires | Dr. Sami Djoulah" : "Candidature - " + title + " | Dr. Sami Djoulah"),
    coverLetter: "Madame, Monsieur,\n\nJe me permets de vous adresser ma candidature" + (isSpont ? " spontanee" : "") + " pour un poste d'expert senior au sein de " + org + ".\n\nFort de plus de 30 ans d'experience en diagnostics moleculaires, avec des deployements verifies dans 5 pays et 6 laboratoires operationnels (LNSP Brazzaville inaugure par le Ministre de la Sante Gilbert Mokoki en decembre 2021, UNH Lubumbashi DRC, Enverq Guinee, WeDiag Allemagne), je pense pouvoir apporter une contribution directe et immediate.\n\nMon expertise couvre la chaine complete: PCR/NGS, kits CE-IVD commercialises via Abbott et Omixon, analyse AI/ML, LIMS. Je suis co-auteur d'une publication Ebola (Cell Mol Immunol, 2021) et coordonne un reseau de 10 partenaires technologiques internationaux. Je developpe actuellement GENOMSURV-DRC, un reseau national de surveillance genomique en RDC.\n\nDisponible immediatement. References institutionnelles disponibles sur demande.\n\nCordialement,\nDr. Sami Djoulah\nsami@djoulah.cloud | +33 6 23 82 23 52 | Paris, France",
    keyPoints: ["5 pays, 6 laboratoires deployes operationnels - references disponibles", "IVD CE complet Abbott/Omixon + reseau 10 partenaires technologiques", "Disponible immediatement - publication Ebola 2021 + GENOMSURV-DRC en cours"],
    tips: ["Mentionner LNSP Brazzaville (2021) avec le nom du Ministre Mokoki - signal fort.", "Proposer un appel 20 min - plus efficace qu'attendre une reponse formelle."]
  });

  const searchJobs = async (theme, useTest) => {
    setSelectedTheme(theme);
    setLoadingJobs(true);
    setJobs([]);
    setApiError("");
    setStep("results");
    setActiveTab("search");
    if (useTest) {
      setLoadingMsg("Chargement...");
      setTimeout(() => { setJobs(TEST_JOBS); setLoadingJobs(false); }, 700);
      return;
    }
    try {
      setLoadingMsg("Recherche Indeed...");
      const r1 = await fetch(`/api/jobs?query=${encodeURIComponent(theme.query)}`);
      const d1 = await r1.json();
      if (d1.jobs && d1.jobs.length > 0) {
        setJobs(d1.jobs);
      } else {
        setJobs(TEST_JOBS);
        setApiError("Aucun résultat Indeed — offres de démonstration affichées.");
      }
    } catch (e) { setJobs(TEST_JOBS); setApiError("Erreur réseau — offres de démonstration affichées."); }
    setLoadingJobs(false);
  };

  const generateApplication = async (job) => {
    setSelectedJob(job);
    setLoadingApp(true);
    setApplication(null);
    setStep("apply");
    try {
      const prompt = "Cover letter for Dr. Sami Djoulah applying to: " + job.title + " at " + job.organization + " in " + job.location + ". Profile: " + CV_SHORT + ". Include concrete facts: 5 countries, 6 labs deployed, Abbott/Omixon IVD, Ebola 2021, available immediately, references available. JSON only no markdown: {\"subjectLine\":\"\",\"coverLetter\":\"\",\"keyPoints\":[\"\",\"\",\"\"],\"tips\":[\"\",\"\"]}";
      const result = await callAPI(prompt);
      setApplication(result || fallbackLetter(job.title, job.organization, false));
    } catch (e) { setApplication(fallbackLetter(job.title, job.organization, false)); }
    setLoadingApp(false);
  };

  const generateSpontaneous = async (target) => {
    setSpontTarget(target);
    setLoadingSpontApp(true);
    setSpontApp(null);
    try {
      const prompt = "Write a spontaneous application (candidature spontanee) for Dr. Sami Djoulah to: " + target.name + " domain: " + target.domain + ". Why relevant: " + target.why + ". Profile: " + CV_SHORT + ". Proactive outreach tone, senior expert. Include: 5 countries, 6 labs, Abbott/Omixon IVD, Ebola 2021, available immediately. JSON only no markdown: {\"subjectLine\":\"\",\"coverLetter\":\"\",\"keyPoints\":[\"\",\"\",\"\"],\"tips\":[\"\",\"\"]}";
      const result = await callAPI(prompt);
      setSpontApp(result || fallbackLetter("Candidature Spontanee", target.name, true));
    } catch (e) { setSpontApp(fallbackLetter("Candidature Spontanee", target.name, true)); }
    setLoadingSpontApp(false);
  };

  const addToTracker = (item) => {
    const key = (item.title || "Spontanee") + "|" + (item.organization || item.name);
    if (tracker.find(t => t.key === key)) return;
    setTracker(prev => [...prev, { key, title: item.title || "Candidature spontanee", organization: item.organization || item.name, location: item.location || "", type: item.type || "spontanee", status: "A envoyer", date: new Date().toLocaleDateString("fr-FR"), note: "", id: Date.now() }]);
  };

  const updateStatus = (id, status) => setTracker(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  const saveNote = (id) => { setTracker(prev => prev.map(t => t.id === id ? { ...t, note: noteText } : t)); setEditingNote(null); };
  const doCopy = (text, setter) => { navigator.clipboard.writeText(text); setter(true); setTimeout(() => setter(false), 2000); };
  const reset = () => { setStep("search"); setJobs([]); setApplication(null); setApiError(""); };

  const tabs = [
    { id: "search", label: "Recherche", icon: "🔍" },
    { id: "spontaneous", label: "Spontanee", icon: "🎯" },
    { id: "pitch", label: "Pitch", icon: "⚡" },
    { id: "tracker", label: "Suivi (" + tracker.length + ")", icon: "📋" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0d1b2a", fontFamily: "Georgia, serif", color: "#dde8f0" }}>
      <div style={{ background: "linear-gradient(135deg,#0a2540,#133a5e)", borderBottom: "1px solid #1e4976", padding: "14px 16px 0", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#5b9bd5", textTransform: "uppercase", fontFamily: "monospace" }}>Career Intelligence Tool</div>
          <div style={{ fontSize: 18, color: "#dde8f0", marginTop: 2 }}>Dr. Sami Djoulah</div>
          <div style={{ fontSize: 10, color: "#5b9bd5", marginTop: 2 }}>Immunogenetique · PCR/NGS · IVD · Afrique & Europe</div>
        </div>
        <div style={{ display: "flex", borderTop: "1px solid #1e4976" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => { setActiveTab(t.id); if (t.id !== "search") setStep("search"); }}
              style={{ flex: 1, padding: "9px 2px", background: "none", border: "none", borderBottom: activeTab === t.id ? "2px solid #3a8bd5" : "2px solid transparent", color: activeTab === t.id ? "#a8d0f0" : "#4a7a9a", fontSize: 10, cursor: "pointer", fontFamily: "inherit" }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "16px 14px 60px" }}>

        {/* PITCH */}
        {activeTab === "pitch" && (
          <div>
            <div style={{ marginBottom: 12, fontSize: 12, color: "#a8c8e8" }}>Ton pitch 30 secondes - a copier pour LinkedIn, email froid ou introduction.</div>
            <div style={{ background: "rgba(13,74,138,0.25)", border: "1px solid #1e4976", borderRadius: 12, padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ fontSize: 10, letterSpacing: 3, color: "#5b9bd5", textTransform: "uppercase", fontFamily: "monospace" }}>⚡ Pitch 30 secondes</div>
                <button onClick={() => doCopy(PITCH, setPitchCopied)} style={{ background: pitchCopied ? "rgba(74,222,128,0.2)" : "rgba(91,155,213,0.15)", border: "1px solid " + (pitchCopied ? "#4ade80" : "#1e4976"), borderRadius: 6, padding: "3px 8px", color: pitchCopied ? "#4ade80" : "#5b9bd5", fontSize: 10, cursor: "pointer", fontFamily: "monospace" }}>
                  {pitchCopied ? "✓ Copie!" : "📋 Copier"}
                </button>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.8, color: "#c8dff0" }}>{PITCH}</div>
            </div>
            <div style={{ marginTop: 14, background: "rgba(13,40,74,0.5)", border: "1px solid #1e4976", borderRadius: 12, padding: "14px" }}>
              <div style={{ fontSize: 10, letterSpacing: 3, color: "#5b9bd5", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 10 }}>🔑 Chiffres cles</div>
              {[["30+","annees d'experience en diagnostics moleculaires"],["6","laboratoires deployes operationnels (Congo, DRC, Guinee, Allemagne, France)"],["5","pays d'intervention verifies"],["10","partenaires technologiques (PCR a NGS a AI/ML a LIMS)"],["20+","publications scientifiques peer-reviewed"],["1","publication Ebola (Cell Mol Immunol, 2021)"]].map(([num, label], i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 7 }}>
                  <div style={{ minWidth: 40, textAlign: "center", fontSize: 18, fontWeight: "bold", color: "#3a8bd5" }}>{num}</div>
                  <div style={{ fontSize: 12, color: "#8aaec8" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TRACKER */}
        {activeTab === "tracker" && (
          <div>
            <div style={{ marginBottom: 12, fontSize: 12, color: "#a8c8e8" }}>Suivi de tes candidatures.</div>
            {tracker.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#3a5a7a" }}>
                <div style={{ fontSize: 30, marginBottom: 8 }}>📋</div>
                <div style={{ fontSize: 12 }}>Aucune candidature suivie.</div>
                <div style={{ fontSize: 10, marginTop: 4 }}>Clique "+ Suivi" sur une offre ou une candidature spontanee.</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
                  {STATUSES.map(s => { const c = tracker.filter(t => t.status === s).length; return c > 0 ? <div key={s} style={{ fontSize: 10, background: "rgba(255,255,255,0.05)", border: "1px solid " + STATUS_COLORS[s] + "44", borderRadius: 20, padding: "2px 9px", color: STATUS_COLORS[s] }}>{s}: {c}</div> : null; })}
                </div>
                {tracker.map(t => (
                  <div key={t.id} style={{ background: "rgba(13,40,74,0.7)", border: "1px solid #1e4976", borderRadius: 12, padding: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, color: "#c8e0f4", fontWeight: "bold", marginBottom: 1 }}>{t.title}</div>
                        <div style={{ fontSize: 10, color: "#5b9bd5" }}>{t.organization} · {t.date}</div>
                      </div>
                      <button onClick={() => setTracker(prev => prev.filter(x => x.id !== t.id))} style={{ background: "none", border: "none", color: "#3a5a7a", cursor: "pointer", fontSize: 16 }}>×</button>
                    </div>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 8 }}>
                      {STATUSES.map(s => (
                        <button key={s} onClick={() => updateStatus(t.id, s)} style={{ background: t.status === s ? STATUS_COLORS[s] + "33" : "rgba(255,255,255,0.03)", border: "1px solid " + (t.status === s ? STATUS_COLORS[s] : "#1e4976"), borderRadius: 20, padding: "2px 8px", color: t.status === s ? STATUS_COLORS[s] : "#4a7a9a", fontSize: 9, cursor: "pointer", fontFamily: "inherit" }}>{s}</button>
                      ))}
                    </div>
                    {editingNote === t.id ? (
                      <div>
                        <textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Ta note..." style={{ width: "100%", background: "rgba(0,0,0,0.2)", border: "1px solid #1e4976", borderRadius: 6, padding: "6px", color: "#dde8f0", fontSize: 11, fontFamily: "inherit", resize: "none", minHeight: 55, boxSizing: "border-box" }} />
                        <div style={{ display: "flex", gap: 6, marginTop: 5 }}>
                          <button onClick={() => saveNote(t.id)} style={{ background: "rgba(74,222,128,0.15)", border: "1px solid #4ade80", borderRadius: 6, padding: "4px 10px", color: "#4ade80", fontSize: 10, cursor: "pointer", fontFamily: "inherit" }}>Enregistrer</button>
                          <button onClick={() => setEditingNote(null)} style={{ background: "none", border: "1px solid #1e4976", borderRadius: 6, padding: "4px 10px", color: "#4a7a9a", fontSize: 10, cursor: "pointer", fontFamily: "inherit" }}>Annuler</button>
                        </div>
                      </div>
                    ) : (
                      <div onClick={() => { setEditingNote(t.id); setNoteText(t.note); }} style={{ fontSize: 10, color: t.note ? "#8aaec8" : "#3a5a7a", fontStyle: t.note ? "normal" : "italic", cursor: "pointer", paddingTop: 5, borderTop: "1px solid #1e3a5a" }}>
                        {t.note || "✏️ Ajouter une note (contacts, relance, suite...)"}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SPONTANEOUS */}
        {activeTab === "spontaneous" && (
          <div>
            {!spontApp && !loadingSpontApp && (
              <div>
                <div style={{ marginBottom: 12, fontSize: 12, color: "#a8c8e8" }}>Organisations strategiques ou te manifester sans attendre une offre publiee.</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {SPONTANEOUS_TARGETS.map(t => (
                    <div key={t.id} style={{ background: "rgba(13,40,74,0.7)", border: "1px solid #1e4976", borderRadius: 12, padding: "13px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, color: "#c8e0f4", fontWeight: "bold", marginBottom: 2 }}>{t.icon} {t.name}</div>
                          <div style={{ fontSize: 11, color: "#5b9bd5" }}>{t.domain}</div>
                        </div>
                        <ScoreBlock matchScore={t.matchScore} myTimeScore={t.myTimeScore} />
                      </div>
                      <div style={{ fontSize: 11, color: "#8aaec8", lineHeight: 1.5, marginBottom: 7, fontStyle: "italic" }}>💡 {t.why}</div>
                      <BadgeRow duration={t.duration} remuneration={t.remuneration} distanceFlag={t.distanceFlag} workMode={t.workMode} />
                      <div style={{ fontSize: 10, color: "#3a6a8a", marginBottom: 9 }}>📧 {t.contact}</div>
                      <div style={{ display: "flex", gap: 7 }}>
                        <button onClick={() => generateSpontaneous(t)} style={{ background: "linear-gradient(135deg,#0d4a8a,#1a6bbf)", border: "none", borderRadius: 8, padding: "7px 12px", color: "#fff", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>✉️ Generer lettre</button>
                        <button onClick={() => { addToTracker(t); setActiveTab("tracker"); }} style={{ background: "rgba(74,222,128,0.1)", border: "1px solid #2a6a4a", borderRadius: 8, padding: "7px 10px", color: "#4ade80", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>+ Suivi</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {loadingSpontApp && (
              <div style={{ textAlign: "center", padding: "50px 20px" }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>✍️</div>
                <div style={{ fontSize: 13, color: "#5b9bd5" }}>Redaction en cours...</div>
              </div>
            )}
            {spontApp && !loadingSpontApp && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <button onClick={() => { setSpontApp(null); setSpontTarget(null); }} style={{ background: "none", border: "1px solid #1e4976", borderRadius: 8, padding: "5px 10px", color: "#5b9bd5", cursor: "pointer", fontSize: 11, fontFamily: "inherit" }}>← Retour</button>
                  {spontTarget && <div style={{ fontSize: 12, color: "#a8d0f0" }}>{spontTarget.icon} {spontTarget.name}</div>}
                </div>
                <CoverLetterBlock application={spontApp} onCopy={() => doCopy("Objet: " + spontApp.subjectLine + "\n\n" + spontApp.coverLetter, setSpontCopied)} copied={spontCopied} />
                <button onClick={() => { addToTracker(spontTarget); setActiveTab("tracker"); }} style={{ width: "100%", marginTop: 10, background: "rgba(74,222,128,0.1)", border: "1px solid #2a6a4a", borderRadius: 10, padding: "10px", color: "#4ade80", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>+ Ajouter au suivi</button>
              </div>
            )}
          </div>
        )}

        {/* SEARCH */}
        {activeTab === "search" && (
          <div>
            {step === "search" && (
              <div>
                <div style={{ textAlign: "center", marginBottom: 16 }}>
                  <div style={{ fontSize: 14, color: "#a8c8e8" }}>Quel type de poste veux-tu explorer ?</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {SEARCH_THEMES.map(t => (
                    <button key={t.id} onClick={() => searchJobs(t, false)} style={{ background: "rgba(13,40,74,0.7)", border: "1px solid #1e4976", borderRadius: 10, padding: "11px 13px", color: "#dde8f0", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontFamily: "inherit" }}>
                      <span style={{ fontSize: 19 }}>{t.icon}</span>
                      <div style={{ flex: 1, fontSize: 12, color: "#a8d0f0" }}>{t.label}</div>
                      <span style={{ color: "#3a6a8a" }}>›</span>
                    </button>
                  ))}
                </div>
                <div style={{ marginTop: 12, padding: "10px 12px", background: "rgba(100,150,60,0.08)", border: "1px dashed #4a6a2a", borderRadius: 10, display: "flex", alignItems: "center", gap: 9 }}>
                  <span style={{ fontSize: 16 }}>🧪</span>
                  <div style={{ flex: 1, fontSize: 11, color: "#8aaa5a" }}>Mode test - 8 offres realistes instantanees</div>
                  <button onClick={() => searchJobs(SEARCH_THEMES[0], true)} style={{ background: "rgba(100,150,60,0.2)", border: "1px solid #4a6a2a", borderRadius: 8, padding: "5px 10px", color: "#8aaa5a", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>Tester →</button>
                </div>
              </div>
            )}

            {step === "results" && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
                  <button onClick={reset} style={{ background: "none", border: "1px solid #1e4976", borderRadius: 8, padding: "5px 9px", color: "#5b9bd5", cursor: "pointer", fontSize: 11, fontFamily: "inherit" }}>← Retour</button>
                  {selectedTheme && <div style={{ fontSize: 12, color: "#a8d0f0" }}>{selectedTheme.icon} {selectedTheme.label}</div>}
                </div>
                {apiError && <div style={{ marginBottom: 10, padding: "6px 10px", background: "rgba(251,191,36,0.08)", border: "1px solid #4a3a1a", borderRadius: 8, fontSize: 10, color: "#fbbf24" }}>⚠️ {apiError}</div>}
                {loadingJobs ? (
                  <div style={{ textAlign: "center", padding: "50px 20px" }}>
                    <div style={{ fontSize: 28, marginBottom: 10 }}>🔍</div>
                    <div style={{ fontSize: 13, color: "#5b9bd5" }}>{loadingMsg}</div>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ fontSize: 10, color: "#4a7a9a" }}>{jobs.length} offres - classees par compatibilite</div>
                    {jobs.map((job, i) => (
                      <div key={i} style={{ background: "rgba(13,40,74,0.7)", border: "1px solid #1e4976", borderRadius: 12, padding: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, color: "#c8e0f4", fontWeight: "bold", marginBottom: 2 }}>{job.title}</div>
                            <div style={{ fontSize: 11, color: "#5b9bd5" }}>{job.organization}</div>
                            <div style={{ fontSize: 10, color: "#3a6a8a", marginTop: 1 }}>📍 {job.location} · {job.type}</div>
                          </div>
                          <ScoreBlock matchScore={job.matchScore} myTimeScore={job.myTimeScore || 70} />
                        </div>
                        <div style={{ fontSize: 11, color: "#8aaec8", lineHeight: 1.5, marginBottom: 6 }}>{job.description}</div>
                        {job.myTimeReason && <div style={{ fontSize: 10, color: "#7a9aaa", fontStyle: "italic", marginBottom: 5 }}>⏱ {job.myTimeReason}</div>}
                        <div style={{ fontSize: 10, color: "#4a8a6a", fontStyle: "italic", marginBottom: 7 }}>✓ {job.matchReason}</div>
                        <BadgeRow duration={job.duration} remuneration={job.remuneration} distanceFlag={job.distanceFlag} workMode={job.workMode} />
                        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                          <button onClick={() => generateApplication(job)} style={{ background: "linear-gradient(135deg,#0d4a8a,#1a6bbf)", border: "none", borderRadius: 8, padding: "7px 12px", color: "#fff", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>✉️ Candidature</button>
                          <button onClick={() => { addToTracker(job); setActiveTab("tracker"); }} style={{ background: "rgba(74,222,128,0.1)", border: "1px solid #2a6a4a", borderRadius: 8, padding: "7px 10px", color: "#4ade80", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>+ Suivi</button>
                          {job.url && <a href={job.url} target="_blank" rel="noopener noreferrer" style={{ color: "#5b9bd5", fontSize: 11, textDecoration: "none", border: "1px solid #1e4976", borderRadius: 8, padding: "7px 9px" }}>🔗</a>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {step === "apply" && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
                  <button onClick={() => setStep("results")} style={{ background: "none", border: "1px solid #1e4976", borderRadius: 8, padding: "5px 9px", color: "#5b9bd5", cursor: "pointer", fontSize: 11, fontFamily: "inherit" }}>← Offres</button>
                  {selectedJob && <div><div style={{ fontSize: 12, color: "#a8d0f0" }}>{selectedJob.title}</div><div style={{ fontSize: 10, color: "#4a7a9a" }}>{selectedJob.organization}</div></div>}
                </div>
                {loadingApp ? (
                  <div style={{ textAlign: "center", padding: "50px 20px" }}>
                    <div style={{ fontSize: 28, marginBottom: 10 }}>✍️</div>
                    <div style={{ fontSize: 13, color: "#5b9bd5" }}>Redaction en cours...</div>
                  </div>
                ) : application && (
                  <div>
                    <CoverLetterBlock application={application} onCopy={() => doCopy("Objet: " + application.subjectLine + "\n\n" + application.coverLetter, setCopied)} copied={copied} />
                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      <button onClick={() => { addToTracker(selectedJob); setActiveTab("tracker"); }} style={{ flex: 1, background: "rgba(74,222,128,0.1)", border: "1px solid #2a6a4a", borderRadius: 10, padding: "10px", color: "#4ade80", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>+ Suivi</button>
                      <button onClick={reset} style={{ flex: 1, background: "none", border: "1px solid #1e4976", borderRadius: 10, padding: "10px", color: "#5b9bd5", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>🔄 Nouvelle recherche</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
