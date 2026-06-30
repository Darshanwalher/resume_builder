import React from "react";
import StepHeader from "./StepHeader";

interface EducationItem {
  institute: string;
  degree: string;
  startDate: string;
  endDate: string;
}

interface StepProps {
  resumeData: any;
  onChange: (updatedData: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function EducationStep({
  resumeData,
  onChange,
  onNext,
  onBack,
}: StepProps) {
  const educationList: EducationItem[] = resumeData?.education || [];

  const handleFieldChange = (index: number, field: keyof EducationItem, value: string) => {
    const updated = [...educationList];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange({ education: updated });
  };

  const handleAddEducation = () => {
    const updated = [
      ...educationList,
      { institute: "", degree: "", startDate: "", endDate: "" },
    ];
    onChange({ education: updated });
  };

  const handleRemoveEducation = (index: number) => {
    const updated = educationList.filter((_, idx) => idx !== index);
    onChange({ education: updated });
  };

  return (
    <div className="space-y-6">
      <StepHeader
        title="Education History"
        description="Add information about your degrees, colleges, schools, or other academic qualifications."
      />

      <div className="space-y-6">
        {educationList.map((edu, index) => (
          <div
            key={index}
            className="group relative bg-slate-950/20 border border-white/[0.06] rounded-3xl p-6 md:p-8 space-y-4 hover:border-violet-500/20 transition-all duration-300 shadow-xl"
          >
            {/* Remove Button Header */}
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Education #{index + 1}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveEducation(index)}
                className="text-slate-500 hover:text-red-400 p-2 hover:bg-slate-900 rounded-xl transition cursor-pointer"
                title="Delete Entry"
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
                  School / University
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={edu.institute || ""}
                    onChange={(e) => handleFieldChange(index, "institute", e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-white/[0.08] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition duration-200"
                    placeholder="e.g. Stanford University"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  Degree / Certificate
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={edu.degree || ""}
                    onChange={(e) => handleFieldChange(index, "degree", e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-white/[0.08] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition duration-200"
                    placeholder="e.g. B.S. in Computer Science"
                  />
                </div>
              </div>
            </div>

            {/* Date inputs */}
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
                    value={edu.startDate || ""}
                    onChange={(e) => handleFieldChange(index, "startDate", e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-white/[0.08] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition duration-200"
                    placeholder="e.g. Sep 2021"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  End Date (or Expected)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={edu.endDate || ""}
                    onChange={(e) => handleFieldChange(index, "endDate", e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-white/[0.08] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition duration-200"
                    placeholder="e.g. Jun 2025"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {educationList.length === 0 && (
          <div className="text-center py-12 bg-slate-950/10 border border-dashed border-white/[0.06] rounded-3xl">
            <svg className="w-10 h-10 text-slate-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
            </svg>
            <h4 className="text-slate-300 font-bold text-base">No Education Logged</h4>
            <p className="text-slate-500 text-xs mt-1 mb-4">Click below to add your academic degrees.</p>
          </div>
        )}

        {/* Add Button */}
        <button
          type="button"
          onClick={handleAddEducation}
          className="w-full py-4 border-2 border-dashed border-white/[0.08] hover:border-violet-500/40 hover:bg-violet-950/[0.03] text-slate-300 hover:text-violet-400 font-semibold rounded-2xl transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Education Record</span>
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
          Next: Experience
        </button>
      </div>
    </div>
  );
}
