import React from "react";

interface StepHeaderProps {
  title: string;
  description: string;
}

export default function StepHeader({ title, description }: StepHeaderProps) {
  return (
    <div className="mb-8 border-b border-white/[0.06] pb-6">
      <h2 className="text-2xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
        {title}
      </h2>
      <p className="text-slate-400 mt-2 text-sm">
        {description}
      </p>
    </div>
  );
}
