"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { SAMPLE_CAMPAIGNS } from "@/lib/sample-data";
import { LocalStore } from "@/lib/storage";
import { Campaign } from "@/lib/types";
import { formatTimeRemaining, formatDate } from "@/lib/utils";
import {
  Search,
  Building,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Filter,
  X,
  ShieldCheck,
} from "lucide-react";

export default function StudentDashboardPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [activeModalCampaign, setActiveModalCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    const saved = LocalStore.getCampaigns();
    if (saved.length > 0) {
      setCampaigns(saved);
    } else {
      setCampaigns(SAMPLE_CAMPAIGNS);
      LocalStore.saveCampaigns(SAMPLE_CAMPAIGNS);
    }
  }, []);

  const roles = ["all", ...Array.from(new Set(campaigns.map((c) => c.role)))];

  const filteredCampaigns = campaigns.filter((camp) => {
    const matchesSearch =
      camp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camp.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camp.requiredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = selectedRole === "all" || camp.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleConfirmParticipation = (campaign: Campaign) => {
    const timer = formatTimeRemaining(campaign.deadline);
    if (timer.isExpired) {
      alert("Submission deadline for this drive has elapsed. Participation is closed.");
      return;
    }
    setActiveModalCampaign(null);
    router.push(`/interview/setup?campaignId=${campaign.id}`);
  };

  return (
    <PortalLayout requiredRole="student">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-softwhite">
              Available Recruitment Drives
            </h1>
            <p className="text-xs text-muted mt-1">
              Explore active university placement drives, review job requirements, and confirm participation.
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search by role, company, or skills (e.g. React, PyTorch, Node.js)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-softwhite placeholder:text-muted/60 text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRole(r)}
                className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedRole === r
                    ? "bg-cyan-500 text-navy-950 font-semibold shadow-sm"
                    : "bg-navy-900 hover:bg-navy-800 text-muted hover:text-softwhite border border-navy-700"
                }`}
              >
                {r === "all" ? "All Roles" : r}
              </button>
            ))}
          </div>
        </div>

        {/* Campaign Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((camp) => {
            const timer = formatTimeRemaining(camp.deadline);

            return (
              <div
                key={camp.id}
                className="glass-panel p-6 rounded-3xl border border-navy-700 hover:border-cyan-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-950/70 text-cyan-300 border border-cyan-500/30">
                      {camp.role}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        timer.isExpired
                          ? "bg-red-500/10 text-red-400 border border-red-500/30"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      <span>{timer.text}</span>
                    </span>
                  </div>

                  <h3 className="font-heading text-base font-bold text-softwhite">
                    {camp.title}
                  </h3>

                  <div className="text-xs text-muted flex items-center gap-1.5 mt-1">
                    <Building className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{camp.organization}</span>
                    <span>•</span>
                    <span>{camp.department}</span>
                  </div>

                  <p className="text-xs text-muted mt-3 line-clamp-3 leading-relaxed">
                    {camp.description}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {camp.requiredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-navy-800 text-softwhite/80 border border-navy-700/60"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-navy-700/60 flex items-center justify-between">
                  <div className="text-[11px] text-muted">
                    {camp.questionCount} Questions • {camp.durationMinutes} mins
                  </div>

                  <button
                    onClick={() => setActiveModalCampaign(camp)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 border border-cyan-500/30 transition-colors"
                  >
                    Details & Confirm →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal: Explicit Participation Confirmation */}
        {activeModalCampaign && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
            <div className="max-w-xl w-full glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-cyan-500/40 shadow-glass relative">
              <button
                onClick={() => setActiveModalCampaign(null)}
                className="absolute top-5 right-5 p-1 rounded-lg text-muted hover:text-softwhite hover:bg-navy-800"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  {activeModalCampaign.role}
                </span>
                <span className="text-xs text-muted">• {activeModalCampaign.organization}</span>
              </div>

              <h2 className="text-xl font-heading font-bold text-softwhite">
                {activeModalCampaign.title}
              </h2>

              <p className="text-xs text-muted mt-3 leading-relaxed">
                {activeModalCampaign.description}
              </p>

              {/* Campaign Specs Table */}
              <div className="mt-5 p-4 rounded-2xl bg-navy-900 border border-navy-700 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-muted block text-[11px]">Drive Duration</span>
                  <span className="font-semibold text-softwhite">
                    {activeModalCampaign.durationMinutes} minutes ({activeModalCampaign.questionCount} questions)
                  </span>
                </div>
                <div>
                  <span className="text-muted block text-[11px]">Submission Deadline</span>
                  <span className="font-semibold text-softwhite">
                    {formatDate(activeModalCampaign.deadline)}
                  </span>
                </div>
                <div>
                  <span className="text-muted block text-[11px]">Interview Stages</span>
                  <span className="font-semibold text-cyan-400">
                    HR, Resume, Technical, Coding
                  </span>
                </div>
                <div>
                  <span className="text-muted block text-[11px]">Evaluation Model</span>
                  <span className="font-semibold text-violet-400">
                    5-Factor Rubric (100 pts)
                  </span>
                </div>
              </div>

              {/* Required Skills */}
              <div className="mt-4">
                <span className="text-[11px] font-semibold text-softwhite uppercase tracking-wider block mb-2">
                  Required Competencies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeModalCampaign.requiredSkills.map((s) => (
                    <span
                      key={s}
                      className="text-xs px-2.5 py-1 rounded-lg bg-navy-800 text-cyan-300 border border-navy-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-navy-700 flex items-center justify-end gap-3">
                <button
                  onClick={() => setActiveModalCampaign(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium text-muted hover:text-softwhite transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={() => handleConfirmParticipation(activeModalCampaign)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-cyan-500 text-navy-950 hover:bg-cyan-400 shadow-neon-cyan transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Participation & Setup</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
