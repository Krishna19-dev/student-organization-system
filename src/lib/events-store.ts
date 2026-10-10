export interface PublicEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  venue?: string;
  tickets: number;
  capacity: number;
  price: number;
  revenue?: string;
  status: "upcoming" | "completed";
  category?: string;
  isPublished?: boolean; // true = visible on public portal, false = draft/unreleased
}

const EVENTS_STORAGE_KEY = "skyline_shared_events";

/**
 * Reads events from localStorage or returns empty array if none created.
 * Demo/mock events are completely removed as requested.
 */
export function getStoredEvents(): PublicEvent[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as PublicEvent[];
  } catch {
    return [];
  }
}

/**
 * Saves events to localStorage and broadcasts change event for real-time sync across tabs.
 */
export function saveStoredEvents(events: PublicEvent[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
    window.dispatchEvent(new Event("events_updated"));
  } catch (err) {
    console.error("Failed to store events:", err);
  }
}
