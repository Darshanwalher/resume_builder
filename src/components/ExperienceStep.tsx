import React, { useState } from "react";
import StepHeader from "./StepHeader";
import { generateExperienceDescription } from "@/apis/ai.api";

interface WorkExperienceItem {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface StepProps {
  resumeData: any;
  onChange: (updatedData: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ExperienceStep({
  resumeData,
  onChange,
  onNext,
  onBack,
}: StepProps) {
  const experienceList: WorkExperienceItem[] = resumeData?.workExperience || [];

  // AI assistant states
  const [aiIndex, setAiIndex] = useState<number | null>(null);
  const [techStack, setTechStack] = useState("");
  const [years, setYears] = useState("2");
  const [level, setLevel] = useState("Mid-Level");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleFieldChange = (index: number, field: keyof WorkExperienceItem, value: string) => {
    const updated = [...experienceList];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange({ workExperience: updated });
  };

  const handleAddExperience = () => {
    const updated = [
      ...experienceList,
      { company: "", position: "", startDate: "", endDate: "", description: "" },
    ];
    onChange({ workExperience: updated });
  };

  const handleRemoveExperience = (index: number) => {
    const updated = experienceList.filter((_, idx) => idx !== index);
    onChange({ workExperience: updated });
  };

  const openAiModal = (index: number) => {
    setAiIndex(index);
    setTechStack("");
    setAiError(null);
    // prefill job title as role
    const currentRole = experienceList[index].position;
    if (currentRole) {
      setTechStack("");
    }
  };

  const handleGenerateAiDescription = async () => {
    if (aiIndex === null || aiLoading) return;

    const role = experienceList[aiIndex].position;
    if (!role) {
      setAiError("Please fill in the Job Title/Position field first before generating descriptions.");
      return;
    }

    setAiLoading(true);
    setAiError(null);

    try {
      const splitTech = techStack
        ? techStack.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const result = await generateExperienceDescription({
        experienceLevel: level,
        techStack: splitTech,
        yearsOfExperience: Number(years) || 2,
        jobRole: role,
      });

      if (result.success && result.data) {
        // AI route returns { description: string } (Wait, let's verify what the experience description API returns in its data block)
        // Let's check: the experience API returns { description } in the data block
        const generatedText = result.data.workExperienceDescription || "";
        
        handleFieldChange(aiIndex, "description", generatedText);
        setAiIndex(null);
      } else {
        setAiError(result.message || "Failed to generate description.");
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.response?.data?.message || "Something went wrong generating descriptions.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <StepHeader
        title="Work Experience"
        description="Detail your professional work history. Use our built-in Gemini AI generator to write professional, ATS-optimized descriptions for your roles."
      />

      <div className="space-y-6">
        {experienceList.map((exp, index) => (
          <div
            key={index}
            className="group relative bg-slate-950/20 border border-white/[0.06] rounded-3xl p-6 md:p-8 space-y-4 hover:border-violet-500/20 transition-all duration-300 shadow-xl"
          >
            {/* Remove Header */}
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Job Record #{index + 1}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveExperience(index)}
                className="text-slate-500 hover:text-red-400 p-2 hover:bg-slate-900 rounded-xl transition cursor-pointer"
                title="Delete Record"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  Company Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={exp.company || ""}
                    onChange={(e) => handleFieldChange(index, "company", e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-white/[0.08] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition duration-200"
                    placeholder="e.g. Google"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  Job Title / Position
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={exp.position || ""}
                    onChange={(e) => handleFieldChange(index, "position", e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-white/[0.08] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition duration-200"
                    placeholder="e.g. Senior Frontend Developer"
                  />
                </div>
              </div>
            </div>

            {/* Date Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  Start Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={exp.startDate || ""}
                    onChange={(e) => handleFieldChange(index, "startDate", e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-white/[0.08] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition duration-200"
                    placeholder="e.g. Oct 2023"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  End Date (or Present)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={exp.endDate || ""}
                    onChange={(e) => handleFieldChange(index, "endDate", e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-white/[0.08] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition duration-200"
                    placeholder="e.g. Present"
                  />
                </div>
              </div>
            </div>

            {/* Description Textarea */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider">
                  Description / Responsibilities
                </label>
                <button
                  type="button"
                  onClick={() => openAiModal(index)}
                  className="px-3 py-1 bg-violet-600/10 hover:bg-violet-600 border border-violet-500/15 hover:border-transparent text-violet-400 hover:text-white text-xs font-bold rounded-lg transition duration-200 flex items-center gap-1 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
                  </svg>
                  <span>✨ AI Writer</span>
                </button>
              </div>
              <textarea
                value={exp.description || ""}
                onChange={(e) => handleFieldChange(index, "description", e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-slate-950/40 border border-white/[0.08] rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition duration-200 text-sm leading-relaxed"
                placeholder="Describe your accomplishments, projects you led, and key contributions to the team..."
              />
            </div>
          </div>
        ))}

        {/* Empty State */}
        {experienceList.length === 0 && (
          <div className="text-center py-12 bg-slate-950/10 border border-dashed border-white/[0.06] rounded-3xl">
            <svg className="w-10 h-10 text-slate-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h4 className="text-slate-300 font-bold text-base">No Experience Logged</h4>
            <p className="text-slate-500 text-xs mt-1 mb-4">Click below to add your professional work records.</p>
          </div>
        )}

        {/* Add Experience Button */}
        <button
          type="button"
          onClick={handleAddExperience}
          className="w-full py-4 border-2 border-dashed border-white/[0.08] hover:border-violet-500/40 hover:bg-violet-950/[0.03] text-slate-300 hover:text-violet-400 font-semibold rounded-2xl transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Work Experience</span>
        </button>
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
          Next: Projects
        </button>
      </div>

      {/* AI Assistant Overlay Modal */}
      {aiIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0f1524] border border-white/[0.08] rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-150 space-y-5">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>✨ AI Description Writer</span>
              </h3>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                Generate professional, bulleted, ATS-friendly accomplishments for your position as <strong className="text-violet-400">{experienceList[aiIndex]?.position || "Role"}</strong> at <strong className="text-slate-300">{experienceList[aiIndex]?.company || "Company"}</strong>.
              </p>
            </div>

            {aiError && (
              <div className="p-3.5 bg-red-950/40 border border-red-500/30 text-red-200 text-xs rounded-xl">
                {aiError}
              </div>
            )}

            <div className="space-y-4">
              {/* Tech Stack */}
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  Keywords / Tech Stack
                </label>
                <input
                  type="text"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/40 border border-white/[0.08] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition duration-200 text-sm"
                  placeholder="e.g. React, Node.js, AWS, Agile"
                />
                <span className="text-[10px] text-slate-500 block mt-1">Comma-separated key technologies/methodologies</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Years of Experience */}
                <div>
                  <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                    Years in Role
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/40 border border-white/[0.08] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition duration-200 text-sm"
                  />
                </div>

                {/* Experience level */}
                <div>
                  <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                    Level
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-950/40 border border-white/[0.08] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition duration-200 text-sm"
                  >
                    <option value="Fresher">Fresher (Entry)</option>
                    <option value="Mid-Level">Mid-Level</option>
                    <option value="Senior-Level">Senior-Level</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-2 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={() => setAiIndex(null)}
                disabled={aiLoading}
                className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent rounded-xl transition text-sm cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerateAiDescription}
                disabled={aiLoading}
                className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-violet-500/15 active:scale-[0.98] transition cursor-pointer text-sm disabled:opacity-50 flex items-center gap-1.5"
              >
                {aiLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin rounded-full" />
                    <span>Writing...</span>
                  </>
                ) : (
                  <span>Generate AI Text</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
