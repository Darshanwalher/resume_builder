import React from "react";
import StepHeader from "./StepHeader";

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
  return (
    <div>
      <StepHeader
        title="Work Experience"
        description="Detail your professional positions, responsibilities, and key achievements."
      />
      <div className="bg-[#0f1524]/40 border border-white/[0.05] rounded-3xl p-8 text-center text-slate-400">
        Experience Form Stub
      </div>
      
      {/* Action Buttons */}
      <div className="mt-8 flex justify-between gap-4">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-slate-900 border border-white/[0.08] hover:bg-slate-800 text-slate-300 font-semibold rounded-xl active:scale-[0.98] transition cursor-pointer"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl active:scale-[0.98] transition cursor-pointer"
        >
          Next Step
        </button>
      </div>
    </div>
  );
}
