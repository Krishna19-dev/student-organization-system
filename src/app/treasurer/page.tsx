"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp, TrendingDown, DollarSign,
  Download, CheckCircle, XCircle, Receipt,
  RefreshCw, BookOpen, AlertCircle
} from "lucide-react";
import { API_BASE } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";

export default function TreasurerPage() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, balance: 0 });
  const [breakdown, setBreakdown] = useState<any>({});
  const [claims, setClaims] = useState<any[]>([]);
  const [ledger, setLedger] = useState<any[]>([]);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const fmt = (p: number) =>
    `₹${((p || 0) / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  useEffect(() => {
    const c = document.cookie.split("; ").find((x) => x.startsWith("token="));
    if (c) setToken(c.split("=")[1]);
  }, []);

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const h = { Authorization: `Bearer ${token}` };
      const [sR, bR, cR, lR] = await Promise.all([
        fetch(`${API_BASE}/api/finance/summary`, { headers: h }),
        fetch(`${API_BASE}/api/finance/breakdown`, { headers: h }),
        fetch(`${API_BASE}/api/expenses`, { headers: h }),
        fetch(`${API_BASE}/api/finance/ledger?pageSize=50`, { headers: h }),
      ]);
      setSummary(await sR.json());
      setBreakdown((await bR.json()).incomeByCategory || {});
      setClaims((await cR.json()).items || []);
      setLedger((await lR.json()).items || []);
    } catch (e: any) { setMessage(`Error: ${e.message}`); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (token) loadData(); }, [token]);

  const approveClaim = async (id: string) => {
    const res = await fetch(`${API_BASE}/api/expenses/${id}/approve`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) { setMessage("Claim approved!"); loadData(); }
    else { const d = await res.json(); setMessage(d.error?.message || "Failed"); }
  };

  const rejectClaim = async (id: string) => {
    if (!rejectReason) { alert("Enter reason"); return; }
    const res = await fetch(`${API_BASE}/api/expenses/${id}/reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ reason: rejectReason }),
    });
    if (res.ok) { setMessage("Rejected."); setRejectId(null); setRejectReason(""); loadData(); }
  };

  const payClaim = async (id: string) => {
    const res = await fetch(`${API_BASE}/api/expenses/${id}/pay`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) { setMessage("Paid & posted to ledger!"); loadData(); }
  };

  return (
    <DashboardLayout
      role="TREASURER"
      breadcrumb={[{ label: "Finance" }]}
      title="Treasurer Finance Dashboard"
      subtitle="Real-time club P&L, expense approvals, payout recording, and audited double-entry ledger."
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.open(`${API_BASE}/api/finance/export.csv`, "_blank")}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#017E84] hover:bg-[#016368] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button
            onClick={loadData} disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      }
    >
      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-900 flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage(null)} className="font-bold ml-4">✕</button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Income", value: fmt(summary.totalIncome), icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
          { label: "Total Expenses", value: fmt(summary.totalExpenses), icon: TrendingDown, color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
          { label: "Net Balance", value: fmt(summary.balance), icon: DollarSign, color: summary.balance >= 0 ? "text-[#4A1942]" : "text-red-700", bg: "bg-purple-50", border: "border-purple-100" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`bg-white rounded-2xl border ${s.border} p-5 shadow-sm`}>
              <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Revenue Breakdown */}
      {Object.keys(breakdown).length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Revenue Breakdown by Category</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {Object.entries(breakdown).map(([cat, amt]: [string, any]) => (
              <div key={cat} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[11px] font-bold text-gray-500 block truncate">{cat}</span>
                <span className="text-sm font-black text-gray-900 block mt-0.5">{fmt(amt)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expense Claims */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-gray-900">
            Expense Claims Queue
            <span className="ml-2 text-xs font-normal text-gray-400">({claims.filter(c => c.status !== "PAID").length} pending)</span>
          </h3>
        </div>
        <div className="divide-y divide-gray-50">
          {claims.length === 0 ? (
            <div className="p-10 text-center text-gray-400 text-sm">No expense claims.</div>
          ) : claims.map((claim) => (
            <div key={claim.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-gray-900">{claim.description}</span>
                  <span className="text-xs font-black text-emerald-600">{fmt(claim.amount)}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    claim.status === "PAID" ? "bg-emerald-100 text-emerald-800"
                    : claim.status === "APPROVED" ? "bg-blue-100 text-blue-800"
                    : claim.status === "REJECTED" ? "bg-red-100 text-red-800"
                    : "bg-amber-100 text-amber-800"
                  }`}>{claim.status}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {claim.user?.name} · {claim.event?.title || "General"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {claim.receiptUrl && (
                  <a href={`${API_BASE}/api/expenses/${claim.id}/receipt`} target="_blank" rel="noreferrer"
                    className="px-2.5 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-lg text-xs font-semibold text-gray-600 flex items-center gap-1">
                    <Receipt className="w-3.5 h-3.5" /> Receipt
                  </a>
                )}
                {claim.status === "PENDING" && (
                  <>
                    <button onClick={() => approveClaim(claim.id)} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700">Approve</button>
                    <button onClick={() => setRejectId(claim.id)} className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-bold hover:bg-red-200">Reject</button>
                  </>
                )}
                {claim.status === "APPROVED" && (
                  <button onClick={() => payClaim(claim.id)} className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 shadow-sm">
                    Mark Paid & Post
                  </button>
                )}
                {rejectId === claim.id && (
                  <div className="flex gap-2 items-center">
                    <input type="text" value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                      placeholder="Reason…" className="text-xs p-2 rounded-lg border border-red-300 w-40 focus:outline-none" />
                    <button onClick={() => rejectClaim(claim.id)} className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold">Confirm</button>
                    <button onClick={() => setRejectId(null)} className="px-3 py-1.5 bg-gray-200 text-gray-600 rounded-lg text-xs font-bold">Cancel</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#4A1942]" />
          <h3 className="font-bold text-sm text-gray-900">Double-Entry Ledger <span className="text-gray-400 font-normal text-xs">(Recent 50)</span></h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Type</th>
                <th className="p-3">Category</th>
                <th className="p-3">Description</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ledger.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50/50">
                  <td className="p-3 text-gray-500">{new Date(entry.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${entry.type === "INCOME" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                      {entry.type}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-gray-700">{entry.category}</td>
                  <td className="p-3 text-gray-500">{entry.description || "—"}</td>
                  <td className={`p-3 text-right font-mono font-bold ${entry.type === "INCOME" ? "text-emerald-600" : "text-red-600"}`}>
                    {entry.type === "INCOME" ? "+" : "−"}{fmt(entry.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
