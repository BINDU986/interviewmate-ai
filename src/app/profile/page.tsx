"use client";

import React, { useState } from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { useAuth } from "@/lib/auth-context";
import { InterviewMateBot } from "@/components/mascot/InterviewMateBot";
import { LocalStore } from "@/lib/storage";
import {
  User,
  GraduationCap,
  Building,
  Mail,
  Award,
  CheckCircle2,
  Save,
  Shield,
  Clock,
  Sparkles,
} from "lucide-react";

export default function StudentProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "Alex Rivera",
    email: user?.email || "alex.rivera@example.edu",
    rollNumber: (user?.profile as any)?.rollNumber || "22CS108",
    college: (user?.profile as any)?.college || "University of Technology",
    course: (user?.profile as any)?.course || "B.S. Computer Science & Engineering",
    department: (user?.profile as any)?.department || "Computer Science",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const updatedUser = {
      ...user,
      fullName: formData.fullName,
      email: formData.email,
      profile: {
        ...user.profile,
        fullName: formData.fullName,
        email: formData.email,
        rollNumber: formData.rollNumber,
        college: formData.college,
        course: formData.course,
        department: formData.department,
      },
    };
    LocalStore.setAuthUser(updatedUser as any);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <PortalLayout requiredRole="student">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-softwhite">
              Student Profile & Academic Record
            </h1>
            <p className="text-xs text-muted mt-1">
              Manage your academic credentials, verified roll number, and placement drive eligibility.
            </p>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-navy-800 hover:bg-navy-700 text-cyan-300 border border-navy-700 transition-colors"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {savedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile information updated successfully.</span>
          </div>
        )}

        {/* Profile Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-navy-700 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-violet-500 flex items-center justify-center text-xl font-bold text-navy-950 font-heading">
              {formData.fullName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-heading font-bold text-softwhite">
                  {formData.fullName}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  Student Candidate
                </span>
              </div>
              <p className="text-xs text-muted mt-1">
                Roll No: <span className="text-cyan-400 font-mono font-medium">{formData.rollNumber}</span> • {formData.college}
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-navy-700/60">
            <div>
              <label className="block text-muted mb-1 font-medium">Full Name</label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-softwhite disabled:opacity-75 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-muted mb-1 font-medium">Google Account Email</label>
              <input
                type="email"
                disabled={!isEditing}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-softwhite disabled:opacity-75 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-muted mb-1 font-medium">Student Roll / Hall Ticket No</label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-softwhite disabled:opacity-75 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-muted mb-1 font-medium">College / University</label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-softwhite disabled:opacity-75 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-muted mb-1 font-medium">Degree / Program</label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-softwhite disabled:opacity-75 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-muted mb-1 font-medium">Department</label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-softwhite disabled:opacity-75 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {isEditing && (
              <div className="sm:col-span-2 pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-cyan-500 text-navy-950 hover:bg-cyan-400 shadow-neon-cyan flex items-center gap-1.5 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </PortalLayout>
  );
}
