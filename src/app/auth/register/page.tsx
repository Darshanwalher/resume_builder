"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/apis/auth.api";
import ThemeToggle from "@/components/ThemeToggle";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await registerUser({ name, email, mobile, password });
      if (res.success) {
        router.push("/dashboard");
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
    { label: "Full Name", type: "text", value: name, set: setName, placeholder: "John Doe" },
    { label: "Email Address", type: "email", value: email, set: setEmail, placeholder: "you@example.com" },
    { label: "Mobile Number", type: "tel", value: mobile, set: setMobile, placeholder: "+91 9876543210" },
    { label: "Password", type: "password", value: password, set: setPassword, placeholder: "Min. 8 characters" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4 py-10">

      {/* Theme toggle */}
      <div className="fixed top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-xl shadow-black/5 dark:shadow-black/30 p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex w-12 h-12 rounded-xl bg-blue-600 items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-[var(--text)] tracking-tight">Create your account</h1>
            <p className="text-[var(--text-muted)] text-sm mt-1">Start building AI-powered resumes today</p>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {fields.map((f) => (
              <div key={f.label}>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  {f.label}
                </label>
                <input
                  type={f.type}
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  required
                  placeholder={f.placeholder}
                  className="w-full px-3.5 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold rounded-xl transition active:scale-[0.98] cursor-pointer text-sm flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-t-white border-r-transparent animate-spin rounded-full" />
                  Creating account…
                </>
              ) : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
