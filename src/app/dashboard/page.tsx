"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getResumes, deleteResume, createResume, updateResume } from "@/apis/resume.api";
import { getCurrentUser } from "@/apis/auth.api";
import { useAuth } from "@/components/providers/AuthProvider";
import ThemeToggle from "@/components/ThemeToggle";

export default function DashboardPage() {
  const router = useRouter();
  const { logout } = useAuth();

  const [user, setUser] = useState<any>(null);
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Create modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const createInputRef = useRef<HTMLInputElement>(null);

  // Inline edit title
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  // Delete modal
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ─── Data loading ───
  useEffect(() => {
    const init = async () => {
      try {
        const [userRes, resumesRes] = await Promise.all([getCurrentUser(), getResumes()]);
        if (!userRes.success) {
          router.push("/auth/login");
          return;
        }
        // The API returns { data: { user: {...} } }
        setUser(userRes.data?.user || userRes.data || null);
        if (resumesRes.success) setResumes(resumesRes.data || []);
      } catch {
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [router]);

  // Focus create input when modal opens
  useEffect(() => {
    if (showCreateModal) setTimeout(() => createInputRef.current?.focus(), 80);
  }, [showCreateModal]);

  // Focus edit input when editing
  useEffect(() => {
    if (editingId) setTimeout(() => editInputRef.current?.focus(), 60);
  }, [editingId]);

  // ─── Handlers ───
  const handleOpenCreateModal = () => {
    setNewTitle("");
    setShowCreateModal(true);
  };

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const res = await createResume();
      if (res.success && res.data?._id) {
        // Set the title immediately
        await updateResume(res.data._id, { title: newTitle.trim() });
        router.push(`/resume/${res.data._id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
      setShowCreateModal(false);
    }
  };

  const handleStartEdit = (resume: any) => {
    setEditingId(resume._id);
    setEditingTitle(resume.title || "");
  };

  const handleSaveTitle = async (id: string) => {
    if (!editingTitle.trim()) {
      setEditingId(null);
      return;
    }
    try {
      await updateResume(id, { title: editingTitle.trim() });
      setResumes((prev) =>
        prev.map((r) => (r._id === id ? { ...r, title: editingTitle.trim() } : r))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setEditingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModalId) return;
    setDeleting(true);
    try {
      await deleteResume(deleteModalId);
      setResumes((prev) => prev.filter((r) => r._id !== deleteModalId));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
      setDeleteModalId(null);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  // ─── Loading screen ───
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
          <p className="text-[var(--text-muted)] text-sm">Loading your workspace…</p>
        </div>
      </div>
    );
  }

  const displayName = user?.name || user?.email || "—";
  const initials = (user?.name || user?.email || "?")[0].toUpperCase();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Header ── */}
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--bg-card)] backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-bold text-[var(--text)] text-sm tracking-tight">AI Resume Builder</span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-muted)]">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                {initials}
              </div>
              <span className="text-xs font-medium text-[var(--text-muted)] max-w-[120px] truncate">{displayName}</span>
            </div>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)] rounded-lg hover:bg-[var(--bg-muted)] transition cursor-pointer"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-6xl mx-auto px-5 py-10">

        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--text)]">My Resumes</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">Manage and build your AI-powered professional resume documents</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Resumes", value: String(resumes.length) },
            { label: "Account Email", value: user?.email || "—" },
            { label: "Member Since", value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—" },
          ].map((s) => (
            <div key={s.label} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl px-5 py-4">
              <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">{s.label}</p>
              <p className="text-sm font-bold text-[var(--text)] mt-1.5 truncate">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* Create new */}
          <button
            onClick={handleOpenCreateModal}
            className="group h-48 border-2 border-dashed border-[var(--border)] hover:border-blue-500 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all cursor-pointer active:scale-[0.98] bg-transparent hover:bg-[var(--accent-soft)]"
          >
            <div className="w-11 h-11 rounded-xl bg-[var(--bg-muted)] border border-[var(--border)] flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition">
              <svg className="w-5 h-5 text-[var(--text-muted)] group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div className="text-center">
              <p className="font-semibold text-[var(--text-muted)] text-sm group-hover:text-[var(--accent)] transition">New Resume</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5 opacity-70">Start from scratch</p>
            </div>
          </button>

          {/* Resume cards */}
          {resumes.map((resume) => (
            <div
              key={resume._id}
              className="group bg-[var(--bg-card)] border border-[var(--border)] hover:border-blue-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-9 h-9 bg-[var(--bg-muted)] border border-[var(--border)] rounded-xl flex items-center justify-center">
                    <svg className="w-4.5 h-4.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <button
                    onClick={() => setDeleteModalId(resume._id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-[var(--text-muted)] hover:text-red-500 rounded-lg transition cursor-pointer"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                {/* Editable title */}
                {editingId === resume._id ? (
                  <input
                    ref={editInputRef}
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={() => handleSaveTitle(resume._id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveTitle(resume._id);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    className="w-full text-sm font-semibold bg-[var(--bg-muted)] border border-blue-500 rounded-lg px-2.5 py-1.5 text-[var(--text)] outline-none"
                  />
                ) : (
                  <div className="flex items-center gap-1.5 group/title">
                    <h2 className="font-semibold text-[var(--text)] text-sm leading-snug truncate">
                      {resume.title || "Untitled Resume"}
                    </h2>
                    <button
                      onClick={() => handleStartEdit(resume)}
                      className="opacity-0 group-hover/title:opacity-100 p-0.5 text-[var(--text-muted)] hover:text-[var(--accent)] rounded transition cursor-pointer"
                      title="Rename"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </div>
                )}

                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Updated {new Date(resume.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>

              <button
                onClick={() => router.push(`/resume/${resume._id}`)}
                className="mt-4 w-full py-2 text-xs font-semibold bg-[var(--bg-muted)] hover:bg-blue-600 border border-[var(--border)] hover:border-blue-600 text-[var(--text-muted)] hover:text-white rounded-xl transition cursor-pointer active:scale-[0.98]"
              >
                Open & Edit
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* ── Create Modal ── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-base font-bold text-[var(--text)] mb-1">Name your resume</h3>
            <p className="text-sm text-[var(--text-muted)] mb-5">Give it a meaningful title so you can find it easily.</p>

            <input
              ref={createInputRef}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); if (e.key === "Escape") setShowCreateModal(false); }}
              placeholder="e.g. Full Stack Developer Resume"
              className="w-full px-3.5 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text)] placeholder-[var(--text-muted)] text-sm outline-none focus:border-blue-500 transition mb-5"
            />

            <div className="flex gap-2.5">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2.5 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)] rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={creating || !newTitle.trim()}
                className="flex-1 py-2.5 text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {creating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-t-white border-r-transparent animate-spin rounded-full" />
                    Creating…
                  </>
                ) : "Create Resume"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Modal ── */}
      {deleteModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-base font-bold text-[var(--text)] mb-2">Delete this resume?</h3>
            <p className="text-sm text-[var(--text-muted)] mb-6 leading-relaxed">
              This action is permanent and cannot be undone.
            </p>
            <div className="flex gap-2.5 justify-end">
              <button
                onClick={() => setDeleteModalId(null)}
                disabled={deleting}
                className="px-4 py-2 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)] rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-4 py-2 text-sm font-semibold bg-red-600 hover:bg-red-500 text-white rounded-xl transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {deleting ? (
                  <><div className="w-3.5 h-3.5 border-2 border-t-white border-r-transparent animate-spin rounded-full" />Deleting…</>
                ) : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
