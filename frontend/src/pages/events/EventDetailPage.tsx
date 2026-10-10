import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Calendar, MapPin, Users, Ticket, ArrowLeft, Clock, 
  Share2, ShieldCheck, CheckCircle2, AlertCircle, Sparkles 
} from "lucide-react";
import { API_BASE } from "@/lib/api";

const SAMPLE_EVENTS = [
  {
    id: "EVT-001",
    title: "Skyline Tech & Design Summit 2026",
    date: "October 24, 2026",
    time: "10:00 AM - 5:00 PM IST",
    venue: "Main Auditorium, Central Campus",
    seatsLeft: 12,
    totalSeats: 120,
    guestPrice: 250,
    memberPrice: 0,
    status: "upcoming",
    category: "Technology",
    description: "The flagship student technology and design symposium featuring industry keynote engineers, design portfolio reviews, and interactive live workshops on distributed systems.",
    highlights: ["3 Keynote Talks", "Design Review Panels", "Networking Lunch", "Certificate of Participation"],
  },
  {
    id: "EVT-002",
    title: "Acoustic Sunset Jam & Poetry Open Mic",
    date: "November 02, 2026",
    time: "5:30 PM - 8:30 PM IST",
    venue: "Open Air Amphitheatre",
    seatsLeft: 0,
    totalSeats: 80,
    guestPrice: 150,
    memberPrice: 50,
    status: "upcoming",
    category: "Cultural",
    description: "An intimate autumn evening under the stars showcasing campus singer-songwriters, poets, and acoustic performers with warm artisanal refreshments.",
    highlights: ["Live Unplugged Sets", "Complimentary Hot Cocoa", "Open Mic Stage Slots"],
  },
  {
    id: "EVT-003",
    title: "Annual General Body Assembly & Elections",
    date: "October 18, 2026",
    time: "3:00 PM - 6:00 PM IST",
    venue: "Council Hall B",
    seatsLeft: 45,
    totalSeats: 200,
    guestPrice: 0,
    memberPrice: 0,
    status: "upcoming",
    category: "Governance",
    description: "Constitutional briefing, annual financial transparency reporting by the Treasurer, and voting for vacant executive council portfolios.",
    highlights: ["Constitutional Amendments", "Financial Audit Presentation", "Executive Council Election"],
  },
  {
    id: "EVT-004",
    title: "24-Hour Campus Hackathon Sprint",
    date: "September 28, 2026",
    time: "Overnight Hack",
    venue: "Innovation Labs A & B",
    seatsLeft: 0,
    totalSeats: 75,
    guestPrice: 250,
    memberPrice: 150,
    status: "completed",
    category: "Hackathon",
    description: "High-intensity prototype-building marathon addressing campus utility needs with sponsor mentorship and cash bounties.",
    highlights: ["₹50,000 Prize Pool", "24h Mentor Access", "Energy Drinks & Meals"],
  },
];

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const found = SAMPLE_EVENTS.find((e) => e.id === id) || SAMPLE_EVENTS[0];
    setEvent(found);
  }, [id]);

  if (!event) return null;

  const isSoldOut = event.seatsLeft === 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <Link
        to="/events"
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#4A1942] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to All Events
      </Link>

      {/* Main Hero Card */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E6F3F4] text-[#017E84]">
            {event.category}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-800 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? "Link Copied!" : "Share"}</span>
            </button>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
          {event.title}
        </h1>

        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          {event.description}
        </p>

        {/* Metadata grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#4A1942] flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-gray-400 uppercase">Date & Time</div>
              <div className="text-xs font-bold text-gray-800">{event.date}</div>
              <div className="text-[11px] text-gray-500">{event.time}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#017E84] flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-gray-400 uppercase">Location</div>
              <div className="text-xs font-bold text-gray-800 truncate max-w-[180px]">{event.venue}</div>
              <div className="text-[11px] text-gray-500">Physical Check-in</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isSoldOut ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-gray-400 uppercase">Capacity</div>
              <div className="text-xs font-bold text-gray-800">
                {isSoldOut ? "Capacity Full" : `${event.seatsLeft} Seats Remaining`}
              </div>
              <div className="text-[11px] text-gray-500">{event.totalSeats} Total Seats</div>
            </div>
          </div>
        </div>

        {/* Pricing & CTA Card */}
        <div className="p-6 rounded-2xl bg-[#FAF7F9] border border-gray-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-gray-900 font-mono">
                {event.guestPrice === 0 ? "FREE" : `₹${event.guestPrice}`}
              </span>
              <span className="text-xs text-gray-500">standard guest ticket</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-[#017E84] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                Verified Member Price: {event.memberPrice === 0 ? "Free with Active Membership" : `₹${event.memberPrice}`}
              </span>
            </div>
          </div>

          <div className="w-full sm:w-auto">
            {isSoldOut ? (
              <button
                disabled
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gray-200 text-gray-400 font-bold text-sm cursor-not-allowed"
              >
                Sold Out
              </button>
            ) : (
              <Link
                to={`/checkout/ticket/${event.id}`}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#017E84] hover:bg-[#016368] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Ticket className="w-4 h-4" />
                Buy Ticket ({event.seatsLeft} left)
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-gray-900">Event Inclusions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {event.highlights.map((h: string, idx: number) => (
            <div key={idx} className="flex items-center gap-2.5 text-xs text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <CheckCircle2 className="w-4 h-4 text-[#017E84] shrink-0" />
              <span>{h}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
