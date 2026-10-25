"use client";

import React, { useState, useEffect } from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { LocalStore } from "@/lib/storage";
import { SystemSettings } from "@/lib/types";
import {
  Settings,
  Sparkles,
  Key,
  Volume2,
  Globe2,
  Trash2,
  CheckCircle2,
  Shield,
  Save,
} from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>(LocalStore.getSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    setSettings(LocalStore.getSettings());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    LocalStore.saveSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleTestGeminiKey = async () => {
    if (!settings.geminiApiKey || settings.geminiApiKey.trim() === "") {
      setTestResult("No API key entered. Operating in realistic simulated demo mode.");
      return;
    }

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${settings.geminiApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "Hello" }] }],
          }),
        }
      );
      if (res.ok) {
        setTestResult("Google Gemini API connection successful!");
      } else {
        setTestResult("API Key invalid or quota exceeded. Safe simulation fallback active.");
      }
    } catch {
      setTestResult("Connection error. Simulation fallback active.");
    }
  };

  const handleResetData = () => {
    if (confirm("Are you sure you want to reset demo data and clear local cache?")) {
      LocalStore.clearAllData();
      alert("Local data cleared. Reloading defaults...");
      window.location.reload();
    }
  };

  return (
    <PortalLayout requiredRole="interviewer">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-softwhite">
              System Settings & AI Provider
            </h1>
            <p className="text-xs text-muted mt-1">
              Configure Google Gemini API keys, default interview language, rubric weights, and demo persistence.
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings saved successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Gemini AI API Configuration */}
          <div className="glass-panel p-6 rounded-3xl border border-navy-700 space-y-4">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-violet-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-softwhite">
                Google Gemini API Configuration
              </h3>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Optional: Enter a Google Gemini API key to activate live real-time LLM evaluations. If blank, InterviewMate AI seamlessly operates with its built-in realistic rubric simulation.
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="password"
                placeholder="AIzaSy..."
                value={settings.geminiApiKey}
                onChange={(e) => setSettings({ ...settings, geminiApiKey: e.target.value })}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-softwhite text-xs focus:outline-none focus:border-violet-400"
              />
              <button
                type="button"
                onClick={handleTestGeminiKey}
                className="px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-cyan-300 border border-navy-700 text-xs font-semibold"
              >
                Test Connection
              </button>
            </div>

            {testResult && (
              <p className="text-xs text-cyan-400 pt-1 font-mono">{testResult}</p>
            )}
          </div>

          {/* Voice & Speech Preferences */}
          <div className="glass-panel p-6 rounded-3xl border border-navy-700 space-y-4 text-xs">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-softwhite">
                Voice & Multilingual Preferences
              </h3>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-muted mb-1 font-medium">Default Language</label>
                <select
                  value={settings.languagePreference}
                  onChange={(e) => setSettings({ ...settings, languagePreference: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-softwhite"
                >
                  <option value="en">English (en-US)</option>
                  <option value="te">Telugu (te-IN)</option>
                  <option value="hi">Hindi (hi-IN)</option>
                </select>
              </div>

              <div>
                <label className="block text-muted mb-1 font-medium">Voice Speed ({settings.voiceSpeed}x)</label>
                <input
                  type="range"
                  min="0.8"
                  max="1.2"
                  step="0.1"
                  value={settings.voiceSpeed}
                  onChange={(e) => setSettings({ ...settings, voiceSpeed: Number(e.target.value) })}
                  className="w-full mt-2"
                />
              </div>

              <div>
                <label className="block text-muted mb-1 font-medium">Voice Pitch ({settings.voicePitch})</label>
                <input
                  type="range"
                  min="0.8"
                  max="1.2"
                  step="0.1"
                  value={settings.voicePitch}
                  onChange={(e) => setSettings({ ...settings, voicePitch: Number(e.target.value) })}
                  className="w-full mt-2"
                />
              </div>
            </div>
          </div>

          {/* Data Reset & Demo Controls */}
          <div className="glass-panel p-6 rounded-3xl border border-red-500/20 space-y-3 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-400">
              Demo Data & Storage Reset
            </h3>
            <p className="text-muted leading-relaxed">
              Clear IndexedDB audio/video recordings and reset sample campaigns, fictional resumes, and repeat tests to initial state.
            </p>
            <button
              type="button"
              onClick={handleResetData}
              className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-semibold"
            >
              Reset All Demo Data
            </button>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-violet-500 text-white font-semibold text-xs hover:bg-violet-400 shadow-neon-violet flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save System Settings</span>
            </button>
          </div>
        </form>
      </div>
    </PortalLayout>
  );
}
