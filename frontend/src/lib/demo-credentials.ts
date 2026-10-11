export interface DemoUser {
  id?: string;
  name: string;
  email: string;
  role: "PRESIDENT" | "TREASURER" | "VOLUNTEER" | "MEMBER" | "GUEST";
  status?: string;
  positionTitle?: string | null;
  token?: string;
  dashboard?: string;
}

export interface DemoCredentialItem {
  id: string;
  roleName: string;
  badge: string;
  badgeColor: string;
  email: string;
  password: string;
  name: string;
  role: DemoUser["role"];
  dashboard: string;
  description: string;
}

export const ALL_DEMO_ACCOUNTS: DemoCredentialItem[] = [
  {
    id: "president",
    roleName: "President (Admin)",
    badge: "EXECUTIVE ADMIN",
    badgeColor: "bg-purple-500/20 text-purple-700 border-purple-400",
    email: "president@skyline.test",
    password: "admin123",
    name: "Arjun Mehta",
    role: "PRESIDENT",
    dashboard: "/admin",
    description: "Full association control: approvals, events, members, fundraisers, orders, and system audit logs.",
  },
  {
    id: "treasurer",
    roleName: "Treasurer",
    badge: "FINANCE & LEDGER",
    badgeColor: "bg-emerald-500/20 text-emerald-700 border-emerald-400",
    email: "treasurer@skyline.test",
    password: "treasurer123",
    name: "Priya Sharma",
    role: "TREASURER",
    dashboard: "/finance",
    description: "Club P&L dashboard, expense claim approvals & payouts, fundraiser takings, and CSV ledger export.",
  },
  {
    id: "volunteer",
    roleName: "Volunteer Officer",
    badge: "VOLUNTEER DESK",
    badgeColor: "bg-amber-500/20 text-amber-700 border-amber-400",
    email: "volunteer@skyline.test",
    password: "volunteer123",
    name: "Rohan Varma",
    role: "VOLUNTEER",
    dashboard: "/volunteer",
    description: "Volunteer task board, QR ticket scanner, and expense reimbursement claims.",
  },
  {
    id: "member",
    roleName: "Active Member",
    badge: "VERIFIED MEMBER",
    badgeColor: "bg-teal-500/20 text-teal-700 border-teal-400",
    email: "member1@skyline.test",
    password: "member123",
    name: "Dev Patel",
    role: "MEMBER",
    dashboard: "/me",
    description: "Digital membership card with QR token, member merch discounts, and registered event passes.",
  },
  {
    id: "guest",
    roleName: "Guest Visitor",
    badge: "VISITOR PASS",
    badgeColor: "bg-slate-500/20 text-slate-700 border-slate-400",
    email: "guest@skyline.test",
    password: "guest123",
    name: "Visitor Guest",
    role: "GUEST",
    dashboard: "/me",
    description: "Access event ticketing and merchandise orders without paying membership fees.",
  },
];

export const GUEST_DEMO_CREDENTIALS: DemoCredentialItem =
  ALL_DEMO_ACCOUNTS.find((a) => a.id === "guest") || ALL_DEMO_ACCOUNTS[4];
export const DEMO_COOKIE_NAME = "skyline_demo_user";
export const AUTH_TOKEN_COOKIE = "token";

