import React from "react";

interface StepHeaderProps {
  title: string;
  description: string;
}

export default function StepHeader({ title, description }: StepHeaderProps) {
  return (
    <div className="mb-6 border-b border-[var(--border)] pb-4">
      <h2 className="text-xl font-semibold text-[var(--text)] tracking-tight">
        {title}
      </h2>
      <p className="text-[var(--text-muted)] mt-1.5 text-sm">
        {description}
      </p>
    </div>
  );
}

