import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  Calendar, MapPin, Users, Ticket, CheckCircle2, 
  ArrowLeft, Save 
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

export default function AdminEventFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState(isEditing ? "Skyline Tech & Design Summit 2026" : "");
  const [date, setDate] = useState(isEditing ? "2026-10-24" : "");
  const [venue, setVenue] = useState(isEditing ? "Main Auditorium, Central Campus" : "");
  const [totalSeats, setTotalSeats] = useState(isEditing ? 120 : 100);
  const [memberPrice, setMemberPrice] = useState(isEditing ? 0 : 0);
  const [nonMemberPrice, setNonMemberPrice] = useState(isEditing ? 250 : 200);
  const [description, setDescription] = useState(isEditing ? "Annual symposium covering engineering and design." : "");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => navigate("/admin/events"), 800);
    }, 700);
  };

  return (
    <DashboardLayout
      role="PRESIDENT"
      breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Events", href: "/admin/events" }, { label: isEditing ? "Edit Event" : "New Event" }]}
      title={isEditing ? `Edit Event (${id})` : "Create Campus Event"}
      subtitle="Configure date, venue capacity, pricing tiers, and registration limits."
    >
      <div className="max-w-2xl bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs">
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Event saved successfully! Redirecting...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Event Title</label>
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
              <label className="block text-xs font-bold text-gray-700 mb-1">Event Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4A1942]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Campus Venue</label>
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
              className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4A1942]"
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
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#017E84]"
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
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#4A1942]"
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

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-[#4A1942] hover:bg-[#3a1232] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving..." : isEditing ? "Update Event" : "Publish Event"}</span>
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
