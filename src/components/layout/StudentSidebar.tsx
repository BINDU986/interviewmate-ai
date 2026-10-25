"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Briefcase,
  FileText,
  PlayCircle,
  Award,
  UserCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { InterviewMateBot } from "../mascot/InterviewMateBot";
import { useAuth } from "@/lib/auth-context";

export const StudentSidebar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  const studentNavItems = [
    {
      label: "Candidate Lobby",
      href: "/candidate",
      icon: Compass,
      description: "Overview & active drives",
    },
    {
      label: "Available Interviews",
      href: "/dashboard",
      icon: Briefcase,
      description: "Recruitment campaigns",
    },
    {
      label: "Resume Studio",
      href: "/resume",
      icon: FileText,
      description: "Upload & skill match",
    },
    {
      label: "Interview Setup & Room",
      href: "/interview/setup",
      icon: PlayCircle,
      description: "Hardware check & AI bot",
    },
    {
      label: "My Scorecards",
      href: "/scorecards",
      icon: Award,
      description: "Evaluation breakdowns",
    },
    {
      label: "Profile & Settings",
      href: "/profile",
      icon: UserCheck,
      description: "Personal academic record",
    },
  ];

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:flex flex-col border-r border-navy-700/60 bg-navy-900/60 backdrop-blur-md p-4 min-h-[calc(100vh-4rem)]">
      {/* Student Profile Quick Tile */}
      <div className="mb-6 p-3 rounded-2xl bg-navy-800/80 border border-navy-700/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm">
            {user?.fullName?.substring(0, 2).toUpperCase() || "ST"}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-softwhite truncate">
              {user?.fullName || "Student Candidate"}
            </h4>
            <p className="text-[11px] text-cyan-400 font-mono truncate">
              Roll: {(user?.profile as any)?.rollNumber || "22CS108"}
            </p>
            <p className="text-[10px] text-muted truncate">
              {(user?.profile as any)?.college || "University of Technology"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5">
        <div className="px-3 pb-2 text-[10px] font-bold tracking-wider uppercase text-muted">
          Student Navigation
        </div>
        {studentNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/candidate" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm"
                  : "text-muted hover:text-softwhite hover:bg-navy-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? "text-cyan-400" : "text-muted group-hover:text-softwhite"
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-neon-cyan" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Mascot Assistant Mini Card */}
      <div className="mt-auto pt-4 border-t border-navy-700/60">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-navy-800 to-navy-850 border border-cyan-500/20 flex items-center gap-3">
          <InterviewMateBot size="sm" state="listening" />
          <div className="flex-1">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-softwhite">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>InterviewMateBot</span>
            </div>
            <p className="text-[10px] text-muted leading-tight mt-0.5">
              Ready for your next mock session.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
