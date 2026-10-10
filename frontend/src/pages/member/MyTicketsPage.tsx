import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Ticket, QrCode, Download, Calendar, MapPin, 
  CheckCircle2, Clock, Sparkles 
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { getDemoUser } from "@/lib/auth-demo";

const MY_TICKETS = [
  {
    id: "TCK-9901",
    eventId: "EVT-001",
    eventTitle: "Skyline Tech & Design Summit 2026",
    date: "October 24, 2026",
    time: "10:00 AM IST",
    venue: "Main Auditorium, Central Campus",
    status: "VALID",
    tier: "Member Free Pass",
    qrCode: "SKY-EVT-9901-VAL",
  },
  {
    id: "TCK-9772",
    eventId: "EVT-002",
    eventTitle: "Acoustic Sunset Jam & Poetry Open Mic",
    date: "November 02, 2026",
    time: "5:30 PM IST",
    venue: "Open Air Amphitheatre",
    status: "VALID",
    tier: "Discounted Member Pass",
    qrCode: "SKY-EVT-9772-VAL",
  },
  {
    id: "TCK-8512",
    eventId: "EVT-004",
    eventTitle: "Campus Hackathon 2026 Sprint",
    date: "September 28, 2026",
    time: "Overnight",
    venue: "Innovation Labs A & B",
    status: "CHECKED_IN",
    tier: "Hacker Pass",
    qrCode: "SKY-EVT-8512-CHK",
  },
];

export default function MyTicketsPage() {
  const [filter, setFilter] = useState<"ALL" | "VALID" | "CHECKED_IN">("ALL");
  const [user, setUser] = useState<any>(null);
  const [ticketList, setTicketList] = useState<any[]>(MY_TICKETS);

  useEffect(() => {
    getDemoUser().then((u) => {
      setUser(u);
      try {
        const stored = localStorage.getItem("user_tickets");
        if (stored) {
          const parsed = JSON.parse(stored);
          setTicketList([...parsed, ...MY_TICKETS]);
        }
      } catch {}
    });
  }, []);

  const isGuest = user?.role === "GUEST";
  const filtered = ticketList.filter((t) => filter === "ALL" || t.status === filter);

  return (
    <DashboardLayout
      role={isGuest ? "GUEST" : "MEMBER"}
      breadcrumb={[{ label: isGuest ? "Guest Hub" : "Member Hub", href: "/me" }, { label: "My Passes" }]}
      title={isGuest ? "My Guest Event Passes" : "My Event Passes"}
      subtitle={isGuest ? "Confirmed visitor tickets and QR passes for campus events." : "Digital event tickets with fast-track entry QR tokens."}
    >
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {(["ALL", "VALID", "CHECKED_IN"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filter === s
                    ? "bg-[#4A1942] text-white shadow-xs"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {s === "ALL" ? "All Passes" : s === "VALID" ? "Valid Passes" : "Attended"}
              </button>
            ))}
          </div>

          <Link
            to="/events"
            className="text-xs font-bold text-[#017E84] hover:underline"
          >
            Browse More Events &rarr;
          </Link>
        </div>

        {/* Tickets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-purple-900 font-bold">{t.id}</span>
                  <h3 className="font-bold text-base text-gray-900 leading-snug mt-0.5">{t.eventTitle}</h3>
                  <span className="text-[11px] text-gray-400">{t.tier}</span>
                </div>
                <span
                  className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    t.status === "VALID"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {t.status === "VALID" ? "VALID PASS" : "CHECKED IN"}
                </span>
              </div>

              {/* Event Details & QR */}
              <div className="p-4 rounded-2xl bg-[#FAF7F9] border border-gray-100 flex items-center justify-between gap-4">
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-3.5 h-3.5 text-[#017E84]" />
                    <span>{t.date} ({t.time})</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-3.5 h-3.5 text-[#017E84]" />
                    <span className="truncate max-w-[180px]">{t.venue}</span>
                  </div>
                </div>

                <div className="bg-white p-2 rounded-xl border border-gray-200 shrink-0 flex flex-col items-center">
                  <QrCode className="w-16 h-16 text-[#4A1942]" />
                  <span className="text-[7px] font-mono text-gray-400 mt-0.5">GATE PASS</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-gray-50 text-xs">
                <span className="text-gray-400 text-[11px]">Show QR at gate check-in</span>
                <button
                  onClick={() => window.print()}
                  className="font-bold text-[#017E84] hover:underline flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Pass</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
