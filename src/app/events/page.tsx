import React from "react";
import Link from "next/link";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Filter
} from "lucide-react";

export const metadata = {
  title: "Campus Events & Tickets | Skyline Student Association",
  description: "Browse upcoming workshops, summits, cultural fests, and book tickets with member discounts.",
};

const SAMPLE_EVENTS = [
  {
    id: "evt-1",
    title: "Skyline Tech & Design Summit 2026",
    category: "Workshop",
    categoryBadge: "badge-info",
    date: "October 24, 2026",
    time: "10:00 AM – 5:00 PM IST",
    venue: "Auditorium A, Science Complex",
    description: "A full-day flagship event featuring hands-on full-stack product building, design systems, and alumni panels from top technology startups.",
    memberPrice: 0,
    guestPrice: 250,
    seatsTotal: 200,
    seatsFilled: 180,
    status: "Filling Fast",
    statusBadge: "badge-warning",
  },
  {
    id: "evt-2",
    title: "Acoustic Sunset: Campus Open Mic & Jam",
    category: "Cultural",
    categoryBadge: "badge-warning",
    date: "November 02, 2026",
    time: "5:30 PM – 8:30 PM IST",
    venue: "Student Amphitheater & Terrace",
    description: "An evening of live student performances, acoustic songwriting, spoken word poetry, and complimentary artisan coffee.",
    memberPrice: 50,
    guestPrice: 150,
    seatsTotal: 120,
    seatsFilled: 95,
    status: "Open",
    statusBadge: "badge-success",
  },
  {
    id: "evt-3",
    title: "Alumni Leadership & Mentorship Mixer",
    category: "Networking",
    categoryBadge: "badge-success",
    date: "November 15, 2026",
    time: "6:00 PM – 9:00 PM IST",
    venue: "Alumni Hall, 2nd Floor",
    description: "Connect with Skyline graduates leading careers in engineering, design, and business. Roundtable format with refreshments served.",
    memberPrice: 100,
    guestPrice: 300,
    seatsTotal: 50,
    seatsFilled: 45,
    status: "Limited",
    statusBadge: "badge-danger",
  },
  {
    id: "evt-4",
    title: "Intro to Competitive Programming & Systems",
    category: "Workshop",
    categoryBadge: "badge-info",
    date: "November 22, 2026",
    time: "2:00 PM – 5:00 PM IST",
    venue: "Computer Lab 4B",
    description: "Deep dive into problem solving, graph theory, and algorithmic speed techniques for upcoming collegiate hackathons.",
    memberPrice: 0,
    guestPrice: 200,
    seatsTotal: 60,
    seatsFilled: 38,
    status: "Open",
    statusBadge: "badge-success",
  },
  {
    id: "evt-5",
    title: "Winter Charity Gala & Annual Fundraiser",
    category: "Social",
    categoryBadge: "badge-primary",
    date: "December 05, 2026",
    time: "7:00 PM – 10:30 PM IST",
    venue: "Skyline Grand Banquet Hall",
    description: "Our year-end celebration raising funds for student scholarships and community relief initiatives across the city.",
    memberPrice: 150,
    guestPrice: 450,
    seatsTotal: 250,
    seatsFilled: 110,
    status: "Open",
    statusBadge: "badge-success",
  },
  {
    id: "evt-6",
    title: "Campus Design Critique & Portfolio Review",
    category: "Workshop",
    categoryBadge: "badge-info",
    date: "December 12, 2026",
    time: "3:00 PM – 6:00 PM IST",
    venue: "Media Studio 101",
    description: "1-on-1 portfolio feedback sessions with senior product designers and creative directors from the student design chapter.",
    memberPrice: 0,
    guestPrice: 150,
    seatsTotal: 30,
    seatsFilled: 26,
    status: "Filling Fast",
    statusBadge: "badge-warning",
  },
];

export default function EventsPage() {
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
            <span>Category:</span>
          </span>
          <button type="button" className="px-3 py-1.5 rounded-lg bg-primary text-white shadow-sm">
            All Events (6)
          </button>
          <button type="button" className="px-3 py-1.5 rounded-lg bg-surface text-body border border-gray-subtle hover:bg-page transition-colors">
            Workshops
          </button>
          <button type="button" className="px-3 py-1.5 rounded-lg bg-surface text-body border border-gray-subtle hover:bg-page transition-colors">
            Cultural &amp; Arts
          </button>
          <button type="button" className="px-3 py-1.5 rounded-lg bg-surface text-body border border-gray-subtle hover:bg-page transition-colors">
            Networking
          </button>
          <button type="button" className="px-3 py-1.5 rounded-lg bg-surface text-body border border-gray-subtle hover:bg-page transition-colors">
            Social
          </button>
        </div>

        <div className="text-xs text-muted">
          Showing <span className="font-semibold text-body">6 events</span> scheduled
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SAMPLE_EVENTS.map((event) => {
          const seatsLeft = event.seatsTotal - event.seatsFilled;
          const percentFilled = Math.round((event.seatsFilled / event.seatsTotal) * 100);

          return (
            <div
              key={event.id}
              className="bg-surface rounded-2xl border border-gray-subtle shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`${event.categoryBadge} text-xs font-semibold px-2.5 py-0.5 rounded-full`}>
                    {event.category}
                  </span>
                  <span className={`${event.statusBadge} text-xs font-semibold px-2.5 py-0.5 rounded-full`}>
                    {event.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-body group-hover:text-primary transition-colors">
                  {event.title}
                </h3>

                <p className="text-xs sm:text-sm text-muted leading-relaxed line-clamp-3">
                  {event.description}
                </p>

                <div className="space-y-2 text-xs text-muted pt-2 border-t border-gray-subtle">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-secondary shrink-0" />
                    <span>{event.date} • {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{event.venue}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Pricing & Actions */}
              <div className="p-6 bg-page border-t border-gray-subtle space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-muted block text-[11px]">Member Rate</span>
                    <span className="font-bold text-sm text-status-success-dark">
                      {event.memberPrice === 0 ? "₹0 (Free)" : `₹${event.memberPrice}`}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-muted block text-[11px]">Guest Rate</span>
                    <span className="font-bold text-sm text-body">
                      ₹{event.guestPrice}
                    </span>
                  </div>
                </div>

                {/* Seat Capacity Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] text-muted">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-secondary" />
                      <span>{event.seatsFilled} booked</span>
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
          href="/login"
          className="shrink-0 text-xs font-semibold text-secondary hover:underline flex items-center gap-1"
        >
          <span>Officer Check-in Scanner Portal</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
