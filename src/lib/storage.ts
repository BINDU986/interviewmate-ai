import {
  AuthUser,
  Campaign,
  InterviewSession,
  ResumeDocument,
  RepeatTestItem,
  SystemSettings,
  InterviewQuestion,
} from "./types";

const DB_NAME = "InterviewMateAI_DB";
const DB_VERSION = 1;
const RECORDINGS_STORE = "session_recordings";

// Open or initialize IndexedDB for media recordings
function openMediaDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return reject(new Error("IndexedDB not supported in this environment"));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(RECORDINGS_STORE)) {
        db.createObjectStore(RECORDINGS_STORE, { keyPath: "sessionId" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Media recording storage functions
export async function saveSessionRecording(
  sessionId: string,
  blob: Blob,
  metadata?: Record<string, unknown>
): Promise<boolean> {
  try {
    const db = await openMediaDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(RECORDINGS_STORE, "readwrite");
      const store = tx.objectStore(RECORDINGS_STORE);
      const record = {
        sessionId,
        blob,
        timestamp: new Date().toISOString(),
        mimeType: blob.type,
        size: blob.size,
        metadata,
      };
      const req = store.put(record);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("Could not save to IndexedDB, fallback:", err);
    return false;
  }
}

export async function getSessionRecording(
  sessionId: string
): Promise<{ blob: Blob; mimeType: string; timestamp: string } | null> {
  try {
    const db = await openMediaDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(RECORDINGS_STORE, "readonly");
      const store = tx.objectStore(RECORDINGS_STORE);
      const req = store.get(sessionId);
      req.onsuccess = () => {
        if (req.result) {
          resolve(req.result);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("Could not retrieve recording from IndexedDB:", err);
    return null;
  }
}

export async function deleteSessionRecording(sessionId: string): Promise<boolean> {
  try {
    const db = await openMediaDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(RECORDINGS_STORE, "readwrite");
      const store = tx.objectStore(RECORDINGS_STORE);
      const req = store.delete(sessionId);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("Could not delete from IndexedDB:", err);
    return false;
  }
}

// LocalStorage helpers for demo persistence with graceful fallback
const STORAGE_KEYS = {
  USER: "interviewmate_auth_user",
  CAMPAIGNS: "interviewmate_campaigns",
  SESSIONS: "interviewmate_sessions",
  RESUMES: "interviewmate_resumes",
  REPEAT_TESTS: "interviewmate_repeat_tests",
  QUESTIONS: "interviewmate_questions",
  SETTINGS: "interviewmate_settings",
};

export const LocalStore = {
  getAuthUser(): AuthUser | null {
    if (typeof window === "undefined") return null;
    try {
      const item = localStorage.getItem(STORAGE_KEYS.USER);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  setAuthUser(user: AuthUser | null): void {
    if (typeof window === "undefined") return;
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch (e) {
      console.warn("Failed to set auth user", e);
    }
  },

  getCampaigns(): Campaign[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveCampaigns(campaigns: Campaign[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
  },

  getSessions(): InterviewSession[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveSessions(sessions: InterviewSession[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  },

  getResumes(): ResumeDocument[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RESUMES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveResumes(resumes: ResumeDocument[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.RESUMES, JSON.stringify(resumes));
  },

  getRepeatTests(): RepeatTestItem[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REPEAT_TESTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveRepeatTests(items: RepeatTestItem[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.REPEAT_TESTS, JSON.stringify(items));
  },

  getCustomQuestions(): InterviewQuestion[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveCustomQuestions(questions: InterviewQuestion[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  },

  getSettings(): SystemSettings {
    const defaults: SystemSettings = {
      geminiApiKey: "",
      voiceSpeed: 1.0,
      voicePitch: 1.0,
      languagePreference: "en",
      theme: "dark",
      rubricWeights: {
        technicalCorrectness: 35,
        relevanceCompleteness: 25,
        problemSolvingReasoning: 20,
        communicationClarity: 10,
        practicalApplication: 10,
      },
      isDemoMode: true,
      enableCameraCheck: true,
      enableIntegrityMonitoring: true,
    };
    if (typeof window === "undefined") return defaults;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...defaults, ...JSON.parse(data) } : defaults;
    } catch {
      return defaults;
    }
  },

  saveSettings(settings: SystemSettings): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  clearAllData(): void {
    if (typeof window === "undefined") return;
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  },
};
