"use client";

import React, { useState } from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { useAuth } from "@/lib/auth-context";
import { exportReportToPdf, exportReportToDocx, buildAcademicReportData } from "@/lib/report-generator";
import { SAMPLE_RESUMES, SAMPLE_SUBMISSIONS, SAMPLE_REPEAT_TESTS } from "@/lib/sample-data";
import { LocalStore } from "@/lib/storage";
import {
  BookOpen,
  Download,
  FileText,
  CheckCircle2,
  Sparkles,
  Camera,
  GraduationCap,
  Layers,
} from "lucide-react";

export default function DocumentationPage() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  const reportData = buildAcademicReportData({
    studentName: user?.fullName || "Alex Rivera",
    rollNumber: (user?.profile as any)?.rollNumber || "22CS108",
    institution: (user?.profile as any)?.college || "University of Technology",
    courseDepartment: (user?.profile as any)?.course || "Department of Computer Science & Engineering",
    activeSession: LocalStore.getSessions()[0] || SAMPLE_SUBMISSIONS[0],
    resume: LocalStore.getResumes()[0] || SAMPLE_RESUMES[0],
    repeatTests: LocalStore.getRepeatTests().length > 0 ? LocalStore.getRepeatTests() : SAMPLE_REPEAT_TESTS,
  });

  const handleExportPdf = () => {
    setIsExporting(true);
    setTimeout(() => {
      exportReportToPdf({
        studentName: reportData.meta.studentName,
        rollNumber: reportData.meta.rollNumber,
        institution: reportData.meta.institution,
        courseDepartment: reportData.meta.department,
        activeSession: LocalStore.getSessions()[0] || SAMPLE_SUBMISSIONS[0],
        resume: LocalStore.getResumes()[0] || SAMPLE_RESUMES[0],
        repeatTests: LocalStore.getRepeatTests().length > 0 ? LocalStore.getRepeatTests() : SAMPLE_REPEAT_TESTS,
      });
      setIsExporting(false);
    }, 400);
  };

  const handleExportDocx = async () => {
    setIsExporting(true);
    await exportReportToDocx({
      studentName: reportData.meta.studentName,
      rollNumber: reportData.meta.rollNumber,
      institution: reportData.meta.institution,
      courseDepartment: reportData.meta.department,
      activeSession: LocalStore.getSessions()[0] || SAMPLE_SUBMISSIONS[0],
      resume: LocalStore.getResumes()[0] || SAMPLE_RESUMES[0],
      repeatTests: LocalStore.getRepeatTests().length > 0 ? LocalStore.getRepeatTests() : SAMPLE_REPEAT_TESTS,
    });
    setIsExporting(false);
  };

  const currentSec = reportData.sections.find((s) => s.number === activeSection) || reportData.sections[0];

  return (
    <PortalLayout requiredRole="interviewer">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-softwhite">
              Academic Documentation Studio
            </h1>
            <p className="text-xs text-muted mt-1">
              Export university capstone reports formatted across all 8 mandatory academic sections in DOCX & PDF.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPdf}
              disabled={isExporting}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-violet-500 text-white hover:bg-violet-400 flex items-center gap-1.5 shadow-neon-violet transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF Report</span>
            </button>
            <button
              onClick={handleExportDocx}
              disabled={isExporting}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-navy-800 hover:bg-navy-700 text-cyan-300 border border-navy-700 flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export DOCX</span>
            </button>
          </div>
        </div>

        {/* 8 Sections Horizontal Step Bar */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {reportData.sections.map((sec) => (
            <button
              key={sec.number}
              onClick={() => setActiveSection(sec.number)}
              className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                activeSection === sec.number
                  ? "bg-violet-500 text-white font-semibold shadow-neon-violet"
                  : "bg-navy-900 border border-navy-700 text-muted hover:text-softwhite"
              }`}
            >
              Section {sec.number}
            </button>
          ))}
        </div>

        {/* Active Section Content View */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-navy-700 space-y-5">
          <div className="flex items-center justify-between border-b border-navy-700/60 pb-3">
            <h2 className="text-lg font-heading font-bold text-softwhite">
              {currentSec.title}
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-950 text-violet-300 border border-violet-500/30">
              Section {currentSec.number} of 8
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-navy-900 border border-navy-800 text-xs sm:text-sm text-softwhite leading-relaxed whitespace-pre-line">
            {currentSec.content}
          </div>

          {currentSec.subsections && currentSec.subsections.length > 0 && (
            <div className="space-y-4 pt-2">
              {currentSec.subsections.map((sub, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-navy-900/60 border border-navy-700/60 space-y-1.5 text-xs">
                  <h4 className="font-semibold text-violet-400 text-xs">{sub.subtitle}</h4>
                  <p className="text-muted leading-relaxed whitespace-pre-line">{sub.body}</p>
                </div>
              ))}
            </div>
          )}

          {/* Screenshot Checklist if Section 8 */}
          {currentSec.number === 8 && (
            <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-3 text-xs">
              <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-cyan-400" />
                <span>Screenshot Evidence Verification</span>
              </span>
              <p className="text-muted text-[11px] leading-relaxed">
                All 8 major application screens have been verified and bundled into the exportable PDF report.
              </p>
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
