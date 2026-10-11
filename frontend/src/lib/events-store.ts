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
  status: "upcoming" | "completed" | "ACTIVE" | "SOLD_OUT";
  category?: string;
  isPublished?: boolean; // true = visible on public portal, false = draft/unreleased
  memberPrice?: number;
  guestPrice?: number;
  totalSeats?: number;
  seatsSold?: number;
  highlights?: string[];
}

const EVENTS_STORAGE_KEY = "skyline_shared_events";

export const DEFAULT_PRESIDENT_EVENTS: PublicEvent[] = [
  {
    id: "EVT-001",
    title: "Skyline Tech & Design Summit 2026",
    description: "A full-day hands-on summit covering product thinking, UI systems, and full-stack architecture with industry alumni.",
    date: "October 24, 2026",
    time: "10:00 AM - 5:00 PM IST",
    venue: "Main Auditorium, Central Campus",
    tickets: 108,
    capacity: 120,
    totalSeats: 120,
    seatsSold: 108,
    price: 250,
    guestPrice: 250,
    memberPrice: 0,
    revenue: "₹19,500",
    status: "upcoming",
    category: "Workshop",
    isPublished: true,
    highlights: ["3 Keynote Talks", "Design Review Panels", "Networking Lunch", "Certificate of Participation"],
  },
  {
    id: "EVT-002",
    title: "Acoustic Sunset Jam & Open Mic",
    description: "Unwind with poetry, acoustic jams, and coffee on the Student Center terrace. Performers and listeners welcome.",
    date: "November 02, 2026",
    time: "5:30 PM - 8:30 PM IST",
    venue: "Open Air Amphitheatre",
    tickets: 80,
    capacity: 80,
    totalSeats: 80,
    seatsSold: 80,
    price: 150,
    guestPrice: 150,
    memberPrice: 50,
    revenue: "₹8,000",
    status: "upcoming",
    category: "Cultural & Arts",
    isPublished: true,
    highlights: ["Live Unplugged Sets", "Complimentary Hot Cocoa", "Open Mic Stage Slots"],
  },
  {
    id: "EVT-003",
    title: "Annual General Body Assembly & Elections",
    description: "Constitutional briefing, annual financial transparency reporting by the Treasurer, and voting for vacant executive council portfolios.",
    date: "October 18, 2026",
    time: "3:00 PM - 6:00 PM IST",
    venue: "Council Hall B",
    tickets: 155,
    capacity: 200,
    totalSeats: 200,
    seatsSold: 155,
    price: 0,
    guestPrice: 0,
    memberPrice: 0,
    revenue: "₹0",
    status: "upcoming",
    category: "Governance",
    isPublished: false, // Draft by default
    highlights: ["Constitutional Amendments", "Financial Audit Presentation", "Executive Council Election"],
  },
];

/**
 * Reads events from localStorage or returns default president events if none saved.
 */
export function getStoredEvents(): PublicEvent[] {
  if (typeof window === "undefined") {
    return DEFAULT_PRESIDENT_EVENTS;
  }
  try {
    const raw = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (!raw) {
      // Seed with default events on first load
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(DEFAULT_PRESIDENT_EVENTS));
      return DEFAULT_PRESIDENT_EVENTS;
    }
    const parsed = JSON.parse(raw) as PublicEvent[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return DEFAULT_PRESIDENT_EVENTS;
    }
    return parsed;
  } catch {
    return DEFAULT_PRESIDENT_EVENTS;
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
    window.dispatchEvent(new StorageEvent("storage", { key: EVENTS_STORAGE_KEY }));
  } catch (err) {
    console.error("Failed to store events:", err);
  }
}

/**
 * Toggle publish status of an event
 */
export function toggleEventPublish(id: string): PublicEvent[] {
  const events = getStoredEvents();
  const updated = events.map((ev) => {
    if (ev.id === id) {
      const current = ev.isPublished !== false;
      return { ...ev, isPublished: !current };
    }
    return ev;
  });
  saveStoredEvents(updated);
  return updated;
}

