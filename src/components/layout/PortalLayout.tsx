"use client";

import React from "react";
import { useAuth } from "@/lib/auth-context";
import { UserRole } from "@/lib/types";
import { StudentSidebar } from "./StudentSidebar";
import { InterviewerSidebar } from "./InterviewerSidebar";
import { InterviewMateBot } from "../mascot/InterviewMateBot";
import Link from "next/link";
import { ShieldAlert, ArrowRight, UserCheck, Lock } from "lucide-react";

interface PortalLayoutProps {
  requiredRole: UserRole;
  children: React.ReactNode;
}

export const PortalLayout: React.FC<PortalLayoutProps> = ({
  requiredRole,
  children,
}) => {
  const { user, isLoading, loginDemo } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6 bg-navy-950">
        <InterviewMateBot size="md" state="thinking" showStatusBadge statusText="Authenticating..." />
        <p className="mt-4 text-xs text-muted tracking-wide">Loading InterviewMate AI workspace...</p>
      </div>
    );
  }

  // Not signed in
  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 bg-navy-950">
        <div className="max-w-md w-full glass-panel rounded-3xl p-8 border border-navy-700 text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
          <InterviewMateBot size="md" state="greeting" />
          <h2 className="text-xl font-heading font-bold text-softwhite mt-4">
            {requiredRole === "student" ? "Student Sign-In Required" : "Recruiter Authentication Required"}
          </h2>
          <p className="text-xs text-muted mt-2 leading-relaxed">
            Please log in with your verified {requiredRole === "student" ? "Google Student Account" : "Corporate / University Recruiter Account"} to continue.
          </p>

          <div className="mt-6 space-y-3">
            <Link
              href={`/login?portal=${requiredRole}`}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-violet-500 text-navy-950 hover:brightness-110 shadow-neon-cyan transition-all"
            >
              <span>Go to Sign-In Page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={() => loginDemo(requiredRole)}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-medium bg-navy-800 hover:bg-navy-700 border border-navy-700 text-softwhite transition-colors flex items-center justify-center gap-2"
            >
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Instant 1-Click {requiredRole === "student" ? "Student" : "Recruiter"} Demo</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Role Mismatch (e.g., Student trying to access recruiter pages)
  if (user.role !== requiredRole) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 bg-navy-950">
        <div className="max-w-md w-full glass-panel rounded-3xl p-8 border border-red-500/30 text-center relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <h2 className="text-xl font-heading font-bold text-softwhite">Access Denied (Role Mismatch)</h2>
          <p className="text-xs text-muted mt-2 leading-relaxed">
            You are currently signed in as a <span className="text-cyan-400 font-semibold">{user.role.toUpperCase()}</span> ({user.fullName}).
            This portal is strictly restricted to verified <span className="text-violet-400 font-semibold">{requiredRole.toUpperCase()}S</span>.
          </p>

          <div className="mt-6 flex flex-col gap-2.5">
            <Link
              href={user.role === "student" ? "/candidate" : "/interviewer"}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-navy-800 hover:bg-navy-700 text-softwhite border border-navy-700 transition-colors"
            >
              Return to Your {user.role === "student" ? "Candidate Portal" : "Recruiter Console"}
            </Link>

            <button
              onClick={() => loginDemo(requiredRole)}
              className="w-full py-2 px-4 rounded-xl text-xs font-medium text-muted hover:text-softwhite transition-colors"
            >
              Switch to Demo {requiredRole === "student" ? "Student" : "Recruiter"} Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-navy-950">
      {requiredRole === "student" ? <StudentSidebar /> : <InterviewerSidebar />}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
