import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "InterviewMate AI — Your Intelligent Interview Partner",
  description:
    "Meet Your Potential. Master Your Interview. Professional AI interview and recruitment management platform featuring the unified InterviewMateBot mascot, resume analysis, multilingual speech interviews, repeat testing, and academic report generation.",
  keywords: [
    "AI Interviewer",
    "Campus Placement",
    "Technical Assessment",
    "Resume Analysis",
    "Recruitment Management",
    "InterviewMate AI",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-navy-950 text-softwhite antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1 flex flex-col">{children}</div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
