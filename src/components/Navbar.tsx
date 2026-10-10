"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Compass, 
  Menu, 
  X, 
  Calendar, 
  Megaphone, 
  ShoppingBag, 
  ShieldCheck, 
  Info, 
  LogIn, 
  Sparkles,
  LogOut,
  User,
  ChevronDown,
  Shield,
  Ticket,
} from "lucide-react";
import { DEMO_COOKIE_NAME } from "@/lib/demo-credentials";

const NAV_ITEMS = [
  { name: "Home", href: "/", icon: Compass },
  { name: "Events", href: "/events", icon: Calendar },
  { name: "Announcements", href: "/announcements", icon: Megaphone },
  { name: "Merch Store", href: "/merch", icon: ShoppingBag },
  { name: "Membership", href: "/membership", icon: ShieldCheck },
  { name: "About", href: "/about", icon: Info },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [demoUser, setDemoUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    // Clear the demo session cookie client-side
    document.cookie = `${DEMO_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
    setDemoUser(null);
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    router.push("/login?loggedOut=true");
    router.refresh();
  };

  useEffect(() => {
    // Read skyline_demo_user cookie client-side
    const allCookies = document.cookie.split("; ");
    const found = allCookies.find((c) => c.startsWith("skyline_demo_user="));
    if (found) {
      try {
        const decoded = decodeURIComponent(found.split("=")[1]);
        setDemoUser(JSON.parse(decoded));
      } catch {
        setDemoUser(null);
      }
    } else {
      setDemoUser(null);
    }
  }, [pathname]);

  // Click outside to close user dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Do not render public Navbar on Admin panel pages (Must be AFTER all hooks)
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const getInitial = (name?: string) => {
    if (!name) return "G";
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 bg-primary text-white shadow-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-secondary rounded-lg px-1 py-1"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-hover border border-primary-light/20 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-secondary-light" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight block leading-tight">
                Skyline
              </span>
              <span className="text-xs text-primary-light/80 font-medium tracking-wide block">
                Student Association
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary-hover text-white shadow-sm ring-1 ring-secondary/50"
                      : "text-primary-light hover:text-white hover:bg-primary-hover/60"
                  }`}
                >
                  <Icon className="w-4 h-4 opacity-80" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {demoUser ? (
              <div className="relative" ref={dropdownRef}>
                {/* User Trigger Pill (exact design pattern from reference screenshot) */}
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-3 p-1.5 pr-2.5 rounded-full hover:bg-primary-hover/80 transition-colors border border-primary-light/20 focus:outline-none focus:ring-2 focus:ring-secondary/50 text-left"
                  aria-expanded={userDropdownOpen}
                >
                  {/* Avatar Circle */}
                  <div className="w-9 h-9 rounded-full bg-surface text-primary font-bold text-sm flex items-center justify-center shadow-sm shrink-0">
                    {getInitial(demoUser.name)}
                  </div>

                  {/* Name, Role & ID */}
                  <div className="leading-tight">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-white">
                        {demoUser.name.split(" ")[0]}
                      </span>
                      <span className="badge-info text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase">
                        {demoUser.role}
                      </span>
                    </div>
                    <span className="text-[10px] text-primary-light/80 font-mono tracking-wider block mt-0.5">
                      SKY-2026-DEMO
                    </span>
                  </div>

                  {/* Chevron Down */}
                  <ChevronDown className={`w-4 h-4 text-primary-light transition-transform duration-200 ${
                    userDropdownOpen ? "rotate-180" : ""
                  }`} />
                </button>

                {/* Floating User Dropdown Menu Card */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-surface text-body rounded-2xl shadow-xl border border-gray-subtle py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {/* Header info */}
                    <div className="px-4 py-3 border-b border-gray-subtle space-y-1">
                      <div className="font-bold text-sm text-body">{demoUser.name}</div>
                      <div className="text-xs text-muted font-medium truncate">{demoUser.email}</div>
                      <div className="flex items-center gap-2 pt-1 text-[11px] text-muted">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary" />
                        <span>Campus Explorer</span>
                        <span>•</span>
                        <span className="font-mono text-[10px]">SKY-2026-DEMO</span>
                      </div>
                    </div>

                    {/* Nav Links */}
                    <div className="py-1">
                      {demoUser.role === "ADMIN" && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-primary hover:bg-primary-light transition-colors"
                        >
                          <Shield className="w-4 h-4 text-primary" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-body hover:bg-page transition-colors"
                      >
                        <User className="w-4 h-4 text-secondary" />
                        <span>My Profile (Tickets &amp; Merch)</span>
                      </Link>

                      <Link
                        href="/events"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-body hover:bg-page transition-colors"
                      >
                        <Ticket className="w-4 h-4 text-primary" />
                        <span>Explore Event Tickets</span>
                      </Link>

                      <Link
                        href="/membership"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-body hover:bg-page transition-colors"
                      >
                        <Shield className="w-4 h-4 text-secondary" />
                        <span>Membership &amp; Upgrade</span>
                      </Link>
                    </div>

                    {/* Divider & Log Out */}
                    <div className="border-t border-gray-subtle pt-1 mt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-status-danger hover:bg-status-danger-light transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4 text-status-danger" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-lg text-white hover:bg-primary-hover transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/membership"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-secondary hover:bg-secondary-hover text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-secondary/50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Join Skyline</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {!demoUser ? (
              <Link
                href="/login"
                className="p-2 text-primary-light hover:text-white hover:bg-primary-hover rounded-lg transition-colors"
                aria-label="Sign In"
              >
                <LogIn className="w-5 h-5" />
              </Link>
            ) : (
              <Link
                href="/profile"
                className="w-8 h-8 rounded-full bg-surface text-primary font-bold text-xs flex items-center justify-center shadow-sm"
                aria-label="My Profile"
              >
                {getInitial(demoUser.name)}
              </Link>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-primary-light hover:text-white hover:bg-primary-hover transition-colors focus:outline-none focus:ring-2 focus:ring-secondary"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-primary-hover bg-primary px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? "bg-primary-hover text-white ring-1 ring-secondary/50"
                      : "text-primary-light hover:bg-primary-hover/70 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5 opacity-90" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-primary-hover/80 space-y-2">
            {demoUser ? (
              <div className="space-y-2">
                <div className="px-3 py-2 rounded-xl bg-primary-hover text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-surface text-primary font-bold text-[10px] flex items-center justify-center">
                      {getInitial(demoUser.name)}
                    </div>
                    <div>
                      <span className="font-semibold block text-white">{demoUser.name}</span>
                      <span className="text-[10px] text-primary-light/80">{demoUser.email}</span>
                    </div>
                  </div>
                  <span className="badge-info text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                    {demoUser.role}
                  </span>
                </div>

                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-surface text-body hover:bg-page transition-colors"
                >
                  <User className="w-4 h-4 text-secondary" />
                  <span>My Profile (Tickets &amp; Merch)</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-status-danger-light text-status-danger hover:bg-status-danger-light/80 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-status-danger" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-primary-hover text-white hover:bg-primary-hover/90 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In (Demo Available)</span>
                </Link>
                <Link
                  href="/membership"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-secondary hover:bg-secondary-hover text-white shadow transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Get Member Pass</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
