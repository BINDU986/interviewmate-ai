"use client";

import React, { useState } from "react";
import Link from "next/link";
import { InterviewMateBot, BotState } from "@/components/mascot/InterviewMateBot";
import { useAuth } from "@/lib/auth-context";
import {
  GraduationCap,
  Building,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  Mic,
  BrainCircuit,
  RefreshCw,
  FileSpreadsheet,
  CheckCircle2,
  Lock,
  Globe2,
} from "lucide-react";

export default function LandingPage() {
  const { loginDemo, user } = useAuth();
  const [botState, setBotState] = useState<BotState>("greeting");

  const botStatesList: { state: BotState; label: string }[] = [
    { state: "greeting", label: "Greeting" },
    { state: "speaking", label: "Speaking" },
    { state: "listening", label: "Listening" },
    { state: "thinking", label: "Thinking" },
    { state: "success", label: "Celebrating" },
    { state: "completed", label: "Completed" },
    { state: "idle", label: "Idle" },
  ];

  return (
    <div className="relative min-h-screen bg-navy-950 overflow-hidden">
      {/* Background ambient glow grids */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-cyan-500/10 via-violet-500/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 -left-48 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center">
        {/* Release Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy-800/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Next-Generation AI Interview & Recruitment Platform</span>
        </div>

        {/* Brand Headline & Tagline */}
        <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-softwhite max-w-5xl mx-auto leading-[1.1]">
          Meet Your Potential. <br className="hidden sm:inline" />
          <span className="text-gradient-cyan-violet">Master Your Interview.</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
          InterviewMate AI pairs students and university placement cells with an autonomous,
          multilingual AI interviewer. Powered by the unified <strong className="text-cyan-300 font-medium">InterviewMateBot</strong> mascot,
          resume analysis, and evidence-grounded scoring.
        </p>

        {/* Mascot Interactive Showcase */}
        <div className="my-10 flex flex-col items-center">
          <div className="p-8 rounded-3xl glass-panel-elevated relative max-w-md w-full flex flex-col items-center shadow-glass">
            <InterviewMateBot
              size="lg"
              state={botState}
              showStatusBadge
              interactive
              onClick={() => {
                const nextStates: BotState[] = ["speaking", "listening", "thinking", "success", "completed", "idle", "greeting"];
                const currIdx = nextStates.indexOf(botState);
                setBotState(nextStates[(currIdx + 1) % nextStates.length]);
              }}
            />

            <p className="text-xs text-muted mt-5 text-center">
              Click the bot mascot or select a state below to test reactive animations:
            </p>

            <div className="flex flex-wrap justify-center gap-1.5 mt-3">
              {botStatesList.map((item) => (
                <button
                  key={item.state}
                  onClick={() => setBotState(item.state)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    botState === item.state
                      ? "bg-cyan-500 text-navy-950 font-semibold shadow-neon-cyan"
                      : "bg-navy-800 hover:bg-navy-700 text-muted hover:text-softwhite"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Portal Entry Cards: Student vs Recruiter */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left mt-8">
          {/* Student Portal Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/25 relative group hover:border-cyan-400/50 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-xl font-bold text-softwhite">
                  Student Portal
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  Candidate Hub
                </span>
              </div>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                Browse available campus drives, upload resumes for skill gap analysis, practice in English, Telugu, or Hindi with InterviewMateBot, and view rubric scorecards.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-softwhite/80">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Resume Studio with PDF/DOCX Parsing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Hardware Check: Camera & Mic Testing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Multilingual Speech & Text Interview Room</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-navy-700/60 flex flex-col sm:flex-row gap-2">
              <Link
                href="/candidate"
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-cyan-500 text-navy-950 hover:bg-cyan-400 transition-colors flex items-center justify-center gap-1.5 shadow-neon-cyan"
              >
                <span>Enter Student Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => loginDemo("student")}
                className="py-2.5 px-4 rounded-xl text-xs font-medium bg-navy-800 hover:bg-navy-700 border border-navy-700 text-softwhite transition-colors"
                title="Instant Demo Student (Alex Rivera)"
              >
                1-Click Demo
              </button>
            </div>
          </div>

          {/* Interviewer Portal Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-violet-500/25 relative group hover:border-violet-400/50 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/30 text-violet-400 flex items-center justify-center mb-4">
                <Building className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-xl font-bold text-softwhite">
                  Interviewer & Recruiter Portal
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-950 text-violet-300 border border-violet-500/30">
                  Recruiter Console
                </span>
              </div>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                Design recruitment campaigns with strict deadlines, evaluate submissions, inspect video playback, customize AI questions, and export 8-section academic reports.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-softwhite/80">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
                  <span>Campaign Builder & Deadline Validation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
                  <span>Submissions Hub with Review Drawer</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
                  <span>Repeat-Testing Lab & Academic Reports</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-navy-700/60 flex flex-col sm:flex-row gap-2">
              <Link
                href="/interviewer"
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-violet-500 text-white hover:bg-violet-400 transition-colors flex items-center justify-center gap-1.5 shadow-neon-violet"
              >
                <span>Enter Recruiter Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => loginDemo("interviewer")}
                className="py-2.5 px-4 rounded-xl text-xs font-medium bg-navy-800 hover:bg-navy-700 border border-navy-700 text-softwhite transition-colors"
                title="Instant Demo Recruiter (Dr. Marcus Vance)"
              >
                1-Click Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-navy-700/60">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-softwhite">
            Architected for Academic Excellence & Rigorous Hiring
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-muted">
            Engineered from the ground up without boilerplate code or legacy chatbots.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl glass-panel border border-navy-700">
            <Globe2 className="w-8 h-8 text-cyan-400 mb-3" />
            <h4 className="font-heading text-sm font-semibold text-softwhite">Multilingual Voice AI</h4>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Conduct interviews smoothly in English, Telugu, or Hindi with client-side speech recognition and synthesis.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-navy-700">
            <BrainCircuit className="w-8 h-8 text-violet-400 mb-3" />
            <h4 className="font-heading text-sm font-semibold text-softwhite">5-Factor Rubric Scoring</h4>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Evaluates technical correctness (35%), relevance (25%), problem-solving (20%), clarity (10%), and practical application (10%).
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-navy-700">
            <RefreshCw className="w-8 h-8 text-cyan-400 mb-3" />
            <h4 className="font-heading text-sm font-semibold text-softwhite">Repeat Testing Lab</h4>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Re-test exact previous questions to measure candidate improvement, learning retention, and feedback assimilation.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-navy-700">
            <FileSpreadsheet className="w-8 h-8 text-violet-400 mb-3" />
            <h4 className="font-heading text-sm font-semibold text-softwhite">Academic Report Studio</h4>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Generates complete university capstone reports formatted across 8 required academic sections in DOCX and PDF.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-navy-700/60 py-8 bg-navy-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <InterviewMateBot size="xs" state="idle" />
            <span className="text-xs font-semibold text-softwhite">InterviewMate AI</span>
            <span className="text-xs text-muted">— Your Intelligent Interview Partner</span>
          </div>

          <p className="text-[11px] text-muted">
            Academic Project Implementation • Built with Next.js 15, TypeScript & Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}
