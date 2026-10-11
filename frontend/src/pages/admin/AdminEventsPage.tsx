import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Calendar, PlusCircle, Edit3, Kanban, BarChart2, 
  MapPin, Users, Ticket, CheckCircle2, Globe, EyeOff, 
  Trash2, X, Save, AlertTriangle, Sparkles, RefreshCw,
  Clock, ArrowRight
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { getStoredEvents, saveStoredEvents, PublicEvent } from "@/lib/events-store";
import { API_BASE } from "@/lib/api";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<PublicEvent | null>(null);
  const [eventToDelete, setEventToDelete] = useState<PublicEvent | null>(null);

  // Form states for Create Event
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Workshop");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("10:00 AM - 5:00 PM IST");
  const [newVenue, setNewVenue] = useState("");
  const [newCapacity, setNewCapacity] = useState("120");
  const [newMemberPrice, setNewMemberPrice] = useState("0");
  const [newGuestPrice, setNewGuestPrice] = useState("250");
  const [newDescription, setNewDescription] = useState("");
  const [newIsPublished, setNewIsPublished] = useState(true);

  // Load events
  const loadEvents = () => {
    const stored = getStoredEvents();
    setEvents(stored);
    setIsLoaded(true);
  };

  useEffect(() => {
    loadEvents();
    window.addEventListener("events_updated", loadEvents);
    window.addEventListener("storage", loadEvents);
    return () => {
      window.removeEventListener("events_updated", loadEvents);
      window.removeEventListener("storage", loadEvents);
    };
  }, []);

  // Single-click Toggle Publish Status
  const handleTogglePublish = (eventId: string) => {
    const updated = events.map((ev) => {
      if (ev.id === eventId) {
        const nextState = ev.isPublished === false;
        return { ...ev, isPublished: nextState };
      }
      return ev;
    });
    setEvents(updated);
    saveStoredEvents(updated);
    const target = updated.find((e) => e.id === eventId);
    setStatusMessage(
      target?.isPublished
        ? `"${target.title}" is now LIVE and PUBLISHED on the Public Portal!`
        : `"${target?.title}" is now set to DRAFT (hidden from Public Portal).`
    );
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Create Event Handler
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDate || !newVenue) return;

    const cap = parseInt(newCapacity, 10) || 100;
    const mPrice = parseInt(newMemberPrice, 10) || 0;
    const gPrice = parseInt(newGuestPrice, 10) || 0;

    const nextId = `EVT-${String(events.length + 1).padStart(3, "0")}`;

    const newEvent: PublicEvent = {
      id: nextId,
      title: newTitle,
      category: newCategory,
      date: newDate,
      time: newTime,
      venue: newVenue,
      capacity: cap,
      totalSeats: cap,
      tickets: 0,
      seatsSold: 0,
      price: gPrice,
      guestPrice: gPrice,
      memberPrice: mPrice,
      revenue: "₹0",
      description: newDescription || undefined,
      status: "upcoming",
      isPublished: newIsPublished,
      highlights: ["Keynote Session", "Networking Session", "Certificate of Participation"],
    };

    const updated = [newEvent, ...events];
    setEvents(updated);
    saveStoredEvents(updated);

    // Reset Form & Close Modal
    setNewTitle("");
    setNewDate("");
    setNewVenue("");
    setNewDescription("");
    setIsCreateModalOpen(false);

    setStatusMessage(`Event "${newEvent.title}" successfully created (${newIsPublished ? "Published Live" : "Saved as Draft"})!`);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Save Edit Handler
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    const updated = events.map((ev) => (ev.id === editingEvent.id ? editingEvent : ev));
    setEvents(updated);
    saveStoredEvents(updated);
    setEditingEvent(null);

    setStatusMessage(`Event "${editingEvent.title}" updated successfully!`);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!eventToDelete) return;
    const updated = events.filter((ev) => ev.id !== eventToDelete.id);
    setEvents(updated);
    saveStoredEvents(updated);
    setEventToDelete(null);

    setStatusMessage("Event removed successfully.");
    setTimeout(() => setStatusMessage(null), 4000);
  };

  return (
    <DashboardLayout
      role="PRESIDENT"
      breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Events Management" }]}
      title="President &amp; Council Event Management"
      subtitle="Publish campus events, control public visibility, monitor seat bookings, supervise volunteer boards, and review event P&amp;L."
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={loadEvents}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#4A1942]" />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#4A1942] hover:bg-[#3a1232] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Event</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Real-time Status Alert */}
        {statusMessage && (
          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-xs font-bold text-purple-900 flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#4A1942]" />
              <span>{statusMessage}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-purple-600 hover:text-purple-900 font-black ml-4 text-sm"
            >
              ✕
            </button>
          </div>
        )}

        {/* Quick Summary Stat Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
            <span className="text-xs text-gray-500 font-medium">Total Events</span>
            <div className="text-2xl font-black text-gray-900 mt-0.5">{events.length}</div>
            <span className="text-[11px] text-gray-400">In database</span>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
            <span className="text-xs text-gray-500 font-medium">Live on Public Site</span>
            <div className="text-2xl font-black text-emerald-600 mt-0.5">
              {events.filter((e) => e.isPublished !== false).length}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">Publicly bookable</span>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
            <span className="text-xs text-gray-500 font-medium">Draft (Hidden)</span>
            <div className="text-2xl font-black text-amber-600 mt-0.5">
              {events.filter((e) => e.isPublished === false).length}
            </div>
            <span className="text-[11px] text-amber-700 font-medium">Executive prep stage</span>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
            <span className="text-xs text-gray-500 font-medium">Total Seats Issued</span>
            <div className="text-2xl font-black text-[#4A1942] font-mono mt-0.5">
              {events.reduce((sum, e) => sum + (e.tickets || e.seatsSold || 0), 0)}
            </div>
            <span className="text-[11px] text-purple-700 font-medium">Booked tickets</span>
          </div>
        </div>

        {/* Events List */}
        {events.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center space-y-4 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#4A1942] flex items-center justify-center mx-auto">
              <Calendar className="w-7 h-7" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="font-bold text-base text-gray-900">No Events Configured Yet</h3>
              <p className="text-xs text-gray-500">
                Click &ldquo;Create New Event&rdquo; above to set up your first campus summit, workshop, or gathering.
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#4A1942] hover:bg-[#3a1232] text-white text-xs font-bold transition-all shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Event Now</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((ev) => {
              const cap = ev.capacity || ev.totalSeats || 100;
              const booked = ev.tickets || ev.seatsSold || 0;
              const seatsLeft = Math.max(0, cap - booked);
              const percentFilled = Math.min(100, Math.round((booked / cap) * 100));
              const isPub = ev.isPublished !== false;
              const mPrice = ev.memberPrice !== undefined ? ev.memberPrice : 0;
              const gPrice = ev.guestPrice !== undefined ? ev.guestPrice : ev.price;

              return (
                <div
                  key={ev.id}
                  className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col xl:flex-row xl:items-center justify-between gap-6"
                >
                  {/* Event Details */}
                  <div className="space-y-3 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded-lg">
                        {ev.id}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-teal-50 text-[#017E84]">
                        {ev.category || "Campus Event"}
                      </span>
                      <span
                        className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          ev.status === "upcoming" || ev.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {ev.status}
                      </span>

                      {/* PUBLISH / UNPUBLISH TOGGLE BUTTON ON EVENT CARD */}
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(ev.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all shadow-2xs border ${
                          isPub
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                            : "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
                        }`}
                        title={isPub ? "Click to unpublish (hide from public portal)" : "Click to publish (show on public portal)"}
                      >
                        {isPub ? (
                          <>
                            <Globe className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Published (Live on Public Site)</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                            <span>Draft (Hidden from Public)</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-gray-900 leading-snug">
                        {ev.title}
                      </h3>
                      {ev.description && (
                        <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                          {ev.description}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-500 pt-1">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#017E84]" />
                        <strong>{ev.date}</strong>
                        {ev.time && <span className="text-gray-400">({ev.time})</span>}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#017E84]" />
                        <span>{ev.venue || "Main Campus"}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#017E84]" />
                        <span>{booked}/{cap} booked ({seatsLeft} left)</span>
                      </span>
                      <span className="font-mono text-gray-700 bg-gray-50 px-2 py-0.5 rounded border border-gray-200 text-[11px]">
                        Member: <strong className="text-emerald-700">{mPrice === 0 ? "Free" : `₹${mPrice}`}</strong> | Guest: <strong className="text-gray-900">{gPrice === 0 ? "Free" : `₹${gPrice}`}</strong>
                      </span>
                    </div>

                    {/* Mini Seat Progress */}
                    <div className="max-w-md pt-1">
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#017E84] h-1.5 rounded-full transition-all"
                          style={{ width: `${percentFilled}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 self-start xl:self-center shrink-0">
                    <Link
                      to={`/admin/events/${ev.id}/tasks`}
                      className="px-3.5 py-2 rounded-xl border border-gray-200 hover:border-[#017E84] hover:bg-teal-50/50 text-gray-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Kanban className="w-3.5 h-3.5 text-[#017E84]" />
                      <span>Task Board</span>
                    </Link>

                    <Link
                      to={`/admin/events/${ev.id}/report`}
                      className="px-3.5 py-2 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 text-gray-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <BarChart2 className="w-3.5 h-3.5 text-[#4A1942]" />
                      <span>Event Report</span>
                    </Link>

                    {/* OPEN CENTERED PROFESSIONAL EDIT MODAL */}
                    <button
                      type="button"
                      onClick={() => setEditingEvent({ ...ev })}
                      className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#4A1942] text-xs font-bold transition-colors flex items-center gap-1.5 border border-purple-200"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEventToDelete(ev)}
                      className="p-2 rounded-xl border border-gray-200 hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete Event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================================================================
          CENTERED PROFESSIONAL EDIT EVENT MODAL DIALOG
         ========================================================================= */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-2xl w-full p-6 sm:p-8 animate-in zoom-in-95 duration-150 my-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#4A1942] flex items-center justify-center font-bold">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">
                    Edit Campus Event ({editingEvent.id})
                  </h3>
                  <p className="text-xs text-gray-500">
                    Modify schedule, venue, pricing tiers, and public portal publication status.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Edit Form */}
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4A1942]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={editingEvent.category || "Workshop"}
                    onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#4A1942]"
                  >
                    <option>Workshop</option>
                    <option>Cultural &amp; Arts</option>
                    <option>Technology</option>
                    <option>Governance</option>
                    <option>Hackathon</option>
                    <option>Networking</option>
                    <option>General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Event Date</label>
                  <input
                    type="text"
                    required
                    value={editingEvent.date}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    placeholder="e.g. October 24, 2026"
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4A1942]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Time Range</label>
                  <input
                    type="text"
                    value={editingEvent.time || ""}
                    onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                    placeholder="e.g. 10:00 AM - 5:00 PM IST"
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4A1942]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Campus Venue</label>
                  <input
                    type="text"
                    required
                    value={editingEvent.venue || ""}
                    onChange={(e) => setEditingEvent({ ...editingEvent, venue: e.target.value })}
                    placeholder="e.g. Main Auditorium"
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4A1942]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Capacity / Seats</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editingEvent.capacity || editingEvent.totalSeats || 100}
                    onChange={(e) => {
                      const num = parseInt(e.target.value, 10) || 100;
                      setEditingEvent({ ...editingEvent, capacity: num, totalSeats: num });
                    }}
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 font-mono focus:outline-none focus:ring-2 focus:ring-[#4A1942]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#017E84] mb-1">Member Price (₹)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editingEvent.memberPrice ?? 0}
                    onChange={(e) => setEditingEvent({ ...editingEvent, memberPrice: parseInt(e.target.value, 10) || 0 })}
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 font-mono bg-teal-50/40 focus:outline-none focus:ring-2 focus:ring-[#017E84]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Guest Price (₹)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editingEvent.guestPrice ?? editingEvent.price ?? 250}
                    onChange={(e) => {
                      const p = parseInt(e.target.value, 10) || 0;
                      setEditingEvent({ ...editingEvent, guestPrice: p, price: p });
                    }}
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 font-mono focus:outline-none focus:ring-2 focus:ring-[#4A1942]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Event Description</label>
                <textarea
                  rows={3}
                  value={editingEvent.description || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  placeholder="Event schedule, keynotes, topics, and expectations..."
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4A1942] resize-none"
                />
              </div>

              {/* PUBLICATION TOGGLE OPTION */}
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80 space-y-2">
                <span className="block text-xs font-bold text-[#4A1942]">Public Portal Publication Status</span>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                      editingEvent.isPublished !== false
                        ? "bg-white border-emerald-500 shadow-xs text-emerald-900 font-bold"
                        : "bg-transparent border-gray-200 text-gray-600 font-medium"
                    }`}
                  >
                    <input
                      type="radio"
                      name="editPublishRadio"
                      checked={editingEvent.isPublished !== false}
                      onChange={() => setEditingEvent({ ...editingEvent, isPublished: true })}
                      className="accent-emerald-600"
                    />
                    <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-xs">Published (Live to Public)</span>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                      editingEvent.isPublished === false
                        ? "bg-white border-amber-500 shadow-xs text-amber-900 font-bold"
                        : "bg-transparent border-gray-200 text-gray-600 font-medium"
                    }`}
                  >
                    <input
                      type="radio"
                      name="editPublishRadio"
                      checked={editingEvent.isPublished === false}
                      onChange={() => setEditingEvent({ ...editingEvent, isPublished: false })}
                      className="accent-amber-600"
                    />
                    <EyeOff className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="text-xs">Draft (Internal Only)</span>
                  </label>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#4A1942] hover:bg-[#3a1232] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          CENTERED PROFESSIONAL CREATE EVENT MODAL DIALOG
         ========================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-2xl w-full p-6 sm:p-8 animate-in zoom-in-95 duration-150 my-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#017E84] flex items-center justify-center font-bold">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">
                    Create Campus Event
                  </h3>
                  <p className="text-xs text-gray-500">
                    Configure dates, venue capacity, pricing tiers, and decide whether to publish now or save as draft.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Create Form */}
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Skyline Autumn Hackathon 2026"
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4A1942]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#4A1942]"
                  >
                    <option>Workshop</option>
                    <option>Cultural &amp; Arts</option>
                    <option>Technology</option>
                    <option>Governance</option>
                    <option>Hackathon</option>
                    <option>Networking</option>
                    <option>General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Event Date *</label>
                  <input
                    type="text"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="e.g. November 12, 2026"
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4A1942]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Time Schedule</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="e.g. 10:00 AM - 5:00 PM IST"
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4A1942]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Campus Venue *</label>
                  <input
                    type="text"
                    required
                    value={newVenue}
                    onChange={(e) => setNewVenue(e.target.value)}
                    placeholder="e.g. Central Auditorium A"
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4A1942]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Capacity / Seats Limit</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 font-mono focus:outline-none focus:ring-2 focus:ring-[#4A1942]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#017E84] mb-1">Member Price (₹)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={newMemberPrice}
                    onChange={(e) => setNewMemberPrice(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 font-mono bg-teal-50/40 focus:outline-none focus:ring-2 focus:ring-[#017E84]"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">Set 0 for free member admission</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Guest Price (₹)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={newGuestPrice}
                    onChange={(e) => setNewGuestPrice(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 font-mono focus:outline-none focus:ring-2 focus:ring-[#4A1942]"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">Standard public ticket rate</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Short Description</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Outline schedule, topics, speakers, and expectations..."
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4A1942] resize-none"
                />
              </div>

              {/* PUBLISH CHOICE SELECTION */}
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80 space-y-2">
                <span className="block text-xs font-bold text-[#4A1942]">Publication &amp; Public Visibility</span>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                      newIsPublished
                        ? "bg-white border-emerald-500 shadow-xs text-emerald-900 font-bold"
                        : "bg-transparent border-gray-200 text-gray-600 font-medium"
                    }`}
                  >
                    <input
                      type="radio"
                      name="newPublishRadio"
                      checked={newIsPublished}
                      onChange={() => setNewIsPublished(true)}
                      className="accent-emerald-600"
                    />
                    <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="text-xs block">Publish to Public Site</span>
                      <span className="text-[10px] text-gray-400 font-normal">Shows in Public Featured section</span>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                      !newIsPublished
                        ? "bg-white border-amber-500 shadow-xs text-amber-900 font-bold"
                        : "bg-transparent border-gray-200 text-gray-600 font-medium"
                    }`}
                  >
                    <input
                      type="radio"
                      name="newPublishRadio"
                      checked={!newIsPublished}
                      onChange={() => setNewIsPublished(false)}
                      className="accent-amber-600"
                    />
                    <EyeOff className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <span className="text-xs block">Save as Draft</span>
                      <span className="text-[10px] text-gray-400 font-normal">Internal only (prepare tasks)</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#4A1942] hover:bg-[#3a1232] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{newIsPublished ? "Publish Event Now" : "Save Event Draft"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          CONFIRM DELETE MODAL DIALOG
         ========================================================================= */}
      {eventToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-200">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-gray-900">
                  Delete Campus Event
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Are you sure you want to remove <strong className="text-gray-900">{eventToDelete.title}</strong> (<span className="font-mono text-purple-900">{eventToDelete.id}</span>)? This will immediately remove it from all portals.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setEventToDelete(null)}
                className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors shadow-xs"
              >
                Yes, Delete Event
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

