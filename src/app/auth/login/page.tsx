"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/apis/auth.api";
import { useAuth } from "@/components/providers/AuthProvider";
import ThemeToggle from "@/components/ThemeToggle";
import CornerFrame from "@/components/CornerFrame";
import AuthStatusReadout from "@/components/AuthStatusReadout";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [triggerShake, setTriggerShake] = useState(false);

  useEffect(() => {
    if (error) {
      setTriggerShake(true);
      const timer = setTimeout(() => setTriggerShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await loginUser({ email, password });
      if (res.success && res.data?.user) {
        login(res.data.user);
      } else {
        setError(res.message || "Invalid credentials");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Auth connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] bg-grid px-4 transition-colors duration-300 relative">
      
      {/* Theme toggle top-right */}
      <div className="fixed top-6 right-6 z-10">
        <ThemeToggle className="border border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text)] rounded-lg shadow-none" />
      </div>

      <div className="w-full max-w-sm relative">
        {/* L-shaped corner framing viewfinder */}
        <CornerFrame />

        {/* Card Body */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-8 shadow-sm">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex w-11 h-11 rounded-lg bg-[var(--accent)] items-center justify-center mb-4 text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-[var(--text)] tracking-tight">Welcome back</h1>
            
            {/* Monospace Status Readout */}
            <AuthStatusReadout
              state={loading ? "loading" : error ? "error" : "idle"}
              message={error}
              idleText="SYSTEM · READY"
            />
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1 group">
              <label className="block text-[9px] font-mono font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500 group-focus-within:text-[var(--accent)] transition-colors pl-0.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-600">
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className={`w-full pl-9 pr-3 py-2 bg-transparent text-[var(--text)] placeholder-slate-300 dark:placeholder-slate-700 text-sm outline-none border-b border-[var(--border)] focus:border-transparent transition-colors duration-300 ${triggerShake ? "animate-input-error" : ""}`}
                />
                {/* Traced underline focus indicator */}
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[var(--accent)] origin-left scale-x-0 transition-transform duration-300 ease-out group-focus-within:scale-x-100 motion-reduce:transition-none" />
              </div>
            </div>

            <div className="space-y-1 group">
              <label className="block text-[9px] font-mono font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500 group-focus-within:text-[var(--accent)] transition-colors pl-0.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-600">
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className={`w-full pl-9 pr-3 py-2 bg-transparent text-[var(--text)] placeholder-slate-300 dark:placeholder-slate-700 text-sm outline-none border-b border-[var(--border)] focus:border-transparent transition-colors duration-300 ${triggerShake ? "animate-input-error" : ""}`}
                />
                {/* Traced underline focus indicator */}
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[var(--accent)] origin-left scale-x-0 transition-transform duration-300 ease-out group-focus-within:scale-x-100 motion-reduce:transition-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[var(--accent)] hover:bg-blue-700 dark:hover:bg-blue-500 disabled:opacity-60 text-white font-medium rounded-lg tracking-widest text-[10px] uppercase transition-all duration-200 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 mt-8 shadow-sm shadow-blue-500/10"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-t-transparent border-current animate-spin rounded-full" />
                  AUTHENTICATING…
                </>
              ) : "Enter"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500 tracking-wide font-mono">
            NEW_HERE?{" "}
            <Link href="/auth/register" className="text-[var(--accent)] hover:underline font-medium transition-colors">
              CREATE_ACCOUNT
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
