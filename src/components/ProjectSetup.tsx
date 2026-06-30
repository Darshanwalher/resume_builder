import React, { useState } from "react";
import StepHeader from "./StepHeader";
import { generateProjectDescription } from "@/apis/ai.api";

interface ProjectItem {
  title: string;
  description: string;
  githubUrl: string;
  liveUrl: string;
  techStack: string[];
}

interface StepProps {
  resumeData: any;
  onChange: (updatedData: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ProjectSetup({
  resumeData,
  onChange,
  onNext,
  onBack,
}: StepProps) {
  const projectList: ProjectItem[] = resumeData?.projects || [];

  // AI assistant states
  const [aiIndex, setAiIndex] = useState<number | null>(null);
  const [techStackInput, setTechStackInput] = useState("");
  const [level, setLevel] = useState("Mid-Level");
  const [roleInput, setRoleInput] = useState("Software Engineer");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleFieldChange = (index: number, field: keyof Omit<ProjectItem, "techStack">, value: string) => {
    const updated = [...projectList];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange({ projects: updated });
  };

  const handleTechStackChange = (index: number, value: string) => {
    const updated = [...projectList];
    const splitArr = value
      ? value.split(",").map((s) => s.trim())
      : [];
    updated[index] = {
      ...updated[index],
      techStack: splitArr,
    };
    onChange({ projects: updated });
  };

  const handleAddProject = () => {
    const updated = [
      ...projectList,
      { title: "", description: "", githubUrl: "", liveUrl: "", techStack: [] },
    ];
    onChange({ projects: updated });
  };

  const handleRemoveProject = (index: number) => {
    const updated = projectList.filter((_, idx) => idx !== index);
    onChange({ projects: updated });
  };

  const openAiModal = (index: number) => {
    setAiIndex(index);
    setAiError(null);
    // Prefill tech stack from current project
    const currentTech = projectList[index].techStack || [];
    setTechStackInput(currentTech.join(", "));
  };

  const handleGenerateAiDescription = async () => {
    if (aiIndex === null || aiLoading) return;

    const projectTitle = projectList[aiIndex].title;
    if (!projectTitle) {
      setAiError("Please fill in the Project Title field first before generating descriptions.");
      return;
    }

    setAiLoading(true);
    setAiError(null);

    try {
      const splitTech = techStackInput
        ? techStackInput.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const result = await generateProjectDescription({
        experienceLevel: level,
        techStack: splitTech,
        jobTitle: roleInput,
      });

      if (result.success && result.data) {
        // AI route returns { projectDescription: string }
        const generatedText = result.data.projectDescription || "";
        
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
        title="Projects Portfolio"
        description="Showcase your best engineering and development projects. Use our built-in Gemini AI generator to write detailed descriptions of your projects."
      />

      <div className="space-y-6">
        {projectList.map((project, index) => (
          <div
            key={index}
            className="group relative bg-slate-950/20 border border-white/[0.06] rounded-3xl p-6 md:p-8 space-y-4 hover:border-violet-500/20 transition-all duration-300 shadow-xl"
          >
            {/* Remove Header */}
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Project Record #{index + 1}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveProject(index)}
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
                  Project Title
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={project.title || ""}
                    onChange={(e) => handleFieldChange(index, "title", e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-white/[0.08] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition duration-200"
                    placeholder="e.g. E-Commerce Platform"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  Technologies Used (Comma Separated)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={project.techStack?.join(", ") || ""}
                    onChange={(e) => handleTechStackChange(index, e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-white/[0.08] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition duration-200"
                    placeholder="e.g. React, Node.js, MongoDB"
                  />
                </div>
              </div>
            </div>

            {/* Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  GitHub Repository Link
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <input
                    type="url"
                    value={project.githubUrl || ""}
                    onChange={(e) => handleFieldChange(index, "githubUrl", e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-white/[0.08] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition duration-200"
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  Live Demo Link
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <input
                    type="url"
                    value={project.liveUrl || ""}
                    onChange={(e) => handleFieldChange(index, "liveUrl", e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-white/[0.08] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition duration-200"
                    placeholder="https://myplatform.com"
                  />
                </div>
              </div>
            </div>

            {/* Description Textarea */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider">
                  Description / Features Built
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
                value={project.description || ""}
                onChange={(e) => handleFieldChange(index, "description", e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-slate-950/40 border border-white/[0.08] rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition duration-200 text-sm leading-relaxed"
                placeholder="Describe what you built, the core architecture, key challenges resolved, and how you engineered features..."
              />
            </div>
          </div>
        ))}

        {/* Empty State */}
        {projectList.length === 0 && (
          <div className="text-center py-12 bg-slate-950/10 border border-dashed border-white/[0.06] rounded-3xl">
            <svg className="w-10 h-10 text-slate-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m-9 1V4a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <h4 className="text-slate-300 font-bold text-base">No Projects Logged</h4>
            <p className="text-slate-500 text-xs mt-1 mb-4">Click below to add your development projects.</p>
          </div>
        )}

        {/* Add Project Button */}
        <button
          type="button"
          onClick={handleAddProject}
          className="w-full py-4 border-2 border-dashed border-white/[0.08] hover:border-violet-500/40 hover:bg-violet-950/[0.03] text-slate-300 hover:text-violet-400 font-semibold rounded-2xl transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Project Record</span>
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
          Next: Skills
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
                Generate professional, bulleted, ATS-friendly accomplishments for your project: <strong className="text-violet-400">{projectList[aiIndex]?.title || "Project"}</strong>.
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
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/40 border border-white/[0.08] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition duration-200 text-sm"
                  placeholder="e.g. React, Express, PostgreSQL"
                />
                <span className="text-[10px] text-slate-500 block mt-1">Comma-separated technologies used in project</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Target Role Context */}
                <div className="col-span-2">
                  <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                    Target Role Context
                  </label>
                  <input
                    type="text"
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/40 border border-white/[0.08] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition duration-200 text-sm"
                    placeholder="e.g. Full Stack Engineer"
                  />
                </div>

                {/* Experience Level */}
                <div className="col-span-2">
                  <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                    Target Complexity Level
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-950/40 border border-white/[0.08] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition duration-200 text-sm"
                  >
                    <option value="Fresher">Fresher (Academic/Personal)</option>
                    <option value="Mid-Level">Mid-Level (Production Grade)</option>
                    <option value="Senior-Level">Senior-Level (Enterprise Scale)</option>
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
