"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Award,
  Users,
  Calendar,
  BookOpen,
  ShoppingBag,
  FileText,
  Receipt,
  CheckSquare,
  QrCode,
  CreditCard,
  Ticket,
  ChevronRight,
  Bell,
  Search,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Wallet,
  Megaphone,
  HandCoins,
  ClipboardList,
  Gavel,
  Activity,
} from "lucide-react";
import { logoutAction } from "@/app/login/actions";

export type DashboardRole =
  | "PRESIDENT"
  | "TREASURER"
  | "VOLUNTEER"
  | "MEMBER"
  | "GUEST";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_CONFIG: Record<DashboardRole, NavSection[]> = {
  PRESIDENT: [
    {
      title: "EXECUTIVE DESK",
      items: [
        { label: "Admin Home", href: "/admin", icon: LayoutDashboard },
        { label: "Members Roster", href: "/admin/members", icon: Users },
        { label: "Role Assignments", href: "/admin/roles", icon: Gavel },
        { label: "Audit Logs", href: "/admin/audit", icon: Activity, badge: "AUDIT", badgeColor: "bg-teal-500/20 text-teal-700" },
      ],
    },
    {
      title: "CAMPUS EVENTS & PROGRAMS",
      items: [
        { label: "Manage Events", href: "/admin/events", icon: Calendar },
        { label: "Create Event", href: "/admin/events/new", icon: LayoutDashboard },
        { label: "Event Tasks", href: "/admin/events/EVT-001/tasks", icon: ClipboardList },
        { label: "Event Reports & P&L", href: "/admin/events/EVT-001/report", icon: Activity },
        { label: "Compose Bulletin", href: "/admin/announcements/new", icon: Megaphone },
      ],
    },
    {
      title: "OPERATIONS & SPONSORS",
      items: [
        { label: "Volunteer Crew", href: "/admin/volunteers", icon: Users },
        { label: "Campaign Fundraisers", href: "/admin/fundraisers", icon: HandCoins },
        { label: "Merch Catalog", href: "/admin/products", icon: ShoppingBag },
        { label: "Merch Handover", href: "/admin/orders", icon: ShoppingBag },
        { label: "Sponsor Pipeline", href: "/admin/sponsors", icon: Award },
        { label: "Sponsor Deliverables", href: "/admin/deliverables", icon: ClipboardList },
        { label: "Handover Notes", href: "/admin/handover", icon: BookOpen },
      ],
    },
  ],
  TREASURER: [
    {
      title: "WORKSPACE",
      items: [
        { label: "Treasury Home", href: "/finance", icon: LayoutDashboard },
        { label: "Full Ledger", href: "/finance/ledger", icon: BookOpen, badge: "VERIFIED", badgeColor: "bg-emerald-500/20 text-emerald-700" },
      ],
    },
    {
      title: "OPERATIONS",
      items: [
        { label: "Claims Queue", href: "/finance/claims", icon: Receipt },
        { label: "Per-Event P&L", href: "/finance/events/EVT-001", icon: Calendar },
        { label: "Record Proceeds", href: "/finance/fundraisers/FND-001", icon: HandCoins },
      ],
    },
  ],
  VOLUNTEER: [
    {
      title: "WORKSPACE",
      items: [
        { label: "My Tasks", href: "/volunteer", icon: CheckSquare },
        { label: "QR Gate Scanner", href: "/volunteer?tab=scanner", icon: QrCode },
      ],
    },
    {
      title: "OPERATIONS",
      items: [
        { label: "Expense Claims", href: "/volunteer?tab=expenses", icon: Receipt },
        { label: "Volunteer Board", href: "/admin/events/EVT-001/tasks", icon: ClipboardList },
      ],
    },
  ],
  MEMBER: [
    {
      title: "WORKSPACE",
      items: [
        { label: "Member Hub", href: "/me", icon: LayoutDashboard },
        { label: "Digital ID Card", href: "/me/card", icon: CreditCard },
        { label: "Membership Plan", href: "/me/membership", icon: ShieldCheck },
        { label: "My Passes", href: "/me/tickets", icon: Ticket },
        { label: "My Orders", href: "/me/orders", icon: ShoppingBag },
      ],
    },
    {
      title: "EXPLORE",
      items: [
        { label: "Events", href: "/events", icon: Calendar },
        { label: "Club Shop", href: "/shop", icon: ShoppingBag },
        { label: "Announcements", href: "/announcements", icon: Megaphone },
      ],
    },
  ],
  GUEST: [
    {
      title: "GUEST DESK",
      items: [
        { label: "Guest Hub", href: "/me", icon: LayoutDashboard },
        { label: "My Passes", href: "/me/tickets", icon: Ticket },
        { label: "My Orders", href: "/me/orders", icon: ShoppingBag },
      ],
    },
    {
      title: "EXPLORE",
      items: [
        { label: "Events", href: "/events", icon: Calendar },
        { label: "Club Shop", href: "/shop", icon: ShoppingBag },
        { label: "Announcements", href: "/announcements", icon: Megaphone },
      ],
    },
  ],
};

const ROLE_META: Record<DashboardRole, { title: string; subtitle: string; color: string; initials: string }> = {
  PRESIDENT: { title: "Skyline ", subtitle: "President Portal", color: "bg-purple-600", initials: "PR" },
  TREASURER: { title: "Skyline ", subtitle: "Treasurer Portal", color: "bg-emerald-600", initials: "TR" },
  VOLUNTEER: { title: "Skyline ", subtitle: "Volunteer Portal", color: "bg-amber-600", initials: "VO" },
  MEMBER: { title: "Skyline ", subtitle: "Member Portal", color: "bg-teal-600", initials: "MB" },
  GUEST: { title: "Skyline ", subtitle: "Guest Portal", color: "bg-slate-600", initials: "GU" },
};

interface DashboardLayoutProps {
  role: DashboardRole;
  breadcrumb?: { label: string; href?: string }[];
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export default function DashboardLayout({
  role,
  breadcrumb = [],
  title,
  subtitle,
  actions,
  children,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sections = NAV_CONFIG[role] ?? [];
  const meta = ROLE_META[role];

  useEffect(() => {
    const allCookies = document.cookie.split("; ");
    const found = allCookies.find((c) => c.startsWith("skyline_demo_user="));
    if (found) {
      try {
        const decoded = decodeURIComponent(found.split("=").slice(1).join("="));
        setUser(JSON.parse(decoded));
      } catch {
        setUser(null);
      }
    }
  }, [pathname]);

  const userInitials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : meta.initials;

  const fullBreadcrumb = [
    { label: "Skyline SSA" },
    ...breadcrumb,
    { label: title },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex overflow-hidden bg-[#F8F5F9]">
      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-52 flex flex-col
          bg-[#4A1942] text-white transition-transform duration-300
          lg:relative lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* App Brand */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
          <div className={`w-9 h-9 rounded-lg ${meta.color} flex items-center justify-center font-black text-sm shrink-0 shadow-inner`}>
            S
          </div>
          <div className="min-w-0">
            <div className="font-black text-sm text-white leading-tight truncate">{meta.title}</div>
            <div className="text-[10px] text-white/50 truncate">{meta.subtitle}</div>
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/10 bg-white/5">
          <div className={`w-8 h-8 rounded-full ${meta.color} flex items-center justify-center text-xs font-black shrink-0`}>
            {userInitials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-white truncate leading-tight">
              {user?.name ?? "Loading…"}
            </div>
            <div className="text-[10px] text-white/50 truncate">{user?.email ?? ""}</div>
          </div>
          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase shrink-0 ${meta.color} text-white`}>
            {role.split("_")[0]}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2 scrollbar-hide">
          {sections.map((section) => (
            <div key={section.title} className="mb-1">
              <div className="px-4 pt-3 pb-1 text-[9px] font-black tracking-widest text-white/40 uppercase">
                {section.title}
              </div>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href.split("?")[0]) && item.href.split("?")[0].length > 1);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center gap-6.5 px-4 py-2 mx-2 my-2 rounded-lg text-xs font-medium transition-all group
                      ${isActive
                        ? "bg-[#4A1942] text-[#FFF] font-bold shadow-sm"
                        : "text-white/75 hover:bg-white/10 hover:text-white"
                      }
                    `}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-[#fff]" : "text-white/60 group-hover:text-white"}`} />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom Links */}
        <div className="border-t border-white/10 py-2">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-4 py-2 mx-2 rounded-lg text-xs text-white/60 hover:bg-white/10 hover:text-white transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            <span>View Public Portal</span>
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-2.5 px-4 py-2 mx-2 rounded-lg text-xs text-white/60 hover:bg-red-500/20 hover:text-red-300 transition-all"
              style={{ width: "calc(100% - 1rem)" }}
            >
              <div className={`w-6 h-6 rounded-full ${meta.color} flex items-center justify-center text-[9px] font-black shrink-0`}>
                {userInitials}
              </div>
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main Area ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top Bar */}
        <header className="shrink-0 h-13 bg-white border-b border-gray-200 flex items-center px-4 gap-3 z-20 shadow-sm">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-all"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-xs text-gray-400 flex-1 min-w-0">
            {fullBreadcrumb.map((crumb, i) => (
              <React.Fragment key={i}>
                {i > 0 && <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" />}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-[#4A1942] transition-colors truncate">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={i === fullBreadcrumb.length - 1 ? "text-gray-700 font-semibold truncate" : "truncate"}>
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 w-56">
            <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search records or IDs…"
              className="bg-transparent text-xs text-gray-600 placeholder-gray-400 outline-none w-full"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-all">
            <Bell className="w-4 h-4 text-gray-500" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#017E84]" />
          </button>

          {/* User Avatar */}
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full ${meta.color} flex items-center justify-center text-[10px] font-black text-white`}>
              {userInitials}
            </div>
            <span className="hidden sm:block text-xs font-semibold text-gray-700 truncate max-w-24">
              {user?.name?.split(" ")[0] ?? "User"}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Inner Page Header */}
          <div className="bg-white border-b border-gray-100 px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-xl font-black text-gray-900 tracking-tight">{title}</h1>
                {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
              </div>
              {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
