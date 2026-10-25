"use client";

import React, { useState, useEffect } from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { SAMPLE_SUBMISSIONS } from "@/lib/sample-data";
import { LocalStore } from "@/lib/storage";
import { InterviewSession, HiringStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
  FileText,
  Video,
  X,
  Save,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<InterviewSession[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeSession, setActiveSession] = useState<InterviewSession | null>(null);
  const [recruiterNotes, setRecruiterNotes] = useState("");
  const [decision, setDecision] = useState<HiringStatus>("under_review");

  useEffect(() => {
    const loaded = LocalStore.getSessions().length > 0 ? LocalStore.getSessions() : SAMPLE_SUBMISSIONS;
    setSubmissions(loaded);
  }, []);

  const filtered = submissions.filter((s) => {
    const matchesSearch =
      s.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.targetRole.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.hiringDecision === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenDrawer = (session: InterviewSession) => {
    setActiveSession(session);
    setRecruiterNotes(session.recruiterNotes || "");
    setDecision(session.hiringDecision);
  };

  const handleSaveDecision = () => {
    if (!activeSession) return;
    const updated: InterviewSession = {
      ...activeSession,
      recruiterNotes,
      hiringDecision: decision,
    };
    const updatedList = submissions.map((s) => (s.id === updated.id ? updated : s));
    setSubmissions(updatedList);
    LocalStore.saveSessions(updatedList);
    setActiveSession(updated);
    alert("Candidate review decision and recruiter notes saved.");
  };

  return (
    <PortalLayout requiredRole="interviewer">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-softwhite">
              Candidate Submissions Hub
            </h1>
            <p className="text-xs text-muted mt-1">
              Review candidate scorecards, integrity event audit trails, and log recruiter decisions.
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search by candidate name, roll number, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-softwhite placeholder:text-muted/60 text-xs focus:outline-none focus:border-violet-400"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {["all", "under_review", "shortlisted", "rejected"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all ${
                  statusFilter === st
                    ? "bg-violet-500 text-white font-semibold shadow-sm"
                    : "bg-navy-900 hover:bg-navy-800 text-muted hover:text-softwhite border border-navy-700"
                }`}
              >
                {st.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Submissions Table */}
        <div className="glass-panel rounded-3xl border border-navy-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-navy-700/80 bg-navy-900/60 text-muted uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4 font-semibold">Candidate</th>
                  <th className="py-3.5 px-4 font-semibold">Roll Number</th>
                  <th className="py-3.5 px-4 font-semibold">Target Role</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Resume Match</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Interview Score</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Integrity</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-700/60">
                {filtered.map((sub) => (
                  <tr key={sub.id} className="hover:bg-navy-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-softwhite">
                      <div>{sub.candidateName}</div>
                      <div className="text-[10px] text-muted">{sub.candidateEmail}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-cyan-400">{sub.rollNumber}</td>
                    <td className="py-3.5 px-4 text-muted">{sub.targetRole}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-cyan-400">
                      {sub.resumeMatchScore || 92}%
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-bold text-softwhite font-mono px-2 py-0.5 rounded-md bg-navy-800 border border-navy-700">
                        {sub.overallScore || 85}/100
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          sub.integrityEvents.length === 0
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {sub.integrityEvents.length === 0 ? "Clean" : `${sub.integrityEvents.length} flags`}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                          sub.hiringDecision === "shortlisted"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : sub.hiringDecision === "rejected"
                            ? "bg-red-500/10 text-red-400 border border-red-500/30"
                            : "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {sub.hiringDecision.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenDrawer(sub)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-500/15 text-violet-300 hover:bg-violet-500/25 border border-violet-500/30 transition-colors"
                      >
                        Review →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Candidate Review Modal */}
        {activeSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
            <div className="max-w-3xl w-full max-h-[90vh] overflow-y-auto glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-violet-500/40 shadow-glass relative space-y-5">
              <button
                onClick={() => setActiveSession(null)}
                className="absolute top-5 right-5 p-1 rounded-lg text-muted hover:text-softwhite hover:bg-navy-800"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between border-b border-navy-700/60 pb-4">
                <div>
                  <h2 className="text-xl font-heading font-bold text-softwhite">
                    Candidate Evaluation Review
                  </h2>
                  <p className="text-xs text-muted mt-0.5">
                    {activeSession.candidateName} • Roll: {activeSession.rollNumber} • Role: {activeSession.targetRole}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted block">Overall Score</span>
                  <span className="text-2xl font-bold font-heading text-gradient-cyan-violet">
                    {activeSession.overallScore || 85}/100
                  </span>
                </div>
              </div>

              {/* Integrity Event Audit Trail */}
              <div className="p-4 rounded-2xl bg-navy-900 border border-navy-700 text-xs">
                <span className="text-[10px] font-bold uppercase text-muted block mb-2">
                  Integrity Audit Trail ({activeSession.integrityEvents.length} signals)
                </span>
                {activeSession.integrityEvents.length === 0 ? (
                  <p className="text-emerald-400 text-xs">No window blur or copy/paste events recorded.</p>
                ) : (
                  <ul className="space-y-1.5 text-[11px] text-muted">
                    {activeSession.integrityEvents.map((evt) => (
                      <li key={evt.id} className="flex justify-between border-b border-navy-800 pb-1">
                        <span>{evt.description}</span>
                        <span className="text-cyan-400 font-mono">{formatDate(evt.timestamp)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Answers & Evidence Feedback */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-softwhite block">
                  Interview Questions & Candidate Evidence
                </span>
                {activeSession.responses.map((r, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-navy-900 border border-navy-700 text-xs space-y-2">
                    <div className="flex justify-between text-cyan-400 font-semibold">
                      <span>Question {i + 1} [{r.category.toUpperCase()}]:</span>
                      <span>{r.evaluation?.score || 85}/100</span>
                    </div>
                    <p className="text-softwhite font-medium">{r.questionText}</p>
                    <p className="text-muted italic bg-navy-950 p-2.5 rounded-xl border border-navy-800">
                      &ldquo;{r.candidateAnswer}&rdquo;
                    </p>
                    {r.evaluation?.explanation && (
                      <p className="text-[11px] text-muted">
                        <strong className="text-cyan-300">Feedback:</strong> {r.evaluation.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Recruiter Notes & Decision Controls */}
              <div className="p-4 rounded-2xl bg-navy-900 border border-violet-500/30 space-y-3 text-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-violet-300 block">
                  Recruiter Decision & Private Notes
                </span>

                <div className="flex items-center gap-3">
                  <span className="text-muted font-medium">Hiring Decision:</span>
                  {(["under_review", "shortlisted", "rejected"] as HiringStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setDecision(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                        decision === st
                          ? st === "shortlisted"
                            ? "bg-emerald-500 text-navy-950"
                            : st === "rejected"
                            ? "bg-red-500 text-white"
                            : "bg-amber-500 text-navy-950"
                          : "bg-navy-800 text-muted hover:text-softwhite"
                      }`}
                    >
                      {st.replace("_", " ")}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={2}
                  placeholder="Enter private notes and recommendations for the university placement cell..."
                  value={recruiterNotes}
                  onChange={(e) => setRecruiterNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-700 text-softwhite focus:outline-none focus:border-violet-400"
                />

                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleSaveDecision}
                    className="px-4 py-2 rounded-xl bg-violet-500 text-white font-semibold hover:bg-violet-400 flex items-center gap-1.5 shadow-neon-violet transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Decision & Notes</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
