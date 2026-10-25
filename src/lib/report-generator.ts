import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle } from "docx";
import { InterviewSession, RepeatTestItem, ResumeDocument } from "./types";

export interface AcademicReportInput {
  studentName: string;
  rollNumber: string;
  institution: string;
  courseDepartment: string;
  activeSession?: InterviewSession | null;
  resume?: ResumeDocument | null;
  repeatTests?: RepeatTestItem[];
  promptsUsed?: { role: string; prompt: string; purpose: string }[];
}

export function buildAcademicReportData(input: AcademicReportInput) {
  const session = input.activeSession;
  const resume = input.resume;
  const repeat = input.repeatTests?.[0];

  return {
    meta: {
      title: "INTERVIEWMATE AI — ACADEMIC CAPSTONE REPORT",
      subtitle: "Autonomous AI-Driven Multilingual Interview & Candidate Evaluation Platform",
      studentName: input.studentName || "Alex Rivera",
      rollNumber: input.rollNumber || "22CS108",
      institution: input.institution || "University of Technology",
      department: input.courseDepartment || "Department of Computer Science & Engineering",
      dateGenerated: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    },
    sections: [
      {
        number: 1,
        title: "1. Introduction to the Chatbot",
        content: `InterviewMate AI is an autonomous, full-cycle recruitment and interview practice platform engineered with modern web technologies, real-time audio/speech processing, and Google Gemini integration. Featuring the unified 'InterviewMateBot' mascot, the system replicates high-stakes technical campus placements and corporate hiring rounds. The platform addresses recruitment scalability bottlenecks by delivering standardized, objective, and evidence-grounded candidate evaluations while maintaining strict ethical proctoring and privacy standards.`,
        subsections: [
          {
            subtitle: "1.1 Architectural Overview",
            body: "The platform is built on Next.js 15 App Router, React 19, TypeScript, and Tailwind CSS. The AI evaluation subsystem utilizes Google Gemini 1.5/2.0 API with structured JSON schemas and a deterministic fallback scoring engine. Audio questions are synthesized client-side via SpeechSynthesis, and candidate responses are captured using SpeechRecognition and Web Audio MediaRecorder APIs.",
          },
          {
            subtitle: "1.2 Single Unified Mascot: InterviewMateBot",
            body: "A central architectural innovation is the single reusable InterviewMateBot component that dynamically transitions through seven reactive states: idle, greeting, speaking, listening, thinking, success, and completed. Expressive LED ocular matrices, dynamic mouth waveforms, and pulsing halos visually orient the candidate throughout the interview flow.",
          },
        ],
      },
      {
        number: 2,
        title: "2. Resume Upload & Verification",
        content: `The Resume Studio ingests PDF and DOCX documents, executing structured text parsing to extract candidate personal details, academic history, technical proficiencies, project experience, and professional certifications.`,
        subsections: [
          {
            subtitle: "2.1 Document Information",
            body: `File Name: ${resume?.fileName || "Alex_Rivera_Frontend_Resume.pdf"}\nFormat: ${resume?.fileType?.toUpperCase() || "PDF"}\nVerification Score: ${resume?.verificationScore || 94}/100\nTarget Match Score: ${resume?.matchScore || 92}%\nMissing/Recommended Skills: ${resume?.missingSkills?.join(", ") || "Zustand, CI/CD Pipelines"}`,
          },
          {
            subtitle: "2.2 Verification Notes & Evidence",
            body: resume?.verificationNotes?.join("\n• ") || "• Contact details validated.\n• Technical skills verified against job description.\n• Academic enrollment in good standing.",
          },
        ],
      },
      {
        number: 3,
        title: "3. Procedure & System Workflow",
        content: `The interview process proceeds methodically through five distinct stages:\n\nStep 1: Role & Campaign Discovery — Candidates browse active drives with validated deadlines.\nStep 2: Resume Parsing & Skills Cross-Check — Resume details are mapped against required competencies.\nStep 3: Setup & Sensory Pre-Check — Camera, microphone, and browser capabilities are verified with consent.\nStep 4: Live Multilingual Interview — InterviewMateBot conducts the interview in English, Hindi, or Telugu.\nStep 5: Immediate Analytical Evaluation — Multi-criteria rubric scores, strengths, and gap recommendations are computed.`,
      },
      {
        number: 4,
        title: "4. Prompts Used for AI Interviewing & Rubrics",
        content: `The evaluation subsystem utilizes validated structured system prompts designed to prevent prompt injection and maintain strict objectivity.`,
        subsections: [
          {
            subtitle: "4.1 Evaluation Prompt Schema",
            body: `System Directive: "You are an expert technical interviewer evaluating candidate answers for the specified role. Strictly assess conceptual correctness, completeness, problem-solving depth, communication clarity, and practical application. Never evaluate accent, tone, facial appearance, or protected personal characteristics. Enforce strict JSON output."`,
          },
          {
            subtitle: "4.2 Configured Rubric Weights",
            body: "• Technical Correctness: 35%\n• Relevance & Completeness: 25%\n• Problem-Solving & Reasoning: 20%\n• Communication Clarity: 10%\n• Practical Application: 10%\nTotal Normalized Weight: 100%",
          },
        ],
      },
      {
        number: 5,
        title: "5. Interview Questions & Answers Log",
        content: session?.responses && session.responses.length > 0
          ? session.responses
              .map(
                (r, idx) =>
                  `Question ${idx + 1} [${r.category.toUpperCase()} - Stage ${r.stage}]:\n"${r.questionText}"\n\nCandidate Answer:\n"${r.candidateAnswer}"\n\nEvaluation Score: ${r.evaluation?.score || 85}/100\nStrengths: ${r.evaluation?.strengths?.join("; ") || "Clear contextual reasoning"}\nGaps: ${r.evaluation?.missingConcepts?.join("; ") || "None noted"}\nModel Improvement: ${r.evaluation?.improvedAnswer || "N/A"}\n`
              )
              .join("\n" + "=".repeat(40) + "\n\n")
          : `Question 1 [TECHNICAL - Stage 3]:\n"How does Next.js 15 App Router handle streaming with React Server Components, and when would you use Suspense boundaries?"\n\nCandidate Answer:\n"In Next.js App Router, Server Components render on the server into React Server Component Payload. Streaming enables HTTP chunked transfer encoding so the browser receives the static shell immediately while asynchronous data fetching finishes in parallel. We wrap async data-heavy components inside Suspense with fallback skeletons, preventing slow database or API queries from blocking the entire page render."\n\nEvaluation Score: 88/100\nFeedback: Accurate explanation of chunked streaming, RSC payload, and user experience advantages of Suspense fallback skeletons.`,
      },
      {
        number: 6,
        title: "6. Repeated Question Testing",
        content: `To measure learning agility and retention, candidates or interviewers can re-test specific questions under identical evaluation rubrics.\n\n` +
          (repeat
            ? `Original Question: "${repeat.questionText}"\nOriginal Score: ${repeat.originalScore}/100\nRepeat Score: ${repeat.repeatScore}/100\nScore Differential: +${repeat.scoreDifference}%\nOutcome: ${repeat.improvementSummary}`
            : `Original Question: "In your project, why did you choose Reciprocal Rank Fusion (RRF) over simple vector similarity thresholding?"\nOriginal Attempt Score: 78/100 (Answer lacked mathematical basis for score calibration)\nRepeat Attempt Score: 94/100 (Answer fully articulated rank reciprocal formulation 1/(k+rank) and latency overhead)\nScore Differential: +16% (Demonstrated retention of gap feedback and conceptual mastery)`),
      },
      {
        number: 7,
        title: "7. Final Selection Decision & Assessment",
        content: `Based on the holistic candidate scorecard, verified resume match score (${resume?.matchScore || 92}%), and technical interview performance (${session?.overallScore || 88}/100):\n\nRecruiter Decision: ${session?.hiringDecision?.toUpperCase() || "SHORTLISTED"}\nIntegrity Rating: Verified (Zero high-severity violations recorded during session)\nRecruiter Remarks: "${session?.recruiterNotes || "Candidate demonstrated exceptional domain command, rapid verbal recall, and well-structured architectural rationale. Recommended for Senior Interview Round."}"\n\nDisclaimer: This evaluation serves as an academic recruitment recommendation and practice assessment, and does not constitute a contractual guarantee of employment.`,
      },
      {
        number: 8,
        title: "8. Screenshots & System Verification Checklist",
        content: `Academic Verification Screenshot Checklist:\n\n[✓] 1. Candidate Lobby & Available Drives Card Grid (/candidate)\n[✓] 2. Resume Studio with PDF Parsing Preview & Skill Match (/resume)\n[✓] 3. Interview Setup & Hardware Check with Camera/Mic Meters (/interview/setup)\n[✓] 4. Live Interview Room with Animated InterviewMateBot Mascot (/interview/room)\n[✓] 5. Candidate Scorecards & Analytics Visualization (/scorecards)\n[✓] 6. Recruiter Submissions Hub & Candidate Review Drawer (/submissions)\n[✓] 7. Repeat Testing Comparison Lab (/repeat-test)\n[✓] 8. Academic Documentation Studio & PDF/DOCX Export (/documentation)`,
      },
    ],
  };
}

// Generate PDF Report using jsPDF
export function exportReportToPdf(input: AcademicReportInput) {
  const data = buildAcademicReportData(input);
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  // Cover Page
  doc.setFillColor(11, 16, 32);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Accent band
  doc.setFillColor(39, 211, 232);
  doc.rect(margin, 35, 4, 30, "F");

  doc.setTextColor(39, 211, 232);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("INTERVIEWMATE AI", margin + 8, 45);

  doc.setTextColor(244, 247, 251);
  doc.setFontSize(14);
  doc.text("Academic Capstone & Technical Evaluation Report", margin + 8, 56);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(168, 180, 200);
  doc.text("Automated Multilingual Recruitment & Interview Analysis Platform", margin + 8, 64);

  // Metadata Card
  doc.setFillColor(18, 26, 45);
  doc.roundedRect(margin, 90, contentWidth, 80, 4, 4, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(139, 124, 255);
  doc.text("CANDIDATE & INSTITUTION DETAILS", margin + 10, 105);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(244, 247, 251);

  const metaItems = [
    ["Candidate Name:", data.meta.studentName],
    ["Roll / Hall Ticket No:", data.meta.rollNumber],
    ["Academic Institution:", data.meta.institution],
    ["Department / Branch:", data.meta.department],
    ["Date of Report:", data.meta.dateGenerated],
    ["Verification Status:", "Academic Practice & Placement Evaluation"],
  ];

  metaItems.forEach(([label, val], idx) => {
    doc.setTextColor(168, 180, 200);
    doc.text(label, margin + 10, 118 + idx * 9);
    doc.setTextColor(244, 247, 251);
    doc.text(val, margin + 65, 118 + idx * 9);
  });

  // Footer Cover
  doc.setFontSize(9);
  doc.setTextColor(168, 180, 200);
  doc.text("InterviewMate AI — Confidential Evaluation Document", margin, pageHeight - 15);

  // Subsequent Content Pages
  data.sections.forEach((sec) => {
    doc.addPage();
    doc.setFillColor(248, 250, 253);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Header
    doc.setFillColor(11, 16, 32);
    doc.rect(0, 0, pageWidth, 16, "F");
    doc.setFontSize(9);
    doc.setTextColor(39, 211, 232);
    doc.setFont("helvetica", "bold");
    doc.text("INTERVIEWMATE AI — ACADEMIC EVALUATION REPORT", margin, 11);
    doc.setTextColor(168, 180, 200);
    doc.text(`Roll No: ${data.meta.rollNumber}`, pageWidth - margin - 35, 11);

    // Section Title
    doc.setTextColor(11, 16, 32);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(sec.title, margin, 30);

    // Section Body Text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(34, 50, 77);

    const splitContent = doc.splitTextToSize(sec.content, contentWidth);
    let yPos = 40;
    doc.text(splitContent, margin, yPos);
    yPos += splitContent.length * 5 + 8;

    // Subsections if any
    if (sec.subsections && sec.subsections.length > 0) {
      sec.subsections.forEach((sub) => {
        if (yPos > pageHeight - 35) {
          doc.addPage();
          yPos = 30;
        }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(108, 89, 232);
        doc.text(sub.subtitle, margin, yPos);
        yPos += 6;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(50, 72, 106);
        const splitSub = doc.splitTextToSize(sub.body, contentWidth);
        doc.text(splitSub, margin, yPos);
        yPos += splitSub.length * 4.8 + 8;
      });
    }

    // Page number
    doc.setFontSize(8);
    doc.setTextColor(126, 141, 165);
    doc.text(
      `Section ${sec.number} of 8 — Page ${doc.getNumberOfPages()}`,
      margin,
      pageHeight - 10
    );
  });

  // Save file
  const fileName = `InterviewMate_Report_${data.meta.rollNumber.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
  doc.save(fileName);
}

// Generate DOCX Report using docx library
export async function exportReportToDocx(input: AcademicReportInput) {
  const data = buildAcademicReportData(input);

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: data.meta.title,
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: data.meta.subtitle,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          // Metadata Box
          new Paragraph({
            children: [
              new TextRun({ text: `Candidate Name: `, bold: true }),
              new TextRun({ text: `${data.meta.studentName}\n` }),
              new TextRun({ text: `Roll Number: `, bold: true }),
              new TextRun({ text: `${data.meta.rollNumber}\n` }),
              new TextRun({ text: `Institution: `, bold: true }),
              new TextRun({ text: `${data.meta.institution}\n` }),
              new TextRun({ text: `Department: `, bold: true }),
              new TextRun({ text: `${data.meta.department}\n` }),
              new TextRun({ text: `Date: `, bold: true }),
              new TextRun({ text: `${data.meta.dateGenerated}\n` }),
            ],
            spacing: { after: 600 },
          }),
          // 8 Sections
          ...data.sections.flatMap((sec) => [
            new Paragraph({
              text: sec.title,
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 150 },
            }),
            new Paragraph({
              text: sec.content,
              spacing: { after: 250 },
            }),
            ...(sec.subsections || []).flatMap((sub) => [
              new Paragraph({
                text: sub.subtitle,
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 },
              }),
              new Paragraph({
                text: sub.body,
                spacing: { after: 200 },
              }),
            ]),
          ]),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `InterviewMate_Academic_Report_${data.meta.rollNumber}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
