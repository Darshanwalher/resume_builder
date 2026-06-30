"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/apis/auth.api";
import { useAuth } from "@/components/providers/AuthProvider";
import ThemeToggle from "@/components/ThemeToggle";
import CornerFrame from "@/components/CornerFrame";
import AuthStatusReadout from "@/components/AuthStatusReadout";

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
        setError(res.message || "Registration failed");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration error");
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
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
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
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
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
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] bg-grid px-4 py-12 transition-colors duration-300 relative">
      
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
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-[var(--text)] tracking-tight">Create your account</h1>
            
            {/* Monospace Status Readout */}
            <AuthStatusReadout
              state={loading ? "loading" : error ? "error" : "idle"}
              message={error}
              idleText="SYSTEM · NEW_ACCOUNT"
            />
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {fields.map((f, i) => (
              <div key={f.id} className="space-y-1 group">
                <label className="block text-[9px] font-mono font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500 group-focus-within:text-[var(--accent)] transition-colors pl-0.5">
                  {f.label}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-600">
                    {f.icon}
                  </div>
                  <input
                    type={f.type}
                    value={f.value}
                    onChange={(e) => f.set(e.target.value)}
                    required
                    placeholder={f.placeholder}
                    className={`w-full pl-9 pr-3 py-2 bg-transparent text-[var(--text)] placeholder-slate-300 dark:placeholder-slate-700 text-sm outline-none border-b border-[var(--border)] focus:border-transparent transition-colors duration-300 ${triggerShake ? "animate-input-error" : ""}`}
                  />
                  {/* Traced underline focus indicator */}
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[var(--accent)] origin-left scale-x-0 transition-transform duration-300 ease-out group-focus-within:scale-x-100 motion-reduce:transition-none" />
                </div>
              </div>
            ))}

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
              ) : "Register"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500 tracking-wide font-mono">
            ALREADY_HAVE_ACCOUNT?{" "}
            <Link href="/auth/login" className="text-[var(--accent)] hover:underline font-medium transition-colors">
              SIGN_IN
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
