import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  Calendar, MapPin, Users, Ticket, CheckCircle2, 
  ArrowLeft, Save, Globe, EyeOff, Sparkles 
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { getStoredEvents, saveStoredEvents, PublicEvent } from "@/lib/events-store";

export default function AdminEventFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Workshop");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00 AM - 5:00 PM IST");
  const [venue, setVenue] = useState("");
  const [totalSeats, setTotalSeats] = useState(120);
  const [memberPrice, setMemberPrice] = useState(0);
  const [nonMemberPrice, setNonMemberPrice] = useState(250);
  const [description, setDescription] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const events = getStoredEvents();
    if (isEditing && id) {
      const existing = events.find((e) => e.id === id);
      if (existing) {
        setTitle(existing.title);
        setCategory(existing.category || "Workshop");
        setDate(existing.date);
        setTime(existing.time || "10:00 AM - 5:00 PM IST");
        setVenue(existing.venue || "");
        setTotalSeats(existing.capacity || existing.totalSeats || 120);
        setMemberPrice(existing.memberPrice ?? 0);
        setNonMemberPrice(existing.guestPrice ?? existing.price ?? 250);
        setDescription(existing.description || "");
        setIsPublished(existing.isPublished !== false);
      }
    }
  }, [id, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const events = getStoredEvents();
    if (isEditing && id) {
      const updated = events.map((ev) => {
        if (ev.id === id) {
          return {
            ...ev,
            title,
            category,
            date,
            time,
            venue,
            capacity: totalSeats,
            totalSeats,
            memberPrice,
            guestPrice: nonMemberPrice,
            price: nonMemberPrice,
            description,
            isPublished,
          };
        }
        return ev;
      });
      saveStoredEvents(updated);
    } else {
      const nextId = `EVT-${String(events.length + 1).padStart(3, "0")}`;
      const newEvent: PublicEvent = {
        id: nextId,
        title,
        category,
        date,
        time,
        venue,
        capacity: totalSeats,
        totalSeats,
        tickets: 0,
        seatsSold: 0,
        memberPrice,
        guestPrice: nonMemberPrice,
        price: nonMemberPrice,
        revenue: "₹0",
        description,
        status: "upcoming",
        isPublished,
        highlights: ["Keynote Session", "Networking Session", "Certificate of Participation"],
      };
      saveStoredEvents([newEvent, ...events]);
    }

    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => navigate("/admin/events"), 600);
    }, 400);
  };

  return (
    <DashboardLayout
      role="PRESIDENT"
      breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Events", href: "/admin/events" }, { label: isEditing ? `Edit ${id}` : "New Event" }]}
      title={isEditing ? `Edit Event (${id})` : "Create Campus Event"}
      subtitle="Configure date, venue capacity, pricing tiers, and public portal publication status."
    >
      <div className="max-w-2xl bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs">
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Event saved successfully! Redirecting to events management...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Event Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Skyline Autumn Hackathon 2026"
              className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4A1942]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. October 24, 2026"
                className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4A1942]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Time Schedule</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 10:00 AM - 5:00 PM IST"
                className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4A1942]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Campus Venue *</label>
              <input
                type="text"
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. Central Auditorium A"
                className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4A1942]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Total Capacity / Seats Limit</label>
            <input
              type="number"
              required
              min={1}
              value={totalSeats}
              onChange={(e) => setTotalSeats(Number(e.target.value))}
              className="w-full text-xs p-3 rounded-xl border border-gray-200 font-mono focus:outline-none focus:ring-2 focus:ring-[#4A1942]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <div>
              <label className="block text-xs font-bold text-[#017E84] mb-1">Member Price (₹)</label>
              <input
                type="number"
                required
                min={0}
                value={memberPrice}
                onChange={(e) => setMemberPrice(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-[#017E84]"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Set 0 for free member admission</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Non-Member / Guest Price (₹)</label>
              <input
                type="number"
                required
                min={0}
                value={nonMemberPrice}
                onChange={(e) => setNonMemberPrice(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-[#4A1942]"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Standard public ticket rate</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Short Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4A1942]"
              placeholder="Outline schedule, topics, and expectations..."
            />
          </div>

          {/* PUBLISH CHOICE */}
          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80 space-y-2">
            <span className="block text-xs font-bold text-[#4A1942]">Public Portal Publication Status</span>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                  isPublished
                    ? "bg-white border-emerald-500 shadow-xs text-emerald-900 font-bold"
                    : "bg-transparent border-gray-200 text-gray-600 font-medium"
                }`}
              >
                <input
                  type="radio"
                  name="formPublishRadio"
                  checked={isPublished}
                  onChange={() => setIsPublished(true)}
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
                  !isPublished
                    ? "bg-white border-amber-500 shadow-xs text-amber-900 font-bold"
                    : "bg-transparent border-gray-200 text-gray-600 font-medium"
                }`}
              >
                <input
                  type="radio"
                  name="formPublishRadio"
                  checked={!isPublished}
                  onChange={() => setIsPublished(false)}
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

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-[#4A1942] hover:bg-[#3a1232] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving..." : isEditing ? "Update Event" : isPublished ? "Publish Event" : "Save Event Draft"}</span>
            </button>
            <Link
              to="/admin/events"
              className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

