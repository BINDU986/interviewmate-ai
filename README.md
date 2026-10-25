# InterviewMate AI — Your Intelligent Interview Partner

> **Tagline:** *"Meet Your Potential. Master Your Interview."*

InterviewMate AI is a modern, full-cycle recruitment and interview practice platform engineered with Next.js 15 App Router, TypeScript, Tailwind CSS, and Google Gemini integration. Featuring the single unified **`InterviewMateBot`** mascot, the application delivers standardized, evidence-grounded candidate evaluations across student and recruiter portals.

---

## 🚀 Key Features

1. **Single Unified Mascot — `InterviewMateBot`**
   - Professional robot character with rounded futuristic chassis, expressive LED eyes, animated mouth waveform, and pulsing acoustic soundwaves.
   - Smooth Framer Motion and lightweight CSS/SVG animations across 7 reactive states: `idle`, `greeting`, `speaking`, `listening`, `thinking`, `success`, and `completed`.
   - Used consistently across landing, candidate lobby, interview room, dashboards, and documentation.

2. **Two Completely Separate Portals**
   - **Student Portal:** Candidate Lobby (`/candidate`), Available Drives (`/dashboard`), Resume Studio (`/resume`), Interview Setup (`/interview/setup`), Live Interview Room (`/interview/room`), Scorecards (`/scorecards`), Profile (`/profile`).
   - **Interviewer & Recruiter Portal:** Recruiter Overview (`/interviewer`), Campaigns & Deadlines (`/campaigns`), Candidate Submissions (`/submissions`), Question Lab (`/questions`), Coding Lab (`/coding`), Repeat Testing (`/repeat-test`), Academic Documentation (`/documentation`), Settings (`/settings`).

3. **Gmail Registration & 1-Click Instant Demo Login**
   - Configurable Google OAuth support via environment variables.
   - Built-in Instant 1-Click Demo Accounts for **Student (Alex Rivera, 22CS108)** and **Recruiter (Dr. Marcus Vance, REC-9042)** for immediate demonstration without external credentials.
   - Server-enforced role permissions (students cannot access recruiter console; recruiters cannot modify candidate submissions unauthorized).

4. **Resume Studio (PDF & DOCX Parsing)**
   - Upload PDF and DOCX files with progress indicator and text extraction preview.
   - Editable fields: Personal Details, Skills, Education, Projects, Experience, and Certifications.
   - Verification Score (0-100) with transparent evidence audit trail.
   - Missing competencies recommendation & resume-grounded AI question generation.
   - Two pre-seeded fictional sample resumes: Alex Rivera (Frontend) & Priya Sharma (AI/ML).
   - Exportable PDF resume analysis report.

5. **Live Multilingual Interview Room**
   - Interactive `InterviewMateBot` interviewer with real-time speech synthesis (TTS) and speech recognition (STT) in English, Telugu, and Hindi, with seamless direct text fallback.
   - 5 structured stages: HR Introduction, Resume-based questions, Technical depth, Coding challenge, Situational engineering.
   - Countdown timer, conversation transcript, question replay, and pause controls.

6. **Consent-Based Proctoring & Integrity Signals**
   - Live camera preview and microphone audio-level meter.
   - Optional local MediaRecorder session recording stored securely in IndexedDB.
   - Non-punitive review signal logging for tab switches (`visibilitychange`), window blur/focus, and copy/paste actions.
   - Ethical constraint: Appearance, facial expressions, and accents are NEVER used in evaluation scoring.

7. **5-Factor Rubric Evaluation & Repeat Testing**
   - Evaluates: Technical Correctness (35%), Relevance & Completeness (25%), Problem Solving (20%), Communication Clarity (10%), and Practical Application (10%).
   - Score out of 100 with identified strengths, missing concepts, and AI model improved answers.
   - **Repeat-Testing Lab:** Re-test identical questions to measure score gains (+/- %) and feedback retention.

8. **Coding Lab Assessment Sandbox**
   - Interactive code editor supporting JavaScript, Python, and TypeScript.
   - Automated sample test case execution with runtime benchmarking and AI algorithmic complexity analysis.

9. **Academic Documentation Studio**
   - Exports complete capstone project reports containing all 8 mandatory university sections in exact order:
     1. Introduction to the Chatbot
     2. Resume Upload & Verification
     3. Procedure & Workflow
     4. Prompts Used for AI Interviewing
     5. Interview Questions & Answers Log
     6. Repeated Question Testing
     7. Final Selection Decision & Assessment
     8. Screenshots & Verification Checklist
   - 1-Click exports to both **PDF** and **DOCX** formats.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 15.1.7 (App Router)
- **Language:** TypeScript 5.7 (Strict type checking)
- **Styling:** Tailwind CSS 3.4 & Custom Glassmorphic Design System
- **Mascot & Motion:** Framer Motion 12 & Custom SVG reactive animations
- **Analytics & Visuals:** Recharts 2.15 (Radar & Bar charts) & Canvas Confetti
- **Document Generation:** jsPDF, jsPDF-AutoTable, and `docx`
- **Storage:** IndexedDB for media recordings & LocalStore for metadata
- **Validation:** Zod 3.24

---

## 📦 Startup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables (Optional)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Configure your keys if live external services are desired:
- `GEMINI_API_KEY`: Google Gemini 1.5 API key. *(If omitted, InterviewMate AI runs with its realistic deterministic simulation fallback)*.
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: For Google OAuth. *(If omitted, 1-Click Demo Accounts are enabled by default)*.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🎓 Academic Demonstration Guide

- **Candidate Workflow:** Click *1-Click Student Demo* on the login page → Explore Active Drives → Navigate to Resume Studio to inspect skills & download PDF analysis → Launch Interview Room with camera/mic check → Complete the 5-stage multilingual interview → Review criteria radar scorecards.
- **Recruiter Workflow:** Click *1-Click Recruiter Demo* → Review Submissions Hub → Open candidate review drawer to inspect answers, integrity signals, and update hiring decision → Explore Question Lab & Coding Lab → Enter Documentation Studio and export full 8-section DOCX and PDF reports.
