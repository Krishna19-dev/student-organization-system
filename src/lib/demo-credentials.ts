export interface DemoUser {
  name: string;
  email: string;
  role: "GUEST" | "MEMBER" | "VOLUNTEER" | "TREASURER" | "ADMIN";
}

export const GUEST_DEMO_CREDENTIALS = {
  email: "guest@skyline.edu",
  password: "guest123",
  name: "Demo Guest Explorer",
  role: "GUEST" as const,
  description: "Official Guest Demo Account for exploring public event tickets, campus announcements, and merchandise.",
};

export const ADMIN_DEMO_CREDENTIALS = {
  email: "admin@skyline.edu",
  password: "admin123",
  name: "Krishna Choudhary",
  role: "ADMIN" as const,
  description: "Association President & Admin. Full access to dashboard, members, events, merch, and ledger.",
};

export const DEMO_COOKIE_NAME = "skyline_demo_user";
