import React, { useState } from "react";
import StepHeader from "./StepHeader";
import { generateSummary } from "@/apis/ai.api";

interface StepProps {
  resumeData: any;
  onChange: (updatedData: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function SummaryStep({
  resumeData,
  onChange,
  onNext,
  onBack,
}: StepProps) {
  const summaryText = resumeData?.summary || "";

  // AI states
  const [aiOpen, setAiOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState(resumeData?.title || "Software Engineer");
  const [skillsInput, setSkillsInput] = useState((resumeData?.skills || []).join(", "));
  const [level, setLevel] = useState("Mid-Level");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleFieldChange = (value: string) => {
    onChange({ summary: value });
  };

  const openAiModal = () => {
    setAiOpen(true);
    setAiError(null);
    const currentSkills = resumeData?.skills || [];
    setSkillsInput(currentSkills.join(", "));
  };

  const handleGenerate = async () => {
    if (aiLoading) return;

    if (!jobTitle) {
      setAiError("Please fill in a Job Title context first.");
      return;
    }

    setAiLoading(true);
    setAiError(null);

    try {
      const result = await generateSummary({
        jobTitle,
        skills: skillsInput,
        experienceLevel: level,
      });

      if (result.success && result.data) {
        const text = result.data.summary || "";
        handleFieldChange(text);
        setAiOpen(false);
      } else {
        setAiError(result.message || "Failed to generate summary.");
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.response?.data?.message || "Something went wrong generating summary.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <StepHeader
        title="Resume Summary & AI Optimization"
        description="Write a short, professional introductory summary highlighting your key achievements and objectives. You can also generate one automatically with Gemini AI."
      />

      <div className="space-y-4">
        {/* Summary Textarea Header */}
        <div className="flex justify-between items-center mb-1">
          <label className="block text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            Professional Summary
          </label>
          <button
            type="button"
            onClick={openAiModal}
            className="px-2.5 py-1 bg-[var(--accent-soft)] border border-blue-500/20 hover:border-blue-500/40 text-[var(--accent-text)] text-xs font-semibold rounded-lg transition duration-150 flex items-center gap-1 cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
            </svg>
            <span>✨ AI Summary Writer</span>
          </button>
        </div>

        {/* Textarea */}
        <textarea
          value={summaryText}
          onChange={(e) => handleFieldChange(e.target.value)}
          rows={6}
          className="w-full px-3.5 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition leading-relaxed"
          placeholder="e.g. Dedicated and detail-oriented Software Engineer with over 4 years of experience building and optimizing scalable web applications..."
        />
      </div>

      {/* Navigation Footer */}
      <div className="mt-6 border-t border-[var(--border)] pt-5 flex justify-between gap-4">
        <button
          onClick={onBack}
          className="px-5 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text)] font-semibold rounded-xl active:scale-[0.98] transition cursor-pointer text-sm"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl active:scale-[0.98] transition cursor-pointer text-sm"
        >
          Next: Preview & PDF
        </button>
      </div>

      {/* AI Config Modal Overlay */}
      {aiOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-150 space-y-5">
            <div>
              <h3 className="text-base font-bold text-[var(--text)] flex items-center gap-2">
                <span>✨ AI Summary Writer</span>
              </h3>
              <p className="text-[var(--text-muted)] text-xs mt-1.5 leading-relaxed">
                Generate an ATS-optimized, high-impact introductory statement based on your profile details.
              </p>
            </div>

            {aiError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-xl">
                {aiError}
              </div>
            )}

            <div className="space-y-4">
              {/* Job Title Context */}
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">
                  Target Job Title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition"
                  placeholder="e.g. Senior Frontend Developer"
                />
              </div>

              {/* Skills Context */}
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">
                  Core Skills Context
                </label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition"
                  placeholder="e.g. React, TypeScript, Next.js"
                />
                <span className="text-[10px] text-[var(--text-muted)] block mt-1">Automatically loaded from your skills step</span>
              </div>

              {/* Level */}
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">
                  Target Complexity Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition text-sm cursor-pointer"
                >
                  <option value="Fresher">Fresher (Entry Level)</option>
                  <option value="Mid-Level">Mid-Level</option>
                  <option value="Senior-Level">Senior-Level</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 justify-end pt-3 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={() => setAiOpen(false)}
                disabled={aiLoading}
                className="px-4 py-2 text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)] rounded-xl transition text-sm cursor-pointer disabled:opacity-50 hover:bg-[var(--bg-muted)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={aiLoading}
                className="px-5 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl active:scale-[0.98] transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {aiLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-t-white border-r-transparent animate-spin rounded-full" />
                    <span>Writing…</span>
                  </>
                ) : (
                  <span>Generate Summary</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
