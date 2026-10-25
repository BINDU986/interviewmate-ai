"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { InterviewMateBot } from "../mascot/InterviewMateBot";
import {
  LogOut,
  Moon,
  Sun,
  Shield,
  User,
  Sparkles,
  ChevronDown,
  Building,
  GraduationCap,
} from "lucide-react";
import { LocalStore } from "@/lib/storage";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isDark, setIsDark] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isStudentPortal =
    pathname.startsWith("/candidate") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/resume") ||
    pathname.startsWith("/interview") ||
    pathname.startsWith("/scorecards") ||
    pathname.startsWith("/profile");

  const isInterviewerPortal =
    pathname.startsWith("/interviewer") ||
    pathname.startsWith("/campaigns") ||
    pathname.startsWith("/submissions") ||
    pathname.startsWith("/questions") ||
    pathname.startsWith("/coding") ||
    pathname.startsWith("/repeat-test") ||
    pathname.startsWith("/documentation") ||
    pathname.startsWith("/settings");

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("light");
    }
    const settings = LocalStore.getSettings();
    settings.theme = isDark ? "light" : "dark";
    LocalStore.saveSettings(settings);
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-navy-700/60 bg-navy-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Unified Bot Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <InterviewMateBot size="sm" state="greeting" />
          <div className="flex flex-col">
            <span className="font-heading text-lg font-bold tracking-tight text-softwhite group-hover:text-cyan-400 transition-colors flex items-center gap-1.5">
              InterviewMate <span className="text-gradient-cyan-violet">AI</span>
            </span>
            <span className="text-[10px] text-muted tracking-wider uppercase font-medium">
              Your Intelligent Interview Partner
            </span>
          </div>
        </Link>

        {/* Portal Indicator Badges & Context Switcher */}
        <div className="hidden md:flex items-center gap-2">
          {isStudentPortal && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-medium">
              <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Student Portal</span>
            </div>
          )}

          {isInterviewerPortal && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-500/30 text-violet-300 text-xs font-medium">
              <Building className="w-3.5 h-3.5 text-violet-400" />
              <span>Recruiter & Placement Portal</span>
            </div>
          )}

          {user?.isDemo && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Demo Mode</span>
            </div>
          )}
        </div>

        {/* Right actions: Theme toggle & Profile */}
        <div className="flex items-center gap-3">
          {/* Quick Portal Switch Link for ease of evaluation */}
          <div className="hidden sm:flex items-center text-xs">
            {isStudentPortal ? (
              <Link
                href="/interviewer"
                className="px-2.5 py-1 text-muted hover:text-softwhite transition-colors"
              >
                Switch to Recruiter View →
              </Link>
            ) : isInterviewerPortal ? (
              <Link
                href="/candidate"
                className="px-2.5 py-1 text-muted hover:text-softwhite transition-colors"
              >
                Switch to Student View →
              </Link>
            ) : null}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-muted hover:text-softwhite hover:bg-navy-800 transition-colors"
            title="Toggle Theme"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Profile or Login CTA */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-navy-800/80 hover:bg-navy-700/80 border border-navy-700 transition-all text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-violet-500 flex items-center justify-center text-xs font-bold text-navy-950">
                  {user.fullName.substring(0, 2).toUpperCase()}
                </div>
                <div className="hidden md:flex flex-col text-xs leading-tight">
                  <span className="font-semibold text-softwhite max-w-[120px] truncate">
                    {user.fullName}
                  </span>
                  <span className="text-[10px] text-muted">
                    {user.role === "student"
                      ? (user.profile as any)?.rollNumber || "Student"
                      : (user.profile as any)?.recruiterId || "Recruiter"}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-muted" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 glass-dropdown rounded-2xl shadow-glass border border-navy-700 p-2 z-50">
                  <div className="px-3 py-2 border-b border-navy-700/60 mb-1">
                    <p className="text-xs font-medium text-softwhite">{user.fullName}</p>
                    <p className="text-[11px] text-muted truncate">{user.email}</p>
                    {user.role === "student" ? (
                      <p className="text-[10px] text-cyan-400 mt-1 font-mono">
                        Roll: {(user.profile as any)?.rollNumber} • {(user.profile as any)?.college}
                      </p>
                    ) : (
                      <p className="text-[10px] text-violet-400 mt-1 font-mono">
                        ID: {(user.profile as any)?.recruiterId} • {(user.profile as any)?.organization}
                      </p>
                    )}
                  </div>

                  <Link
                    href={user.role === "student" ? "/profile" : "/settings"}
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-muted hover:text-softwhite hover:bg-navy-800 rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4 text-cyan-400" />
                    <span>My Account & Settings</span>
                  </Link>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      logout();
                      router.push("/");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login?portal=student"
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-softwhite hover:bg-navy-800 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register?portal=student"
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-violet-500 text-navy-950 hover:brightness-110 shadow-neon-cyan transition-all"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
