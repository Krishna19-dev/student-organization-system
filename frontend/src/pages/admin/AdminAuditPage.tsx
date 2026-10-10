import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Activity, Clock, User, Filter, ShieldCheck, 
  Search, Download 
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  category: "AUTH" | "FINANCE" | "MEMBERSHIP" | "ELECTION" | "EVENT";
}

const INITIAL_AUDIT_LOGS: AuditEntry[] = [
  { id: "AUD-991", actor: "Arjun Mehta (President)", action: "ELECT_OFFICER", target: "Priya Sharma as Treasurer", timestamp: "Oct 10, 2026, 05:30 PM", category: "ELECTION" },
  { id: "AUD-990", actor: "Priya Sharma (Treasurer)", action: "SETTLE_CLAIM", target: "CLM-EXP-5534 (₹16,500)", timestamp: "Oct 09, 2026, 02:15 PM", category: "FINANCE" },
  { id: "AUD-989", actor: "System Gateway", action: "DUES_PAYMENT", target: "Aanya Sharma (SKY-2026-9041)", timestamp: "Oct 09, 2026, 11:20 AM", category: "MEMBERSHIP" },
  { id: "AUD-988", actor: "Arjun Mehta (President)", action: "PUBLISH_EVENT", target: "EVT-001 Skyline Tech Summit", timestamp: "Oct 08, 2026, 04:00 PM", category: "EVENT" },
  { id: "AUD-987", actor: "Dev Patel (Volunteer)", action: "MERCH_HANDOVER", target: "ORD-9820 (2x Crest Pins)", timestamp: "Oct 06, 2026, 01:45 PM", category: "EVENT" },
  { id: "AUD-986", actor: "Admin Gateway", action: "LEDGER_CREDIT", target: "TXN-9042 Ticket Revenue (₹250)", timestamp: "Oct 05, 2026, 06:10 PM", category: "FINANCE" },
];

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditEntry[]>(INITIAL_AUDIT_LOGS);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const filtered = logs.filter((log) => {
    const matchesFilter = filter === "ALL" || log.category === filter;
    const matchesSearch =
      log.actor.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.target.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <DashboardLayout
      role="PRESIDENT"
      breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Audit Logs" }]}
      title="System Audit & Security Logs"
      subtitle="Immutable cryptographic trail of executive appointments, financial authorizations, and dues verifications."
    >
      <div className="space-y-6">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search actor, action, or target..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#4A1942]"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {["ALL", "FINANCE", "MEMBERSHIP", "ELECTION", "EVENT"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  filter === cat
                    ? "bg-[#4A1942] text-white shadow-xs"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase font-bold">
                <tr>
                  <th className="p-4">Log ID</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Executive Actor</th>
                  <th className="p-4">Target Entity</th>
                  <th className="p-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-purple-900">{log.id}</td>
                    <td className="p-4">
                      <span className="font-bold text-gray-900">{log.action}</span>
                      <span className="block text-[10px] text-gray-400 font-mono">{log.category}</span>
                    </td>
                    <td className="p-4 text-gray-700">{log.actor}</td>
                    <td className="p-4 font-mono text-gray-600">{log.target}</td>
                    <td className="p-4 text-right text-gray-400 font-mono text-[11px] whitespace-nowrap">
                      {log.timestamp}
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
