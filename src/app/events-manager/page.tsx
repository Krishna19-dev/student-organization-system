"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar, PlusCircle, MapPin, BarChart2, RefreshCw,
  Users, Tag, Ticket, TrendingUp
} from "lucide-react";
import { API_BASE } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";

export default function EventsManagerPage() {
  const [token, setToken] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  // form
  const [title, setTitle] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [totalSeats, setTotalSeats] = useState(100);
  const [memberPrice, setMemberPrice] = useState(0);
  const [guestPrice, setGuestPrice] = useState(15000);

  useEffect(() => {
    const c = document.cookie.split("; ").find(x => x.startsWith("token="));
    if (c) setToken(c.split("=")[1]);
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/api/events`);
      const data = await r.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (e: any) { setMessage(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, venue, date, totalSeats: Number(totalSeats), memberPrice: Number(memberPrice), guestPrice: Number(guestPrice) }),
      });
      if (res.ok) { setMessage("Event published!"); setShowCreate(false); loadData(); }
      else { const d = await res.json(); setMessage(d.error?.message || "Error"); }
    } catch (e: any) { setMessage(e.message); }
  };

  const viewReport = async (eventId: string) => {
    if (!token) return;
    try {
      const r = await fetch(`${API_BASE}/api/events/${eventId}/report`, { headers: { Authorization: `Bearer ${token}` } });
      setSelectedReport(await r.json());
    } catch (e: any) { setMessage(e.message); }
  };

  return (
    <DashboardLayout
      role="PRESIDENT"
      breadcrumb={[{ label: "Events" }]}
      title="Events & Programming Management"
      subtitle="Publish campus events, configure member/guest ticketing tiers, and track attendance P&L reports."
      actions={
        <div className="flex items-center gap-2">
          <button onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all">
            <PlusCircle className="w-4 h-4" /> Create Event
          </button>
          <button onClick={loadData} disabled={loading}
            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-all">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      }
    >
      {message && (
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs font-medium text-blue-900 flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage(null)} className="font-bold ml-4">✕</button>
        </div>
      )}

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Events", value: events.length, icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Total Seats", value: events.reduce((a, e) => a + (e.totalSeats || 0), 0), icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Seats Sold", value: events.reduce((a, e) => a + (e.seatsSold || 0), 0), icon: Ticket, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Sold Out", value: events.filter(e => e.seatsLeft === 0).length, icon: Tag, color: "text-red-600", bg: "bg-red-50" },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center mb-2`}>
                <Icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Selected Report Panel */}
      {selectedReport && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-blue-900 flex items-center gap-2">
              <BarChart2 className="w-4 h-4" /> P&L Report: {selectedReport.title}
            </h3>
            <button onClick={() => setSelectedReport(null)} className="text-xs font-bold text-blue-700">✕ Close</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: "Sold", val: selectedReport.sold, color: "text-gray-900" },
              { label: "Checked-In", val: selectedReport.attended, color: "text-emerald-600" },
              { label: "No-Shows", val: selectedReport.noShows, color: "text-amber-600" },
              { label: "Revenue", val: `₹${((selectedReport.revenue||0)/100).toFixed(0)}`, color: "text-emerald-700" },
              { label: "Net P&L", val: `₹${((selectedReport.net||0)/100).toFixed(0)}`, color: selectedReport.net >= 0 ? "text-emerald-700" : "text-red-700" },
            ].map(m => (
              <div key={m.label} className="bg-white p-3 rounded-xl border border-blue-100">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">{m.label}</span>
                <span className={`text-base font-black ${m.color}`}>{m.val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Events Grid */}
      <div>
        <h2 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Campus Events ({events.length})</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => {
            const left = event.seatsLeft ?? (event.totalSeats - event.seatsSold);
            const pct = Math.round(((event.seatsSold || 0) / Math.max(event.totalSeats, 1)) * 100);
            return (
              <div key={event.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                  <span className={`text-[11px] font-bold ${left > 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {left > 0 ? `${left} left` : "Sold Out"}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-gray-900 line-clamp-1">{event.title}</h3>
                <div className="text-xs text-gray-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> {event.venue}
                </div>
                {/* Seat progress bar */}
                <div>
                  <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                    <span>{event.seatsSold} / {event.totalSeats} sold</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${pct > 80 ? "bg-red-500" : pct > 50 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-1 rounded bg-gray-100 font-semibold text-gray-700">
                    Member: {event.memberPrice === 0 ? "Free" : `₹${(event.memberPrice / 100).toFixed(0)}`}
                  </span>
                  <span className="px-2 py-1 rounded bg-gray-100 font-semibold text-gray-700">
                    Guest: ₹{(event.guestPrice / 100).toFixed(0)}
                  </span>
                </div>
                <button onClick={() => viewReport(event.id)}
                  className="w-full py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5">
                  <BarChart2 className="w-3.5 h-3.5" /> View P&L Report
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-gray-900">Create Campus Event</h3>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-700 font-bold">✕</button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Event Title</label>
                <input type="text" required value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Annual Hackathon 2026"
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Venue / Room</label>
                <input type="text" required value={venue} onChange={e => setVenue(e.target.value)}
                  placeholder="e.g. Auditorium Hall B"
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Date & Time</label>
                  <input type="datetime-local" required value={date} onChange={e => setDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Seat Capacity</label>
                  <input type="number" min={1} required value={totalSeats} onChange={e => setTotalSeats(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Member Price (paise)</label>
                  <input type="number" min={0} step={100} value={memberPrice} onChange={e => setMemberPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Guest Price (paise)</label>
                  <input type="number" min={0} step={100} value={guestPrice} onChange={e => setGuestPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-md">Publish Event</button>
                <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
