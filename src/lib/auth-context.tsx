"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthUser, StudentProfile, InterviewerProfile, UserRole } from "./types";
import { LocalStore } from "./storage";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  loginDemo: (role: UserRole) => void;
  loginWithEmail: (email: string, role: UserRole) => boolean;
  loginWithGoogle?: (role: UserRole) => Promise<boolean>;
  registerStudent: (data: Omit<StudentProfile, "id" | "createdAt">) => boolean;
  registerInterviewer: (data: Omit<InterviewerProfile, "id" | "createdAt">) => boolean;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  authError: string | null;
  setAuthError: (err: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo Pre-seeded Accounts
export const DEMO_STUDENT: AuthUser = {
  id: "cand_alex_001",
  role: "student",
  email: "alex.rivera@example.edu",
  fullName: "Alex Rivera",
  isDemo: true,
  profile: {
    id: "cand_alex_001",
    fullName: "Alex Rivera",
    email: "alex.rivera@example.edu",
    rollNumber: "22CS108",
    college: "University of Technology",
    course: "B.S. Computer Science & Engineering",
    department: "Computer Science",
    createdAt: "2026-09-01T00:00:00Z",
  },
};

export const DEMO_INTERVIEWER: AuthUser = {
  id: "rec_marcus_9042",
  role: "interviewer",
  email: "marcus.vance@nexoratech.com",
  fullName: "Dr. Marcus Vance",
  isDemo: true,
  profile: {
    id: "rec_marcus_9042",
    fullName: "Dr. Marcus Vance",
    email: "marcus.vance@nexoratech.com",
    officialEmail: "recruitment@nexoratech.com",
    organization: "Nexora Technologies",
    recruiterId: "REC-9042",
    designation: "Principal Talent Architect & Engineering Lead",
    createdAt: "2026-08-15T00:00:00Z",
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Load initial user session
    const storedUser = LocalStore.getAuthUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const loginDemo = (role: UserRole) => {
    setAuthError(null);
    const demoUser = role === "student" ? DEMO_STUDENT : DEMO_INTERVIEWER;
    setUser(demoUser);
    LocalStore.setAuthUser(demoUser);
  };

  const loginWithGoogle = async (
    role: UserRole,
    customData?: { email?: string; fullName?: string; avatarUrl?: string }
  ): Promise<boolean> => {
    setAuthError(null);
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;

    // If real Google OAuth client ID is configured and no explicit customData passed, start Google OAuth flow:
    if (clientId && !clientId.includes("your_google_client_id") && !customData && typeof window !== "undefined") {
      const redirectUri = window.location.origin + "/login";
      const scope = encodeURIComponent("email profile openid");
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${scope}&state=${role}`;
      window.location.href = authUrl;
      return true;
    }

    // Immediate Google sign-in (custom email or verified Google user profile):
    const email =
      customData?.email?.trim() ||
      (role === "student" ? "student.user@gmail.com" : "recruiter.lead@gmail.com");
    const namePart = email
      .split("@")[0]
      .replace(/[._-]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    const fullName = customData?.fullName?.trim() || namePart || "Google User";
    const avatarUrl =
      customData?.avatarUrl ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=0284c7&color=fff`;

    const googleUser: AuthUser = {
      id: `google_${Date.now()}`,
      role,
      email,
      fullName,
      isDemo: false,
      profile:
        role === "student"
          ? {
              id: `std_${Date.now()}`,
              fullName,
              email,
              rollNumber: "GOOG-" + Math.floor(1000 + Math.random() * 9000),
              college: "Google Verified Student Portal",
              course: "Computer Science & Engineering",
              department: "Technology",
              avatarUrl,
              createdAt: new Date().toISOString(),
            }
          : {
              id: `rec_${Date.now()}`,
              fullName,
              email,
              officialEmail: email,
              organization: "Google Certified Partner Organization",
              recruiterId: `G-REC-${Math.floor(1000 + Math.random() * 9000)}`,
              designation: "Technical Interviewer & Talent Specialist",
              avatarUrl,
              createdAt: new Date().toISOString(),
            },
    };

    setUser(googleUser);
    LocalStore.setAuthUser(googleUser);
    return true;
  };

  const registerStudent = (data: Omit<StudentProfile, "id" | "createdAt">): boolean => {
    setAuthError(null);
    if (!data.fullName || !data.email || !data.rollNumber || !data.college) {
      setAuthError("All student profile fields are required.");
      return false;
    }

    const newStudent: AuthUser = {
      id: `std_${Date.now()}`,
      role: "student",
      email: data.email,
      fullName: data.fullName,
      isDemo: false,
      profile: {
        ...data,
        id: `std_${Date.now()}`,
        createdAt: new Date().toISOString(),
      },
    };

    setUser(newStudent);
    LocalStore.setAuthUser(newStudent);
    return true;
  };

  const registerInterviewer = (
    data: Omit<InterviewerProfile, "id" | "createdAt">
  ): boolean => {
    setAuthError(null);
    if (!data.fullName || !data.email || !data.organization || !data.designation) {
      setAuthError("All interviewer profile fields are required.");
      return false;
    }

    const recruiterId =
      data.recruiterId || `REC-${Math.floor(1000 + Math.random() * 9000)}`;

    const newInterviewer: AuthUser = {
      id: `rec_${Date.now()}`,
      role: "interviewer",
      email: data.email,
      fullName: data.fullName,
      isDemo: false,
      profile: {
        ...data,
        recruiterId,
        id: `rec_${Date.now()}`,
        createdAt: new Date().toISOString(),
      },
    };

    setUser(newInterviewer);
    LocalStore.setAuthUser(newInterviewer);
    return true;
  };

  const loginWithEmail = (email: string, role: UserRole): boolean => {
    setAuthError(null);
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      setAuthError("Please enter a valid email address.");
      return false;
    }

    const namePart = trimmed
      .split("@")[0]
      .replace(/[._-]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    const fullName = namePart || (role === "student" ? "Student Candidate" : "Talent Recruiter");

    const emailUser: AuthUser = {
      id: `usr_${Date.now()}`,
      role,
      email: trimmed,
      fullName,
      isDemo: false,
      profile:
        role === "student"
          ? {
              id: `std_${Date.now()}`,
              fullName,
              email: trimmed,
              rollNumber: "STD-" + Math.floor(1000 + Math.random() * 9000),
              college: "School of Engineering & Computing",
              course: "B.Tech / B.S. Computer Science",
              department: "Computer Science",
              createdAt: new Date().toISOString(),
            }
          : {
              id: `rec_${Date.now()}`,
              fullName,
              email: trimmed,
              officialEmail: trimmed,
              organization: "Talent Acquisition Partner",
              recruiterId: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
              designation: "Hiring Manager & Technical Evaluator",
              createdAt: new Date().toISOString(),
            },
    };

    setUser(emailUser);
    LocalStore.setAuthUser(emailUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    LocalStore.setAuthUser(null);
    setAuthError(null);
  };

  const hasRole = (requiredRole: UserRole): boolean => {
    return !!user && user.role === requiredRole;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        loginDemo,
        loginWithEmail,
        loginWithGoogle,
        registerStudent,
        registerInterviewer,
        logout,
        hasRole,
        authError,
        setAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
