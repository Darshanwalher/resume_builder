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
          <label className="block text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            Certification / Honor Title
          </label>
          <div className="flex gap-2.5">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition"
                placeholder="e.g. AWS Certified Solutions Architect (press Enter)"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] hover:bg-[var(--bg-muted)] text-[var(--text)] font-semibold rounded-xl transition cursor-pointer active:scale-[0.98] text-sm"
            >
              Add
            </button>
          </div>
        </form>

        {/* List of Certifications */}
        <div className="space-y-2.5">
          {certsList.map((cert, index) => (
            <div
              key={index}
              className="group flex items-center justify-between p-3.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl transition duration-150"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--accent-soft)] border border-blue-500/10 rounded-lg">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                </div>
                <span className="font-medium text-[var(--text)] text-sm transition">
                  {cert}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveCert(cert)}
                className="text-[var(--text-muted)] hover:text-red-500 p-1 hover:bg-[var(--bg-muted)] rounded-lg transition cursor-pointer"
                title="Remove Entry"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}

          {certsList.length === 0 && (
            <div className="text-center py-10 border-2 border-dashed border-[var(--border)] rounded-2xl">
              <svg className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <h4 className="text-[var(--text)] font-semibold text-sm">No Records Logged</h4>
              <p className="text-[var(--text-muted)] text-xs mt-0.5">Use the input above to add credentials or certifications.</p>
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
          Next: AI Summary
        </button>
      </div>
    </div>
  );
}
