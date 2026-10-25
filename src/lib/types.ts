export type UserRole = "student" | "interviewer";

export interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  rollNumber: string;
  college: string;
  course: string;
  department: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface InterviewerProfile {
  id: string;
  fullName: string;
  email: string;
  officialEmail: string;
  organization: string;
  recruiterId: string;
  designation: string;
  avatarUrl?: string;
  createdAt: string;
}

export type AuthUser = {
  id: string;
  role: UserRole;
  email: string;
  fullName: string;
  profile: StudentProfile | InterviewerProfile;
  isDemo?: boolean;
};

export type CampaignStatus = "active" | "draft" | "closed" | "archived";

export interface EvaluationWeights {
  technicalCorrectness: number;
  relevanceCompleteness: number;
  problemSolvingReasoning: number;
  communicationClarity: number;
  practicalApplication: number;
}

export interface Campaign {
  id: string;
  title: string;
  role: string;
  organization: string;
  department: string;
  description: string;
  requiredSkills: string[];
  startDate: string;
  deadline: string;
  durationMinutes: number;
  questionCount: number;
  categories: string[];
  customQuestions?: string[];
  evaluationWeights: EvaluationWeights;
  status: CampaignStatus;
  createdAt: string;
  createdBy?: string;
}

export interface ParsedResumeData {
  fullName: string;
  email: string;
  phone: string;
  education: string[];
  skills: string[];
  projects: { title: string; description: string; techStack?: string[] }[];
  experience: { role: string; company: string; duration: string; details: string }[];
  certifications: string[];
}

export interface ResumeDocument {
  id: string;
  candidateId: string;
  fileName: string;
  fileType: "pdf" | "docx";
  uploadDate: string;
  extractedText: string;
  parsedData: ParsedResumeData;
  verificationScore: number;
  verificationNotes: string[];
  matchScore?: number;
  missingSkills?: string[];
}

export type QuestionCategory =
  | "hr"
  | "technical"
  | "resume"
  | "coding"
  | "problem_solving"
  | "aptitude"
  | "communication"
  | "situational";

export interface InterviewQuestion {
  id: string;
  campaignId?: string;
  category: QuestionCategory;
  questionText: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  expectedConcepts: string[];
  evaluationRubric: string;
  followUpQuestion?: string;
  isCustom?: boolean;
  stage: number;
}

export interface AnswerEvaluation {
  score: number; // 0 - 100
  criteriaScores: {
    technicalCorrectness: number;
    relevanceCompleteness: number;
    problemSolvingReasoning: number;
    communicationClarity: number;
    practicalApplication: number;
  };
  explanation: string;
  strengths: string[];
  missingConcepts: string[];
  improvedAnswer: string;
  followUpQuestion?: string;
  isSimulated?: boolean;
}

export interface QuestionResponse {
  questionId: string;
  questionText: string;
  category: QuestionCategory;
  stage: number;
  candidateAnswer: string;
  transcript: string;
  timestamp: string;
  durationSeconds: number;
  evaluation?: AnswerEvaluation;
}

export type IntegrityEventType =
  | "tab_blur"
  | "tab_focus"
  | "visibility_hidden"
  | "copy_paste"
  | "camera_offline"
  | "mic_offline"
  | "window_blur";

export interface IntegrityEvent {
  id: string;
  timestamp: string;
  eventType: IntegrityEventType;
  description: string;
  severity: "info" | "warning";
}

export type HiringStatus = "under_review" | "shortlisted" | "rejected";

export interface InterviewSession {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  rollNumber: string;
  campaignId: string;
  campaignTitle: string;
  targetRole: string;
  language: "en" | "te" | "hi";
  difficulty: "beginner" | "intermediate" | "advanced";
  startTime: string;
  endTime?: string;
  status: "in_progress" | "completed" | "interrupted";
  responses: QuestionResponse[];
  overallScore?: number;
  resumeMatchScore?: number;
  integrityEvents: IntegrityEvent[];
  recordingUrl?: string; // or IndexedDB key
  hasRecording?: boolean;
  recruiterNotes?: string;
  hiringDecision: HiringStatus;
  isDemo?: boolean;
}

export interface RepeatTestItem {
  id: string;
  sessionId: string;
  candidateId: string;
  candidateName: string;
  originalQuestionId: string;
  questionText: string;
  originalAnswer: string;
  originalScore: number;
  originalEvaluation: AnswerEvaluation;
  repeatAnswer: string;
  repeatScore: number;
  repeatEvaluation: AnswerEvaluation;
  scoreDifference: number;
  improvementSummary: string;
  dateCompleted: string;
}

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  sampleCases: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  initialCode: {
    javascript: string;
    python: string;
    typescript: string;
  };
  testCases: {
    input: string;
    expectedOutput: string;
    isHidden?: boolean;
  }[];
}

export interface CodingSubmission {
  id: string;
  problemId: string;
  language: string;
  code: string;
  status: "Passed" | "Failed" | "Syntax Error";
  passedTests: number;
  totalTests: number;
  runtimeMs: number;
  aiComplexityAnalysis: {
    timeComplexity: string;
    spaceComplexity: string;
    codeQuality: string;
    suggestions: string[];
  };
  submittedAt: string;
}

export interface AcademicDocumentation {
  title: string;
  subtitle: string;
  studentName: string;
  rollNumber: string;
  institution: string;
  dateGenerated: string;
  sections: {
    sectionNumber: number;
    title: string;
    content: string;
    subsections?: { subtitle: string; body: string }[];
  }[];
}

export interface SystemSettings {
  geminiApiKey: string;
  voiceSpeed: number; // 0.8 - 1.2
  voicePitch: number; // 0.8 - 1.2
  languagePreference: "en" | "te" | "hi";
  theme: "dark" | "light";
  rubricWeights: EvaluationWeights;
  isDemoMode: boolean;
  enableCameraCheck: boolean;
  enableIntegrityMonitoring: boolean;
}

export type { BotState, BotSize } from "@/components/mascot/InterviewMateBot";
