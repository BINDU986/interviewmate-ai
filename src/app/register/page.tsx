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
  CheckCircle2,
  Sparkles,
} from "lucide-react";

function RegisterContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const portalParam = (searchParams.get("portal") as UserRole) || "student";
  const [role, setRole] = useState<UserRole>(portalParam === "interviewer" ? "interviewer" : "student");

  // Student Fields
  const [studentForm, setStudentForm] = useState({
    fullName: "",
    email: "",
    rollNumber: "",
    college: "",
    course: "B.Tech / B.S.",
    department: "Computer Science & Engineering",
  });

  // Interviewer Fields
  const [interviewerForm, setInterviewerForm] = useState({
    fullName: "",
    email: "",
    officialEmail: "",
    organization: "",
    recruiterId: "",
    designation: "",
  });

  const { registerStudent, registerInterviewer, authError, setAuthError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (portalParam === "interviewer" || portalParam === "student") {
      setRole(portalParam);
    }
  }, [portalParam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError(null);

    if (role === "student") {
      const ok = registerStudent(studentForm);
      setIsSubmitting(false);
      if (ok) {
        router.push("/candidate");
      }
    } else {
      const ok = registerInterviewer(interviewerForm);
      setIsSubmitting(false);
      if (ok) {
        router.push("/interviewer");
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 bg-navy-950 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-lg w-full glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-navy-700/80 shadow-glass relative z-10">
        {/* Mascot & Heading */}
        <div className="text-center flex flex-col items-center">
          <InterviewMateBot size="sm" state="greeting" />
          <h2 className="text-2xl font-heading font-bold text-softwhite mt-3">
            Create Your Account
          </h2>
          <p className="text-xs text-muted mt-1">
            Register for {role === "student" ? "Campus Drives & AI Mock Sessions" : "Recruiter Management & Evaluation"}
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
            <span>Student Registration</span>
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
            <span>Recruiter Registration</span>
          </button>
        </div>

        {/* Error Alert */}
        {authError && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">{authError}</div>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {role === "student" ? (
            <>
              <div>
                <label className="block text-xs font-medium text-softwhite mb-1">
                  Full Name <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={studentForm.fullName}
                  onChange={(e) => setStudentForm({ ...studentForm, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-softwhite placeholder:text-muted/60 text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-softwhite mb-1">
                    Google / University Email <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@university.edu"
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-softwhite placeholder:text-muted/60 text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-softwhite mb-1">
                    Roll / Hall Ticket No <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 22CS108"
                    value={studentForm.rollNumber}
                    onChange={(e) => setStudentForm({ ...studentForm, rollNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-softwhite placeholder:text-muted/60 text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-softwhite mb-1">
                  College or University <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. University of Technology"
                  value={studentForm.college}
                  onChange={(e) => setStudentForm({ ...studentForm, college: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-softwhite placeholder:text-muted/60 text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-softwhite mb-1">Degree / Course</label>
                  <input
                    type="text"
                    value={studentForm.course}
                    onChange={(e) => setStudentForm({ ...studentForm, course: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-softwhite text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-softwhite mb-1">Department</label>
                  <input
                    type="text"
                    value={studentForm.department}
                    onChange={(e) => setStudentForm({ ...studentForm, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-softwhite text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-medium text-softwhite mb-1">
                  Full Name <span className="text-violet-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Marcus Vance"
                  value={interviewerForm.fullName}
                  onChange={(e) => setInterviewerForm({ ...interviewerForm, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-softwhite placeholder:text-muted/60 text-xs focus:outline-none focus:border-violet-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-softwhite mb-1">
                    Google Account Email <span className="text-violet-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="marcus@gmail.com"
                    value={interviewerForm.email}
                    onChange={(e) => setInterviewerForm({ ...interviewerForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-softwhite placeholder:text-muted/60 text-xs focus:outline-none focus:border-violet-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-softwhite mb-1">
                    Official Work Email
                  </label>
                  <input
                    type="email"
                    placeholder="recruiter@nexoratech.com"
                    value={interviewerForm.officialEmail}
                    onChange={(e) => setInterviewerForm({ ...interviewerForm, officialEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-softwhite placeholder:text-muted/60 text-xs focus:outline-none focus:border-violet-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-softwhite mb-1">
                  Organization / Company <span className="text-violet-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nexora Technologies"
                  value={interviewerForm.organization}
                  onChange={(e) => setInterviewerForm({ ...interviewerForm, organization: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-softwhite placeholder:text-muted/60 text-xs focus:outline-none focus:border-violet-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-softwhite mb-1">
                    Designation / Title <span className="text-violet-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Talent Lead"
                    value={interviewerForm.designation}
                    onChange={(e) => setInterviewerForm({ ...interviewerForm, designation: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-softwhite placeholder:text-muted/60 text-xs focus:outline-none focus:border-violet-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-softwhite mb-1">
                    Recruiter ID (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Auto-generated if blank"
                    value={interviewerForm.recruiterId}
                    onChange={(e) => setInterviewerForm({ ...interviewerForm, recruiterId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-softwhite placeholder:text-muted/60 text-xs focus:outline-none focus:border-violet-400"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full mt-4 py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              role === "student"
                ? "bg-cyan-500 text-navy-950 hover:bg-cyan-400 shadow-neon-cyan"
                : "bg-violet-500 text-white hover:bg-violet-400 shadow-neon-violet"
            }`}
          >
            <span>Complete Registration</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted">
          Already registered?{" "}
          <Link
            href={`/login?portal=${role}`}
            className="text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-navy-950">
          <InterviewMateBot size="sm" state="thinking" />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
