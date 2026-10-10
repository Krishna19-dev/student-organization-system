import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Users, UserCheck, ShieldCheck, ArrowRight, 
  Search, CheckCircle2, Sparkles, Award 
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

interface MemberRoster {
  id: string;
  name: string;
  email: string;
  role: "MEMBER" | "VOLUNTEER";
  tier: "Premium" | "Basic";
  tasksCompleted: number;
}

const INITIAL_ROSTER: MemberRoster[] = [
  { id: "M-101", name: "Ananya Iyer", email: "ananya@skyline.test", role: "VOLUNTEER", tier: "Premium", tasksCompleted: 8 },
  { id: "M-102", name: "Rohan Mehta", email: "rohan@skyline.test", role: "VOLUNTEER", tier: "Basic", tasksCompleted: 5 },
  { id: "M-103", name: "Dev Patel", email: "dev@skyline.test", role: "VOLUNTEER", tier: "Basic", tasksCompleted: 3 },
  { id: "M-104", name: "Sneha Reddy", email: "sneha@skyline.test", role: "MEMBER", tier: "Premium", tasksCompleted: 0 },
  { id: "M-105", name: "Aarav Sharma", email: "aarav@skyline.test", role: "MEMBER", tier: "Basic", tasksCompleted: 0 },
  { id: "M-106", name: "Tanvi Verma", email: "tanvi@skyline.test", role: "MEMBER", tier: "Premium", tasksCompleted: 0 },
];

export default function AdminVolunteersPage() {
  const [roster, setRoster] = useState<MemberRoster[]>(INITIAL_ROSTER);
  const [search, setSearch] = useState("");
  const [promotedMessage, setPromotedMessage] = useState<string | null>(null);

  const handlePromote = (memberId: string) => {
    setRoster(
      roster.map((m) => (m.id === memberId ? { ...m, role: "VOLUNTEER" as const } : m))
    );
    const member = roster.find((m) => m.id === memberId);
    setPromotedMessage(`${member?.name} has been promoted to Volunteer Operations Crew!`);
    setTimeout(() => setPromotedMessage(null), 3000);
  };

  const filtered = roster.filter(
    (m) => m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout
      role="PRESIDENT"
      breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Volunteer Crew" }]}
      title="Volunteer Operations Assignment"
      subtitle="Promote active members to the operational crew and assign event logistics ownership."
    >
      <div className="space-y-6">
        {promotedMessage && (
          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#017E84]" />
            <span>{promotedMessage}</span>
          </div>
        )}

        {/* Search */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search member name or email..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#4A1942]"
            />
          </div>

          <span className="text-xs text-gray-400">
            {roster.filter((m) => m.role === "VOLUNTEER").length} Active Crew Members
          </span>
        </div>

        {/* Members Roster Table */}
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase font-bold">
                <tr>
                  <th className="p-4">Member Name</th>
                  <th className="p-4">Current Role</th>
                  <th className="p-4">Tier</th>
                  <th className="p-4 text-center">Tasks Handled</th>
                  <th className="p-4 text-right">Promotion Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{m.name}</div>
                      <div className="text-[11px] text-gray-400">{m.email}</div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          m.role === "VOLUNTEER"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {m.role}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{m.tier}</td>
                    <td className="p-4 text-center font-mono font-bold text-purple-900">
                      {m.tasksCompleted}
                    </td>
                    <td className="p-4 text-right">
                      {m.role === "VOLUNTEER" ? (
                        <span className="text-[11px] text-teal-700 font-bold flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Assigned Volunteer</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handlePromote(m.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#017E84] hover:bg-[#016368] text-white text-xs font-bold transition-colors shadow-2xs"
                        >
                          Promote to Volunteer
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
