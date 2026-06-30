"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/dashboard");
      } else {
        router.push("/auth/login");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-[#070b13] flex items-center justify-center">
      {/* Premium Loader */}
      <div className="relative flex flex-col items-center">
        <div className="w-12 h-12 rounded-full border-2 border-violet-500/20 border-t-violet-500 animate-spin mb-4" />
        <p className="text-slate-400 text-sm tracking-wide">Loading Resume Builder...</p>
      </div>
    </div>
  );
}