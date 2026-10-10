"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Filter,
  Ticket
} from "lucide-react";
import { getStoredEvents, PublicEvent } from "@/lib/events-store";

export default function EventsPageClient() {
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load and listen for real-time events updates across tabs/windows
  useEffect(() => {
    const loadEvents = () => {
      const stored = getStoredEvents();
      setEvents(stored);
      setIsLoaded(true);
    };

    loadEvents();

    const handleUpdate = () => {
      loadEvents();
    };

    window.addEventListener("events_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("events_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Only published events are shown to the public
  const publicEvents = events.filter((ev) => ev.isPublished !== false);

  const filteredEvents = publicEvents.filter((ev) => {
    if (selectedCategory === "ALL") return true;
    return ev.category?.toUpperCase() === selectedCategory.toUpperCase();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header Banner */}
      <div className="bg-primary-light rounded-3xl p-8 sm:p-10 border border-primary/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 badge-primary px-3 py-1 rounded-full text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>Campus Activities Calendar</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-body tracking-tight">
            Explore Events &amp; Workshops
          </h1>
          <p className="text-sm sm:text-base text-muted leading-relaxed">
            Reserve tickets online with instant QR passes. Skyline members enjoy deep discounts,
            with free admissions to flagship workshops.
          </p>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row gap-3">
          <Link
            href="/membership"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-secondary hover:bg-secondary-hover text-white text-sm font-semibold shadow-sm transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Member Discounts</span>
          </Link>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-subtle">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
          <span className="text-muted flex items-center gap-1.5 mr-2">
            <Filter className="w-3.5 h-3.5 text-secondary" />
            <span>Filter:</span>
          </span>
          <button
            type="button"
            onClick={() => setSelectedCategory("ALL")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              selectedCategory === "ALL"
                ? "bg-primary text-white shadow-sm"
                : "bg-surface text-body border border-gray-subtle hover:bg-page"
            }`}
          >
            All Events ({events.length})
          </button>
        </div>

        <div className="text-xs text-muted">
          Showing <span className="font-semibold text-body">{filteredEvents.length} events</span> scheduled
        </div>
      </div>

      {/* Events Grid or Real-time Empty State */}
      {isLoaded && publicEvents.length === 0 ? (
        <div className="bg-surface rounded-3xl border border-dashed border-gray-subtle p-16 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-secondary-light text-secondary flex items-center justify-center mx-auto">
            <Calendar className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="font-bold text-base text-body">No Upcoming Events Right Now</h3>
            <p className="text-xs text-muted leading-relaxed">
              All demo events have been cleared. As soon as the Admin schedules a new event from the Admin Panel, it will instantly appear right here in real time!
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Ticket className="w-4 h-4 text-secondary-light" />
              <span>Go to Admin Panel to Post Events</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const seatsLeft = Math.max(0, event.capacity - event.tickets);
            const percentFilled = Math.min(100, Math.round((event.tickets / event.capacity) * 100));

            return (
              <div
                key={event.id}
                className="bg-surface rounded-2xl border border-gray-subtle shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="badge-info text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {event.category || "Campus Event"}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      event.status === "upcoming" ? "badge-success" : "badge-warning"
                    }`}>
                      {event.status === "upcoming" ? "Upcoming" : "Completed"}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-body group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>

                  {event.description && (
                    <p className="text-xs sm:text-sm text-muted leading-relaxed line-clamp-3">
                      {event.description}
                    </p>
                  )}

                  <div className="space-y-2 text-xs text-muted pt-2 border-t border-gray-subtle">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-secondary shrink-0" />
                      <span>{event.date} {event.time ? `• ${event.time}` : ""}</span>
                    </div>
                    {event.venue && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{event.venue}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer: Pricing & Actions */}
                <div className="p-6 bg-page border-t border-gray-subtle space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-muted block text-[11px]">Member Rate</span>
                      <span className="font-bold text-sm text-status-success-dark">
                        {event.price === 0 ? "₹0 (Free)" : `₹${Math.round(event.price * 0.7)}`}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-muted block text-[11px]">General Admission</span>
                      <span className="font-bold text-sm text-body">
                        {event.price === 0 ? "Free" : `₹${event.price}`}
                      </span>
                    </div>
                  </div>

                  {/* Seat Capacity Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] text-muted">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-secondary" />
                        <span>{event.tickets} booked</span>
                      </span>
                      <span className="font-medium text-body">
                        {seatsLeft} seats left ({percentFilled}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-subtle rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${percentFilled}%` }} 
                      />
                    </div>
                  </div>

                  <Link
                    href="/login"
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm transition-colors"
                  >
                    <span>Book Ticket with QR Pass</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Notice Banner */}
      <div className="bg-surface rounded-2xl p-6 border border-gray-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary-light flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-body">Hosting a Campus Event?</h4>
            <p className="text-xs text-muted">
              Skyline volunteers and club officers can request event budget approvals and manage check-in scanners.
            </p>
          </div>
        </div>
        <Link
          href="/admin"
          className="shrink-0 text-xs font-semibold text-secondary hover:underline flex items-center gap-1"
        >
          <span>Officer Check-in &amp; Event Operations</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
