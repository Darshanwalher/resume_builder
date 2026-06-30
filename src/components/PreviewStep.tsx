import React, { useState, useRef, useEffect } from "react";
import StepHeader from "./StepHeader";
import { getAtsScore } from "@/apis/ai.api";

type TemplateId = "minimalist" | "modern" | "corporate";

const TEMPLATES: { id: TemplateId; name: string; desc: string; dot: string }[] = [
  { id: "minimalist",  name: "Minimalist",      desc: "Clean serif, ATS-first",    dot: "bg-gray-700" },
  { id: "modern",      name: "Modern Blue",     desc: "Bold header accent",        dot: "bg-blue-600" },
  { id: "corporate",   name: "Corporate",       desc: "Two-column executive style", dot: "bg-slate-600" },
];

interface StepProps {
  resumeData: any;
  onChange: (d: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PreviewStep({ resumeData, onBack }: Omit<StepProps, "onChange" | "onNext">) {
  const [template, setTemplate] = useState<TemplateId>("minimalist");
  const [atsData, setAtsData] = useState<any>(null);
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsError, setAtsError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        setScale(w / 794);
      }
    };
    handleResize();
    const timer = setTimeout(handleResize, 100);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  const p = resumeData?.personalInfo || {};

  // ─── Contact list helper for rendering/joining ───
  const getContactParts = (isHtml = false) => {
    const parts = [];
    if (p.email) parts.push(p.email);
    if (p.mobile) parts.push(p.mobile);
    if (p.location) parts.push(p.location);
    if (p.linkedin) {
      parts.push(isHtml ? `<a href="${p.linkedin}">LinkedIn</a>` : "LinkedIn");
    }
    if (p.github) {
      parts.push(isHtml ? `<a href="${p.github}">GitHub</a>` : "GitHub");
    }
    if (p.portfolio) {
      parts.push(isHtml ? `<a href="${p.portfolio}">Portfolio</a>` : "Portfolio");
    }
    return parts;
  };

  // ─── ATS text builder ───
  const buildText = () => {
    let t = `${p.fullName || ""}\n${getContactParts().join(" | ")}\n\n`;
    if (resumeData?.summary) t += `Summary:\n${resumeData.summary}\n\n`;
    resumeData?.workExperience?.forEach((e: any) => {
      t += `${e.position} at ${e.company} (${e.startDate}–${e.endDate || "Present"})\n${e.description}\n`;
    });
    resumeData?.projects?.forEach((pr: any) => {
      t += `${pr.title} | ${pr.techStack?.join(", ") || ""}\n${pr.description}\n`;
    });
    resumeData?.education?.forEach((ed: any) => {
      t += `${ed.degree} – ${ed.institute} (${ed.startDate}–${ed.endDate || "Present"})\n`;
    });
    if (resumeData?.skills?.length) t += `Skills: ${resumeData.skills.join(", ")}\n`;
    return t;
  };

  // ─── HTML templates for printing ───
  const getHTML = () => {
    const name = p.fullName || "Your Name";
    const contactHTML = getContactParts(true).join("  ·  ");

    const expHTML = (resumeData?.workExperience || []).map((e: any) => `
      <div class="item">
        <div class="row"><strong>${e.position}</strong><span class="date">${e.startDate} – ${e.endDate || "Present"}</span></div>
        <div class="sub">${e.company}</div>
        <p>${e.description}</p>
      </div>`).join("");

    const projHTML = (resumeData?.projects || []).map((pr: any) => `
      <div class="item">
        <div class="row"><strong>${pr.title}</strong><span class="date">${pr.techStack?.join(", ") || ""}</span></div>
        <p>${pr.description}</p>
      </div>`).join("");

    const eduHTML = (resumeData?.education || []).map((ed: any) => `
      <div class="item">
        <div class="row"><strong>${ed.degree}</strong><span class="date">${ed.startDate} – ${ed.endDate || "Present"}</span></div>
        <div class="sub">${ed.institute}</div>
      </div>`).join("");

    const skillsList = resumeData?.skills || [];
    const certsList = resumeData?.certifications || [];

    if (template === "minimalist") {
      const skillsHTML = skillsList.length ? skillsList.join("  ·  ") : "";
      const certsHTML = certsList.length ? `<ul>${certsList.map((c: string) => `<li>${c}</li>`).join("")}</ul>` : "";

      return `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${resumeData?.title || "Resume"}</title>
<style>
  @page{margin:15mm 18mm;}
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Georgia',serif;font-size:10.5pt;color:#111;line-height:1.55;}
  h1{font-size:22pt;font-weight:700;letter-spacing:-0.3px;margin-bottom:4px;}
  .contact{font-size:9pt;color:#111;margin-bottom:14px;}
  .contact a{color:inherit;text-decoration:underline;}
  hr{border:none;border-top:1px solid #111;margin:12px 0 8px;}
  .sec{font-size:9.5pt;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:7px;color:#111;}
  .item{margin-bottom:11px;break-inside:avoid;}
  .row{display:flex;justify-content:space-between;font-weight:700;font-size:10pt;}
  .date{font-weight:400;color:#555;font-size:9.5pt;}
  .sub{font-style:italic;color:#555;font-size:9pt;margin-bottom:3px;}
  p{color:#333;font-size:10pt;text-align:justify;white-space:pre-line;}
  ul{padding-left:16px;}li{margin-bottom:2px;font-size:10pt;}
</style></head><body>
<h1>${name}</h1>
<div class="contact">${contactHTML}</div>
${resumeData?.summary ? `<hr><div class="sec">Summary</div><p>${resumeData.summary}</p>` : ""}
${expHTML ? `<hr><div class="sec">Experience</div>${expHTML}` : ""}
${projHTML ? `<hr><div class="sec">Projects</div>${projHTML}` : ""}
${eduHTML ? `<hr><div class="sec">Education</div>${eduHTML}` : ""}
${skillsHTML ? `<hr><div class="sec">Skills</div><p>${skillsHTML}</p>` : ""}
${certsHTML ? `<hr><div class="sec">Certifications</div>${certsHTML}` : ""}
</body></html>`;
    }

    if (template === "modern") {
      const skillsHTML = skillsList.map((s: string) => `<span class="chip">${s}</span>`).join("");
      const certsHTML = certsList.length ? `<ul>${certsList.map((c: string) => `<li>${c}</li>`).join("")}</ul>` : "";

      return `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${resumeData?.title || "Resume"}</title>
<style>
  @page{margin:0;}
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:10pt;color:#1e293b;line-height:1.5;}
  .hdr{background:#1d4ed8;color:#fff;padding:28px 28px 20px;}
  h1{font-size:22pt;font-weight:800;letter-spacing:-0.5px;}
  .contact{font-size:9pt;opacity:.85;margin-top:6px;}
  .contact a{color:inherit;text-decoration:underline;}
  .body{padding:20px 28px;}
  .sec{font-size:9.5pt;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#1d4ed8;border-bottom:2px solid #1d4ed8;padding-bottom:2px;margin:16px 0 8px;}
  .item{margin-bottom:10px;break-inside:avoid;}
  .row{display:flex;justify-content:space-between;font-weight:700;}
  .date{font-weight:400;color:#64748b;font-size:9pt;}
  .sub{font-style:italic;color:#64748b;font-size:9pt;margin-bottom:3px;}
  p{color:#374151;font-size:9.5pt;white-space:pre-line;}
  .chip{display:inline-block;margin:2px 3px;padding:2px 9px;background:#eff6ff;color:#1e40af;font-size:8.5pt;border-radius:4px;font-weight:600;}
  ul{padding-left:16px;}li{font-size:9.5pt;margin-bottom:2px;}
</style></head><body>
<div class="hdr"><h1>${name}</h1><div class="contact">${contactHTML}</div></div>
<div class="body">
${resumeData?.summary ? `<div class="sec">About</div><p>${resumeData.summary}</p>` : ""}
${expHTML ? `<div class="sec">Experience</div>${expHTML}` : ""}
${projHTML ? `<div class="sec">Projects</div>${projHTML}` : ""}
${eduHTML ? `<div class="sec">Education</div>${eduHTML}` : ""}
${skillsHTML ? `<div class="sec">Skills</div><div>${skillsHTML}</div>` : ""}
${certsHTML ? `<div class="sec">Certifications</div>${certsHTML}` : ""}
</div></body></html>`;
    }

    // corporate (two-column)
    const sidebarSkills = skillsList.map((s: string) => `<div class="sk">• ${s}</div>`).join("");
    const sidebarCerts = certsList.map((c: string) => `<div class="sk" style="font-size:8pt;">${c}</div>`).join("");
    return `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${resumeData?.title || "Resume"}</title>
<style>
  @page{margin:0;}
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Segoe UI',Calibri,sans-serif;font-size:10pt;color:#111;display:flex;min-height:100vh;}
  .side{width:220px;background:#1e293b;color:#e2e8f0;padding:24px 16px;flex-shrink:0;}
  .side h1{font-size:15pt;font-weight:800;color:#fff;line-height:1.2;margin-bottom:4px;}
  .side .role{font-size:9pt;color:#94a3b8;margin-bottom:16px;}
  .stitle{font-size:8.5pt;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;margin:14px 0 6px;border-bottom:1px solid rgba(255,255,255,.08);padding-bottom:2px;}
  .sk{font-size:9pt;color:#cbd5e1;margin-bottom:4px;}
  .sk a{color:inherit;text-decoration:underline;}
  .main{flex:1;padding:24px 22px;}
  .sec{font-size:9.5pt;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#1e293b;border-bottom:1.5px solid #1e293b;padding-bottom:2px;margin:14px 0 7px;}
  .item{margin-bottom:11px;break-inside:avoid;}
  .row{display:flex;justify-content:space-between;font-weight:700;font-size:10pt;}
  .date{font-weight:400;color:#64748b;font-size:9pt;}
  .sub{font-style:italic;color:#64748b;font-size:9pt;margin-bottom:3px;}
  p{color:#374151;font-size:9.5pt;white-space:pre-line;}
  ul{padding-left:16px;}li{margin-bottom:2px;font-size:9.5pt;}
</style></head><body>
<div class="side">
  <h1>${name}</h1>
  <div class="role">${resumeData?.title || ""}</div>
  <div class="stitle">Contact</div>
  ${getContactParts(true).map((v: string) => `<div class="sk">${v}</div>`).join("")}
  ${sidebarSkills ? `<div class="stitle">Skills</div>${sidebarSkills}` : ""}
  ${sidebarCerts ? `<div class="stitle">Certifications</div>${sidebarCerts}` : ""}
</div>
<div class="main">
${resumeData?.summary ? `<div class="sec">Profile</div><p>${resumeData.summary}</p>` : ""}
${expHTML ? `<div class="sec">Experience</div>${expHTML}` : ""}
${projHTML ? `<div class="sec">Projects</div>${projHTML}` : ""}
${eduHTML ? `<div class="sec">Education</div>${eduHTML}` : ""}
</div></body></html>`;
  };

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      const html = getHTML();
      const win = window.open("about:blank", "_blank");
      if (!win) {
        alert("Please allow pop-ups to download PDF.");
        return;
      }
      win.document.open();
      win.document.write(html + `<script>
        window.onload = function() {
          window.print();
          setTimeout(function(){ window.close(); }, 1200);
        };
      <\/script>`);
      win.document.close();
    } finally {
      setDownloading(false);
    }
  };

  const handleAts = async () => {
    if (atsLoading) return;
    setAtsLoading(true);
    setAtsError(null);
    setAtsData(null);
    try {
      const result = await getAtsScore(buildText());
      if (result.success && result.data) {
        let parsed = result.data.AtsScore;
        if (typeof parsed === "string") {
          try { parsed = JSON.parse(parsed); } catch {
            parsed = JSON.parse(parsed.replace(/```json|```/g, "").trim());
          }
        }
        setAtsData(parsed);
      } else {
        setAtsError(result.message || "Failed to analyze.");
      }
    } catch (err: any) {
      setAtsError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setAtsLoading(false);
    }
  };

  // ─── Live Preview component renders (scaled to fit) ───

  const renderPreviewContact = (underlineClass = false) => {
    const parts = [];
    if (p.email) parts.push(<span>{p.email}</span>);
    if (p.mobile) parts.push(<span>{p.mobile}</span>);
    if (p.location) parts.push(<span>{p.location}</span>);
    if (p.linkedin) {
      parts.push(<a href={p.linkedin} style={{ color: "inherit", textDecoration: "underline" }}>LinkedIn</a>);
    }
    if (p.github) {
      parts.push(<a href={p.github} style={{ color: "inherit", textDecoration: "underline" }}>GitHub</a>);
    }
    if (p.portfolio) {
      parts.push(<a href={p.portfolio} style={{ color: "inherit", textDecoration: "underline" }}>Portfolio</a>);
    }

    return parts.map((part, index) => (
      <React.Fragment key={index}>
        {part}
        {index < parts.length - 1 && <span style={{ margin: "0 6px", opacity: 0.5 }}>·</span>}
      </React.Fragment>
    ));
  };

  const MinimalistPreview = () => (
    <div style={{ fontFamily: "Georgia, serif", color: "#111", lineHeight: 1.55 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 2 }}>{p.fullName || "Your Name"}</h1>
      <div style={{ fontSize: 9.5, color: "#111", marginBottom: 14, display: "flex", flexWrap: "wrap", alignItems: "center" }}>
        {renderPreviewContact()}
      </div>
      {resumeData?.summary && <ResumeSection title="Summary"><p style={{ fontSize: 10, color: "#333", textAlign: "justify", whiteSpace: "pre-line" }}>{resumeData.summary}</p></ResumeSection>}
      {resumeData?.workExperience?.length > 0 && <ResumeSection title="Experience">{resumeData.workExperience.map((e: any, i: number) => <ExpBlock key={i} {...e} />)}</ResumeSection>}
      {resumeData?.projects?.length > 0 && <ResumeSection title="Projects">{resumeData.projects.map((pr: any, i: number) => <ProjBlock key={i} {...pr} />)}</ResumeSection>}
      {resumeData?.education?.length > 0 && <ResumeSection title="Education">{resumeData.education.map((ed: any, i: number) => <EduBlock key={i} {...ed} />)}</ResumeSection>}
      {resumeData?.skills?.length > 0 && <ResumeSection title="Skills"><p style={{ fontSize: 10, color: "#333" }}>{resumeData.skills.join("  ·  ")}</p></ResumeSection>}
      {resumeData?.certifications?.length > 0 && <ResumeSection title="Certifications"><ul style={{ paddingLeft: 12 }}>{resumeData.certifications.map((c: string, i: number) => <li key={i} style={{ fontSize: 10, color: "#333" }}>{c}</li>)}</ul></ResumeSection>}
    </div>
  );

  const ModernPreview = () => (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#1e293b", margin: "-36px" }}>
      <div style={{ background: "#1d4ed8", color: "#fff", padding: "28px 28px 20px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px" }}>{p.fullName || "Your Name"}</h1>
        <div style={{ fontSize: 9.5, opacity: 0.85, marginTop: 6, display: "flex", flexWrap: "wrap", alignItems: "center" }}>
          {renderPreviewContact()}
        </div>
      </div>
      <div style={{ padding: "20px 28px" }}>
        {resumeData?.summary && <ModernSection title="About"><p style={{ fontSize: 10, color: "#374151", whiteSpace: "pre-line" }}>{resumeData.summary}</p></ModernSection>}
        {resumeData?.workExperience?.length > 0 && <ModernSection title="Experience">{resumeData.workExperience.map((e: any, i: number) => <ExpBlock key={i} {...e} />)}</ModernSection>}
        {resumeData?.projects?.length > 0 && <ModernSection title="Projects">{resumeData.projects.map((pr: any, i: number) => <ProjBlock key={i} {...pr} />)}</ModernSection>}
        {resumeData?.education?.length > 0 && <ModernSection title="Education">{resumeData.education.map((ed: any, i: number) => <EduBlock key={i} {...ed} />)}</ModernSection>}
        {resumeData?.skills?.length > 0 && (
          <ModernSection title="Skills">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 6px" }}>
              {resumeData.skills.map((s: string, i: number) => (
                <span key={i} style={{ background: "#eff6ff", color: "#1e40af", fontSize: 9, padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>{s}</span>
              ))}
            </div>
          </ModernSection>
        )}
        {resumeData?.certifications?.length > 0 && <ModernSection title="Certifications"><ul style={{ paddingLeft: 12 }}>{resumeData.certifications.map((c: string, i: number) => <li key={i} style={{ fontSize: 9.5 }}>{c}</li>)}</ul></ModernSection>}
      </div>
    </div>
  );

  const CorporatePreview = () => (
    <div style={{ display: "flex", fontFamily: "'Segoe UI', Calibri, sans-serif", color: "#111", margin: "-36px", minHeight: 1123 }}>
      <div style={{ width: 220, background: "#1e293b", color: "#e2e8f0", padding: "24px 16px", flexShrink: 0 }}>
        <h1 style={{ fontSize: 15, fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: 4 }}>{p.fullName || "Your Name"}</h1>
        <p style={{ fontSize: 9, color: "#94a3b8", marginBottom: 16 }}>{resumeData?.title || ""}</p>
        <SidebarSection title="Contact">
          {getContactParts().map((v, i) => <div key={i} style={{ fontSize: 8.5, color: "#cbd5e1", marginBottom: 4 }}>{v}</div>)}
        </SidebarSection>
        {resumeData?.skills?.length > 0 && (
          <SidebarSection title="Skills">
            {resumeData.skills.map((s: string, i: number) => <div key={i} style={{ fontSize: 8.5, color: "#cbd5e1", marginBottom: 3 }}>• {s}</div>)}
          </SidebarSection>
        )}
        {resumeData?.certifications?.length > 0 && (
          <SidebarSection title="Certs">
            {resumeData.certifications.map((c: string, i: number) => <div key={i} style={{ fontSize: 8, color: "#94a3b8", marginBottom: 3 }}>{c}</div>)}
          </SidebarSection>
        )}
      </div>
      <div style={{ flex: 1, padding: "24px 22px" }}>
        {resumeData?.summary && <CorpSection title="Profile"><p style={{ fontSize: 10, color: "#374151", whiteSpace: "pre-line" }}>{resumeData.summary}</p></CorpSection>}
        {resumeData?.workExperience?.length > 0 && <CorpSection title="Experience">{resumeData.workExperience.map((e: any, i: number) => <ExpBlock key={i} {...e} />)}</CorpSection>}
        {resumeData?.projects?.length > 0 && <CorpSection title="Projects">{resumeData.projects.map((pr: any, i: number) => <ProjBlock key={i} {...pr} />)}</CorpSection>}
        {resumeData?.education?.length > 0 && <CorpSection title="Education">{resumeData.education.map((ed: any, i: number) => <EduBlock key={i} {...ed} />)}</CorpSection>}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <StepHeader title="Preview & Download" description="Choose a template, preview your resume, then download as PDF." />

      {/* Template selector */}
      <div className="flex flex-wrap gap-2">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTemplate(t.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-medium transition cursor-pointer ${
              template === t.id
                ? "border-blue-500 bg-[var(--accent-soft)] text-[var(--accent-text)]"
                : "border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:border-blue-400 hover:text-[var(--text)]"
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${t.dot}`} />
            {t.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

        {/* ── A4 Preview ── */}
        <div className="xl:col-span-7">
          <p className="text-xs text-[var(--text-muted)] mb-2 font-medium">Live Preview (A4)</p>
          
          {/* A4 paper white container box */}
          <div
            ref={containerRef}
            className="relative bg-white shadow-xl border border-slate-200/60 dark:border-slate-800/10 overflow-hidden w-full"
            style={{
              aspectRatio: "210 / 297",   /* Exact A4 ratio */
            }}
          >
            {/* Real scale container styled at standard A4 width (794px) and scaled down to fit */}
            <div
              style={{
                width: "794px",
                height: "1123px",
                position: "absolute",
                top: 0,
                left: 0,
                padding: "36px",
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                backgroundColor: "#fff",
                color: "#111",
                boxSizing: "border-box",
                overflow: "hidden",
              }}
            >
              {template === "minimalist" && <MinimalistPreview />}
              {template === "modern" && <ModernPreview />}
              {template === "corporate" && <CorporatePreview />}
            </div>
          </div>
          <p className="text-[10px] text-[var(--text-muted)] text-center mt-2">
            Preview matches print layout exactly. Scaling adjusts automatically.
          </p>
        </div>

        {/* ── Control Panel ── */}
        <div className="xl:col-span-5 space-y-4">

          {/* Download card */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5">
            <h3 className="text-sm font-bold text-[var(--text)] mb-1">Download PDF</h3>
            <p className="text-xs text-[var(--text-muted)] mb-4">Opens a print dialog — choose "Save as PDF" to download.</p>
            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold rounded-xl transition active:scale-[0.98] cursor-pointer text-sm flex items-center justify-center gap-2"
            >
              {downloading ? (
                <><div className="w-4 h-4 border-2 border-t-white border-r-transparent animate-spin rounded-full" />Preparing…</>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PDF
                </>
              )}
            </button>
          </div>

          {/* ATS Score card */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5">
            <h3 className="text-sm font-bold text-[var(--text)] mb-1">ATS Score</h3>
            <p className="text-xs text-[var(--text-muted)] mb-4">Grade your resume against ATS keyword checks.</p>

            {atsError && (
              <div className="mb-3 px-3 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs">
                {atsError}
              </div>
            )}

            {!atsData && !atsLoading && (
              <button
                onClick={handleAts}
                className="w-full py-2.5 bg-[var(--bg-muted)] hover:bg-[var(--accent-soft)] border border-[var(--border)] hover:border-blue-400 text-[var(--text-muted)] hover:text-[var(--accent-text)] font-medium rounded-xl transition cursor-pointer text-xs"
              >
                Analyze ATS Score
              </button>
            )}

            {atsLoading && (
              <div className="text-center py-6">
                <div className="w-7 h-7 border-2 border-blue-500/20 border-t-blue-500 animate-spin rounded-full mx-auto mb-2" />
                <p className="text-[var(--text-muted)] text-xs">Analyzing your resume…</p>
              </div>
            )}

            {atsData && (
              <div className="space-y-4">
                {/* Score ring */}
                <div className="flex items-center gap-4 bg-[var(--bg-muted)] border border-[var(--border)] p-4 rounded-xl">
                  <div className="relative w-14 h-14 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
                      <circle cx="28" cy="28" r="22" strokeWidth="4" fill="transparent" className="stroke-[var(--border)]" />
                      <circle
                        cx="28" cy="28" r="22" strokeWidth="4" fill="transparent"
                        stroke={atsData.atsScore >= 70 ? "#22c55e" : atsData.atsScore >= 50 ? "#f59e0b" : "#ef4444"}
                        strokeDasharray={138.2}
                        strokeDashoffset={138.2 - (138.2 * (atsData.atsScore || 0)) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center font-bold text-sm text-[var(--text)]">
                      {atsData.atsScore}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[var(--text)]">ATS Score</p>
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5 leading-relaxed">{atsData.summary}</p>
                  </div>
                </div>

                <div className="max-h-56 overflow-y-auto space-y-3 pr-0.5">
                  <ScoreList title="Strengths" items={atsData.strengths} color="text-emerald-600 dark:text-emerald-400" />
                  <ScoreList title="Improvements" items={atsData.improvements} color="text-amber-600 dark:text-amber-400" />
                  <ScoreList title="Recommendations" items={atsData.recommendations} color="text-blue-600 dark:text-blue-400" />
                </div>

                <button onClick={handleAts} className="w-full py-2 bg-[var(--bg-muted)] border border-[var(--border)] text-[var(--text-muted)] rounded-xl text-[11px] cursor-pointer hover:bg-[var(--bg-card)] transition">
                  Recalculate
                </button>
              </div>
            )}
          </div>


        </div>
      </div>

      {/* Back */}
      <div className="pt-4 border-t border-[var(--border)]">
        <button
          onClick={onBack}
          className="px-5 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text)] font-medium rounded-xl text-sm cursor-pointer transition"
        >
          Back
        </button>
      </div>
    </div>
  );
}

// ─── Shared tiny sub-components ───

function ResumeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 12, breakInside: "avoid" }}>
      <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, borderBottom: "1px solid #111", paddingBottom: 2, marginBottom: 6 }}>{title}</div>
      {children}
    </div>
  );
}

function ModernSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 12, breakInside: "avoid" }}>
      <div style={{ fontSize: 9.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: "#1d4ed8", borderBottom: "2px solid #1d4ed8", paddingBottom: 2, marginBottom: 6 }}>{title}</div>
      {children}
    </div>
  );
}

function CorpSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 12, breakInside: "avoid" }}>
      <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "#1e293b", borderBottom: "1.5px solid #1e293b", paddingBottom: 2, marginBottom: 6 }}>{title}</div>
      {children}
    </div>
  );
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 12, breakInside: "avoid" }}>
      <div style={{ fontSize: 8.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#94a3b8", borderBottom: "1px solid rgba(255,255,255,.08)", paddingBottom: 2, marginBottom: 4 }}>{title}</div>
      {children}
    </div>
  );
}

function ExpBlock({ position, company, startDate, endDate, description }: any) {
  return (
    <div style={{ marginBottom: 10, breakInside: "avoid" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 10 }}>
        <span>{position}</span>
        <span style={{ fontWeight: 400, color: "#555", fontSize: 9 }}>{startDate} – {endDate || "Present"}</span>
      </div>
      <div style={{ fontStyle: "italic", color: "#555", fontSize: 9, marginBottom: 2 }}>{company}</div>
      <p style={{ fontSize: 9.5, color: "#333", lineHeight: 1.5, whiteSpace: "pre-line" }}>{description}</p>
    </div>
  );
}

function ProjBlock({ title, techStack, description }: any) {
  return (
    <div style={{ marginBottom: 10, breakInside: "avoid" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 10 }}>
        <span>{title}</span>
        <span style={{ fontWeight: 400, color: "#555", fontSize: 8.5, fontStyle: "italic" }}>{techStack?.join(", ")}</span>
      </div>
      <p style={{ fontSize: 9.5, color: "#333", lineHeight: 1.5, whiteSpace: "pre-line" }}>{description}</p>
    </div>
  );
}

function EduBlock({ degree, institute, startDate, endDate }: any) {
  return (
    <div style={{ marginBottom: 9, breakInside: "avoid" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 10 }}>
        <span>{degree}</span>
        <span style={{ fontWeight: 400, color: "#555", fontSize: 9 }}>{startDate} – {endDate || "Present"}</span>
      </div>
      <div style={{ fontStyle: "italic", color: "#555", fontSize: 9 }}>{institute}</div>
    </div>
  );
}

function ScoreList({ title, items, color }: { title: string; items: string[]; color: string }) {
  if (!items?.length) return null;
  return (
    <div>
      <p className={`text-[10px] font-bold uppercase tracking-widest ${color} mb-1.5`}>{title}</p>
      <ul className="space-y-1">
        {items.map((item: string, i: number) => (
          <li key={i} className="text-[10.5px] text-[var(--text-muted)] flex items-start gap-1.5">
            <span className={`${color} font-bold mt-px`}>•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
