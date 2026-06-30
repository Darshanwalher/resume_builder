import React, { useState } from "react";
import StepHeader from "./StepHeader";
import { generateSkills } from "@/apis/ai.api";

interface StepProps {
  resumeData: any;
  onChange: (updatedData: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function SkillsStep({
  resumeData,
  onChange,
  onNext,
  onBack,
}: StepProps) {
  const skillsList: string[] = resumeData?.skills || [];
  const [manualInput, setManualInput] = useState("");

  // AI Recommendation states
  const [jobTitle, setJobTitle] = useState(resumeData?.title || "Software Engineer");
  const [level, setLevel] = useState("Mid-Level");
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skillsList.includes(trimmed)) {
      onChange({ skills: [...skillsList, trimmed] });
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onChange({ skills: skillsList.filter((s) => s !== skillToRemove) });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill(manualInput);
      setManualInput("");
    }
  };

  const handleManualAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddSkill(manualInput);
    setManualInput("");
  };

  const handleFetchRecommendations = async () => {
    if (!jobTitle) {
      setAiError("Please enter a job title context first.");
      return;
    }

    setAiLoading(true);
    setAiError(null);
    setRecommendations([]);

    try {
      const result = await generateSkills({
        jobTitle,
        experienceLevel: level,
      });

      if (result.success && result.data) {
        const suggested = result.data.skills || [];
        setRecommendations(suggested);
      } else {
        setAiError(result.message || "Failed to fetch suggestions.");
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.response?.data?.message || "Something went wrong fetching recommendations.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleAddAllRecommendations = () => {
    const fresh = recommendations.filter((r) => !skillsList.includes(r));
    onChange({ skills: [...skillsList, ...fresh] });
  };

  return (
    <div className="space-y-6">
      <StepHeader
        title="Technical & Soft Skills"
        description="Add keywords representing your professional abilities. Use our AI suggestion tool to generate contextual skills optimized for ATS parsing."
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Active Skills Tag Manager (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Manual input */}
          <form onSubmit={handleManualAddSubmit} className="space-y-2">
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              Add Skill Manually
            </label>
            <div className="flex gap-2.5">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition"
                placeholder="e.g. JavaScript (press Enter)"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] hover:bg-[var(--bg-muted)] text-[var(--text)] font-semibold rounded-xl transition cursor-pointer active:scale-[0.98] text-sm"
              >
                Add
              </button>
            </div>
          </form>

          {/* Active Badge Container */}
          <div className="bg-[var(--bg-muted)] border border-[var(--border)] rounded-2xl p-5 min-h-[140px] flex flex-wrap gap-2 items-start content-start">
            {skillsList.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--accent-soft)] border border-blue-500/20 text-[var(--accent-text)] font-semibold text-xs rounded-full"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-[var(--text-muted)] hover:text-red-500 rounded-lg p-0.5 transition cursor-pointer"
                  title="Remove Skill"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}

            {skillsList.length === 0 && (
              <div className="w-full text-center py-8 text-[var(--text-muted)] text-xs italic">
                No skills added yet. Type above or generate suggestions.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Suggestion Tool (5 Cols) */}
        <div className="lg:col-span-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="text-xs font-bold text-[var(--text)] uppercase tracking-wider flex items-center gap-1.5">
              <span>✨ AI Suggestions</span>
            </h3>
            <p className="text-[var(--text-muted)] text-[10px] mt-1 leading-relaxed">
              Generate skills list mapped to your target job profile.
            </p>
          </div>

          {aiError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-xl">
              {aiError}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-1.5">
                Target Role
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text)] placeholder-[var(--text-muted)] text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition"
                placeholder="e.g. Frontend Engineer"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-1.5">
                Experience Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition text-xs cursor-pointer"
              >
                <option value="Fresher">Fresher (Entry Level)</option>
                <option value="Mid-Level">Mid-Level</option>
                <option value="Senior-Level">Senior-Level</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleFetchRecommendations}
              disabled={aiLoading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl active:scale-[0.98] transition cursor-pointer text-xs disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {aiLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-t-white border-r-transparent animate-spin rounded-full" />
                  <span>Loading…</span>
                </>
              ) : (
                <span>Generate Suggestions</span>
              )}
            </button>
          </div>

          {/* Suggested Pills Grid */}
          {recommendations.length > 0 && (
            <div className="border-t border-[var(--border)] pt-3 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                  Suggested Pills
                </span>
                <button
                  type="button"
                  onClick={handleAddAllRecommendations}
                  className="text-blue-600 dark:text-blue-400 hover:underline text-xs font-semibold cursor-pointer"
                >
                  Add All
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-0.5">
                {recommendations.map((rec) => {
                  const alreadyAdded = skillsList.includes(rec);
                  return (
                    <button
                      key={rec}
                      type="button"
                      onClick={() => !alreadyAdded && handleAddSkill(rec)}
                      disabled={alreadyAdded}
                      className={`px-2 py-0.5 text-xs rounded-lg border text-left transition cursor-pointer active:scale-[0.97] ${
                        alreadyAdded
                          ? "bg-[var(--bg-muted)] border-[var(--border)] text-[var(--text-muted)] cursor-default pointer-events-none"
                          : "bg-transparent border-[var(--border)] hover:border-blue-400 text-[var(--text)] hover:text-blue-500"
                      }`}
                    >
                      {rec} {alreadyAdded && "✓"}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
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
          Next: Achievements
        </button>
      </div>
    </div>
  );
}
