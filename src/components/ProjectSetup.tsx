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
            className="group relative bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 space-y-4 transition duration-200"
          >
            {/* Remove Header */}
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                Project Record #{index + 1}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveProject(index)}
                className="text-[var(--text-muted)] hover:text-red-500 p-1.5 hover:bg-[var(--bg-muted)] rounded-lg transition cursor-pointer"
                title="Delete Record"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">
                  Project Title
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={project.title || ""}
                    onChange={(e) => handleFieldChange(index, "title", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition"
                    placeholder="e.g. E-Commerce Platform"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">
                  Technologies Used (Comma Separated)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={project.techStack?.join(", ") || ""}
                    onChange={(e) => handleTechStackChange(index, e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition"
                    placeholder="e.g. React, Node.js, MongoDB"
                  />
                </div>
              </div>
            </div>

            {/* Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">
                  GitHub Repository Link
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <input
                    type="url"
                    value={project.githubUrl || ""}
                    onChange={(e) => handleFieldChange(index, "githubUrl", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition"
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">
                  Live Demo Link
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <input
                    type="url"
                    value={project.liveUrl || ""}
                    onChange={(e) => handleFieldChange(index, "liveUrl", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition"
                    placeholder="https://myplatform.com"
                  />
                </div>
              </div>
            </div>

            {/* Description Textarea */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                  Description / Features Built
                </label>
                <button
                  type="button"
                  onClick={() => openAiModal(index)}
                  className="px-2.5 py-1 bg-[var(--accent-soft)] border border-blue-500/20 hover:border-blue-500/40 text-[var(--accent-text)] text-xs font-semibold rounded-lg transition duration-150 flex items-center gap-1 cursor-pointer"
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
                className="w-full px-3.5 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition leading-relaxed"
                placeholder="Describe what you built, the core architecture, key challenges resolved, and how you engineered features..."
              />
            </div>
          </div>
        ))}

        {/* Empty State */}
        {projectList.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed border-[var(--border)] rounded-2xl">
            <svg className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m-9 1V4a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <h4 className="text-[var(--text)] font-semibold text-sm">No Projects Logged</h4>
            <p className="text-[var(--text-muted)] text-xs mt-0.5">Click below to add your development projects.</p>
          </div>
        )}

        {/* Add Project Button */}
        <button
          type="button"
          onClick={handleAddProject}
          className="w-full py-3.5 border-2 border-dashed border-[var(--border)] hover:border-blue-500 text-[var(--text-muted)] hover:text-blue-600 font-semibold rounded-2xl transition duration-150 flex items-center justify-center gap-2 cursor-pointer bg-transparent hover:bg-[var(--accent-soft)]"
        >
          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Project Record</span>
        </button>
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
          Next: Skills
        </button>
      </div>

      {/* AI Assistant Overlay Modal */}
      {aiIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-150 space-y-5">
            <div>
              <h3 className="text-base font-bold text-[var(--text)] flex items-center gap-2">
                <span>✨ AI Description Writer</span>
              </h3>
              <p className="text-[var(--text-muted)] text-xs mt-1.5 leading-relaxed">
                Generate professional, bulleted, ATS-friendly accomplishments for your project: <strong className="text-blue-500">{projectList[aiIndex]?.title || "Project"}</strong>.
              </p>
            </div>

            {aiError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-xl">
                {aiError}
              </div>
            )}

            <div className="space-y-4">
              {/* Tech Stack */}
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">
                  Keywords / Tech Stack
                </label>
                <input
                  type="text"
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition"
                  placeholder="e.g. React, Express, PostgreSQL"
                />
                <span className="text-[10px] text-[var(--text-muted)] block mt-1">Comma-separated technologies used in project</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Target Role Context */}
                <div className="col-span-2">
                  <label className="block text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">
                    Target Role Context
                  </label>
                  <input
                    type="text"
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition"
                    placeholder="e.g. Full Stack Engineer"
                  />
                </div>

                {/* Experience Level */}
                <div className="col-span-2">
                  <label className="block text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">
                    Target Complexity Level
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition text-sm cursor-pointer"
                  >
                    <option value="Fresher">Fresher (Academic/Personal)</option>
                    <option value="Mid-Level">Mid-Level (Production Grade)</option>
                    <option value="Senior-Level">Senior-Level (Enterprise Scale)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 justify-end pt-3 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={() => setAiIndex(null)}
                disabled={aiLoading}
                className="px-4 py-2 text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)] rounded-xl transition text-sm cursor-pointer disabled:opacity-50 hover:bg-[var(--bg-muted)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerateAiDescription}
                disabled={aiLoading}
                className="px-5 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl active:scale-[0.98] transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {aiLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-t-white border-r-transparent animate-spin rounded-full" />
                    <span>Writing…</span>
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
