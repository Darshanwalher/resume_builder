import React, { useState } from "react";
import StepHeader from "./StepHeader";
import { getAtsScore } from "@/apis/ai.api";

interface StepProps {
  resumeData: any;
  onChange: (updatedData: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PreviewStep({
  resumeData,
  onBack,
}: Omit<StepProps, "onChange" | "onNext">) {
  const [atsScoreData, setAtsScoreData] = useState<any>(null);
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsError, setAtsError] = useState<string | null>(null);

  const buildResumeText = () => {
    let text = "";
    const p = resumeData?.personalInfo || {};
    text += `Name: ${p.fullName || ""}\nEmail: ${p.email || ""}\nPhone: ${p.mobile || ""}\nLocation: ${p.location || ""}\nGitHub: ${p.github || ""}\nLinkedIn: ${p.linkedin || ""}\nPortfolio: ${p.portfolio || ""}\n\n`;
    
    if (resumeData?.summary) {
      text += `Professional Summary:\n${resumeData.summary}\n\n`;
    }
    if (resumeData?.workExperience?.length > 0) {
      text += `Work Experience:\n`;
      resumeData.workExperience.forEach((exp: any) => {
        text += `- Role: ${exp.position || ""}\n  Company: ${exp.company || ""}\n  Timeline: ${exp.startDate || ""} - ${exp.endDate || ""}\n  Description: ${exp.description || ""}\n`;
      });
      text += `\n`;
    }
    if (resumeData?.projects?.length > 0) {
      text += `Projects:\n`;
      resumeData.projects.forEach((proj: any) => {
        text += `- Project: ${proj.title || ""}\n  Tech Stack: ${proj.techStack?.join(", ") || ""}\n  GitHub: ${proj.githubUrl || ""}\n  Demo: ${proj.liveUrl || ""}\n  Description: ${proj.description || ""}\n`;
      });
      text += `\n`;
    }
    if (resumeData?.education?.length > 0) {
      text += `Education:\n`;
      resumeData.education.forEach((edu: any) => {
        text += `- School: ${edu.institute || ""}\n  Degree: ${edu.degree || ""}\n  Timeline: ${edu.startDate || ""} - ${edu.endDate || ""}\n`;
      });
      text += `\n`;
    }
    if (resumeData?.skills?.length > 0) {
      text += `Skills: ${resumeData.skills.join(", ")}\n\n`;
    }
    if (resumeData?.certifications?.length > 0) {
      text += `Certifications:\n${resumeData.certifications.map((c: string) => `- ${c}`).join("\n")}\n\n`;
    }
    return text;
  };

  const handleDownloadPdf = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${resumeData?.title || "Resume"}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1a1a1a; line-height: 1.5; font-size: 13px; }
            h1 { margin: 0 0 4px 0; font-size: 26px; font-weight: 700; text-align: center; }
            .contact-info { text-align: center; font-size: 12px; color: #555; margin-bottom: 20px; border-bottom: 2px solid #222; padding-bottom: 12px; }
            .contact-info span { margin: 0 6px; }
            .section-title { font-size: 14px; font-weight: 700; border-bottom: 1.5px solid #444; padding-bottom: 3px; margin-top: 22px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.8px; color: #111; }
            .item-header { display: flex; justify-content: space-between; font-weight: 700; font-size: 13px; margin-bottom: 2px; }
            .item-sub { font-style: italic; color: #444; font-size: 12px; margin-bottom: 5px; }
            .item-desc { margin: 0 0 10px 0; font-size: 12.5px; color: #333; text-align: justify; }
            ul { margin: 0 0 10px 0; padding-left: 20px; }
            li { font-size: 12.5px; color: #333; margin-bottom: 3px; }
            a { color: #0284c7; text-decoration: none; }
            .skills-list { font-size: 12.5px; color: #333; line-height: 1.6; }
          </style>
        </head>
        <body>
          <h1>${resumeData?.personalInfo?.fullName || "Your Name"}</h1>
          <div class="contact-info">
            ${resumeData?.personalInfo?.email ? `<span>${resumeData.personalInfo.email}</span>` : ""}
            ${resumeData?.personalInfo?.mobile ? `<span>| &nbsp; ${resumeData.personalInfo.mobile}</span>` : ""}
            ${resumeData?.personalInfo?.location ? `<span>| &nbsp; ${resumeData.personalInfo.location}</span>` : ""}
            ${resumeData?.personalInfo?.linkedin ? `<span>| &nbsp; <a href="${resumeData.personalInfo.linkedin}">LinkedIn</a></span>` : ""}
            ${resumeData?.personalInfo?.github ? `<span>| &nbsp; <a href="${resumeData.personalInfo.github}">GitHub</a></span>` : ""}
          </div>
          
          ${resumeData?.summary ? `
            <div class="section-title">Professional Summary</div>
            <p class="item-desc">${resumeData.summary}</p>
          ` : ""}

          ${resumeData?.workExperience?.length > 0 ? `
            <div class="section-title">Work Experience</div>
            ${resumeData.workExperience.map((exp: any) => `
              <div style="margin-bottom: 12px;">
                <div class="item-header">
                  <span>${exp.position}</span>
                  <span>${exp.startDate} - ${exp.endDate}</span>
                </div>
                <div class="item-sub">${exp.company}</div>
                <p class="item-desc">${exp.description}</p>
              </div>
            `).join("")}
          ` : ""}

          ${resumeData?.projects?.length > 0 ? `
            <div class="section-title">Projects</div>
            ${resumeData.projects.map((proj: any) => `
              <div style="margin-bottom: 12px;">
                <div class="item-header">
                  <span>${proj.title}</span>
                  <span style="font-weight: 400; font-size: 11px; font-style: italic;">${proj.techStack?.join(", ") || ""}</span>
                </div>
                <div class="item-sub">
                  ${proj.githubUrl ? `<a href="${proj.githubUrl}">GitHub Repository</a>` : ""}
                  ${proj.githubUrl && proj.liveUrl ? " &nbsp;|&nbsp; " : ""}
                  ${proj.liveUrl ? `<a href="${proj.liveUrl}">Live Link</a>` : ""}
                </div>
                <p class="item-desc">${proj.description}</p>
              </div>
            `).join("")}
          ` : ""}

          ${resumeData?.education?.length > 0 ? `
            <div class="section-title">Education</div>
            ${resumeData.education.map((edu: any) => `
              <div style="margin-bottom: 10px;">
                <div class="item-header">
                  <span>${edu.degree}</span>
                  <span>${edu.startDate} - ${edu.endDate}</span>
                </div>
                <div class="item-sub">${edu.institute}</div>
              </div>
            `).join("")}
          ` : ""}

          ${resumeData?.skills?.length > 0 ? `
            <div class="section-title">Skills & Competencies</div>
            <div class="skills-list">
              <strong>Technical Stack:</strong> ${resumeData.skills.join(", ")}
            </div>
          ` : ""}

          ${resumeData?.certifications?.length > 0 ? `
            <div class="section-title">Certifications & Honors</div>
            <ul>
              ${resumeData.certifications.map((cert: string) => `<li>${cert}</li>`).join("")}
            </ul>
          ` : ""}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const handleCheckAts = async () => {
    if (atsLoading) return;
    setAtsLoading(true);
    setAtsError(null);
    setAtsScoreData(null);

    try {
      const textBlock = buildResumeText();
      const result = await getAtsScore(textBlock);

      if (result.success && result.data) {
        let parsed = null;
        const rawScore = result.data.AtsScore;
        if (typeof rawScore === "string") {
          try {
            parsed = JSON.parse(rawScore);
          } catch {
            const cleanStr = rawScore.replace(/```json|```/g, "").trim();
            parsed = JSON.parse(cleanStr);
          }
        } else {
          parsed = rawScore;
        }
        setAtsScoreData(parsed);
      } else {
        setAtsError(result.message || "Failed to analyze score.");
      }
    } catch (err: any) {
      console.error(err);
      setAtsError(err.response?.data?.message || "Something went wrong scoring the resume.");
    } finally {
      setAtsLoading(false);
    }
  };

  return (
    <div className="space-y-8 select-none">
      <StepHeader
        title="Preview & Download"
        description="Verify your resume details, download a professional printed PDF copy, or check your profile against automated ATS scoring rules."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Visual Paper Preview (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0b0e17] border border-white/[0.06] rounded-3xl p-6 md:p-8 max-h-[800px] overflow-y-auto shadow-2xl space-y-6">
          <div className="border-b border-white/[0.1] pb-5 text-center">
            <h3 className="text-xl font-bold text-white tracking-tight">
              {resumeData?.personalInfo?.fullName || "Your Name"}
            </h3>
            <div className="text-xs text-slate-400 mt-2 flex flex-wrap justify-center gap-2">
              <span>{resumeData?.personalInfo?.email || "email@example.com"}</span>
              {resumeData?.personalInfo?.mobile && <span>• {resumeData.personalInfo.mobile}</span>}
              {resumeData?.personalInfo?.location && <span>• {resumeData.personalInfo.location}</span>}
            </div>
          </div>

          {/* Summary */}
          {resumeData?.summary && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-violet-400 uppercase tracking-widest border-b border-white/[0.05] pb-1">
                Professional Summary
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed text-justify">
                {resumeData.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {resumeData?.workExperience?.length > 0 && (
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-violet-400 uppercase tracking-widest border-b border-white/[0.05] pb-1">
                Work Experience
              </h4>
              {resumeData.workExperience.map((exp: any, i: number) => (
                <div key={i} className="text-xs space-y-1">
                  <div className="flex justify-between font-semibold text-slate-200">
                    <span>{exp.position}</span>
                    <span className="text-slate-500 font-normal">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <div className="text-slate-400 italic text-[11px]">{exp.company}</div>
                  <p className="text-slate-400 leading-relaxed text-justify mt-1">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {resumeData?.projects?.length > 0 && (
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-violet-400 uppercase tracking-widest border-b border-white/[0.05] pb-1">
                Projects
              </h4>
              {resumeData.projects.map((proj: any, i: number) => (
                <div key={i} className="text-xs space-y-1">
                  <div className="flex justify-between font-semibold text-slate-200">
                    <span>{proj.title}</span>
                    <span className="text-slate-500 font-normal text-[10px] italic">
                      {proj.techStack?.join(", ")}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 flex gap-2">
                    {proj.githubUrl && <span className="hover:text-violet-400">GitHub</span>}
                    {proj.liveUrl && <span className="hover:text-violet-400">Demo</span>}
                  </div>
                  <p className="text-slate-400 leading-relaxed text-justify mt-1">
                    {proj.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {resumeData?.education?.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-violet-400 uppercase tracking-widest border-b border-white/[0.05] pb-1">
                Education
              </h4>
              {resumeData.education.map((edu: any, i: number) => (
                <div key={i} className="text-xs">
                  <div className="flex justify-between font-semibold text-slate-200">
                    <span>{edu.degree}</span>
                    <span className="text-slate-500 font-normal">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <div className="text-slate-400 italic text-[11px] mt-0.5">{edu.institute}</div>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {resumeData?.skills?.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-violet-400 uppercase tracking-widest border-b border-white/[0.05] pb-1">
                Skills
              </h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {resumeData.skills.map((s: string, i: number) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-slate-900 border border-white/[0.04] text-slate-300 rounded text-[10px]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {resumeData?.certifications?.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-violet-400 uppercase tracking-widest border-b border-white/[0.05] pb-1">
                Certifications
              </h4>
              <ul className="list-disc list-inside text-slate-400 text-xs space-y-1 pt-1">
                {resumeData.certifications.map((cert: string, i: number) => (
                  <li key={i}>{cert}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Side: Actions Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Action trigger */}
          <div className="bg-[#0f1524]/40 border border-white/[0.05] rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
              Download Actions
            </h3>
            <button
              onClick={handleDownloadPdf}
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-2xl transition duration-200 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-violet-500/10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download Printed PDF</span>
            </button>
          </div>

          {/* ATS Assistant widget */}
          <div className="bg-[#0f1524]/40 border border-white/[0.05] rounded-3xl p-6 shadow-xl space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>📊 ATS Score Analysis</span>
              </h3>
              <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
                Run an automated ATS evaluator rule-check to grade your resume contents and read keyword advice.
              </p>
            </div>

            {atsError && (
              <div className="p-3 bg-red-950/40 border border-red-500/30 text-red-200 text-xs rounded-xl">
                {atsError}
              </div>
            )}

            {!atsScoreData && !atsLoading && (
              <button
                type="button"
                onClick={handleCheckAts}
                className="w-full py-3 bg-slate-900 border border-white/[0.08] hover:bg-slate-800 text-slate-200 font-semibold rounded-xl active:scale-[0.98] transition cursor-pointer text-xs flex items-center justify-center gap-1.5"
              >
                <span>Calculate ATS Score</span>
              </button>
            )}

            {atsLoading && (
              <div className="text-center py-6 space-y-3">
                <div className="w-8 h-8 border-2 border-violet-500/20 border-t-violet-500 animate-spin rounded-full mx-auto" />
                <p className="text-slate-500 text-xs animate-pulse">Gemini AI is parsing and grading resume tags...</p>
              </div>
            )}

            {/* ATS Score Details */}
            {atsScoreData && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-150">
                {/* Radial Indicator Score */}
                <div className="flex items-center gap-5 bg-slate-950/20 p-4 border border-white/[0.04] rounded-2xl">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    {/* Circle Background */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="32" cy="32" r="28" className="stroke-slate-800" strokeWidth="4.5" fill="transparent" />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        className={
                          atsScoreData.atsScore >= 70
                            ? "stroke-emerald-500"
                            : atsScoreData.atsScore >= 50
                            ? "stroke-amber-500"
                            : "stroke-red-500"
                        }
                        strokeWidth="4.5"
                        fill="transparent"
                        strokeDasharray={175.9}
                        strokeDashoffset={175.9 - (175.9 * atsScoreData.atsScore) / 100}
                      />
                    </svg>
                    <span className="absolute font-bold text-base text-white">
                      {atsScoreData.atsScore}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">ATS Rating</h4>
                    <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                      {atsScoreData.summary}
                    </p>
                  </div>
                </div>

                {/* Score Advice Tabs/Accordion lists */}
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  
                  {/* Strengths */}
                  <div className="space-y-2">
                    <h5 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                      Strengths
                    </h5>
                    <ul className="space-y-1.5">
                      {atsScoreData.strengths?.map((str: string, i: number) => (
                        <li key={i} className="text-[11px] text-slate-400 flex items-start gap-1.5 leading-relaxed">
                          <span className="text-emerald-500 font-bold mt-0.5">•</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Improvements */}
                  <div className="space-y-2 border-t border-white/[0.04] pt-3">
                    <h5 className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                      Improvements Needed
                    </h5>
                    <ul className="space-y-1.5">
                      {atsScoreData.improvements?.map((imp: string, i: number) => (
                        <li key={i} className="text-[11px] text-slate-400 flex items-start gap-1.5 leading-relaxed">
                          <span className="text-amber-500 font-bold mt-0.5">•</span>
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-2 border-t border-white/[0.04] pt-3">
                    <h5 className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">
                      Actionable Recommendations
                    </h5>
                    <ul className="space-y-1.5">
                      {atsScoreData.recommendations?.map((rec: string, i: number) => (
                        <li key={i} className="text-[11px] text-slate-400 flex items-start gap-1.5 leading-relaxed">
                          <span className="text-violet-500 font-bold mt-0.5">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Re-calculate button */}
                <button
                  type="button"
                  onClick={handleCheckAts}
                  className="w-full py-2 bg-slate-900 border border-white/[0.05] hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-xl transition text-[11px] cursor-pointer"
                >
                  Recalculate Score
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="mt-8 border-t border-white/[0.06] pt-6 flex justify-start">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-slate-900 border border-white/[0.08] hover:bg-slate-800 text-slate-300 font-semibold rounded-xl hover:shadow-md hover:shadow-black/25 active:scale-[0.98] transition cursor-pointer"
        >
          Back
        </button>
      </div>
    </div>
  );
}
