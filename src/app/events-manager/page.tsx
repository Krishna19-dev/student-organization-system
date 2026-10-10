"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  PlusCircle, 
  Users, 
  MapPin, 
  Clock, 
  BarChart2, 
  Sparkles, 
  RefreshCw,
  CheckCircle,
  Tag
} from "lucide-react";
import { API_BASE } from "@/lib/api";

export default function EventsManagerPage() {
  const [token, setToken] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [fundraisers, setFundraisers] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // New Event Form
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [totalSeats, setTotalSeats] = useState(100);
  const [memberPrice, setMemberPrice] = useState(0);
  const [guestPrice, setGuestPrice] = useState(15000);

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const foundToken = cookies.find((c) => c.startsWith("token="));
    if (foundToken) {
      setToken(foundToken.split("=")[1]);
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const eRes = await fetch(`${API_BASE}/api/events`);
      const eData = await eRes.json();
      setEvents(Array.isArray(eData) ? eData : []);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          venue,
          date,
          totalSeats: Number(totalSeats),
          memberPrice: Number(memberPrice),
          guestPrice: Number(guestPrice),
        }),
      });

      if (res.ok) {
        setMessage("Event created successfully!");
        setShowCreateModal(false);
        setTitle("");
        setVenue("");
        setDate("");
        loadData();
      } else {
        const d = await res.json();
        setMessage(`Failed: ${d.error?.message || "Error"}`);
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const handleViewReport = async (eventId: string) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/events/${eventId}/report`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSelectedReport(data);
    } catch (err: any) {
      setMessage(`Report load error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <Calendar className="w-6 h-6" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              VP Events & Programming Desk
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Publish campus events, configure member/guest ticketing tiers, and track attendance P&L reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Event</span>
          </button>
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs font-medium text-blue-900 flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage(null)} className="text-blue-700 font-bold ml-4">✕</button>
        </div>
      )}

      {/* Selected Event Report Modal / Drawer */}
      {selectedReport && (
        <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-blue-900 flex items-center gap-2">
              <BarChart2 className="w-4 h-4" />
              <span>Event P&L Report: {selectedReport.title}</span>
            </h3>
            <button onClick={() => setSelectedReport(null)} className="text-xs font-bold text-blue-700">✕ Close</button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-white p-3 rounded-xl border border-blue-100">
              <span className="text-[10px] text-gray-500 font-bold uppercase block">Seats Sold</span>
              <span className="text-base font-black text-gray-900">{selectedReport.sold}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-blue-100">
              <span className="text-[10px] text-gray-500 font-bold uppercase block">Checked-In</span>
              <span className="text-base font-black text-emerald-600">{selectedReport.attended}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-blue-100">
              <span className="text-[10px] text-gray-500 font-bold uppercase block">No-Shows</span>
              <span className="text-base font-black text-amber-600">{selectedReport.noShows}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-blue-100">
              <span className="text-[10px] text-gray-500 font-bold uppercase block">Ticket Revenue</span>
              <span className="text-base font-black text-emerald-600">₹{((selectedReport.revenue || 0) / 100).toFixed(2)}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-blue-100">
              <span className="text-[10px] text-gray-500 font-bold uppercase block">Net P&L</span>
              <span className={`text-base font-black ${selectedReport.net >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                ₹{((selectedReport.net || 0) / 100).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Events Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Active Campus Events ({events.length})</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((event) => {
            const seatsLeft = event.seatsLeft !== undefined ? event.seatsLeft : event.totalSeats - event.seatsSold;
            return (
              <div key={event.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                    <span className="text-[11px] font-bold text-gray-500">
                      {event.seatsSold} / {event.totalSeats} Sold
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-gray-900 line-clamp-1">{event.title}</h3>

                  <div className="text-xs text-gray-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{event.venue}</span>
                  </div>

                  <div className="pt-2 flex items-center gap-2 text-xs">
                    <span className="px-2 py-1 rounded bg-gray-100 font-semibold text-gray-700">
                      Member: {event.memberPrice === 0 ? "Free" : `₹${(event.memberPrice / 100).toFixed(0)}`}
                    </span>
                    <span className="px-2 py-1 rounded bg-gray-100 font-semibold text-gray-700">
                      Guest: ₹{(event.guestPrice / 100).toFixed(0)}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-3 flex items-center justify-between">
                  <span className={`text-xs font-bold ${seatsLeft > 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {seatsLeft > 0 ? `${seatsLeft} Seats Left` : "Sold Out"}
                  </span>
                  <button
                    onClick={() => handleViewReport(event.id)}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition-all"
                  >
                    View Report &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-gray-900">Create Campus Event</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 font-bold hover:text-gray-600">✕</button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Annual Hackathon 2026"
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Venue / Room</label>
                <input
                  type="text"
                  required
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. Auditorium Hall B"
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Total Seat Capacity</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={totalSeats}
                    onChange={(e) => setTotalSeats(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Member Price (in paise, 0=Free)</label>
                  <input
                    type="number"
                    min={0}
                    step={100}
                    value={memberPrice}
                    onChange={(e) => setMemberPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Guest Price (in paise)</label>
                  <input
                    type="number"
                    min={0}
                    step={100}
                    value={guestPrice}
                    onChange={(e) => setGuestPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-md"
                >
                  Publish Event
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
