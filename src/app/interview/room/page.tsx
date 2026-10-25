"use client";

import React, { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { SAMPLE_CAMPAIGNS, SAMPLE_RESUMES } from "@/lib/sample-data";
import { LocalStore, saveSessionRecording } from "@/lib/storage";
import {
  Campaign,
  InterviewSession,
  QuestionResponse,
  IntegrityEvent,
  InterviewQuestion,
} from "@/lib/types";
import { evaluateAnswerWithGemini } from "@/lib/gemini";
import { InterviewMateBot, BotState } from "@/components/mascot/InterviewMateBot";
import { PortalLayout } from "@/components/layout/PortalLayout";
import {
  Mic,
  MicOff,
  Volume2,
  Send,
  Camera,
  CameraOff,
  Clock,
  ShieldAlert,
  CheckCircle2,
  Award,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Eye,
} from "lucide-react";
import confetti from "canvas-confetti";

function InterviewRoomContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const campaignId = searchParams.get("campaignId") || "camp_frontend_2026";
  const resumeId = searchParams.get("resumeId");
  const language = (searchParams.get("language") as "en" | "te" | "hi") || "en";
  const difficulty = (searchParams.get("difficulty") as any) || "intermediate";
  const cameraEnabled = searchParams.get("camera") !== "false";
  const recordingEnabled = searchParams.get("recording") !== "false";

  // Data states
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [candidateAnswer, setCandidateAnswer] = useState("");
  const [transcriptHistory, setTranscriptHistory] = useState<
    { speaker: "bot" | "user"; text: string; timestamp: string }[]
  >([]);
  const [sessionResponses, setSessionResponses] = useState<QuestionResponse[]>([]);
  const [integrityEvents, setIntegrityEvents] = useState<IntegrityEvent[]>([]);

  // Bot & Interview State
  const [botState, setBotState] = useState<BotState>("greeting");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes per question
  const [sessionId] = useState(() => `sess_${Date.now()}`);

  // Voice & Speech
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  // Webcam & Media Recording
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // 1. Initialize Campaign & Questions
  useEffect(() => {
    const campaigns = LocalStore.getCampaigns().length > 0 ? LocalStore.getCampaigns() : SAMPLE_CAMPAIGNS;
    const foundCamp = campaigns.find((c) => c.id === campaignId) || campaigns[0];
    setCampaign(foundCamp);

    // Build the stages of questions
    const role = foundCamp.role;
    const initialQuestions: InterviewQuestion[] = [
      {
        id: "q_stage_1",
        category: "hr",
        stage: 1,
        questionText: `Hello! Welcome to your interview for the ${role} position at ${foundCamp.organization}. To begin, please introduce yourself and share what interests you most about this role.`,
        difficulty: "beginner",
        expectedConcepts: ["Clear introduction", "Role motivation", "Academic background"],
        evaluationRubric: "Assesses communication confidence, clarity, and genuine alignment.",
      },
      {
        id: "q_stage_2",
        category: "resume",
        stage: 2,
        questionText:
          "Looking at your declared background, walk me through the most significant project you have engineered. What architecture did you choose and what trade-offs were involved?",
        difficulty: "intermediate",
        expectedConcepts: ["Project depth", "Architectural trade-offs", "Tech stack mastery"],
        evaluationRubric: "Verifies authenticity of declared experience and technical depth.",
      },
      {
        id: "q_stage_3",
        category: "technical",
        stage: 3,
        questionText:
          role.includes("AI") || role.includes("ML")
            ? "Can you explain how Retrieval-Augmented Generation (RAG) mitigates LLM hallucinations, and how you evaluate retrieval precision?"
            : `How do you approach state synchronization and performance optimization in modern ${role} architectures?`,
        difficulty: "advanced",
        expectedConcepts: ["Core domain mechanisms", "Failure recovery", "Scalability"],
        evaluationRubric: "Measures rigorous technical accuracy and problem solving.",
      },
      {
        id: "q_stage_4",
        category: "coding",
        stage: 4,
        questionText:
          "Suppose you need to design a cache eviction mechanism with strict linear space and O(1) retrieval constraints. How would you design the data structure?",
        difficulty: "advanced",
        expectedConcepts: ["Hash Map + Doubly Linked List (LRU)", "Time complexity O(1)", "Space bounds"],
        evaluationRubric: "Tests algorithmic mastery and data structure selection.",
      },
      {
        id: "q_stage_5",
        category: "situational",
        stage: 5,
        questionText:
          "Imagine a critical production release causes intermittent latency spikes affecting 10% of users. Walk us through your triage, mitigation, and post-mortem communication strategy.",
        difficulty: "intermediate",
        expectedConcepts: ["Root cause triage", "Rollback / circuit breaking", "Blameless post-mortem"],
        evaluationRubric: "Evaluates incident management, resilience, and engineering maturity.",
      },
    ];

    setQuestions(initialQuestions);

    // Speak initial greeting
    speakText(initialQuestions[0].questionText);
    setTranscriptHistory([
      {
        speaker: "bot",
        text: initialQuestions[0].questionText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, [campaignId]);

  // 2. Hardware: Camera & MediaRecorder
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (cameraEnabled) {
      navigator.mediaDevices
        ?.getUserMedia({ video: true, audio: true })
        .then((s) => {
          stream = s;
          mediaStreamRef.current = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }

          // Initialize local MediaRecorder if enabled
          if (recordingEnabled && typeof MediaRecorder !== "undefined") {
            try {
              const recorder = new MediaRecorder(s);
              mediaRecorderRef.current = recorder;
              recorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) {
                  recordedChunksRef.current.push(e.data);
                }
              };
              recorder.start(1000); // 1-second chunks
            } catch (err) {
              console.warn("MediaRecorder init failed:", err);
            }
          }
        })
        .catch((err) => {
          console.warn("Webcam access optional check:", err);
          logIntegrityEvent("camera_offline", "Camera permission was not granted or device is offline.");
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    };
  }, [cameraEnabled, recordingEnabled]);

  // 3. Proctoring & Integrity Listeners
  const logIntegrityEvent = (eventType: IntegrityEvent["eventType"], description: string) => {
    const event: IntegrityEvent = {
      id: `int_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      eventType,
      description,
      severity: eventType === "tab_blur" || eventType === "visibility_hidden" ? "warning" : "info",
    };
    setIntegrityEvents((prev) => [...prev, event]);
  };

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        logIntegrityEvent("visibility_hidden", "Candidate switched tabs or minimized interview window.");
      } else {
        logIntegrityEvent("tab_focus", "Candidate returned focus to interview room window.");
      }
    };

    const handleBlur = () => {
      logIntegrityEvent("tab_blur", "Interview window lost focus.");
    };

    const handleCopy = () => {
      logIntegrityEvent("copy_paste", "Copy action detected on browser page.");
    };

    const handlePaste = () => {
      logIntegrityEvent("copy_paste", "Paste action detected in interview room.");
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  // 4. Question Countdown Timer
  useEffect(() => {
    if (isCompleted || isPaused) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Auto submit if time expires
          handleSubmitAnswer();
          return 180;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isCompleted, isPaused, currentQuestionIndex, candidateAnswer]);

  // 5. Speech Synthesis (TTS) Helper
  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    if (language === "te") utterance.lang = "te-IN";
    else if (language === "hi") utterance.lang = "hi-IN";
    else utterance.lang = "en-US";

    utterance.onstart = () => setBotState("speaking");
    utterance.onend = () => setBotState("listening");
    utterance.onerror = () => setBotState("idle");

    window.speechSynthesis.speak(utterance);
  };

  // 6. Speech Recognition (STT) Helper
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setBotState("idle");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      alert("Browser speech recognition is not supported in this browser. Please type your answer.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language === "te" ? "te-IN" : language === "hi" ? "hi-IN" : "en-US";

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        }
      }
      if (finalTranscript) {
        setCandidateAnswer((prev) => prev + " " + finalTranscript.trim());
      }
    };

    recognition.onerror = (e: any) => {
      console.warn("Speech recognition error:", e);
      setIsListening(false);
      setBotState("idle");
    };

    recognition.onend = () => {
      setIsListening(false);
      setBotState("idle");
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    setBotState("listening");
  };

  // 7. Submit Answer & Real-time AI Evaluation
  const handleSubmitAnswer = async () => {
    if (!questions[currentQuestionIndex] || isEvaluating) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const currQ = questions[currentQuestionIndex];
    const answerText = candidateAnswer.trim() || "No verbal response provided within the allotted time.";

    // Add candidate response to transcript
    setTranscriptHistory((prev) => [
      ...prev,
      {
        speaker: "user",
        text: answerText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);

    setIsEvaluating(true);
    setBotState("thinking");

    // Call Gemini Evaluation
    const evaluation = await evaluateAnswerWithGemini({
      questionText: currQ.questionText,
      category: currQ.category,
      candidateAnswer: answerText,
      targetRole: campaign?.role || "Software Engineer",
      weights: campaign?.evaluationWeights || {
        technicalCorrectness: 35,
        relevanceCompleteness: 25,
        problemSolvingReasoning: 20,
        communicationClarity: 10,
        practicalApplication: 10,
      },
    });

    const responseItem: QuestionResponse = {
      questionId: currQ.id,
      questionText: currQ.questionText,
      category: currQ.category,
      stage: currQ.stage,
      candidateAnswer: answerText,
      transcript: answerText,
      timestamp: new Date().toISOString(),
      durationSeconds: 180 - timeLeft,
      evaluation,
    };

    const updatedResponses = [...sessionResponses, responseItem];
    setSessionResponses(updatedResponses);
    setCandidateAnswer("");
    setTimeLeft(180);
    setIsEvaluating(false);

    // Check if more questions remain
    if (currentQuestionIndex + 1 < questions.length) {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      const nextQ = questions[nextIdx];

      setTranscriptHistory((prev) => [
        ...prev,
        {
          speaker: "bot",
          text: nextQ.questionText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      speakText(nextQ.questionText);
    } else {
      // Completed interview session!
      finishInterview(updatedResponses);
    }
  };

  // 8. Finalize Interview Session & Persist
  const finishInterview = async (finalResponses: QuestionResponse[]) => {
    setIsCompleted(true);
    setBotState("completed");

    // Confetti effect
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}

    // Calculate overall average score
    const totalScore = finalResponses.reduce((acc, r) => acc + (r.evaluation?.score || 70), 0);
    const overallScore = Math.round(totalScore / (finalResponses.length || 1));

    const session: InterviewSession = {
      id: sessionId,
      candidateId: user?.id || "cand_local",
      candidateName: user?.fullName || "Candidate",
      candidateEmail: user?.email || "candidate@example.edu",
      rollNumber: (user?.profile as any)?.rollNumber || "22CS108",
      campaignId: campaign?.id || "camp_frontend_2026",
      campaignTitle: campaign?.title || "Engineering Drive 2026",
      targetRole: campaign?.role || "Software Engineer",
      language,
      difficulty,
      startTime: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      endTime: new Date().toISOString(),
      status: "completed",
      responses: finalResponses,
      overallScore,
      resumeMatchScore: 92,
      integrityEvents,
      hasRecording: recordedChunksRef.current.length > 0,
      hiringDecision: overallScore >= 85 ? "shortlisted" : overallScore >= 70 ? "under_review" : "rejected",
      recruiterNotes: `Automated Evaluation Summary: Overall Score ${overallScore}/100 with ${integrityEvents.length} integrity events recorded.`,
      isDemo: true,
    };

    // Save session in LocalStore
    const existingSessions = LocalStore.getSessions();
    LocalStore.saveSessions([session, ...existingSessions]);

    // Save recording in IndexedDB if captured
    if (recordedChunksRef.current.length > 0) {
      const recordingBlob = new Blob(recordedChunksRef.current, { type: "video/webm" });
      await saveSessionRecording(sessionId, recordingBlob, {
        candidateName: session.candidateName,
        overallScore,
      });
    }
  };

  const currQ = questions[currentQuestionIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <PortalLayout requiredRole="student">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-navy-700">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                Stage {currQ?.stage || 1} of 5 • {currQ?.category?.toUpperCase()}
              </span>
              <span className="text-xs text-muted">
                {campaign?.title || "Technical Interview Drive"}
              </span>
            </div>
            <h2 className="text-sm font-bold text-softwhite mt-1">
              Role: {campaign?.role || "Candidate Practice"} • Language: {language.toUpperCase()}
            </h2>
          </div>

          {/* Countdown & Pause Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy-900 border border-navy-700 font-mono text-xs text-softwhite">
              <Clock className={`w-3.5 h-3.5 ${timeLeft < 30 ? "text-red-400 animate-pulse" : "text-cyan-400"}`} />
              <span>
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </span>
            </div>

            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 rounded-xl bg-navy-900 hover:bg-navy-800 border border-navy-700 text-muted hover:text-softwhite transition-colors"
              title={isPaused ? "Resume Interview" : "Pause Interview"}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-cyan-400" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Main Workspace */}
        {!isCompleted ? (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: InterviewMateBot & Live Question */}
            <div className="lg:col-span-2 space-y-5">
              {/* Interviewer Stage Visualizer */}
              <div className="glass-panel-elevated p-6 rounded-3xl border border-cyan-500/30 text-center relative overflow-hidden shadow-glass flex flex-col items-center">
                <div className="absolute top-3 left-4 flex items-center gap-1.5 text-[11px] text-muted">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>AI Interviewer Session Active</span>
                </div>

                <div className="my-3">
                  <InterviewMateBot size="lg" state={botState} showStatusBadge />
                </div>

                {/* Current Question Display */}
                <div className="w-full mt-2 p-4 rounded-2xl bg-navy-900/90 border border-navy-700/80 text-left">
                  <div className="flex items-center justify-between text-[11px] text-cyan-400 font-semibold uppercase tracking-wider mb-1.5">
                    <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                    <button
                      onClick={() => speakText(currQ?.questionText || "")}
                      className="flex items-center gap-1 text-[11px] text-muted hover:text-cyan-300 font-normal normal-case transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Replay Audio</span>
                    </button>
                  </div>
                  <p className="text-sm sm:text-base font-medium text-softwhite leading-relaxed">
                    {currQ?.questionText}
                  </p>
                </div>
              </div>

              {/* Candidate Response Entry */}
              <div className="glass-panel p-5 rounded-3xl border border-navy-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-softwhite flex items-center gap-2">
                    <span>Your Answer</span>
                    {isListening && (
                      <span className="text-[10px] text-cyan-400 font-mono animate-pulse flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        Listening to microphone...
                      </span>
                    )}
                  </span>

                  <button
                    onClick={toggleListening}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isListening
                        ? "bg-red-500 text-white animate-pulse"
                        : "bg-navy-800 hover:bg-navy-700 text-cyan-300 border border-navy-700"
                    }`}
                  >
                    {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    <span>{isListening ? "Stop Recording" : "Speak via Mic"}</span>
                  </button>
                </div>

                <textarea
                  rows={4}
                  value={candidateAnswer}
                  onChange={(e) => setCandidateAnswer(e.target.value)}
                  placeholder="Type or speak your answer here. Explain your technical rationale, trade-offs, and examples..."
                  className="w-full px-4 py-3 rounded-2xl bg-navy-900 border border-navy-700 text-softwhite placeholder:text-muted/60 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 leading-relaxed resize-none"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-muted">
                    {candidateAnswer.split(/\s+/).filter(Boolean).length} words entered
                  </span>

                  <button
                    onClick={handleSubmitAnswer}
                    disabled={isEvaluating}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-cyan-500 text-navy-950 hover:bg-cyan-400 shadow-neon-cyan transition-all flex items-center gap-1.5"
                  >
                    {isEvaluating ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5 animate-spin" />
                        <span>Evaluating...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Answer</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Col: Video Preview, Proctoring Log & Transcript */}
            <div className="space-y-5">
              {/* Webcam Preview Check */}
              <div className="glass-panel p-4 rounded-3xl border border-navy-700 text-center">
                <div className="flex items-center justify-between text-xs text-muted mb-2 px-1">
                  <span className="font-semibold text-softwhite">Candidate Camera</span>
                  {cameraEnabled && (
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Feed
                    </span>
                  )}
                </div>

                <div className="w-full aspect-video rounded-2xl bg-navy-900 border border-navy-700 overflow-hidden relative flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {!cameraEnabled && (
                    <div className="flex flex-col items-center justify-center text-muted">
                      <CameraOff className="w-6 h-6 mb-1" />
                      <span className="text-[11px]">Camera disabled</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Proctoring Integrity Panel */}
              <div className="glass-panel p-4 rounded-3xl border border-navy-700 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-softwhite flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Integrity Signals</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-navy-900 text-muted">
                    {integrityEvents.length} events
                  </span>
                </div>

                <p className="text-[10px] text-muted leading-tight mb-2">
                  Non-punitive review signals logged for campus recruiter inspection:
                </p>

                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  {integrityEvents.length === 0 ? (
                    <div className="text-[11px] text-emerald-400/80 py-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Zero focus interruptions detected</span>
                    </div>
                  ) : (
                    integrityEvents.slice(-4).map((evt) => (
                      <div
                        key={evt.id}
                        className="p-1.5 rounded-lg bg-navy-900 text-[10px] text-muted border border-navy-800 flex justify-between"
                      >
                        <span className="truncate max-w-[160px]">{evt.description}</span>
                        <span className="text-[9px] text-cyan-400 font-mono">
                          {new Date(evt.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Live Transcript Stream */}
              <div className="glass-panel p-4 rounded-3xl border border-navy-700 text-xs flex flex-col h-64">
                <span className="font-semibold text-softwhite mb-2">Conversation Log</span>
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                  {transcriptHistory.map((msg, i) => (
                    <div
                      key={i}
                      className={`p-2.5 rounded-xl text-xs leading-relaxed ${
                        msg.speaker === "bot"
                          ? "bg-navy-900 text-softwhite border border-cyan-500/20"
                          : "bg-cyan-500/10 text-cyan-200 border border-cyan-500/30 ml-4"
                      }`}
                    >
                      <div className="flex justify-between text-[10px] text-muted mb-1 font-semibold">
                        <span>{msg.speaker === "bot" ? "InterviewMateBot" : "You"}</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p>{msg.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Interview Completed View */
          <div className="glass-panel-elevated p-8 rounded-3xl border border-cyan-500/40 text-center max-w-2xl mx-auto space-y-6">
            <InterviewMateBot size="lg" state="completed" showStatusBadge statusText="Interview Completed!" />

            <div>
              <h2 className="text-2xl font-heading font-extrabold text-softwhite">
                Outstanding Effort, {user?.fullName || "Candidate"}!
              </h2>
              <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
                Your interview session for <span className="text-cyan-400 font-semibold">{campaign?.role}</span> has been processed and scored under our multi-criteria rubric.
              </p>
            </div>

            {/* Quick Score Metrics */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-navy-900 border border-navy-700 text-center">
              <div>
                <span className="text-[11px] text-muted block">Questions Answered</span>
                <span className="text-lg font-bold text-softwhite">{sessionResponses.length} / {questions.length}</span>
              </div>
              <div>
                <span className="text-[11px] text-muted block">Overall Score</span>
                <span className="text-lg font-bold text-gradient-cyan-violet">
                  {Math.round(
                    sessionResponses.reduce((acc, r) => acc + (r.evaluation?.score || 75), 0) /
                      (sessionResponses.length || 1)
                  )} / 100
                </span>
              </div>
              <div>
                <span className="text-[11px] text-muted block">Integrity Rating</span>
                <span className="text-lg font-bold text-emerald-400">
                  {integrityEvents.length === 0 ? "Clean" : "Flagged Review"}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/scorecards"
                className="flex-1 py-3 px-4 rounded-xl text-xs font-semibold bg-cyan-500 text-navy-950 hover:bg-cyan-400 shadow-neon-cyan flex items-center justify-center gap-2 transition-all"
              >
                <Award className="w-4 h-4" />
                <span>View Full Scorecards & Analytics</span>
              </Link>
              <Link
                href="/candidate"
                className="py-3 px-4 rounded-xl text-xs font-medium bg-navy-800 hover:bg-navy-700 text-softwhite border border-navy-700 transition-colors"
              >
                Back to Lobby
              </Link>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}

export default function InterviewRoomPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-navy-950">
          <InterviewMateBot size="sm" state="thinking" />
        </div>
      }
    >
      <InterviewRoomContent />
    </Suspense>
  );
}
