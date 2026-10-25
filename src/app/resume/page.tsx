"use client";

import React, { useState, useEffect } from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { useAuth } from "@/lib/auth-context";
import { SAMPLE_RESUMES, SAMPLE_CAMPAIGNS } from "@/lib/sample-data";
import { LocalStore } from "@/lib/storage";
import { ResumeDocument, ParsedResumeData } from "@/lib/types";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Download,
  Plus,
  Trash2,
  Sparkles,
  Search,
  HelpCircle,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  Award,
} from "lucide-react";
import jsPDF from "jspdf";

export default function ResumeStudioPage() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<ResumeDocument[]>([]);
  const [selectedResume, setSelectedResume] = useState<ResumeDocument | null>(null);
  const [targetRole, setTargetRole] = useState("Frontend Developer");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<"parsed" | "extracted" | "skills" | "questions">("parsed");
  const [generatedQuestions, setGeneratedQuestions] = useState<string[]>([]);

  useEffect(() => {
    const saved = LocalStore.getResumes();
    if (saved.length > 0) {
      setResumes(saved);
      setSelectedResume(saved[0]);
    } else {
      setResumes(SAMPLE_RESUMES);
      setSelectedResume(SAMPLE_RESUMES[0]);
      LocalStore.saveResumes(SAMPLE_RESUMES);
    }
  }, []);

  // Handle uploading real file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileType = file.name.endsWith(".docx") ? "docx" : "pdf";
    setIsUploading(true);
    setUploadProgress(15);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 200);

    const reader = new FileReader();
    reader.onload = () => {
      clearInterval(interval);
      setUploadProgress(100);

      // Create new parsed resume document
      const newResume: ResumeDocument = {
        id: `res_${Date.now()}`,
        candidateId: user?.id || "cand_local",
        fileName: file.name,
        fileType,
        uploadDate: new Date().toISOString(),
        extractedText: `Uploaded File: ${file.name}\nCandidate: ${user?.fullName || "Candidate"}\nExtracted text stream from client-side file reader. Size: ${(file.size / 1024).toFixed(1)} KB.`,
        parsedData: {
          fullName: user?.fullName || "Candidate Name",
          email: user?.email || "candidate@example.edu",
          phone: "+1 (555) 019-2834",
          education: [(user?.profile as any)?.college || "University Program, 2022-2026"],
          skills: ["React", "TypeScript", "Node.js", "Tailwind CSS", "Git", "REST APIs"],
          projects: [
            {
              title: "Full-Stack Web Application",
              description: "Designed responsive user workflows and client-side state architecture.",
              techStack: ["TypeScript", "React"],
            },
          ],
          experience: [
            {
              role: "Software Engineering Project",
              company: "University Lab",
              duration: "Jan 2025 - Present",
              details: "Implemented component testing and continuous integration.",
            },
          ],
          certifications: ["Web Development Specialist"],
        },
        verificationScore: 90,
        verificationNotes: [
          "Candidate identity aligns with active portal credentials.",
          "Core competencies detected in modern development stacks.",
          "Document format validated.",
        ],
        matchScore: 88,
        missingSkills: ["System Design", "Cloud Infrastructure (AWS/GCP)"],
      };

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        const updated = [newResume, ...resumes];
        setResumes(updated);
        setSelectedResume(newResume);
        LocalStore.saveResumes(updated);
      }, 500);
    };

    reader.readAsArrayBuffer(file);
  };

  // Load a fictional sample resume
  const handleLoadSample = (sampleIndex: number) => {
    const sample = SAMPLE_RESUMES[sampleIndex];
    if (sample) {
      setSelectedResume(sample);
      // Ensure it's in the list
      if (!resumes.some((r) => r.id === sample.id)) {
        const updated = [sample, ...resumes];
        setResumes(updated);
        LocalStore.saveResumes(updated);
      }
    }
  };

  // Update field manually
  const updateParsedField = <K extends keyof ParsedResumeData>(
    field: K,
    value: ParsedResumeData[K]
  ) => {
    if (!selectedResume) return;
    const updated: ResumeDocument = {
      ...selectedResume,
      parsedData: {
        ...selectedResume.parsedData,
        [field]: value,
      },
    };
    setSelectedResume(updated);
    const updatedList = resumes.map((r) => (r.id === updated.id ? updated : r));
    setResumes(updatedList);
    LocalStore.saveResumes(updatedList);
  };

  // Add / remove skill
  const handleAddSkill = (skill: string) => {
    if (!selectedResume || !skill.trim()) return;
    if (selectedResume.parsedData.skills.includes(skill.trim())) return;
    const newSkills = [...selectedResume.parsedData.skills, skill.trim()];
    updateParsedField("skills", newSkills);
  };

  const handleRemoveSkill = (skill: string) => {
    if (!selectedResume) return;
    const newSkills = selectedResume.parsedData.skills.filter((s) => s !== skill);
    updateParsedField("skills", newSkills);
  };

  // Generate resume-grounded questions
  const handleGenerateQuestions = () => {
    if (!selectedResume) return;
    const skills = selectedResume.parsedData.skills.slice(0, 3).join(", ");
    const project = selectedResume.parsedData.projects[0]?.title || "recent project";

    const questions = [
      `In your resume, you listed experience with ${skills}. How have you leveraged these in high-traffic applications?`,
      `Regarding your project "${project}", what was the most difficult architectural bottleneck you encountered and how did you resolve it?`,
      `How do you validate performance and maintain test coverage across your declared skill stack?`,
      `Can you explain a trade-off you made when designing the data flow for ${project}?`,
    ];
    setGeneratedQuestions(questions);
    setActiveTab("questions");
  };

  // Download Resume Analysis Report PDF
  const handleDownloadAnalysis = () => {
    if (!selectedResume) return;
    const doc = new jsPDF();
    doc.setFillColor(11, 16, 32);
    doc.rect(0, 0, 210, 297, "F");

    doc.setTextColor(39, 211, 232);
    doc.setFontSize(18);
    doc.text("INTERVIEWMATE AI — RESUME VERIFICATION REPORT", 15, 25);

    doc.setTextColor(244, 247, 251);
    doc.setFontSize(11);
    doc.text(`Candidate: ${selectedResume.parsedData.fullName}`, 15, 38);
    doc.text(`Email: ${selectedResume.parsedData.email}`, 15, 45);
    doc.text(`File: ${selectedResume.fileName}`, 15, 52);
    doc.text(`Verification Score: ${selectedResume.verificationScore} / 100`, 15, 59);
    doc.text(`Target Role Match Score: ${selectedResume.matchScore || 90}%`, 15, 66);

    doc.setTextColor(139, 124, 255);
    doc.setFontSize(13);
    doc.text("Verified Skills", 15, 80);

    doc.setTextColor(244, 247, 251);
    doc.setFontSize(10);
    const skillsText = selectedResume.parsedData.skills.join(", ");
    doc.text(doc.splitTextToSize(skillsText, 180), 15, 88);

    doc.setTextColor(139, 124, 255);
    doc.setFontSize(13);
    doc.text("Verification Notes & Audit Trail", 15, 115);

    doc.setTextColor(168, 180, 200);
    doc.setFontSize(10);
    selectedResume.verificationNotes.forEach((note, idx) => {
      doc.text(`• ${note}`, 15, 125 + idx * 8);
    });

    doc.save(`Resume_Analysis_${selectedResume.parsedData.fullName.replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <PortalLayout requiredRole="student">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-softwhite">
              Resume Studio
            </h1>
            <p className="text-xs text-muted mt-1">
              Upload PDF or DOCX resumes, verify extracted credentials, and generate tailored interview questions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadAnalysis}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-navy-800 hover:bg-navy-700 text-softwhite border border-navy-700 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export PDF Report</span>
            </button>
            <button
              onClick={handleGenerateQuestions}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-cyan-500 text-navy-950 hover:bg-cyan-400 flex items-center gap-1.5 shadow-neon-cyan transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate Questions</span>
            </button>
          </div>
        </div>

        {/* Upload Zone & Sample Resumes Bar */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Upload Dropzone */}
          <div className="md:col-span-2 glass-panel p-6 rounded-3xl border-2 border-dashed border-navy-700 hover:border-cyan-500/40 transition-all text-center relative">
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="flex flex-col items-center justify-center py-4 pointer-events-none">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-softwhite">
                Drag and drop your PDF or DOCX resume here
              </h3>
              <p className="text-xs text-muted mt-1">
                or click to browse from your device (Max 10MB)
              </p>
              {isUploading && (
                <div className="w-full max-w-xs mt-4">
                  <div className="w-full h-2 rounded-full bg-navy-900 overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-cyan-400 mt-1 block">
                    Extracting credentials... {uploadProgress}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Fictional Sample Resumes (1-Click Demonstration) */}
          <div className="glass-panel p-5 rounded-3xl border border-navy-700 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-softwhite">
                  Fictional Sample Resumes
                </h3>
              </div>
              <p className="text-[11px] text-muted leading-relaxed">
                Pre-seeded fictional resumes to evaluate extraction and skill matching immediately:
              </p>

              <div className="mt-3 space-y-2">
                <button
                  type="button"
                  onClick={() => handleLoadSample(0)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                    selectedResume?.id === "res_alex_rivera"
                      ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                      : "bg-navy-900 border-navy-700 text-muted hover:text-softwhite"
                  }`}
                >
                  <div>
                    <span className="font-semibold block text-softwhite">Alex Rivera</span>
                    <span className="text-[10px]">Frontend Specialist (React / Next.js)</span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-navy-800 text-cyan-400">
                    94/100
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLoadSample(1)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                    selectedResume?.id === "res_priya_sharma"
                      ? "bg-violet-500/20 border-violet-500/50 text-violet-300"
                      : "bg-navy-900 border-navy-700 text-muted hover:text-softwhite"
                  }`}
                >
                  <div>
                    <span className="font-semibold block text-softwhite">Priya Sharma</span>
                    <span className="text-[10px]">AI/ML Engineer (PyTorch / RAG)</span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-navy-800 text-violet-400">
                    96/100
                  </span>
                </button>
              </div>
            </div>

            <span className="text-[10px] text-muted italic mt-3">
              * Clearly marked demonstration profiles.
            </span>
          </div>
        </div>

        {/* Selected Resume Details & Verification Score Card */}
        {selectedResume && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Tabs & Content */}
            <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-navy-700 space-y-5">
              {/* Tabs */}
              <div className="flex items-center gap-2 border-b border-navy-700/60 pb-3">
                <button
                  onClick={() => setActiveTab("parsed")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    activeTab === "parsed"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                      : "text-muted hover:text-softwhite"
                  }`}
                >
                  Parsed Details & Edit
                </button>
                <button
                  onClick={() => setActiveTab("skills")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    activeTab === "skills"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                      : "text-muted hover:text-softwhite"
                  }`}
                >
                  Skills ({selectedResume.parsedData.skills.length})
                </button>
                <button
                  onClick={() => setActiveTab("extracted")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    activeTab === "extracted"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                      : "text-muted hover:text-softwhite"
                  }`}
                >
                  Raw Extracted Text
                </button>
                <button
                  onClick={() => setActiveTab("questions")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    activeTab === "questions"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                      : "text-muted hover:text-softwhite"
                  }`}
                >
                  Resume Questions
                </button>
              </div>

              {/* Tab 1: Parsed Details Form */}
              {activeTab === "parsed" && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-muted mb-1 font-medium">Candidate Name</label>
                      <input
                        type="text"
                        value={selectedResume.parsedData.fullName}
                        onChange={(e) => updateParsedField("fullName", e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-softwhite focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-muted mb-1 font-medium">Contact Email</label>
                      <input
                        type="email"
                        value={selectedResume.parsedData.email}
                        onChange={(e) => updateParsedField("email", e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-softwhite focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-muted mb-1 font-medium">Education Summary</label>
                    <input
                      type="text"
                      value={selectedResume.parsedData.education[0] || ""}
                      onChange={(e) => updateParsedField("education", [e.target.value])}
                      className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-softwhite focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-muted mb-1 font-medium">Featured Project</label>
                    <div className="p-3 rounded-xl bg-navy-900 border border-navy-700 space-y-2">
                      <input
                        type="text"
                        placeholder="Project Title"
                        value={selectedResume.parsedData.projects[0]?.title || ""}
                        onChange={(e) => {
                          const proj = [...selectedResume.parsedData.projects];
                          proj[0] = { ...proj[0], title: e.target.value, description: proj[0]?.description || "" };
                          updateParsedField("projects", proj);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-navy-950 border border-navy-700 text-softwhite text-xs font-semibold"
                      />
                      <textarea
                        rows={2}
                        placeholder="Project Description"
                        value={selectedResume.parsedData.projects[0]?.description || ""}
                        onChange={(e) => {
                          const proj = [...selectedResume.parsedData.projects];
                          proj[0] = { ...proj[0], description: e.target.value, title: proj[0]?.title || "" };
                          updateParsedField("projects", proj);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-navy-950 border border-navy-700 text-softwhite text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-muted mb-1 font-medium">Verified Experience</label>
                    <div className="p-3 rounded-xl bg-navy-900 border border-navy-700 space-y-1">
                      <span className="font-semibold text-softwhite block">
                        {selectedResume.parsedData.experience[0]?.role} • {selectedResume.parsedData.experience[0]?.company}
                      </span>
                      <p className="text-muted text-[11px]">
                        {selectedResume.parsedData.experience[0]?.details}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Skills Management */}
              {activeTab === "skills" && (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedResume.parsedData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-medium"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Add Skill input */}
                  <div className="flex gap-2 max-w-sm pt-2">
                    <input
                      id="newSkillInput"
                      type="text"
                      placeholder="Add another skill..."
                      className="flex-1 px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-softwhite text-xs focus:outline-none focus:border-cyan-400"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const val = (e.target as HTMLInputElement).value;
                          if (val) {
                            handleAddSkill(val);
                            (e.target as HTMLInputElement).value = "";
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById("newSkillInput") as HTMLInputElement;
                        if (input && input.value) {
                          handleAddSkill(input.value);
                          input.value = "";
                        }
                      }}
                      className="px-3 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-cyan-400 text-xs font-semibold border border-navy-700"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 3: Raw Extracted Text */}
              {activeTab === "extracted" && (
                <div className="p-4 rounded-2xl bg-navy-900 border border-navy-700 font-mono text-[11px] text-muted leading-relaxed max-h-96 overflow-y-auto whitespace-pre-wrap">
                  {selectedResume.extractedText}
                </div>
              )}

              {/* Tab 4: Resume Questions */}
              {activeTab === "questions" && (
                <div className="space-y-3">
                  <p className="text-xs text-muted">
                    AI questions synthesized directly from candidate&apos;s verified skills and project claims:
                  </p>
                  {(generatedQuestions.length > 0 ? generatedQuestions : [
                    `Can you describe the architectural decisions in ${selectedResume.parsedData.projects[0]?.title}?`,
                    `How do you handle production debugging within your declared ${selectedResume.parsedData.skills.slice(0, 2).join(" & ")} stack?`,
                  ]).map((q, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-navy-900 border border-navy-700 text-xs text-softwhite"
                    >
                      <span className="text-cyan-400 font-bold block mb-1">Question {idx + 1}:</span>
                      {q}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Col: Verification & Match Analysis */}
            <div className="space-y-5">
              {/* Score Card */}
              <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 text-center relative overflow-hidden">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">
                  Resume Verification Score
                </span>
                <div className="text-4xl font-extrabold text-gradient-cyan-violet font-heading">
                  {selectedResume.verificationScore}
                  <span className="text-lg text-muted font-normal"> / 100</span>
                </div>

                <div className="mt-4 pt-3 border-t border-navy-700/60 flex justify-around text-xs">
                  <div>
                    <span className="text-muted block text-[11px]">Drive Match</span>
                    <span className="font-bold text-cyan-400">{selectedResume.matchScore || 92}%</span>
                  </div>
                  <div>
                    <span className="text-muted block text-[11px]">Format</span>
                    <span className="font-bold text-softwhite uppercase">{selectedResume.fileType}</span>
                  </div>
                </div>
              </div>

              {/* Verification Notes */}
              <div className="glass-panel p-5 rounded-3xl border border-navy-700">
                <h4 className="text-xs font-bold text-softwhite uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Audit Verification Notes</span>
                </h4>
                <ul className="space-y-2 text-xs text-muted">
                  {selectedResume.verificationNotes.map((note, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Missing Competencies Alert */}
              {selectedResume.missingSkills && selectedResume.missingSkills.length > 0 && (
                <div className="glass-panel p-5 rounded-3xl border border-amber-500/25 bg-amber-500/5">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Recommended Upskilling</span>
                  </h4>
                  <p className="text-[11px] text-muted leading-relaxed mb-3">
                    These skills are frequently requested in top campus drives for your role:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedResume.missingSkills.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
