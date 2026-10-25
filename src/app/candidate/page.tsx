"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { useAuth } from "@/lib/auth-context";
import { InterviewMateBot } from "@/components/mascot/InterviewMateBot";
import { SAMPLE_CAMPAIGNS, SAMPLE_SUBMISSIONS } from "@/lib/sample-data";
import { LocalStore } from "@/lib/storage";
import { Campaign, InterviewSession } from "@/lib/types";
import { formatTimeRemaining } from "@/lib/utils";
import {
  FileText,
  PlayCircle,
  Award,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Building,
} from "lucide-react";

export default function CandidateLobbyPage() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [recentSessions, setRecentSessions] = useState<InterviewSession[]>([]);

  useEffect(() => {
    // Load campaigns from storage or fallback to sample
    const saved = LocalStore.getCampaigns();
    if (saved.length > 0) {
      setCampaigns(saved);
    } else {
      setCampaigns(SAMPLE_CAMPAIGNS);
      LocalStore.saveCampaigns(SAMPLE_CAMPAIGNS);
    }

    // Load candidate sessions
    const sessions = LocalStore.getSessions();
    if (sessions.length > 0) {
      setRecentSessions(sessions);
    } else {
      setRecentSessions(SAMPLE_SUBMISSIONS);
      LocalStore.saveSessions(SAMPLE_SUBMISSIONS);
    }
  }, []);

  return (
    <PortalLayout requiredRole="student">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Hero Banner */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel-elevated relative overflow-hidden border border-cyan-500/25">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Candidate Lobby Active</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-softwhite">
                Welcome back, {user?.fullName || "Candidate"}!
              </h1>
              <p className="text-xs sm:text-sm text-muted mt-2 max-w-xl leading-relaxed">
                Roll No: <span className="text-cyan-400 font-mono font-medium">{(user?.profile as any)?.rollNumber || "22CS108"}</span> •
                {" "}{(user?.profile as any)?.college || "University of Technology"}
                <br />
                Select an active drive below, upload your resume for verification, or enter the AI mock interview room.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/resume"
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-navy-800 hover:bg-navy-700 text-softwhite border border-navy-700 flex items-center gap-2 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Resume Studio</span>
                </Link>
                <Link
                  href="/interview/setup"
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-cyan-500 text-navy-950 hover:bg-cyan-400 flex items-center gap-2 transition-colors shadow-neon-cyan"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>Start AI Interview</span>
                </Link>
              </div>
            </div>

            <div className="hidden md:flex flex-col items-center">
              <InterviewMateBot size="md" state="greeting" showStatusBadge statusText="Ready to Practice" />
            </div>
          </div>
        </div>

        {/* Quick Action Tiles */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Link
            href="/dashboard"
            className="p-5 rounded-2xl glass-panel border border-navy-700 hover:border-cyan-500/40 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-softwhite group-hover:text-cyan-300 transition-colors">
              Available Drives ({campaigns.length})
            </h3>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Explore active company recruitment drives with live submission countdowns.
            </p>
          </Link>

          <Link
            href="/resume"
            className="p-5 rounded-2xl glass-panel border border-navy-700 hover:border-cyan-500/40 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-softwhite group-hover:text-cyan-300 transition-colors">
              Resume Studio
            </h3>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Extract PDF/DOCX skills, run gap analysis, and review verification scores.
            </p>
          </Link>

          <Link
            href="/scorecards"
            className="p-5 rounded-2xl glass-panel border border-navy-700 hover:border-cyan-500/40 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-softwhite group-hover:text-cyan-300 transition-colors">
              My Scorecards
            </h3>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Inspect criteria breakdown scores, recruiter feedback, and repeat test gains.
            </p>
          </Link>
        </div>

        {/* Active Campus Drives Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-heading font-bold text-softwhite">Active Recruitment Drives</h2>
              <p className="text-xs text-muted">Validated campus placement campaigns open for candidate participation</p>
            </div>
            <Link
              href="/dashboard"
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {campaigns.map((camp) => {
              const timer = formatTimeRemaining(camp.deadline);

              return (
                <div
                  key={camp.id}
                  className="p-5 rounded-2xl glass-panel border border-navy-700 flex flex-col justify-between hover:border-navy-600 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-navy-800 text-muted border border-navy-700">
                        {camp.role}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          timer.isExpired
                            ? "bg-red-500/10 text-red-400 border border-red-500/30"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        <span>{timer.text}</span>
                      </span>
                    </div>

                    <h3 className="font-heading text-sm font-bold text-softwhite mt-2">
                      {camp.title}
                    </h3>
                    <p className="text-xs text-cyan-400 font-medium flex items-center gap-1.5 mt-1">
                      <Building className="w-3.5 h-3.5" />
                      <span>{camp.organization}</span>
                    </p>

                    <p className="text-xs text-muted mt-2 line-clamp-2 leading-relaxed">
                      {camp.description}
                    </p>

                    {/* Skills pills */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {camp.requiredSkills.slice(0, 4).map((s) => (
                        <span
                          key={s}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-navy-800 text-softwhite/80"
                        >
                          {s}
                        </span>
                      ))}
                      {camp.requiredSkills.length > 4 && (
                        <span className="text-[10px] px-1.5 py-0.5 text-muted">
                          +{camp.requiredSkills.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-navy-700/60 flex items-center justify-between">
                    <div className="text-[11px] text-muted">
                      {camp.questionCount} Questions • {camp.durationMinutes}m
                    </div>

                    <Link
                      href={`/interview/setup?campaignId=${camp.id}`}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 border border-cyan-500/30 transition-colors"
                    >
                      Participate →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
