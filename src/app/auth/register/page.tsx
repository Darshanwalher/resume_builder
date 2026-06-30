"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/apis/auth.api";
import { useAuth } from "@/components/providers/AuthProvider";
import ThemeToggle from "@/components/ThemeToggle";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await registerUser({ name, email, mobile, password });
      if (res.success && res.data?.user) {
        login(res.data.user);
      } else {
        setError(res.message || "Registration failed.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      id: "name",
      label: "Full Name",
      type: "text",
      value: name,
      set: setName,
      placeholder: "John Doe",
      icon: (
        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      id: "email",
      label: "Email Address",
      type: "email",
      value: email,
      set: setEmail,
      placeholder: "you@example.com",
      icon: (
        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
        </svg>
      )
    },
    {
      id: "mobile",
      label: "Mobile Number",
      type: "tel",
      value: mobile,
      set: setMobile,
      placeholder: "+91 9876543210",
      icon: (
        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      )
    },
    {
      id: "password",
      label: "Password",
      type: "password",
      value: password,
      set: setPassword,
      placeholder: "Min. 8 characters",
      icon: (
        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
  ];

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 overflow-hidden transition-colors duration-300">

      {/* Background Decorative Glow Shapes */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-blue-400/20 dark:bg-blue-600/10 blur-[100px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-violet-400/25 dark:bg-violet-600/10 blur-[120px] pointer-events-none animate-pulse-slow" style={{ animationDelay: "2s" }} />

      {/* Theme toggle top-right */}
      <div className="fixed top-6 right-6 z-10 animate-fade-in-down">
        <ThemeToggle className="shadow-lg shadow-black/5 dark:shadow-black/20" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Main Card with Glassmorphism and fadeInUp entry */}
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/40 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-black/40 p-8 md:p-10 animate-fade-in-up">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 items-center justify-center mb-5 shadow-lg shadow-blue-500/20 ring-4 ring-blue-500/10 animate-fade-in-down" style={{ animationDelay: "100ms" }}>
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Create your account</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Start building AI-powered resumes today</p>
          </div>

          {error && (
            <div className={`mb-6 px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200/60 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-start gap-2.5 ${triggerShake ? "animate-shake" : ""}`}>
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {fields.map((f, i) => (
              <div key={f.id} className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">
                  {f.label}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    {f.icon}
                  </div>
                  <input
                    type={f.type}
                    value={f.value}
                    onChange={(e) => f.set(e.target.value)}
                    required
                    placeholder={f.placeholder}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 text-sm outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 focus:bg-white dark:focus:bg-slate-900 transition-all duration-200"
                  />
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-60 text-white font-bold rounded-2xl transition-all duration-200 active:scale-[0.98] cursor-pointer text-sm flex items-center justify-center gap-2 mt-6 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <div className="w-4.5 h-4.5 border-2 border-t-white border-r-transparent animate-spin rounded-full" />
                  Creating account…
                </>
              ) : "Create Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-600 dark:text-blue-400 hover:underline font-bold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

