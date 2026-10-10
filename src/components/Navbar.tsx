"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  LayoutDashboard
} from "lucide-react";
import { logoutAction } from "@/app/login/actions";

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
  const [user, setUser] = useState<{
    name: string;
    email: string;
    role: string;
    dashboard?: string;
  } | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Read skyline_demo_user cookie client-side
    const allCookies = document.cookie.split("; ");
    const found = allCookies.find((c) => c.startsWith("skyline_demo_user="));
    if (found) {
      try {
        const decoded = decodeURIComponent(found.split("=")[1]);
        setUser(JSON.parse(decoded));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [pathname]);

  const getPortalLink = () => {
    if (!user) return "/login";
    if (user.dashboard) return user.dashboard;
    switch (user.role) {
      case "PRESIDENT": return "/admin";
      case "TREASURER": return "/treasurer";
      case "VP_EVENTS": return "/events-manager";
      case "VOLUNTEER": return "/volunteer";
      case "MEMBER": return "/member";
      default: return "/guest";
    }
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
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={getPortalLink()}
                  className="flex items-center gap-2 bg-secondary hover:bg-secondary-hover text-white px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all shadow-sm"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>{user.role} Portal</span>
                </Link>

                <div className="flex items-center gap-2 bg-primary-hover/80 px-3 py-1.5 rounded-xl border border-primary-light/20 text-xs">
                  <User className="w-3.5 h-3.5 text-secondary-light" />
                  <span className="font-bold truncate max-w-[120px]">{user.name}</span>
                </div>

                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-primary-hover text-primary-light hover:text-white hover:bg-red-500/20 transition-all"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-primary-light hover:text-white hover:bg-primary-hover transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 bg-secondary hover:bg-secondary-hover text-white px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Join Club</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-primary-hover text-primary-light hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-primary-hover bg-primary px-4 pt-3 pb-6 space-y-3">
          {user && (
            <div className="p-3 bg-primary-hover rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold block">{user.name}</span>
                <span className="text-[10px] text-primary-light">{user.role} Account</span>
              </div>
              <Link
                href={getPortalLink()}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-1 bg-secondary text-white rounded-lg text-xs font-bold"
              >
                Go to Portal &rarr;
              </Link>
            </div>
          )}

          <div className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover"
              >
                <item.icon className="w-4 h-4 opacity-80" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-primary-hover/50 flex gap-2">
            {user ? (
              <form action={logoutAction} className="w-full">
                <button
                  type="submit"
                  className="w-full py-2 bg-red-600/30 text-white rounded-xl text-xs font-bold"
                >
                  Sign Out
                </button>
              </form>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 bg-primary-hover rounded-xl text-xs font-bold"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 bg-secondary text-white rounded-xl text-xs font-bold"
                >
                  Join Club
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
