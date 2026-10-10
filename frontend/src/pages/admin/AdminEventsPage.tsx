import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Calendar, PlusCircle, Edit3, Kanban, BarChart2, 
  MapPin, Users, Ticket, CheckCircle2 
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const INITIAL_EVENTS = [
  {
    id: "EVT-001",
    title: "Skyline Tech & Design Summit 2026",
    date: "October 24, 2026",
    venue: "Main Auditorium",
    totalSeats: 120,
    seatsSold: 108,
    memberPrice: 0,
    guestPrice: 250,
    status: "ACTIVE",
  },
  {
    id: "EVT-002",
    title: "Acoustic Sunset Jam & Open Mic",
    date: "November 02, 2026",
    venue: "Open Air Amphitheatre",
    totalSeats: 80,
    seatsSold: 80,
    memberPrice: 50,
    guestPrice: 150,
    status: "SOLD_OUT",
  },
  {
    id: "EVT-003",
    title: "Annual General Body Assembly",
    date: "October 18, 2026",
    venue: "Council Hall B",
    totalSeats: 200,
    seatsSold: 155,
    memberPrice: 0,
    guestPrice: 0,
    status: "ACTIVE",
  },
];

export default function AdminEventsPage() {
  const [events, setEvents] = useState(INITIAL_EVENTS);

  return (
    <DashboardLayout
      role="PRESIDENT"
      breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Events Management" }]}
      title="President & Council Event Management"
      subtitle="Publish campus events, monitor seat bookings, supervise volunteer boards, and review event P&L."
      actions={
        <Link
          to="/admin/events/new"
          className="flex items-center gap-1.5 px-4 py-2 bg-[#4A1942] hover:bg-[#3a1232] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Event</span>
        </Link>
      }
    >
      <div className="space-y-4">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-purple-900">{ev.id}</span>
                <span
                  className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    ev.status === "ACTIVE"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {ev.status}
                </span>
              </div>

              <h3 className="font-bold text-base text-gray-900">{ev.title}</h3>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#017E84]" />
                  {ev.date}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#017E84]" />
                  {ev.venue}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#017E84]" />
                  {ev.seatsSold}/{ev.totalSeats} seats booked
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
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

              <Link
                to={`/admin/events/${ev.id}/edit`}
                className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
