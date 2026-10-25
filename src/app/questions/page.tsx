"use client";

import React, { useState, useEffect } from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { LocalStore } from "@/lib/storage";
import { generateInterviewQuestions } from "@/lib/gemini";
import { InterviewQuestion, QuestionCategory } from "@/lib/types";
import {
  HelpCircle,
  Sparkles,
  PlusCircle,
  Trash2,
  CheckCircle2,
  Copy,
  BookOpen,
} from "lucide-react";

export default function QuestionLabPage() {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [role, setRole] = useState("Frontend Developer");
  const [category, setCategory] = useState<QuestionCategory>("technical");
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("intermediate");
  const [isGenerating, setIsGenerating] = useState(false);

  // Manual question entry
  const [manualText, setManualText] = useState("");
  const [manualConcepts, setManualConcepts] = useState("");
  const [manualRubric, setManualRubric] = useState("");

  useEffect(() => {
    const saved = LocalStore.getCustomQuestions();
    if (saved.length > 0) {
      setQuestions(saved);
    } else {
      handleGenerate();
    }
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    const generated = await generateInterviewQuestions({
      role,
      category,
      difficulty,
      count: 3,
    });
    const updated = [...generated, ...questions];
    setQuestions(updated);
    LocalStore.saveCustomQuestions(updated);
    setIsGenerating(false);
  };

  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim()) return;

    const newQ: InterviewQuestion = {
      id: `manual_q_${Date.now()}`,
      category,
      questionText: manualText.trim(),
      difficulty,
      expectedConcepts: manualConcepts.split(",").map((s) => s.trim()).filter(Boolean),
      evaluationRubric: manualRubric || "Measures candidate understanding and problem solving.",
      isCustom: true,
      stage: 3,
    };

    const updated = [newQ, ...questions];
    setQuestions(updated);
    LocalStore.saveCustomQuestions(updated);
    setManualText("");
    setManualConcepts("");
    setManualRubric("");
  };

  const handleDelete = (id: string) => {
    const updated = questions.filter((q) => q.id !== id);
    setQuestions(updated);
    LocalStore.saveCustomQuestions(updated);
  };

  return (
    <PortalLayout requiredRole="interviewer">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-softwhite">
              Question Lab
            </h1>
            <p className="text-xs text-muted mt-1">
              Generate structured interview questions via AI or author custom rubrics and expected concepts.
            </p>
          </div>
        </div>

        {/* AI Generator Bar */}
        <div className="glass-panel p-5 rounded-3xl border border-navy-700 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-softwhite">
              AI Question Synthesizer
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-muted mb-1 font-medium">Target Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-softwhite focus:outline-none focus:border-violet-400"
              >
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="AI/ML Engineer">AI/ML Engineer</option>
                <option value="Full-Stack Developer">Full-Stack Developer</option>
              </select>
            </div>

            <div>
              <label className="block text-muted mb-1 font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-softwhite focus:outline-none focus:border-violet-400"
              >
                <option value="hr">HR & Introduction</option>
                <option value="technical">Technical Fundamentals</option>
                <option value="resume">Resume & Projects</option>
                <option value="coding">Coding & Algorithms</option>
                <option value="problem_solving">Problem Solving</option>
                <option value="aptitude">Aptitude & Logic</option>
                <option value="communication">Communication</option>
                <option value="situational">Situational & Behavioral</option>
              </select>
            </div>

            <div>
              <label className="block text-muted mb-1 font-medium">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-softwhite focus:outline-none focus:border-violet-400"
              >
                <option value="beginner">Entry Level</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-2.5 px-4 rounded-xl bg-violet-500 text-white font-semibold hover:bg-violet-400 flex items-center justify-center gap-2 shadow-neon-violet transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGenerating ? "Synthesizing..." : "Generate 3 Questions"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-muted block">
            Question Bank ({questions.length})
          </span>

          <div className="grid md:grid-cols-2 gap-4">
            {questions.map((q) => (
              <div
                key={q.id}
                className="glass-panel p-5 rounded-2xl border border-navy-700 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-violet-950 text-violet-300 border border-violet-500/30 uppercase">
                      {q.category}
                    </span>
                    <span className="text-muted capitalize">{q.difficulty}</span>
                  </div>

                  <p className="text-xs font-semibold text-softwhite leading-relaxed">
                    {q.questionText}
                  </p>

                  <div className="mt-3 p-2.5 rounded-xl bg-navy-900 border border-navy-700/80 text-[11px] space-y-1">
                    <span className="text-muted block text-[10px] font-bold uppercase">Expected Concepts:</span>
                    <p className="text-cyan-300">{q.expectedConcepts?.join(", ") || "General reasoning"}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-navy-700/60 flex items-center justify-between text-[11px] text-muted">
                  <span>Rubric: {q.evaluationRubric.slice(0, 45)}...</span>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="p-1 rounded-lg hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
