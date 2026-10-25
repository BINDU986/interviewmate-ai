"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { SAMPLE_REPEAT_TESTS, SAMPLE_SUBMISSIONS } from "@/lib/sample-data";
import { LocalStore } from "@/lib/storage";
import { RepeatTestItem } from "@/lib/types";
import { evaluateAnswerWithGemini } from "@/lib/gemini";
import { InterviewMateBot } from "@/components/mascot/InterviewMateBot";
import {
  RefreshCw,
  TrendingUp,
  Award,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Send,
  HelpCircle,
} from "lucide-react";

function RepeatTestContent() {
  const searchParams = useSearchParams();
  const [repeatItems, setRepeatItems] = useState<RepeatTestItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<RepeatTestItem | null>(null);

  // New repeat test attempt state
  const [repeatAnswerInput, setRepeatAnswerInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loaded = LocalStore.getRepeatTests().length > 0 ? LocalStore.getRepeatTests() : SAMPLE_REPEAT_TESTS;
    setRepeatItems(loaded);
    if (loaded.length > 0) {
      setSelectedItem(loaded[0]);
    }
  }, []);

  const handleRunRepeatEvaluation = async () => {
    if (!selectedItem || !repeatAnswerInput.trim()) return;

    setIsSubmitting(true);
    const evaluation = await evaluateAnswerWithGemini({
      questionText: selectedItem.questionText,
      category: "technical",
      candidateAnswer: repeatAnswerInput.trim(),
      targetRole: "Software Engineer",
      weights: {
        technicalCorrectness: 35,
        relevanceCompleteness: 25,
        problemSolvingReasoning: 20,
        communicationClarity: 10,
        practicalApplication: 10,
      },
    });

    const diff = evaluation.score - selectedItem.originalScore;
    const updated: RepeatTestItem = {
      ...selectedItem,
      repeatAnswer: repeatAnswerInput.trim(),
      repeatScore: evaluation.score,
      repeatEvaluation: evaluation,
      scoreDifference: diff,
      improvementSummary:
        diff > 0
          ? `+${diff}% Improvement. Candidate assimilated previous feedback and demonstrated deeper conceptual reasoning.`
          : diff === 0
          ? "Consistent performance with similar conceptual coverage."
          : `${diff}% Score decrease. Candidate omitted critical details present in the initial attempt.`,
      dateCompleted: new Date().toISOString(),
    };

    const updatedList = repeatItems.map((item) => (item.id === updated.id ? updated : item));
    setRepeatItems(updatedList);
    LocalStore.saveRepeatTests(updatedList);
    setSelectedItem(updated);
    setIsSubmitting(false);
    setRepeatAnswerInput("");
  };

  return (
    <PortalLayout requiredRole="interviewer">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-softwhite">
              Repeat-Testing Lab
            </h1>
            <p className="text-xs text-muted mt-1">
              Re-evaluate identical interview questions under unvarying rubrics to measure retention and score regression.
            </p>
          </div>
        </div>

        {/* Question Selector Bar */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {repeatItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`p-3.5 rounded-2xl border text-left min-w-[280px] flex-shrink-0 transition-all ${
                selectedItem?.id === item.id
                  ? "bg-violet-500/15 border-violet-500/40 shadow-sm"
                  : "bg-navy-900 border-navy-700 text-muted hover:text-softwhite"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-softwhite truncate max-w-[180px]">
                  {item.candidateName}
                </span>
                <span
                  className={`text-xs font-mono font-bold ${
                    item.scoreDifference >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {item.scoreDifference >= 0 ? `+${item.scoreDifference}%` : `${item.scoreDifference}%`}
                </span>
              </div>
              <p className="text-[10px] text-muted truncate">{item.questionText}</p>
            </button>
          ))}
        </div>

        {selectedItem && (
          <div className="space-y-6">
            {/* Target Question Display */}
            <div className="glass-panel p-5 rounded-3xl border border-violet-500/30">
              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-300 block mb-1">
                Repeated Question Under Evaluation
              </span>
              <p className="text-sm font-semibold text-softwhite leading-relaxed">
                &ldquo;{selectedItem.questionText}&rdquo;
              </p>
            </div>

            {/* Side-by-Side Comparison Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Col: Original Attempt */}
              <div className="glass-panel p-6 rounded-3xl border border-navy-700 space-y-4">
                <div className="flex justify-between items-center border-b border-navy-700/60 pb-3">
                  <div>
                    <span className="text-xs font-bold text-softwhite">Attempt 1 (Original)</span>
                    <span className="text-[10px] text-muted block">First Live Response</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold font-mono text-cyan-400">
                      {selectedItem.originalScore}
                    </span>
                    <span className="text-xs text-muted"> / 100</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-navy-900 border border-navy-700 text-xs">
                  <span className="text-[10px] font-bold uppercase text-muted block mb-1">Original Answer:</span>
                  <p className="text-softwhite/90 leading-relaxed italic text-[11px]">
                    &ldquo;{selectedItem.originalAnswer}&rdquo;
                  </p>
                </div>

                <div className="text-xs space-y-2">
                  <span className="text-[10px] font-bold uppercase text-muted block">Original AI Rubric Feedback:</span>
                  <p className="text-muted text-[11px] leading-relaxed">
                    {selectedItem.originalEvaluation?.explanation}
                  </p>
                </div>
              </div>

              {/* Right Col: Repeat Attempt */}
              <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-4">
                <div className="flex justify-between items-center border-b border-navy-700/60 pb-3">
                  <div>
                    <span className="text-xs font-bold text-emerald-400">Attempt 2 (Repeat)</span>
                    <span className="text-[10px] text-muted block">Re-Tested Under Identical Rubric</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold font-mono text-emerald-400">
                      {selectedItem.repeatScore}
                    </span>
                    <span className="text-xs text-muted"> / 100</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-navy-900 border border-navy-700 text-xs">
                  <span className="text-[10px] font-bold uppercase text-muted block mb-1">Repeat Answer:</span>
                  <p className="text-softwhite/90 leading-relaxed italic text-[11px]">
                    &ldquo;{selectedItem.repeatAnswer}&rdquo;
                  </p>
                </div>

                <div className="text-xs space-y-2">
                  <span className="text-[10px] font-bold uppercase text-muted block">Repeat Evaluation Feedback:</span>
                  <p className="text-muted text-[11px] leading-relaxed">
                    {selectedItem.repeatEvaluation?.explanation}
                  </p>
                </div>
              </div>
            </div>

            {/* Differential Summary Callout */}
            <div className="glass-panel p-5 rounded-3xl border border-cyan-500/30 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold text-softwhite">
                  Score Differential:{" "}
                  <span className="text-emerald-400 font-mono font-bold">
                    +{selectedItem.scoreDifference}% Gain
                  </span>
                </span>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  {selectedItem.improvementSummary}
                </p>
              </div>
            </div>

            {/* Live Re-Test Interactive Form */}
            <div className="glass-panel p-5 rounded-3xl border border-navy-700 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-softwhite">
                Execute Another Repeat Attempt for This Question
              </h3>
              <textarea
                rows={3}
                placeholder="Type revised answer addressing previous gaps to test rubric score improvement..."
                value={repeatAnswerInput}
                onChange={(e) => setRepeatAnswerInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-navy-900 border border-navy-700 text-softwhite text-xs focus:outline-none focus:border-violet-400"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleRunRepeatEvaluation}
                  disabled={isSubmitting || !repeatAnswerInput.trim()}
                  className="px-4 py-2 rounded-xl bg-violet-500 text-white font-semibold text-xs hover:bg-violet-400 shadow-neon-violet transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? "Scoring Attempt..." : "Score Repeat Attempt"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}

export default function RepeatTestPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-navy-950">
          <InterviewMateBot size="sm" state="thinking" />
        </div>
      }
    >
      <RepeatTestContent />
    </Suspense>
  );
}
