import React from "react";
import StepHeader from "./StepHeader";

interface StepProps {
  resumeData: any;
  onChange: (updatedData: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PersonalInfoStep({
  resumeData,
  onChange,
  onNext,
}: Omit<StepProps, "onBack">) {
  const info = resumeData?.personalInfo || {};

  const handleFieldChange = (field: string, value: string) => {
    onChange({
      personalInfo: {
        ...info,
        [field]: value,
      },
    });
  };

  const fields = [
    { id: "fullName", label: "Full Name", placeholder: "John Doe", type: "text", icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )},
    { id: "email", label: "Email Address", placeholder: "john.doe@example.com", type: "email", icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
      </svg>
    )},
    { id: "mobile", label: "Phone Number", placeholder: "+1 (555) 000-0000", type: "tel", icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    )},
    { id: "location", label: "Location", placeholder: "New York, NY", type: "text", icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )},
  ];

  const socialFields = [
    { id: "github", label: "GitHub URL", placeholder: "https://github.com/...", icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    )},
    { id: "linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/...", icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 11-5.656 5.656l-1.1-1.1" />
      </svg>
    )},
    { id: "portfolio", label: "Portfolio URL", placeholder: "https://myportfolio.com", icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    )},
  ];

  return (
    <div className="space-y-6">
      <StepHeader
        title="Personal Information"
        description="Enter your full name, contact information, and online professional profile links to help employers connect with you."
      />

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {fields.map((f) => (
            <div key={f.id}>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">
                {f.label}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                  {f.icon}
                </div>
                <input
                  type={f.type}
                  value={info[f.id] || ""}
                  onChange={(e) => handleFieldChange(f.id, e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition"
                  placeholder={f.placeholder}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-[var(--border)] pt-5 mt-2">
          <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4">
            Professional Links
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {socialFields.map((f) => (
              <div key={f.id}>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">
                  {f.label}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                    {f.icon}
                  </div>
                  <input
                    type="url"
                    value={info[f.id] || ""}
                    onChange={(e) => handleFieldChange(f.id, e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition"
                    placeholder={f.placeholder}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>

      {/* Action Buttons */}
      <div className="mt-6 border-t border-[var(--border)] pt-5 flex justify-end">
        <button
          onClick={onNext}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition active:scale-[0.98] cursor-pointer text-sm"
        >
          Next: Education
        </button>
      </div>
    </div>
  );
}
