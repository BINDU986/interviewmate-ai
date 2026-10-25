"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { UserRole } from "@/lib/types";
import { InterviewMateBot } from "@/components/mascot/InterviewMateBot";
import {
  GraduationCap,
  Building,
  ArrowRight,
  AlertCircle,
  Sparkles,
  UserCheck,
  CheckCircle2,
} from "lucide-react";

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const portalParam = (searchParams.get("portal") as UserRole) || "student";
  const [role, setRole] = useState<UserRole>(portalParam === "interviewer" ? "interviewer" : "student");
  const { loginDemo, user, authError, setAuthError } = useAuth();

  useEffect(() => {
    if (portalParam === "interviewer" || portalParam === "student") {
      setRole(portalParam);
    }
  }, [portalParam]);

  useEffect(() => {
    if (user && user.role === role) {
      router.push(role === "student" ? "/candidate" : "/interviewer");
    }
  }, [user, role, router]);

  const handleDemoSignIn = () => {
    loginDemo(role);
    router.push(role === "student" ? "/candidate" : "/interviewer");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 bg-navy-950 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-navy-700/80 shadow-glass relative z-10">
        {/* Mascot & Heading */}
        <div className="text-center flex flex-col items-center">
          <InterviewMateBot size="sm" state="greeting" />
          <h2 className="text-2xl font-heading font-bold text-softwhite mt-3">
            Welcome to InterviewMate AI
          </h2>
          <p className="text-xs text-muted mt-1">
            Sign in to access your {role === "student" ? "Candidate Portal" : "Recruiter Console"}
          </p>
        </div>

        {/* Portal Role Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-navy-900 border border-navy-700 mt-6">
          <button
            type="button"
            onClick={() => {
              setRole("student");
              setAuthError(null);
            }}
            className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all ${
              role === "student"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                : "text-muted hover:text-softwhite"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRole("interviewer");
              setAuthError(null);
            }}
            className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all ${
              role === "interviewer"
                ? "bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-sm"
                : "text-muted hover:text-softwhite"
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Recruiter</span>
          </button>
        </div>

        {/* Error Alert if any */}
        {authError && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">{authError}</div>
          </div>
        )}

        {/* 1-Click Instant Demo Login CTA (Recommended for Testing) */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleDemoSignIn}
            className={`w-full py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-md ${
              role === "student"
                ? "bg-cyan-500 text-navy-950 hover:bg-cyan-400 shadow-neon-cyan"
                : "bg-violet-500 text-white hover:bg-violet-400 shadow-neon-violet"
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>
              Instant 1-Click {role === "student" ? "Student" : "Recruiter"} Demo
            </span>
            <ArrowRight className="w-3.5 h-3.5 ml-auto" />
          </button>
          <p className="text-[11px] text-muted text-center mt-2">
            Loads pre-seeded {role === "student" ? "Alex Rivera (22CS108)" : "Dr. Marcus Vance (REC-9042)"} without external keys.
          </p>
        </div>

        {/* Link to Register */}
        <p className="mt-6 text-center text-xs text-muted">
          Don&apos;t have an account?{" "}
          <Link
            href={`/register?portal=${role}`}
            className="text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            Register as a {role === "student" ? "Student" : "Recruiter"}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-navy-950">
          <InterviewMateBot size="sm" state="thinking" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
