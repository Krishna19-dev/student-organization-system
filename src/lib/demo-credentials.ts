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

export const DEMO_COOKIE_NAME = "skyline_demo_user";
