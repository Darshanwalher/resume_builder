"use client";

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getResume, updateResume } from "@/apis/resume.api";

// Import step components
import PersonalInfoStep from "@/components/PersonalInfoStep";
import EducationStep from "@/components/EducationStep";
import ExperienceStep from "@/components/ExperienceStep";
import ProjectSetup from "@/components/ProjectSetup";
import SkillsStep from "@/components/SkillsStep";
import AchievementsStep from "@/components/AchievementsStep";
import SummaryStep from "@/components/SummaryStep";
import PreviewStep from "@/components/PreviewStep";

const STEPS = [
  { name: "Personal Info", desc: "Contact details" },
  { name: "Education", desc: "Academics" },
  { name: "Experience", desc: "Work history" },
  { name: "Projects", desc: "Tech portfolio" },
  { name: "Skills", desc: "Competencies" },
  { name: "Achievements", desc: "Certifications" },
  { name: "AI Summary", desc: "Intro profile" },
  { name: "Preview & PDF", desc: "Export resume" },
];

export default function ResumePage({ params }: { params: Promise<{ resumeId: string }> }) {
  const router = useRouter();
  const { resumeId } = use(params);

  const [resumeData, setResumeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const result = await getResume(resumeId);
        if (result.success && result.data) {
          setResumeData(result.data);
        } else {
          router.push("/dashboard");
        }
      } catch (err) {
        console.error("Failed to load resume:", err);
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [resumeId, router]);

  const handleSave = async (updatedData = resumeData) => {
    if (!resumeId || !updatedData) return;
    setSaving(true);
    try {
      await updateResume(resumeId, updatedData);
    } catch (err) {
      console.error("Failed to auto-save resume:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDataChange = (updatedFields: any) => {
    setResumeData((prev: any) => {
      const next = { ...prev, ...updatedFields };
      // Debounce or save immediately when changing page sections
      return next;
    });
  };

  const handleNext = async () => {
    // Save current step data to database first
    await handleSave();
    if (activeStep < STEPS.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = async () => {
    await handleSave();
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  const handleSidebarClick = async (stepIndex: number) => {
    await handleSave();
    setActiveStep(stepIndex);
  };

  const renderActiveStep = () => {
    const props = {
      resumeData,
      onChange: handleDataChange,
      onNext: handleNext,
      onBack: handleBack,
    };

    switch (activeStep) {
      case 0:
        return <PersonalInfoStep {...props} />;
      case 1:
        return <EducationStep {...props} />;
      case 2:
        return <ExperienceStep {...props} />;
      case 3:
        return <ProjectSetup {...props} />;
      case 4:
        return <SkillsStep {...props} />;
      case 5:
        return <AchievementsStep {...props} />;
      case 6:
        return <SummaryStep {...props} />;
      case 7:
        return <PreviewStep {...props} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b13] flex items-center justify-center text-white select-none">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-2 border-violet-500/20 border-t-violet-500 animate-spin mb-4" />
          <p className="text-slate-400 text-sm tracking-wide">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b13] text-white flex flex-col font-sans select-none">
      {/* Header bar */}
      <header className="border-b border-white/[0.06] bg-[#0c101b]/60 backdrop-blur-xl px-6 py-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={async () => {
              await handleSave();
              router.push("/dashboard");
            }}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Dashboard</span>
          </button>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-slate-300 font-bold max-w-[200px] sm:max-w-xs truncate">
            {resumeData?.title || "Untitled Resume"}
          </span>
        </div>

        {/* Saving indicator */}
        <div className="flex items-center gap-2">
          {saving ? (
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <div className="w-3.5 h-3.5 border border-t-slate-400 border-r-transparent border-b-transparent border-l-transparent animate-spin rounded-full" />
              <span>Saving Changes...</span>
            </div>
          ) : (
            <span className="text-emerald-400 text-xs flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Saved
            </span>
          )}
        </div>
      </header>

      {/* Main split layout */}
      <div className="flex-1 flex flex-col md:flex-row relative z-10">
        
        {/* Left Sidebar Steps Panel */}
        <aside className="w-full md:w-80 border-r border-white/[0.06] bg-[#0c101b]/20 p-6 flex flex-col gap-1 shrink-0 overflow-y-auto">
          {STEPS.map((step, idx) => {
            const isActive = idx === activeStep;
            return (
              <button
                key={idx}
                onClick={() => handleSidebarClick(idx)}
                className={`w-full text-left p-4 rounded-2xl flex items-center gap-4 transition cursor-pointer ${
                  isActive
                    ? "bg-violet-600/10 border border-violet-500/30 text-white"
                    : "border border-transparent text-slate-400 hover:text-white hover:bg-white/[0.02]"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    isActive
                      ? "bg-violet-600 text-white scale-110 shadow-lg shadow-violet-500/20"
                      : "bg-slate-900 border border-white/[0.08]"
                  }`}
                >
                  {idx + 1}
                </div>
                <div>
                  <span className="block font-semibold text-sm">{step.name}</span>
                  <span className="block text-slate-500 text-xs mt-0.5">{step.desc}</span>
                </div>
              </button>
            );
          })}
        </aside>

        {/* Right Editor Form Workspace */}
        <main className="flex-1 p-6 md:p-10 max-w-4xl w-full mx-auto overflow-y-auto">
          <div className="bg-[#0f1524]/20 border border-white/[0.04] rounded-3xl p-6 md:p-8 shadow-2xl">
            {renderActiveStep()}
          </div>
        </main>
      </div>
    </div>
  );
}
