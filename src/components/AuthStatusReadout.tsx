import React from "react";

interface AuthStatusReadoutProps {
  state: "idle" | "loading" | "error" | "success";
  message?: string | null;
  idleText?: string;
}

export default function AuthStatusReadout({
  state,
  message,
  idleText = "SYSTEM · READY",
}: AuthStatusReadoutProps) {
  let content = "";
  let colorClass = "text-slate-400 dark:text-slate-500";
  let showBlinkingCursor = false;

  switch (state) {
    case "loading":
      content = "AUTHENTICATING…";
      showBlinkingCursor = true;
      break;
    case "error":
      // Clean up error message to keep it short, uppercase, and monospace-friendly
      const cleanMsg = message
        ? message.toUpperCase().replace(/\.$/, "").replace(/[^A-Z0-9_ ·]/g, "_")
        : "FAILED";
      content = `ERROR · ${cleanMsg}`;
      colorClass = "text-red-500 dark:text-red-400";
      break;
    case "success":
      content = "SUCCESS · SECURE_SESSION_INITIALIZED";
      colorClass = "text-emerald-500 dark:text-emerald-400";
      break;
    case "idle":
    default:
      content = idleText;
      break;
  }

  return (
    <div className={`font-mono text-[10px] uppercase tracking-widest mt-2 transition-all duration-300 ${colorClass}`}>
      <span>{content}</span>
      {showBlinkingCursor && (
        <span className="inline-block ml-0.5 animate-cursor-blink font-bold">█</span>
      )}
    </div>
  );
}
