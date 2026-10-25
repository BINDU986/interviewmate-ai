"use client";

import React, { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { useAuth } from "@/lib/auth-context";
import { SAMPLE_CAMPAIGNS, SAMPLE_RESUMES } from "@/lib/sample-data";
import { LocalStore } from "@/lib/storage";
import { Campaign, ResumeDocument } from "@/lib/types";
import { InterviewMateBot } from "@/components/mascot/InterviewMateBot";
import {
  Camera,
  Mic,
  Video,
  Volume2,
  Shield,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  Settings2,
  Globe2,
  Sparkles,
  Info,
} from "lucide-react";

function SetupContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const campaignIdParam = searchParams.get("campaignId");

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [resumes, setResumes] = useState<ResumeDocument[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");

  // Configuration options
  const [language, setLanguage] = useState<"en" | "te" | "hi">("en");
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("intermediate");
  const [mode, setMode] = useState<"mixed" | "technical" | "hr" | "coding">("mixed");
  const [answerInputType, setAnswerInputType] = useState<"voice" | "text">("voice");
  const [enableCamera, setEnableCamera] = useState<boolean>(true);
  const [enableRecording, setEnableRecording] = useState<boolean>(true);

  // Hardware testing states
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [micActive, setMicActive] = useState<boolean>(false);
  const [micLevel, setMicLevel] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const loadedCampaigns = LocalStore.getCampaigns().length > 0 ? LocalStore.getCampaigns() : SAMPLE_CAMPAIGNS;
    const loadedResumes = LocalStore.getResumes().length > 0 ? LocalStore.getResumes() : SAMPLE_RESUMES;
    setCampaigns(loadedCampaigns);
    setResumes(loadedResumes);

    if (campaignIdParam && loadedCampaigns.some((c) => c.id === campaignIdParam)) {
      setSelectedCampaignId(campaignIdParam);
    } else if (loadedCampaigns.length > 0) {
      setSelectedCampaignId(loadedCampaigns[0].id);
    }

    if (loadedResumes.length > 0) {
      setSelectedResumeId(loadedResumes[0].id);
    }

    return () => {
      // Clean up media streams
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [campaignIdParam]);

  // Camera & Mic Hardware Check
  const handleTestHardware = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        mediaStreamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
        setMicActive(true);

        // Simple audio meter
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            const ctx = new AudioContextClass();
            audioContextRef.current = ctx;
            const src = ctx.createMediaStreamSource(stream);
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 256;
            src.connect(analyser);

            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            const checkVolume = () => {
              if (!analyser) return;
              analyser.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
              }
              const average = sum / dataArray.length;
              setMicLevel(Math.min(100, Math.round(average * 2)));
              requestAnimationFrame(checkVolume);
            };
            checkVolume();
          }
        } catch (e) {
          console.warn("Audio meter context initialization failed", e);
        }
      } else {
        setCameraError("Webcam/Microphone API is not supported in this browser environment.");
      }
    } catch (err: any) {
      console.warn("Media devices check:", err);
      setCameraError(
        err.name === "NotAllowedError"
          ? "Camera or microphone permission was denied. You can still proceed with text answering."
          : `Device access message: ${err.message || "Hardware stream unavailable"}`
      );
    }
  };

  const handleLaunchInterview = () => {
    // Stop local preview stream before transitioning to the room
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    const query = new URLSearchParams({
      campaignId: selectedCampaignId,
      resumeId: selectedResumeId,
      language,
      difficulty,
      mode,
      answerType: answerInputType,
      camera: enableCamera ? "true" : "false",
      recording: enableRecording ? "true" : "false",
    });

    router.push(`/interview/room?${query.toString()}`);
  };

  const activeCampaign = campaigns.find((c) => c.id === selectedCampaignId);

  return (
    <PortalLayout requiredRole="student">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-softwhite">
              Interview Pre-Check & Room Setup
            </h1>
            <p className="text-xs text-muted mt-1">
              Verify your target campaign, configure language and modality, and test hardware before joining InterviewMateBot.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Setup Options */}
          <div className="lg:col-span-2 space-y-5">
            {/* 1. Drive & Resume Selection */}
            <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-navy-700 space-y-4">
              <h2 className="text-xs font-bold text-softwhite uppercase tracking-wider flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-cyan-400" />
                <span>1. Recruitment Campaign & Verified Resume</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted text-xs mb-1 font-medium">Selected Campaign</label>
                  <select
                    value={selectedCampaignId}
                    onChange={(e) => setSelectedCampaignId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-softwhite text-xs focus:outline-none focus:border-cyan-400"
                  >
                    {campaigns.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.role} — {c.organization}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-muted text-xs mb-1 font-medium">Active Resume</label>
                  <select
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-softwhite text-xs focus:outline-none focus:border-cyan-400"
                  >
                    {resumes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.parsedData.fullName} ({r.fileType.toUpperCase()}) — Score: {r.verificationScore}/100
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {activeCampaign && (
                <div className="p-3 rounded-xl bg-navy-900 border border-navy-700 text-xs flex justify-between items-center text-muted">
                  <span>
                    Role: <strong className="text-softwhite">{activeCampaign.role}</strong>
                  </span>
                  <span>
                    Questions: <strong className="text-cyan-400">{activeCampaign.questionCount}</strong>
                  </span>
                  <span>
                    Duration: <strong className="text-softwhite">{activeCampaign.durationMinutes}m</strong>
                  </span>
                </div>
              )}
            </div>

            {/* 2. Language, Difficulty & Modality */}
            <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-navy-700 space-y-4">
              <h2 className="text-xs font-bold text-softwhite uppercase tracking-wider flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-cyan-400" />
                <span>2. Language & Interview Configuration</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Language selection */}
                <div>
                  <label className="block text-muted text-xs mb-1 font-medium">Interview Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-softwhite text-xs focus:outline-none focus:border-cyan-400"
                  >
                    <option value="en">English (Default)</option>
                    <option value="te">Telugu (తెలుగు)</option>
                    <option value="hi">Hindi (हिंदी)</option>
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-muted text-xs mb-1 font-medium">Difficulty Level</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-softwhite text-xs focus:outline-none focus:border-cyan-400"
                  >
                    <option value="beginner">Entry Level</option>
                    <option value="intermediate">Intermediate / Standard</option>
                    <option value="advanced">Advanced / Rigorous</option>
                  </select>
                </div>

                {/* Answering mode */}
                <div>
                  <label className="block text-muted text-xs mb-1 font-medium">Answer Mode</label>
                  <select
                    value={answerInputType}
                    onChange={(e) => setAnswerInputType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-softwhite text-xs focus:outline-none focus:border-cyan-400"
                  >
                    <option value="voice">Voice + Speech to Text</option>
                    <option value="text">Direct Text Typing</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Privacy, Consent & Proctoring Notice */}
            <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-navy-700 space-y-3">
              <h2 className="text-xs font-bold text-softwhite uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>3. Consent, Proctoring & Integrity Ethics</span>
              </h2>

              <p className="text-xs text-muted leading-relaxed">
                InterviewMate AI uses non-invasive integrity logging to verify academic authenticity.
                Tab visibility switches and window focus changes are logged as review signals for recruiters.
                <strong> Facial appearance, skin tone, or accents are NEVER used in evaluation scoring.</strong>
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <label className="flex items-center gap-2.5 text-xs text-softwhite cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={enableCamera}
                    onChange={(e) => setEnableCamera(e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-500 focus:ring-0 bg-navy-900 border-navy-700"
                  />
                  <span>Enable live webcam preview check</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-softwhite cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={enableRecording}
                    onChange={(e) => setEnableRecording(e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-500 focus:ring-0 bg-navy-900 border-navy-700"
                  />
                  <span>Save session recording locally in IndexedDB</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Col: Hardware Test Preview & Launch CTA */}
          <div className="space-y-5">
            <div className="glass-panel p-5 rounded-3xl border border-navy-700 flex flex-col items-center text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted mb-3">
                Webcam & Audio Sensory Check
              </span>

              {/* Video Preview Box */}
              <div className="w-full aspect-video rounded-2xl bg-navy-900 border border-navy-700 overflow-hidden relative flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${cameraActive ? "block" : "hidden"}`}
                />

                {!cameraActive && (
                  <div className="flex flex-col items-center justify-center p-4">
                    <Camera className="w-8 h-8 text-muted/60 mb-2" />
                    <span className="text-xs text-muted">Camera preview inactive</span>
                  </div>
                )}

                {cameraActive && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono flex items-center gap-1 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Cam Active</span>
                  </div>
                )}
              </div>

              {/* Mic Audio Level Meter */}
              <div className="w-full mt-3">
                <div className="flex justify-between text-[11px] text-muted mb-1">
                  <span className="flex items-center gap-1">
                    <Mic className="w-3 h-3 text-cyan-400" />
                    <span>Mic Input Level</span>
                  </span>
                  <span>{micLevel}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-navy-900 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-100"
                    style={{ width: `${micLevel}%` }}
                  />
                </div>
              </div>

              {cameraError && (
                <div className="w-full mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] text-left">
                  {cameraError}
                </div>
              )}

              <button
                type="button"
                onClick={handleTestHardware}
                className="w-full mt-4 py-2 px-3 rounded-xl text-xs font-semibold bg-navy-800 hover:bg-navy-700 text-cyan-300 border border-navy-700 transition-colors"
              >
                {cameraActive ? "Re-Test Camera & Mic" : "Test Camera & Microphone"}
              </button>
            </div>

            {/* Launch CTA */}
            <div className="glass-panel p-5 rounded-3xl border border-cyan-500/30 text-center">
              <InterviewMateBot size="sm" state="speaking" />
              <h3 className="text-sm font-bold text-softwhite mt-2">
                Ready to Join InterviewMateBot?
              </h3>
              <p className="text-[11px] text-muted mt-1">
                Your responses will be recorded and scored under the 5-factor rubric.
              </p>

              <button
                type="button"
                onClick={handleLaunchInterview}
                className="w-full mt-4 py-3 px-4 rounded-xl text-xs font-semibold bg-cyan-500 text-navy-950 hover:bg-cyan-400 shadow-neon-cyan transition-all flex items-center justify-center gap-2"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Enter Live Interview Room</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

export default function InterviewSetupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-navy-950">
          <InterviewMateBot size="sm" state="thinking" />
        </div>
      }
    >
      <SetupContent />
    </Suspense>
  );
}
