"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { getResumes, createResume, deleteResume } from "@/apis/resume.api";

interface Resume {
  _id: string;
  title: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchResumes = async () => {
    try {
      const result = await getResumes();
      if (result.success && Array.isArray(result.data)) {
        setResumes(result.data);
      }
    } catch (err) {
      console.error("Error fetching resumes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleCreateNew = async () => {
    if (creating) return;
    setCreating(true);
    try {
      const result = await createResume();
      if (result.success && result.data?._id) {
        router.push(`/resume/${result.data._id}`);
      }
    } catch (err) {
      console.error("Error creating resume:", err);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId || deleting) return;
    setDeleting(true);
    try {
      const result = await deleteResume(deleteId);
      if (result.success) {
        setResumes((prev) => prev.filter((r) => r._id !== deleteId));
        setDeleteId(null);
      }
    } catch (err) {
      console.error("Error deleting resume:", err);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="min-h-screen bg-[#070b13] text-white flex flex-col font-sans select-none">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-15%] w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-15%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[130px] pointer-events-none" />

      {/* Header / Navbar */}
      <header className="relative z-20 border-b border-white/[0.06] bg-[#0c101b]/60 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-xl shadow-lg shadow-indigo-500/10">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <span className="font-extrabold text-xl bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300 tracking-tight">
            AI Resume Builder
          </span>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-semibold text-slate-200">{user?.name}</span>
            <span className="text-xs text-slate-500">{user?.email}</span>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-slate-900 border border-white/[0.08] hover:bg-slate-800 text-slate-300 text-sm font-medium rounded-xl active:scale-[0.98] transition cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 py-10">
        
        {/* Welcome Section */}
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
            Welcome back, {user?.name || "User"}
          </h2>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            Create, optimize, and manage your resumes with industrial-level AI enhancements.
          </p>
        </div>

        {/* Grid Container */}
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">
            Your Resumes
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            
            {/* Create New Resume Card */}
            <button
              onClick={handleCreateNew}
              disabled={creating}
              className="group relative flex flex-col items-center justify-center p-8 bg-slate-950/20 border-2 border-dashed border-white/[0.08] hover:border-violet-500/50 hover:bg-violet-950/[0.03] rounded-3xl min-h-[220px] transition-all duration-300 cursor-pointer disabled:opacity-50"
            >
              {creating ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-t-violet-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                  <span className="text-slate-400 font-medium text-sm">Creating...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-slate-900 group-hover:bg-violet-600/10 group-hover:scale-110 border border-white/[0.06] group-hover:border-violet-500/20 rounded-2xl transition duration-300 shadow-md">
                    <svg
                      className="w-6 h-6 text-slate-400 group-hover:text-violet-400 transition"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <div className="text-center">
                    <span className="block text-slate-200 group-hover:text-violet-400 font-semibold text-base transition">
                      Create New Resume
                    </span>
                    <span className="block text-slate-500 text-xs mt-1">
                      Start from a fresh template
                    </span>
                  </div>
                </div>
              )}
            </button>

            {/* Skeletons while loading */}
            {loading && (
              <>
                <div className="animate-pulse bg-[#0f1524]/40 border border-white/[0.05] rounded-3xl p-6 h-[220px] flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="h-5 bg-slate-800 rounded w-2/3" />
                    <div className="h-4 bg-slate-800 rounded w-1/3" />
                  </div>
                  <div className="h-9 bg-slate-800 rounded-xl w-full" />
                </div>
                <div className="animate-pulse bg-[#0f1524]/40 border border-white/[0.05] rounded-3xl p-6 h-[220px] flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="h-5 bg-slate-800 rounded w-3/4" />
                    <div className="h-4 bg-slate-800 rounded w-1/2" />
                  </div>
                  <div className="h-9 bg-slate-800 rounded-xl w-full" />
                </div>
              </>
            )}

            {/* Existing Resumes */}
            {!loading &&
              resumes.map((resume) => (
                <div
                  key={resume._id}
                  className="group relative flex flex-col justify-between p-6 bg-[#0f1524]/50 hover:bg-[#0f1524]/80 border border-white/[0.05] hover:border-violet-500/20 rounded-3xl min-h-[220px] transition-all duration-300 shadow-xl"
                >
                  <div>
                    {/* Card Title */}
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <h4 className="font-bold text-lg text-slate-200 group-hover:text-white line-clamp-2 transition">
                        {resume.title || "Untitled Resume"}
                      </h4>
                      
                      {/* Delete Trigger */}
                      <button
                        onClick={() => setDeleteId(resume._id)}
                        className="text-slate-500 hover:text-red-400 p-1.5 hover:bg-slate-900 rounded-lg opacity-0 group-hover:opacity-100 transition cursor-pointer duration-250"
                        title="Delete Resume"
                      >
                        <svg
                          className="w-4.5 h-4.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                    
                    <span className="text-slate-500 text-xs">
                      Last updated {formatDate(resume.updatedAt)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex items-center gap-3">
                    <button
                      onClick={() => router.push(`/resume/${resume._id}`)}
                      className="flex-1 py-2.5 bg-violet-600/10 hover:bg-violet-600 text-violet-400 hover:text-white text-sm font-semibold rounded-xl active:scale-[0.98] border border-violet-500/15 hover:border-transparent transition-all duration-200 cursor-pointer text-center"
                    >
                      Edit Resume
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* Empty State */}
          {!loading && resumes.length === 0 && (
            <div className="mt-12 text-center py-16 bg-[#0f1524]/20 border border-white/[0.04] rounded-3xl max-w-lg mx-auto">
              <svg
                className="w-12 h-12 text-slate-600 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 13h6m-3-3v6m-9 1V4a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
              <h4 className="text-slate-300 font-bold text-lg">No Resumes Yet</h4>
              <p className="text-slate-500 text-sm mt-1">
                Get started by creating your very first AI resume.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0f1524] border border-white/[0.08] rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-xl font-bold text-white mb-2">Delete Resume</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Are you sure you want to delete this resume? This action is permanent and cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent rounded-xl transition text-sm cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl active:scale-[0.98] transition cursor-pointer text-sm disabled:opacity-50 flex items-center gap-1.5"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin rounded-full" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
