"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Compass, 
  MapPin, 
  Mail, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight,
  Shield,
  Heart
} from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  // Do not render public footer inside Admin panel
  if (pathname?.startsWith("/admin")) {
    return null;
  }
  return (
    <footer className="bg-primary text-white border-t border-primary-hover">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand & Purpose */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-hover border border-primary-light/20 flex items-center justify-center shadow-inner">
                <Compass className="w-5 h-5 text-secondary-light" />
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight block">
                  Skyline
                </span>
                <span className="text-xs text-primary-light/80 font-medium tracking-wide block">
                  Student Association
                </span>
              </div>
            </div>
            <p className="text-sm text-primary-light/90 leading-relaxed">
              The unified campus club operating system. Powering membership, digital ticketing, 
              merchandise, and an immutable single ledger for complete financial integrity.
            </p>
            <div className="flex items-center gap-2 text-xs text-secondary-light bg-primary-hover/50 px-3 py-2 rounded-lg border border-primary-light/10">
              <Shield className="w-4 h-4 shrink-0 text-secondary-light" />
              <span>100% Cashless &amp; Auditable Single-Ledger Policy</span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary-light mb-4">
              Explore Platform
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link 
                  href="/events" 
                  className="text-primary-light hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>Upcoming Events &amp; Tickets</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </Link>
              </li>
              <li>
                <Link 
                  href="/announcements" 
                  className="text-primary-light hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>Official Announcements</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </Link>
              </li>
              <li>
                <Link 
                  href="/merch" 
                  className="text-primary-light hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>Apparel &amp; Merch Store</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </Link>
              </li>
              <li>
                <Link 
                  href="/membership" 
                  className="text-primary-light hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>Membership Tiers &amp; Perks</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-primary-light hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>About Skyline Association</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Governance & Operations */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary-light mb-4">
              Club Governance
            </h3>
            <ul className="space-y-2.5 text-sm text-primary-light/90">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                <span>Single-Entry Financial Ledger</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                <span>Zero-Float Integer Accounting</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                <span>QR-Verified Event Check-Ins</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                <span>Volunteer Expense Audits</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                <span>Live Size-Wise Inventory Control</span>
              </li>
            </ul>
          </div>

          {/* Campus Office & Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary-light mb-4">
              Campus Office
            </h3>
            <ul className="space-y-3 text-sm text-primary-light/90">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-secondary-light shrink-0 mt-0.5" />
                <span>Student Activities Building, Room 304, Campus Quad</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-secondary-light shrink-0" />
                <a 
                  href="mailto:contact@skyline-sa.edu" 
                  className="hover:text-white transition-colors"
                >
                  contact@skyline-sa.edu
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-secondary-light shrink-0" />
                <span>Mon – Fri: 9:00 AM – 5:30 PM IST</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="pt-8 border-t border-primary-hover flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-primary-light/80">
          <p>
            &copy; {new Date().getFullYear()} Skyline Student Association. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-primary-light/70">
            <span>Built with care for campus communities</span>
            <Heart className="w-3.5 h-3.5 text-status-danger fill-status-danger inline mx-0.5" />
            <span>• Hackathon Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
