"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  HelpCircle,
  Code2,
  RefreshCw,
  BookOpen,
  Settings,
  Sparkles,
} from "lucide-react";
import { InterviewMateBot } from "../mascot/InterviewMateBot";
import { useAuth } from "@/lib/auth-context";

export const InterviewerSidebar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  const interviewerNavItems = [
    {
      label: "Recruiter Overview",
      href: "/interviewer",
      icon: LayoutDashboard,
      description: "Recruitment metrics & status",
    },
    {
      label: "Campaigns & Deadlines",
      href: "/campaigns",
      icon: Calendar,
      description: "Manage interview drives",
    },
    {
      label: "Candidate Submissions",
      href: "/submissions",
      icon: Users,
      description: "Scores, recordings & reviews",
    },
    {
      label: "Question Lab",
      href: "/questions",
      icon: HelpCircle,
      description: "AI generator & custom rubrics",
    },
    {
      label: "Coding Lab",
      href: "/coding",
      icon: Code2,
      description: "Programming assessment sandbox",
    },
    {
      label: "Repeat Testing",
      href: "/repeat-test",
      icon: RefreshCw,
      description: "Score regression comparison",
    },
    {
      label: "Academic Documentation",
      href: "/documentation",
      icon: BookOpen,
      description: "8-section PDF & DOCX export",
    },
    {
      label: "Settings & AI Provider",
      href: "/settings",
      icon: Settings,
      description: "Gemini keys & rubric weights",
    },
  ];

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:flex flex-col border-r border-navy-700/60 bg-navy-900/60 backdrop-blur-md p-4 min-h-[calc(100vh-4rem)]">
      {/* Recruiter Profile Quick Tile */}
      <div className="mb-6 p-3 rounded-2xl bg-navy-800/80 border border-violet-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 font-bold text-sm">
            {user?.fullName?.substring(0, 2).toUpperCase() || "RC"}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-softwhite truncate">
              {user?.fullName || "Recruitment Lead"}
            </h4>
            <p className="text-[11px] text-violet-400 font-mono truncate">
              ID: {(user?.profile as any)?.recruiterId || "REC-9042"}
            </p>
            <p className="text-[10px] text-muted truncate">
              {(user?.profile as any)?.organization || "Nexora Technologies"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5">
        <div className="px-3 pb-2 text-[10px] font-bold tracking-wider uppercase text-muted">
          Interviewer Console
        </div>
        {interviewerNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/interviewer" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? "bg-violet-500/15 text-violet-300 border border-violet-500/30 shadow-sm"
                  : "text-muted hover:text-softwhite hover:bg-navy-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? "text-violet-400" : "text-muted group-hover:text-softwhite"
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-neon-violet" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Mascot Assistant Mini Card */}
      <div className="mt-auto pt-4 border-t border-navy-700/60">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-navy-800 to-navy-850 border border-violet-500/20 flex items-center gap-3">
          <InterviewMateBot size="sm" state="thinking" />
          <div className="flex-1">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-softwhite">
              <Sparkles className="w-3 h-3 text-violet-400" />
              <span>InterviewMateBot</span>
            </div>
            <p className="text-[10px] text-muted leading-tight mt-0.5">
              Analyzing candidate submissions & rubrics.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
