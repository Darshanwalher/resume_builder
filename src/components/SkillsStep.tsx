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
        // AI route returns { skills: string[] }
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
    <div className="space-y-8">
      <StepHeader
        title="Technical & Soft Skills"
        description="Add keywords representing your professional abilities. Use our AI suggestion tool to generate contextual skills optimized for ATS parsing."
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Active Skills Tag Manager (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Manual input */}
          <form onSubmit={handleManualAddSubmit} className="space-y-2">
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider">
              Add Skill Manually
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 px-4 py-3 bg-slate-950/40 border border-white/[0.08] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition duration-200 text-sm"
                placeholder="e.g. JavaScript (press Enter to add)"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-slate-900 border border-white/[0.08] hover:bg-slate-800 text-slate-200 font-semibold rounded-xl transition cursor-pointer active:scale-[0.98]"
              >
                Add
              </button>
            </div>
          </form>

          {/* Active Badge Container */}
          <div className="bg-slate-950/20 border border-white/[0.06] rounded-3xl p-6 min-h-[160px] flex flex-wrap gap-2.5 items-start content-start shadow-xl">
            {skillsList.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-600/10 border border-violet-500/25 text-violet-300 font-semibold text-xs rounded-xl shadow-sm"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-violet-400 hover:text-white hover:bg-violet-600/20 rounded-lg p-0.5 transition cursor-pointer"
                  title="Remove Skill"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}

            {skillsList.length === 0 && (
              <div className="w-full text-center py-8 text-slate-500 text-sm italic">
                No skills added yet. Use the manual input or AI recommendations below.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Suggestion Tool (5 Cols) */}
        <div className="lg:col-span-5 bg-[#0f1524]/40 border border-white/[0.05] rounded-3xl p-6 shadow-xl space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>✨ AI Suggestions</span>
            </h3>
            <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
              Input your target job profile context to get AI recommended skills mapping.
            </p>
          </div>

          {aiError && (
            <div className="p-3 bg-red-950/40 border border-red-500/30 text-red-200 text-xs rounded-xl">
              {aiError}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-1.5">
                Target Role
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950/50 border border-white/[0.08] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition text-xs"
                placeholder="e.g. Frontend Engineer"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-1.5">
                Experience Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950/50 border border-white/[0.08] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition text-xs"
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
              className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl hover:shadow-md hover:shadow-violet-500/10 active:scale-[0.98] transition cursor-pointer text-xs disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {aiLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin rounded-full" />
                  <span>Loading Recommendations...</span>
                </>
              ) : (
                <span>Generate Recommendations</span>
              )}
            </button>
          </div>

          {/* Suggested Pills Grid */}
          {recommendations.length > 0 && (
            <div className="border-t border-white/[0.06] pt-4 space-y-3.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Suggested Pills
                </span>
                <button
                  type="button"
                  onClick={handleAddAllRecommendations}
                  className="text-violet-400 hover:text-violet-300 text-xs font-semibold hover:underline cursor-pointer"
                >
                  Add All
                </button>
              </div>

              <div className="flex flex-wrap gap-2 max-h-[160px] overflow-y-auto pr-1">
                {recommendations.map((rec) => {
                  const alreadyAdded = skillsList.includes(rec);
                  return (
                    <button
                      key={rec}
                      type="button"
                      onClick={() => !alreadyAdded && handleAddSkill(rec)}
                      disabled={alreadyAdded}
                      className={`px-2.5 py-1 text-xs rounded-lg border text-left transition cursor-pointer active:scale-[0.97] ${
                        alreadyAdded
                          ? "bg-slate-900 border-white/[0.04] text-slate-600 cursor-default pointer-events-none"
                          : "bg-slate-950/60 border-white/[0.06] hover:border-violet-500/30 text-slate-300 hover:text-violet-300"
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
      <div className="mt-8 border-t border-white/[0.06] pt-6 flex justify-between gap-4">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-slate-900 border border-white/[0.08] hover:bg-slate-800 text-slate-300 font-semibold rounded-xl hover:shadow-md hover:shadow-black/25 active:scale-[0.98] transition cursor-pointer"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-violet-500/10 active:scale-[0.98] transition cursor-pointer"
        >
          Next: Achievements
        </button>
      </div>
    </div>
  );
}
