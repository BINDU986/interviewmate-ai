"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { useAuth } from "@/lib/auth-context";
import { SAMPLE_SUBMISSIONS } from "@/lib/sample-data";
import { LocalStore } from "@/lib/storage";
import { InterviewSession, QuestionResponse } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  RefreshCw,
  TrendingUp,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function ScorecardsPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<InterviewSession | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(0);

  useEffect(() => {
    const loaded = LocalStore.getSessions().length > 0 ? LocalStore.getSessions() : SAMPLE_SUBMISSIONS;
    setSessions(loaded);
    if (loaded.length > 0) {
      setSelectedSession(loaded[0]);
    }
  }, []);

  // Compute criteria averages for charts
  const criteriaData = selectedSession?.responses?.[0]?.evaluation
    ? [
        {
          subject: "Technical Correctness",
          score: selectedSession.responses[0].evaluation.criteriaScores.technicalCorrectness,
          fullMark: 100,
        },
        {
          subject: "Relevance & Completeness",
          score: selectedSession.responses[0].evaluation.criteriaScores.relevanceCompleteness,
          fullMark: 100,
        },
        {
          subject: "Problem Solving",
          score: selectedSession.responses[0].evaluation.criteriaScores.problemSolvingReasoning,
          fullMark: 100,
        },
        {
          subject: "Communication Clarity",
          score: selectedSession.responses[0].evaluation.criteriaScores.communicationClarity,
          fullMark: 100,
        },
        {
          subject: "Practical Application",
          score: selectedSession.responses[0].evaluation.criteriaScores.practicalApplication,
          fullMark: 100,
        },
      ]
    : [
        { subject: "Technical", score: 85, fullMark: 100 },
        { subject: "Relevance", score: 88, fullMark: 100 },
        { subject: "Problem Solving", score: 82, fullMark: 100 },
        { subject: "Clarity", score: 90, fullMark: 100 },
        { subject: "Practical", score: 80, fullMark: 100 },
      ];

  return (
    <PortalLayout requiredRole="student">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-softwhite">
              My Interview Scorecards
            </h1>
            <p className="text-xs text-muted mt-1">
              Review multi-criteria evaluations, evidence-based feedback, and AI model answer recommendations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/repeat-test"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-violet-500/20 text-violet-300 hover:bg-violet-500/30 border border-violet-500/40 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Repeat Testing Lab</span>
            </Link>
          </div>
        </div>

        {/* Sessions Horizontal Selector */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {sessions.map((sess) => (
            <button
              key={sess.id}
              onClick={() => setSelectedSession(sess)}
              className={`p-3.5 rounded-2xl border text-left min-w-[240px] flex-shrink-0 transition-all ${
                selectedSession?.id === sess.id
                  ? "bg-cyan-500/15 border-cyan-500/40 shadow-sm"
                  : "bg-navy-900 border-navy-700 text-muted hover:text-softwhite"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-softwhite truncate max-w-[150px]">
                  {sess.targetRole}
                </span>
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {sess.overallScore || 85}/100
                </span>
              </div>
              <p className="text-[10px] text-muted truncate">{sess.campaignTitle}</p>
              <span className="text-[9px] text-muted mt-2 block">
                {formatDate(sess.startTime)}
              </span>
            </button>
          ))}
        </div>

        {selectedSession && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Question-by-Question Detailed Feedback */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
                Question Evaluations ({selectedSession.responses.length})
              </h2>

              {selectedSession.responses.map((resp, idx) => {
                const isExpanded = expandedQuestion === idx;
                const evalData = resp.evaluation;

                return (
                  <div
                    key={resp.questionId || idx}
                    className="glass-panel rounded-2xl border border-navy-700 overflow-hidden transition-all"
                  >
                    <div
                      onClick={() => setExpandedQuestion(isExpanded ? null : idx)}
                      className="p-4 cursor-pointer hover:bg-navy-800/40 flex items-center justify-between gap-3 select-none"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-navy-900 text-cyan-400 border border-navy-700">
                            Q{idx + 1} • {resp.category?.toUpperCase()}
                          </span>
                          <span className="text-[10px] text-muted">
                            Stage {resp.stage}
                          </span>
                        </div>
                        <h4 className="text-xs font-semibold text-softwhite truncate">
                          {resp.questionText}
                        </h4>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold font-mono text-cyan-400">
                          {evalData?.score || 85}
                          <span className="text-[10px] text-muted font-normal"> / 100</span>
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-muted" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted" />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-4 pt-0 border-t border-navy-700/60 space-y-3 text-xs">
                        {/* Candidate Answer */}
                        <div className="p-3 rounded-xl bg-navy-900 border border-navy-700 mt-3">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">
                            Your Answer
                          </span>
                          <p className="text-softwhite leading-relaxed text-[11px]">
                            &ldquo;{resp.candidateAnswer}&rdquo;
                          </p>
                        </div>

                        {/* Explanation */}
                        {evalData?.explanation && (
                          <p className="text-muted leading-relaxed text-[11px]">
                            <strong className="text-cyan-300">Analysis:</strong> {evalData.explanation}
                          </p>
                        )}

                        {/* Strengths & Missing Concepts */}
                        <div className="grid sm:grid-cols-2 gap-3 pt-1">
                          {evalData?.strengths && evalData.strengths.length > 0 && (
                            <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                              <span className="text-[10px] font-bold uppercase text-emerald-400 block mb-1">
                                Identified Strengths
                              </span>
                              <ul className="space-y-1 text-[11px] text-muted">
                                {evalData.strengths.map((s, i) => (
                                  <li key={i} className="flex items-start gap-1.5">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                                    <span>{s}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {evalData?.missingConcepts && evalData.missingConcepts.length > 0 && (
                            <div className="p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20">
                              <span className="text-[10px] font-bold uppercase text-amber-400 block mb-1">
                                Suggested Missing Concepts
                              </span>
                              <ul className="space-y-1 text-[11px] text-muted">
                                {evalData.missingConcepts.map((m, i) => (
                                  <li key={i} className="flex items-start gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                                    <span>{m}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Model Improved Answer */}
                        {evalData?.improvedAnswer && (
                          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 block mb-1 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                              <span>AI Exemplary Answer</span>
                            </span>
                            <p className="text-[11px] text-softwhite/90 leading-relaxed italic">
                              {evalData.improvedAnswer}
                            </p>
                          </div>
                        )}

                        {/* Repeat Test CTA */}
                        <div className="pt-2 flex justify-end">
                          <Link
                            href={`/repeat-test?questionId=${resp.questionId}&sessionId=${selectedSession.id}`}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-navy-800 hover:bg-navy-700 text-cyan-300 border border-navy-700 flex items-center gap-1.5 transition-colors"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Repeat Test This Question →</span>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right Col: Radar Chart & Rubric Analytics */}
            <div className="space-y-5">
              {/* Overall Scorecard Summary Card */}
              <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">
                  Overall Interview Score
                </span>
                <div className="text-4xl font-extrabold text-gradient-cyan-violet font-heading">
                  {selectedSession.overallScore || 85}
                  <span className="text-lg text-muted font-normal"> / 100</span>
                </div>

                <div className="mt-4 pt-3 border-t border-navy-700/60 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted block text-[10px]">Hiring Status</span>
                    <span
                      className={`font-semibold capitalize ${
                        selectedSession.hiringDecision === "shortlisted"
                          ? "text-emerald-400"
                          : selectedSession.hiringDecision === "rejected"
                          ? "text-red-400"
                          : "text-amber-400"
                      }`}
                    >
                      {selectedSession.hiringDecision.replace("_", " ")}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted block text-[10px]">Resume Match</span>
                    <span className="font-semibold text-cyan-400">
                      {selectedSession.resumeMatchScore || 92}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Rubric Radar Chart */}
              <div className="glass-panel p-5 rounded-3xl border border-navy-700">
                <span className="text-xs font-bold uppercase tracking-wider text-softwhite block mb-3">
                  5-Factor Competency Radar
                </span>

                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={criteriaData}>
                      <PolarGrid stroke="#22324D" />
                      <PolarAngleAxis dataKey="subject" stroke="#A8B4C8" tick={{ fontSize: 9 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#22324D" tick={false} />
                      <Radar
                        name="Score"
                        dataKey="score"
                        stroke="#27D3E8"
                        fill="#27D3E8"
                        fillOpacity={0.4}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
