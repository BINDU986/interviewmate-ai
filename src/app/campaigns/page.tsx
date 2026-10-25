"use client";

import React, { useState, useEffect } from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { SAMPLE_CAMPAIGNS } from "@/lib/sample-data";
import { LocalStore } from "@/lib/storage";
import { Campaign, EvaluationWeights } from "@/lib/types";
import { formatDate, formatTimeRemaining } from "@/lib/utils";
import {
  Calendar,
  PlusCircle,
  Clock,
  Building,
  CheckCircle2,
  Trash2,
  Edit2,
  Save,
  X,
  Sparkles,
  AlertCircle,
} from "lucide-react";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  // Form state
  const [formData, setFormData] = useState<{
    title: string;
    role: string;
    organization: string;
    department: string;
    description: string;
    requiredSkills: string;
    startDate: string;
    deadline: string;
    durationMinutes: number;
    questionCount: number;
    weights: EvaluationWeights;
    status: Campaign["status"];
  }>({
    title: "",
    role: "Full-Stack Developer",
    organization: "Nexora Technologies",
    department: "Enterprise Systems",
    description: "",
    requiredSkills: "React, Node.js, TypeScript, PostgreSQL",
    startDate: new Date().toISOString().slice(0, 16),
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 16),
    durationMinutes: 30,
    questionCount: 5,
    weights: {
      technicalCorrectness: 35,
      relevanceCompleteness: 25,
      problemSolvingReasoning: 20,
      communicationClarity: 10,
      practicalApplication: 10,
    },
    status: "active",
  });

  useEffect(() => {
    const loaded = LocalStore.getCampaigns().length > 0 ? LocalStore.getCampaigns() : SAMPLE_CAMPAIGNS;
    setCampaigns(loaded);
  }, []);

  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = formData.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean);

    if (editingCampaign) {
      const updatedList = campaigns.map((c) =>
        c.id === editingCampaign.id
          ? {
              ...c,
              ...formData,
              requiredSkills: skillsArray,
              evaluationWeights: formData.weights,
            }
          : c
      );
      setCampaigns(updatedList);
      LocalStore.saveCampaigns(updatedList);
    } else {
      const newCamp: Campaign = {
        id: `camp_${Date.now()}`,
        ...formData,
        requiredSkills: skillsArray,
        categories: ["hr", "resume", "technical", "coding", "problem_solving"],
        evaluationWeights: formData.weights,
        createdAt: new Date().toISOString(),
      };
      const updatedList = [newCamp, ...campaigns];
      setCampaigns(updatedList);
      LocalStore.saveCampaigns(updatedList);
    }

    setIsCreating(false);
    setEditingCampaign(null);
  };

  const handleDeleteCampaign = (id: string) => {
    const updated = campaigns.filter((c) => c.id !== id);
    setCampaigns(updated);
    LocalStore.saveCampaigns(updated);
  };

  return (
    <PortalLayout requiredRole="interviewer">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-softwhite">
              Campaigns & Placement Drives
            </h1>
            <p className="text-xs text-muted mt-1">
              Create, schedule, and configure automated AI recruitment drives with validated deadlines.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingCampaign(null);
              setIsCreating(true);
            }}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-violet-500 text-white hover:bg-violet-400 shadow-neon-violet flex items-center gap-1.5 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Recruitment Drive</span>
          </button>
        </div>

        {/* Campaign Builder Modal */}
        {isCreating && (
          <div className="glass-panel-elevated p-6 rounded-3xl border border-violet-500/40 relative space-y-4">
            <div className="flex items-center justify-between border-b border-navy-700/60 pb-3">
              <h2 className="text-base font-bold text-softwhite">
                {editingCampaign ? "Edit Recruitment Drive" : "New Recruitment Campaign Builder"}
              </h2>
              <button onClick={() => setIsCreating(false)} className="text-muted hover:text-softwhite">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCampaign} className="space-y-4 text-xs">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted mb-1 font-medium">Drive Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Campus Placement 2026 Drive"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-softwhite focus:outline-none focus:border-violet-400"
                  />
                </div>
                <div>
                  <label className="block text-muted mb-1 font-medium">Target Role</label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-softwhite focus:outline-none focus:border-violet-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted mb-1 font-medium">Job Description & Scope</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Responsibilities, expectations, project scope..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-softwhite focus:outline-none focus:border-violet-400"
                />
              </div>

              <div>
                <label className="block text-muted mb-1 font-medium">Required Competencies (Comma-separated)</label>
                <input
                  type="text"
                  value={formData.requiredSkills}
                  onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-softwhite focus:outline-none focus:border-violet-400"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-muted mb-1 font-medium">Start Date</label>
                  <input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-navy-900 border border-navy-700 text-softwhite"
                  />
                </div>
                <div>
                  <label className="block text-muted mb-1 font-medium">Deadline</label>
                  <input
                    type="datetime-local"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-navy-900 border border-navy-700 text-softwhite"
                  />
                </div>
                <div>
                  <label className="block text-muted mb-1 font-medium">Duration (Mins)</label>
                  <input
                    type="number"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg bg-navy-900 border border-navy-700 text-softwhite"
                  />
                </div>
                <div>
                  <label className="block text-muted mb-1 font-medium">Question Count</label>
                  <input
                    type="number"
                    value={formData.questionCount}
                    onChange={(e) => setFormData({ ...formData, questionCount: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg bg-navy-900 border border-navy-700 text-softwhite"
                  />
                </div>
              </div>

              {/* Rubric Weights */}
              <div className="p-3 rounded-2xl bg-navy-900 border border-navy-700">
                <span className="text-[11px] font-bold uppercase tracking-wider text-softwhite block mb-2">
                  Evaluation Rubric Weights (Normalized to 100%)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[11px]">
                  <div>
                    <span className="text-muted block">Technical ({formData.weights.technicalCorrectness}%)</span>
                    <input
                      type="range"
                      min="10"
                      max="60"
                      value={formData.weights.technicalCorrectness}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          weights: { ...formData.weights, technicalCorrectness: Number(e.target.value) },
                        })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <span className="text-muted block">Relevance ({formData.weights.relevanceCompleteness}%)</span>
                    <input
                      type="range"
                      min="10"
                      max="50"
                      value={formData.weights.relevanceCompleteness}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          weights: { ...formData.weights, relevanceCompleteness: Number(e.target.value) },
                        })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <span className="text-muted block">Problem Solving ({formData.weights.problemSolvingReasoning}%)</span>
                    <input
                      type="range"
                      min="10"
                      max="50"
                      value={formData.weights.problemSolvingReasoning}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          weights: { ...formData.weights, problemSolvingReasoning: Number(e.target.value) },
                        })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <span className="text-muted block">Clarity ({formData.weights.communicationClarity}%)</span>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      value={formData.weights.communicationClarity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          weights: { ...formData.weights, communicationClarity: Number(e.target.value) },
                        })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <span className="text-muted block">Practical ({formData.weights.practicalApplication}%)</span>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      value={formData.weights.practicalApplication}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          weights: { ...formData.weights, practicalApplication: Number(e.target.value) },
                        })
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded-xl text-muted hover:text-softwhite"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-violet-500 text-white font-semibold hover:bg-violet-400 shadow-neon-violet"
                >
                  Save Campaign
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Existing Campaigns Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((camp) => {
            const timer = formatTimeRemaining(camp.deadline);

            return (
              <div
                key={camp.id}
                className="glass-panel p-5 rounded-3xl border border-navy-700 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-950 text-violet-300 border border-violet-500/30">
                      {camp.role}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        timer.isExpired ? "text-red-400 bg-red-500/10" : "text-emerald-400 bg-emerald-500/10"
                      }`}
                    >
                      {timer.text}
                    </span>
                  </div>

                  <h3 className="font-heading text-sm font-bold text-softwhite">{camp.title}</h3>
                  <p className="text-xs text-muted mt-1">{camp.organization} • {camp.department}</p>
                  <p className="text-xs text-muted mt-2 line-clamp-2">{camp.description}</p>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {camp.requiredSkills.map((s) => (
                      <span key={s} className="text-[9px] px-2 py-0.5 rounded bg-navy-800 text-softwhite/80">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-navy-700/60 flex items-center justify-between">
                  <span className="text-[10px] text-muted">{camp.durationMinutes}m • {camp.questionCount} Qs</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDeleteCampaign(camp.id)}
                      className="p-1.5 rounded-lg text-muted hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PortalLayout>
  );
}
