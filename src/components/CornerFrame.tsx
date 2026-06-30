import React from "react";

export default function CornerFrame() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top Left Bracket */}
      <div className="absolute -top-3.5 -left-3.5 w-4 h-4 border-t-1.5 border-l-1.5 border-slate-200 dark:border-slate-800 animate-bracket-tl" />
      
      {/* Top Right Bracket */}
      <div className="absolute -top-3.5 -right-3.5 w-4 h-4 border-t-1.5 border-r-1.5 border-slate-200 dark:border-slate-800 animate-bracket-tr" />
      
      {/* Bottom Left Bracket */}
      <div className="absolute -bottom-3.5 -left-3.5 w-4 h-4 border-b-1.5 border-l-1.5 border-slate-200 dark:border-slate-800 animate-bracket-bl" />
      
      {/* Bottom Right Bracket */}
      <div className="absolute -bottom-3.5 -right-3.5 w-4 h-4 border-b-1.5 border-r-1.5 border-slate-200 dark:border-slate-800 animate-bracket-br" />
    </div>
  );
}
