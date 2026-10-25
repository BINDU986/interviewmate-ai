"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { useAuth } from "@/lib/auth-context";
import { SAMPLE_CAMPAIGNS, SAMPLE_SUBMISSIONS } from "@/lib/sample-data";
import { LocalStore } from "@/lib/storage";
import { Campaign, InterviewSession } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { InterviewMateBot } from "@/components/mascot/InterviewMateBot";
import {
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  PlusCircle,
  Briefcase,
  HelpCircle,
  Code2,
  RefreshCw,
  BookOpen,
  Building,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function InterviewerOverviewPage() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [submissions, setSubmissions] = useState<InterviewSession[]>([]);

  useEffect(() => {
    const loadedCamps = LocalStore.getCampaigns().length > 0 ? LocalStore.getCampaigns() : SAMPLE_CAMPAIGNS;
    const loadedSubs = LocalStore.getSessions().length > 0 ? LocalStore.getSessions() : SAMPLE_SUBMISSIONS;
    setCampaigns(loadedCamps);
    setSubmissions(loadedSubs);
  }, []);

  const totalCandidates = submissions.length;
  const shortlistedCount = submissions.filter((s) => s.hiringDecision === "shortlisted").length;
  const underReviewCount = submissions.filter((s) => s.hiringDecision === "under_review").length;
  const rejectedCount = submissions.filter((s) => s.hiringDecision === "rejected").length;

  const roleDistribution = campaigns.map((c) => ({
    name: c.role,
    candidates: submissions.filter((s) => s.campaignId === c.id || s.targetRole === c.role).length || 1,
  }));

  const statusPieData = [
    { name: "Shortlisted", value: shortlistedCount || 1, color: "#10B981" },
    { name: "Under Review", value: underReviewCount || 1, color: "#F59E0B" },
    { name: "Rejected", value: rejectedCount || 1, color: "#EF4444" },
  ];

  return (
    <PortalLayout requiredRole="interviewer">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Recruiter Banner */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel-elevated relative overflow-hidden border border-violet-500/25">
          <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-950/80 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                <span>Recruiter & Placement Console</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-softwhite">
                Welcome, {user?.fullName || "Recruiter"}
              </h1>
              <p className="text-xs sm:text-sm text-muted mt-2 max-w-xl leading-relaxed">
                ID: <span className="text-violet-400 font-mono font-medium">{(user?.profile as any)?.recruiterId || "REC-9042"}</span> •
                {" "}{(user?.profile as any)?.organization || "Nexora Technologies"}
                <br />
                Oversee recruitment campaigns, inspect candidate submission scorecards, and review AI interview evaluations.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/campaigns"
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-violet-500 text-white hover:bg-violet-400 flex items-center gap-2 transition-colors shadow-neon-violet"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Build New Campaign</span>
                </Link>
                <Link
                  href="/submissions"
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-navy-800 hover:bg-navy-700 text-softwhite border border-navy-700 flex items-center gap-2 transition-colors"
                >
                  <Users className="w-3.5 h-3.5 text-violet-400" />
                  <span>Submissions Hub</span>
                </Link>
              </div>
            </div>

            <div className="hidden md:flex flex-col items-center">
              <InterviewMateBot size="md" state="thinking" showStatusBadge statusText="Evaluating Drive" />
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl glass-panel border border-navy-700">
            <span className="text-[11px] text-muted block mb-1">Active Drives</span>
            <div className="text-2xl font-bold font-heading text-softwhite">
              {campaigns.filter((c) => c.status === "active").length}
            </div>
          </div>

          <div className="p-4 rounded-2xl glass-panel border border-navy-700">
            <span className="text-[11px] text-muted block mb-1">Total Submissions</span>
            <div className="text-2xl font-bold font-heading text-cyan-400">
              {totalCandidates}
            </div>
          </div>

          <div className="p-4 rounded-2xl glass-panel border border-navy-700">
            <span className="text-[11px] text-muted block mb-1">Shortlisted</span>
            <div className="text-2xl font-bold font-heading text-emerald-400">
              {shortlistedCount}
            </div>
          </div>

          <div className="p-4 rounded-2xl glass-panel border border-navy-700">
            <span className="text-[11px] text-muted block mb-1">Under Review</span>
            <div className="text-2xl font-bold font-heading text-amber-400">
              {underReviewCount}
            </div>
          </div>
        </div>

        {/* Studio Quick Launch Links */}
        <div className="grid sm:grid-cols-4 gap-4">
          <Link
            href="/questions"
            className="p-4 rounded-2xl glass-panel border border-navy-700 hover:border-violet-500/40 transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-semibold text-softwhite group-hover:text-violet-300 transition-colors">
              Question Lab
            </h4>
            <p className="text-[11px] text-muted mt-0.5">Generate custom AI rubrics</p>
          </Link>

          <Link
            href="/coding"
            className="p-4 rounded-2xl glass-panel border border-navy-700 hover:border-violet-500/40 transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Code2 className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-semibold text-softwhite group-hover:text-violet-300 transition-colors">
              Coding Lab
            </h4>
            <p className="text-[11px] text-muted mt-0.5">Assess algorithmic code</p>
          </Link>

          <Link
            href="/repeat-test"
            className="p-4 rounded-2xl glass-panel border border-navy-700 hover:border-violet-500/40 transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <RefreshCw className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-semibold text-softwhite group-hover:text-violet-300 transition-colors">
              Repeat Testing
            </h4>
            <p className="text-[11px] text-muted mt-0.5">Compare question re-tests</p>
          </Link>

          <Link
            href="/documentation"
            className="p-4 rounded-2xl glass-panel border border-navy-700 hover:border-violet-500/40 transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-semibold text-softwhite group-hover:text-violet-300 transition-colors">
              Documentation Studio
            </h4>
            <p className="text-[11px] text-muted mt-0.5">8-section DOCX & PDF</p>
          </Link>
        </div>

        {/* Analytics Charts */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 glass-panel p-5 rounded-3xl border border-navy-700">
            <span className="text-xs font-bold uppercase tracking-wider text-softwhite block mb-4">
              Candidate Submissions by Campaign
            </span>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roleDistribution}>
                  <XAxis dataKey="name" stroke="#A8B4C8" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#A8B4C8" tick={{ fontSize: 10 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#121A2D",
                      border: "1px solid #22324D",
                      borderRadius: "8px",
                      fontSize: "11px",
                    }}
                  />
                  <Bar dataKey="candidates" fill="#8B7CFF" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-3xl border border-navy-700 flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-softwhite block mb-2">
              Decision Pipeline
            </span>

            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#121A2D",
                      border: "1px solid #22324D",
                      borderRadius: "8px",
                      fontSize: "11px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-1 text-center text-[10px] pt-2 border-t border-navy-700/60">
              <div>
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block mr-1" />
                <span>Shortlist</span>
              </div>
              <div>
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block mr-1" />
                <span>Review</span>
              </div>
              <div>
                <span className="w-2 h-2 rounded-full bg-red-400 inline-block mr-1" />
                <span>Reject</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
