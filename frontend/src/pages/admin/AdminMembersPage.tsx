import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Users, Search, CheckCircle2, Clock, AlertCircle, 
  CreditCard, ShieldCheck, Filter 
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

interface MemberRecord {
  id: string;
  name: string;
  email: string;
  memberCode: string;
  tier: "Premium" | "Basic";
  status: "ACTIVE" | "PENDING" | "EXPIRED";
  expiryDate: string;
  duesPaid: boolean;
}

const INITIAL_MEMBERS: MemberRecord[] = [
  { id: "MBR-01", name: "Aanya Sharma", email: "aanya@skyline.test", memberCode: "SKY-2026-9041", tier: "Premium", status: "ACTIVE", expiryDate: "Oct 31, 2027", duesPaid: true },
  { id: "MBR-02", name: "Rohan Mehta", email: "rohan@skyline.test", memberCode: "SKY-2026-9042", tier: "Basic", status: "ACTIVE", expiryDate: "Aug 15, 2027", duesPaid: true },
  { id: "MBR-03", name: "Priya Kapoor", email: "priya@skyline.test", memberCode: "SKY-2026-9043", tier: "Premium", status: "ACTIVE", expiryDate: "Jul 20, 2027", duesPaid: true },
  { id: "MBR-04", name: "Dev Patel", email: "dev@skyline.test", memberCode: "SKY-2026-9044", tier: "Basic", status: "ACTIVE", expiryDate: "Sep 10, 2027", duesPaid: true },
  { id: "MBR-05", name: "Sneha Reddy", email: "sneha@skyline.test", memberCode: "SKY-2026-9045", tier: "Premium", status: "PENDING", expiryDate: "Oct 10, 2026", duesPaid: false },
  { id: "MBR-06", name: "Arjun Nair", email: "arjun@skyline.test", memberCode: "SKY-2026-9046", tier: "Basic", status: "EXPIRED", expiryDate: "Sep 01, 2026", duesPaid: false },
];

export default function AdminMembersPage() {
  const [members, setMembers] = useState<MemberRecord[]>(INITIAL_MEMBERS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "PENDING" | "EXPIRED">("ALL");

  const handleMarkPaid = (id: string) => {
    setMembers(
      members.map((m) =>
        m.id === id
          ? { ...m, status: "ACTIVE" as const, duesPaid: true, expiryDate: "Oct 31, 2027" }
          : m
      )
    );
  };

  const filtered = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.memberCode.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "ALL" || m.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout
      role="PRESIDENT"
      breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Members Roster" }]}
      title="Association Member Roster"
      subtitle="Search verified students, inspect renewal expiries, and manually record cash dues settlements."
    >
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or code..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#4A1942]"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(["ALL", "ACTIVE", "PENDING", "EXPIRED"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  filter === f
                    ? "bg-[#4A1942] text-white shadow-xs"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Members Table */}
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase font-bold">
                <tr>
                  <th className="p-4">Member</th>
                  <th className="p-4">Code</th>
                  <th className="p-4">Tier</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Valid Until</th>
                  <th className="p-4 text-right">Dues Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{m.name}</div>
                      <div className="text-[11px] text-gray-400">{m.email}</div>
                    </td>
                    <td className="p-4 font-mono font-bold text-purple-900">{m.memberCode}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">
                        {m.tier}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          m.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-800"
                            : m.status === "PENDING"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 font-mono text-[11px]">{m.expiryDate}</td>
                    <td className="p-4 text-right">
                      {m.duesPaid ? (
                        <span className="text-[11px] text-teal-700 font-bold flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Paid</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleMarkPaid(m.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#017E84] hover:bg-[#016368] text-white text-xs font-bold transition-colors shadow-2xs"
                        >
                          Mark Paid
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
