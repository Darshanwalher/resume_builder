import React, { useState } from "react";
import StepHeader from "./StepHeader";

interface StepProps {
  resumeData: any;
  onChange: (updatedData: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function AchievementsStep({
  resumeData,
  onChange,
  onNext,
  onBack,
}: StepProps) {
  const certsList: string[] = resumeData?.certifications || [];
  const [manualInput, setManualInput] = useState("");

  const handleAddCert = (cert: string) => {
    const trimmed = cert.trim();
    if (trimmed && !certsList.includes(trimmed)) {
      onChange({ certifications: [...certsList, trimmed] });
    }
  };

  const handleRemoveCert = (certToRemove: string) => {
    onChange({ certifications: certsList.filter((c) => c !== certToRemove) });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCert(manualInput);
      setManualInput("");
    }
  };

  const handleManualAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddCert(manualInput);
    setManualInput("");
  };

  return (
    <div className="space-y-6">
      <StepHeader
        title="Certifications & Achievements"
        description="Add credentials, certificates, honors, or other achievements to demonstrate your expertise."
      />

      <div className="space-y-6">
        {/* Manual Input */}
        <form onSubmit={handleManualAddSubmit} className="space-y-2">
          <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider">
            Certification / Honor Title
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-white/[0.08] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition duration-200 text-sm"
                placeholder="e.g. AWS Certified Solutions Architect (press Enter to add)"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 bg-slate-900 border border-white/[0.08] hover:bg-slate-800 text-slate-200 font-semibold rounded-xl transition cursor-pointer active:scale-[0.98]"
            >
              Add
            </button>
          </div>
        </form>

        {/* List of Certifications */}
        <div className="space-y-3">
          {certsList.map((cert, index) => (
            <div
              key={index}
              className="group flex items-center justify-between p-4 bg-[#0f1524]/50 border border-white/[0.05] hover:border-violet-500/20 rounded-2xl transition duration-200 shadow-md"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 bg-violet-600/10 border border-violet-500/20 rounded-xl">
                  <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                </div>
                <span className="font-semibold text-slate-200 text-sm md:text-base group-hover:text-white transition">
                  {cert}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveCert(cert)}
                className="text-slate-500 hover:text-red-400 p-2 hover:bg-slate-900 rounded-xl transition cursor-pointer"
                title="Remove Entry"
              >
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}

          {certsList.length === 0 && (
            <div className="text-center py-12 bg-slate-950/10 border border-dashed border-white/[0.06] rounded-3xl">
              <svg className="w-10 h-10 text-slate-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <h4 className="text-slate-300 font-bold text-base">No Records Logged</h4>
              <p className="text-slate-500 text-xs mt-1">Use the input above to add credentials or certifications.</p>
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
          Next: AI Summary
        </button>
      </div>
    </div>
  );
}
