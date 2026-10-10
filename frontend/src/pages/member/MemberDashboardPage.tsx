import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  CreditCard, Ticket, ShoppingBag, ShieldCheck, 
  Calendar, ArrowRight, Sparkles, Clock, QrCode, Tag 
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { getDemoUser } from "@/lib/auth-demo";

export default function MemberDashboardPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getDemoUser().then(setUser);
  }, []);

  const isGuest = user?.role === "GUEST";
  const memberStatus = user?.status || (isGuest ? "GUEST" : "ACTIVE");
  const memberCode = isGuest 
    ? (user?.id ? `GST-${user.id.slice(-6).toUpperCase()}` : "GST-VISITOR") 
    : "SKY-2026-9041";
  const expiryDate = "October 31, 2027";
  const tier = user?.tier || (isGuest ? "NONE" : "PREMIUM");

  const upcomingTickets = [
    {
      id: "TCK-9901",
      title: "Skyline Tech & Design Summit 2026",
      date: "Oct 24, 2026",
      venue: "Central Auditorium",
      status: "VALID",
    },
    {
      id: "TCK-9772",
      title: "Acoustic Sunset Jam & Open Mic",
      date: "Nov 02, 2026",
      venue: "Amphitheatre",
      status: "VALID",
    },
  ];

  return (
    <DashboardLayout
      role={isGuest ? "GUEST" : "MEMBER"}
      breadcrumb={[{ label: isGuest ? "Guest Hub" : "Member Hub" }]}
      title={isGuest ? "Guest Visitor Hub" : "Member Operations Hub"}
      subtitle={
        isGuest
          ? "Browse campus events, purchase guest passes, and order official merchandise."
          : "Digital membership status, upcoming event passes, and campus perks."
      }
    >
      {/* Top Banner Card */}
      <div className={`rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 ${
        isGuest 
          ? "bg-gradient-to-r from-slate-800 via-slate-900 to-[#017E84]/80" 
          : "bg-gradient-to-r from-[#4A1942] to-[#2E0F29]"
      }`}>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
              isGuest
                ? "bg-slate-700 text-slate-200 border border-slate-600"
                : memberStatus === "ACTIVE" 
                  ? "bg-emerald-400 text-emerald-950" 
                  : "bg-red-400 text-red-950"
            }`}>
              {isGuest ? "Guest Visitor" : `${memberStatus} Member`}
            </span>
            <span className="text-xs text-slate-300">ID: {memberCode}</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">{user?.name || (isGuest ? "Guest Explorer" : "Student Member")}</h2>
          <p className="text-xs text-slate-300">
            {isGuest 
              ? "Standard non-member pricing • Purchase tickets & merchandise without annual dues"
              : `${tier === "PREMIUM" ? "Executive Premium Tier" : "Standard Basic Tier"} • Valid until ${expiryDate}`
            }
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/shop"
            className="px-4 py-2.5 rounded-xl bg-white text-gray-900 font-bold text-xs hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-sm"
          >
            <ShoppingBag className="w-4 h-4 text-[#017E84]" />
            <span>Buy Merchandise</span>
          </Link>
          <Link
            to="/events"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-colors flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Browse Events</span>
          </Link>
          {isGuest && (
            <Link
              to="/membership"
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs transition-colors flex items-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Join as Member (Save 20%)</span>
            </Link>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            label: "Account Tier", 
            value: isGuest ? "Visitor" : tier, 
            icon: ShieldCheck, 
            color: isGuest ? "text-slate-600" : "text-purple-600", 
            bg: isGuest ? "bg-slate-100" : "bg-purple-50" 
          },
          { label: "Valid Event Passes", value: "2", icon: Ticket, color: "text-teal-600", bg: "bg-teal-50" },
          { label: "Merch Orders", value: isGuest ? "1" : "3", icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
          { 
            label: isGuest ? "Member Discount" : "Expiry Countdown", 
            value: isGuest ? "0%" : "340 Days", 
            icon: Clock, 
            color: "text-amber-600", 
            bg: "bg-amber-50" 
          },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
              <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center mb-2`}>
                <Icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div className={`text-xl font-black ${s.color} font-mono`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Upcoming Event Passes */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
            <Ticket className="w-4 h-4 text-[#017E84]" />
            Upcoming Confirmed Event Tickets
          </h3>
          <Link to="/me/tickets" className="text-xs font-bold text-[#017E84] hover:underline">
            View All ({upcomingTickets.length}) &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {upcomingTickets.map((t) => (
            <div key={t.id} className="p-4 rounded-xl border border-gray-100 bg-[#FAF7F9] flex justify-between items-center">
              <div>
                <span className="text-[10px] font-mono text-gray-400">{t.id}</span>
                <h4 className="font-bold text-xs text-gray-900">{t.title}</h4>
                <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-2">
                  <span>{t.date}</span>
                  <span>•</span>
                  <span>{t.venue}</span>
                </div>
              </div>
              <Link
                to="/me/tickets"
                className="p-2 rounded-lg bg-white border border-gray-200 text-[#4A1942] hover:bg-purple-50 transition-colors"
                title="View Pass"
              >
                <QrCode className="w-5 h-5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
