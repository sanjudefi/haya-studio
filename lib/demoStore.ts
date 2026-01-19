import { DemoStore, getDefaultDemoStore } from "./demoData";

const STORAGE_KEY = "haya-demo-store";

export function getDemoStore(): DemoStore {
  if (typeof window === "undefined") {
    return getDefaultDemoStore();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const defaultStore = getDefaultDemoStore();
      saveDemoStore(defaultStore);
      return defaultStore;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error loading demo store:", error);
    return getDefaultDemoStore();
  }
}

export function saveDemoStore(store: DemoStore): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (error) {
    console.error("Error saving demo store:", error);
  }
}

export function resetDemoStore(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error resetting demo store:", error);
  }
}

export interface DemoSession {
  role: "MANAGER" | "INSTRUCTOR";
  instructorId?: string;
  studioId: string;
}

const SESSION_KEY = "haya-demo-session";

export function getSession(): DemoSession | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error loading session:", error);
    return null;
  }
}

export function saveSession(session: DemoSession): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error("Error saving session:", error);
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error("Error clearing session:", error);
  }
}
