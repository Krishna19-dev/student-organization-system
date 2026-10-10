export interface DemoUser {
  id?: string;
  name: string;
  email: string;
  role: "PRESIDENT" | "TREASURER" | "VP_EVENTS" | "VOLUNTEER" | "MEMBER" | "GUEST";
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
    description: "Full association control: approvals, elections, members list, orders, and system audit logs.",
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
    dashboard: "/treasurer",
    description: "Club P&L dashboard, expense claim approvals & payouts, fundraiser takings, and CSV ledger export.",
  },
  {
    id: "vp_events",
    roleName: "VP of Events",
    badge: "EVENTS & CAMPAIGNS",
    badgeColor: "bg-blue-500/20 text-blue-700 border-blue-400",
    email: "vp.events@skyline.test",
    password: "vpevents123",
    name: "Rohan Varma",
    role: "VP_EVENTS",
    dashboard: "/events-manager",
    description: "Create/edit campus events, seat capacity monitoring, attendance reports, and fundraisers.",
  },
  {
    id: "volunteer",
    roleName: "Volunteer",
    badge: "OPERATIONS CREW",
    badgeColor: "bg-amber-500/20 text-amber-700 border-amber-400",
    email: "volunteer@skyline.test",
    password: "volunteer123",
    name: "Ananya Iyer",
    role: "VOLUNTEER",
    dashboard: "/volunteer",
    description: "Assigned tasks kanban board, sponsor deliverable execution, and live QR ticket check-in scanner.",
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
    dashboard: "/member",
    description: "Digital membership card with QR token, member merch discounts, and registered event passes.",
  },
  {
    id: "applicant",
    roleName: "Membership Applicant",
    badge: "UNDER REVIEW",
    badgeColor: "bg-orange-500/20 text-orange-700 border-orange-400",
    email: "applicant@skyline.test",
    password: "applicant123",
    name: "Simran Kaur",
    role: "GUEST",
    dashboard: "/application-status",
    description: "Submitted membership application currently undergoing President review queue.",
  },
  {
    id: "guest",
    roleName: "Campus Guest",
    badge: "VISITOR",
    badgeColor: "bg-slate-500/20 text-slate-700 border-slate-400",
    email: "guest@skyline.edu",
    password: "guest123",
    name: "Demo Guest Explorer",
    role: "GUEST",
    dashboard: "/guest",
    description: "Public event ticket purchases and merchandise ordering at standard non-member rates.",
  },
];

export const GUEST_DEMO_CREDENTIALS = ALL_DEMO_ACCOUNTS[6];
export const DEMO_COOKIE_NAME = "skyline_demo_user";
export const AUTH_TOKEN_COOKIE = "token";
