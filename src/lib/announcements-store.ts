export interface Announcement {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  date: string;
  category: string;
  badge: string;
  pin: boolean;
  isPublished: boolean;
}

const ANNOUNCEMENTS_KEY = "skyline_announcements";

/**
 * Reads announcements from localStorage.
 * Returns empty array if none exist — no built-in demo data.
 */
export function getStoredAnnouncements(): Announcement[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ANNOUNCEMENTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Announcement[];
  } catch {
    return [];
  }
}

/**
 * Persists announcements and broadcasts cross-tab update event.
 */
export function saveStoredAnnouncements(items: Announcement[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("announcements_updated"));
  } catch (err) {
    console.error("Failed to store announcements:", err);
  }
}
