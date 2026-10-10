"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Megaphone,
  Calendar,
  User,
  ShieldCheck,
  ArrowRight,
  Bell,
  Pin,
  Ticket,
} from "lucide-react";
import { getStoredAnnouncements, Announcement } from "@/lib/announcements-store";

export default function AnnouncementsPageClient() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const load = () => {
      const stored = getStoredAnnouncements();
      // Pinned ones first, then by insertion order (newest first)
      setAnnouncements(stored.filter((a) => a.isPublished !== false));
      setIsLoaded(true);
    };

    load();
    window.addEventListener("announcements_updated", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("announcements_updated", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  // Pinned announcements shown at top
  const sorted = [
    ...announcements.filter((a) => a.pin),
    ...announcements.filter((a) => !a.pin),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header Banner */}
      <div className="bg-primary-light rounded-3xl p-8 sm:p-10 border border-primary/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 badge-primary px-3 py-1 rounded-full text-xs font-semibold">
            <Megaphone className="w-3.5 h-3.5 text-primary" />
            <span>Public Bulletin</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-body tracking-tight">
            Official Announcements &amp; Records
          </h1>
          <p className="text-sm sm:text-base text-muted leading-relaxed">
            The immutable public archive of Skyline Student Association. Published once,
            accessible forever to members, faculty, and student body.
          </p>
        </div>

        <div className="shrink-0">
          <div className="flex items-center gap-2 text-xs text-secondary-dark bg-secondary-light px-3.5 py-2.5 rounded-xl border border-secondary/20">
            <Bell className="w-4 h-4 text-secondary shrink-0" />
            <span>Public broadcast feed • No login required</span>
          </div>
        </div>
      </div>

      {/* Announcements List */}
      {isLoaded && sorted.length === 0 ? (
        <div className="bg-surface rounded-3xl border border-dashed border-gray-subtle p-16 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-primary-light text-primary flex items-center justify-center mx-auto">
            <Megaphone className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="font-bold text-base text-body">No Announcements Yet</h3>
            <p className="text-xs text-muted leading-relaxed">
              Once the Admin publishes an announcement from the Admin Panel, it will appear here instantly in real time.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Ticket className="w-4 h-4 text-secondary-light" />
              <span>Go to Admin Panel to Post Announcements</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {sorted.map((item) => (
            <article
              key={item.id}
              className={`bg-surface rounded-2xl p-6 sm:p-8 border ${
                item.pin ? "border-primary/40 shadow-md" : "border-gray-subtle shadow-sm"
              } hover:shadow-md transition-shadow space-y-4`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`${item.badge} text-xs font-semibold px-2.5 py-0.5 rounded-full`}>
                    {item.category}
                  </span>
                  {item.pin && (
                    <span className="badge-primary text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                      <Pin className="w-2.5 h-2.5" />
                      Pinned
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-secondary" />
                    <span>{item.date}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-primary" />
                    <span>{item.author}</span>
                  </span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-body hover:text-primary transition-colors">
                {item.title}
              </h2>

              <p className="text-sm sm:text-base text-body/90 leading-relaxed font-normal">
                {item.summary}
              </p>

              {item.content && (
                <div className="p-4 rounded-xl bg-page border border-gray-subtle text-xs sm:text-sm text-muted leading-relaxed">
                  <span className="font-semibold text-body block mb-1">Details &amp; Context:</span>
                  {item.content}
                </div>
              )}

              <div className="pt-2 flex items-center justify-between text-xs text-muted">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-status-success" />
                  <span>Verified by Skyline Executive Board</span>
                </div>
                <span className="font-mono text-[11px] text-muted">ID: {item.id}</span>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Footer Info Box */}
      <div className="bg-surface rounded-2xl p-6 border border-gray-subtle text-center space-y-2">
        <h3 className="font-bold text-base text-body">Have an announcement request?</h3>
        <p className="text-xs sm:text-sm text-muted max-w-xl mx-auto">
          Registered campus clubs and student volunteer heads can submit notices to the executive board for approval.
        </p>
        <div className="pt-2">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <span>Learn about association submission bylaws</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
