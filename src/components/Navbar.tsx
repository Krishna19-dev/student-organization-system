"use client";

import React, { useState } from "react";
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
  Sparkles 
} from "lucide-react";

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
  const pathname = usePathname();

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
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/login"
              className="p-2 text-primary-light hover:text-white hover:bg-primary-hover rounded-lg transition-colors"
              aria-label="Sign In"
            >
              <LogIn className="w-5 h-5" />
            </Link>
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
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-primary-hover text-white hover:bg-primary-hover/90 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Member Portal</span>
            </Link>
            <Link
              href="/membership"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-secondary hover:bg-secondary-hover text-white shadow transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Get Member Pass</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
