"use client";

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getResume, updateResume } from "@/apis/resume.api";
import ThemeToggle from "@/components/ThemeToggle";

import PersonalInfoStep from "@/components/PersonalInfoStep";
import EducationStep from "@/components/EducationStep";
import ExperienceStep from "@/components/ExperienceStep";
import ProjectSetup from "@/components/ProjectSetup";
import SkillsStep from "@/components/SkillsStep";
import AchievementsStep from "@/components/AchievementsStep";
import SummaryStep from "@/components/SummaryStep";
import PreviewStep from "@/components/PreviewStep";

const STEPS = [
  { name: "Personal Info",  desc: "Contact details" },
  { name: "Education",      desc: "Academic background" },
  { name: "Experience",     desc: "Work history" },
  { name: "Projects",       desc: "Portfolio work" },
  { name: "Skills",         desc: "Technical skills" },
  { name: "Achievements",   desc: "Certifications" },
  { name: "AI Summary",     desc: "Profile intro" },
  { name: "Preview & PDF",  desc: "Export resume" },
];

export default function ResumePage({ params }: { params: Promise<{ resumeId: string }> }) {
  const router = useRouter();
  const { resumeId } = use(params);

  const [resumeData, setResumeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(true);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const result = await getResume(resumeId);
        if (result.success && result.data) {
          setResumeData(result.data);
        } else {
          router.push("/dashboard");
        }
      } catch {
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, [resumeId, router]);

  const handleSave = async (data = resumeData) => {
    if (!resumeId || !data) return;
    setSaving(true);
    setSavedOk(false);
    try {
      await updateResume(resumeId, data);
      setSavedOk(true);
    } catch {
      /* silent */
    } finally {
      setSaving(false);
    }
  };

  const handleDataChange = (fields: any) =>
    setResumeData((prev: any) => ({ ...prev, ...fields }));

  const handleNext = async () => {
    await handleSave();
    if (activeStep < STEPS.length - 1) setActiveStep((p) => p + 1);
  };

  const handleBack = async () => {
    await handleSave();
    if (activeStep > 0) setActiveStep((p) => p - 1);
  };

  const handleSidebarClick = async (idx: number) => {
    await handleSave();
    setActiveStep(idx);
  };

  const renderStep = () => {
    const p = { resumeData, onChange: handleDataChange, onNext: handleNext, onBack: handleBack };
    switch (activeStep) {
      case 0: return <PersonalInfoStep {...p} />;
      case 1: return <EducationStep {...p} />;
      case 2: return <ExperienceStep {...p} />;
      case 3: return <ProjectSetup {...p} />;
      case 4: return <SkillsStep {...p} />;
      case 5: return <AchievementsStep {...p} />;
      case 6: return <SummaryStep {...p} />;
      case 7: return <PreviewStep {...p} />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
          <p className="text-[var(--text-muted)] text-sm">Loading workspace…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ─── Header ─── */}
      <header className="shrink-0 border-b border-[var(--border)] bg-[var(--bg-card)] h-13 flex items-center justify-between px-5">
        <div className="flex items-center gap-3">
          <button
            onClick={async () => { await handleSave(); router.push("/dashboard"); }}
            className="flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text)] transition cursor-pointer text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Dashboard</span>
          </button>
          <span className="text-[var(--border)] select-none">|</span>
          <span className="font-semibold text-[var(--text)] text-sm max-w-[220px] truncate">
            {resumeData?.title || "Untitled Resume"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {saving ? (
            <span className="flex items-center gap-1.5 text-[var(--text-muted)] text-xs">
              <div className="w-3.5 h-3.5 border border-t-current animate-spin rounded-full" />
              Saving…
            </span>
          ) : savedOk ? (
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Saved
            </span>
          ) : null}
          <ThemeToggle />
        </div>
      </header>

      {/* ─── Body: Sidebar + Editor ─── */}
      <div className="flex-1 flex overflow-hidden">

        {/* Sidebar */}
        <aside className="w-56 shrink-0 border-r border-[var(--border)] bg-[var(--bg-card)] overflow-y-auto py-4 px-3 flex flex-col gap-0.5">
          {STEPS.map((step, idx) => {
            const isActive = idx === activeStep;
            const isDone = idx < activeStep;
            return (
              <button
                key={idx}
                onClick={() => handleSidebarClick(idx)}
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl transition cursor-pointer ${
                  isActive
                    ? "bg-[var(--accent-soft)] text-[var(--accent-text)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-muted)]"
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 transition-all ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : isDone
                    ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400"
                    : "bg-[var(--bg-muted)] border border-[var(--border)] text-[var(--text-muted)]"
                }`}>
                  {isDone ? (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate leading-tight">{step.name}</p>
                  <p className="text-[10px] opacity-60 truncate mt-0.5">{step.desc}</p>
                </div>
              </button>
            );
          })}
        </aside>

        {/* Editor */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-3xl mx-auto bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 md:p-8">
            {renderStep()}
          </div>
        </main>
      </div>
    </div>
  );
}
