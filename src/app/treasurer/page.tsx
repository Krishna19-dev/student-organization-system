"use client";

import React, { useState, useEffect } from "react";
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  CheckCircle, 
  XCircle, 
  DollarSign, 
  FileText, 
  Receipt,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { API_BASE } from "@/lib/api";

export default function TreasurerPage() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Data
  const [summary, setSummary] = useState<{ totalIncome: number; totalExpenses: number; balance: number }>({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });
  const [breakdown, setBreakdown] = useState<any>({});
  const [claims, setClaims] = useState<any[]>([]);
  const [ledger, setLedger] = useState<any[]>([]);

  // Actions
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const foundToken = cookies.find((c) => c.startsWith("token="));
    if (foundToken) {
      setToken(foundToken.split("=")[1]);
    }
  }, []);

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    setMessage(null);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [sRes, bRes, cRes, lRes] = await Promise.all([
        fetch(`${API_BASE}/api/finance/summary`, { headers }),
        fetch(`${API_BASE}/api/finance/breakdown`, { headers }),
        fetch(`${API_BASE}/api/expenses`, { headers }),
        fetch(`${API_BASE}/api/finance/ledger?pageSize=50`, { headers }),
      ]);

      const sData = await sRes.json();
      const bData = await bRes.json();
      const cData = await cRes.json();
      const lData = await lRes.json();

      setSummary(sData);
      setBreakdown(bData.incomeByCategory || {});
      setClaims(cData.items || []);
      setLedger(lData.items || []);
    } catch (err: any) {
      setMessage(`Error loading finances: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  const handleApproveClaim = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/expenses/${id}/approve`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMessage("Expense claim approved!");
        loadData();
      } else {
        const d = await res.json();
        setMessage(`Approval error: ${d.error?.message || "Failed"}`);
      }
    } catch (e: any) {
      setMessage(`Error: ${e.message}`);
    }
  };

  const handleRejectClaim = async (id: string) => {
    if (!rejectReason) {
      alert("Please enter a reason");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/expenses/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason: rejectReason }),
      });
      if (res.ok) {
        setMessage("Claim rejected.");
        setRejectId(null);
        setRejectReason("");
        loadData();
      } else {
        const d = await res.json();
        setMessage(`Rejection error: ${d.error?.message || "Failed"}`);
      }
    } catch (e: any) {
      setMessage(`Error: ${e.message}`);
    }
  };

  const handlePayClaim = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/expenses/${id}/pay`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMessage("Claim paid and recorded as ledger expense!");
        loadData();
      } else {
        const d = await res.json();
        setMessage(`Payment error: ${d.error?.message || "Failed"}`);
      }
    } catch (e: any) {
      setMessage(`Error: ${e.message}`);
    }
  };

  const handleExportCsv = () => {
    window.open(`${API_BASE}/api/finance/export.csv`, "_blank");
  };

  const formatRupees = (paise: number) => `₹${((paise || 0) / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <Wallet className="w-6 h-6" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Treasurer Finance Dashboard
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Real-time club P&L, expense approvals, payout recording, and audited double-entry ledger.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-900 flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage(null)} className="text-emerald-700 font-bold ml-4">✕</button>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Total Income</span>
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">
            {formatRupees(summary.totalIncome)}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5 text-red-600" />
            <span>Total Expenses</span>
          </span>
          <div className="text-2xl sm:text-3xl font-black text-red-600">
            {formatRupees(summary.totalExpenses)}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-purple-600" />
            <span>Net Balance</span>
          </span>
          <div className={`text-2xl sm:text-3xl font-black ${summary.balance >= 0 ? "text-purple-700" : "text-red-700"}`}>
            {formatRupees(summary.balance)}
          </div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-gray-800 uppercase tracking-wide">Revenue Breakdown by Category</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Object.entries(breakdown).map(([cat, amt]: [string, any]) => (
            <div key={cat} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-[11px] font-bold text-gray-500 block truncate">{cat}</span>
              <span className="text-sm font-black text-gray-900 block mt-0.5">{formatRupees(amt)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Expense Claims Queue */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-gray-900">
          Expense Claims Queue ({claims.filter((c) => c.status !== "PAID").length} Pending)
        </h3>

        {claims.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border text-center text-gray-500 text-xs">
            No active expense claims submitted.
          </div>
        ) : (
          <div className="grid gap-3">
            {claims.map((claim) => (
              <div key={claim.id} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-gray-900">{claim.description}</span>
                    <span className="text-xs font-black text-emerald-600">{formatRupees(claim.amount)}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      claim.status === "PAID"
                        ? "bg-emerald-100 text-emerald-800"
                        : claim.status === "APPROVED"
                        ? "bg-blue-100 text-blue-800"
                        : claim.status === "REJECTED"
                        ? "bg-red-100 text-red-800"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {claim.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Claimant: {claim.user?.name} ({claim.user?.email}) | Event: {claim.event?.title || "General"}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {claim.receiptUrl && (
                    <a
                      href={`${API_BASE}/api/expenses/${claim.id}/receipt`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-lg text-xs font-semibold text-gray-700 flex items-center gap-1"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Receipt</span>
                    </a>
                  )}

                  {claim.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => handleApproveClaim(claim.id)}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => setRejectId(claim.id)}
                        className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-bold hover:bg-red-200"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {claim.status === "APPROVED" && (
                    <button
                      onClick={() => handlePayClaim(claim.id)}
                      className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 shadow-sm"
                    >
                      Mark Paid & Post Ledger
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ledger Entries Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b font-bold text-sm text-gray-800">
          Double-Entry Accounting Ledger (Recent 50 Entries)
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase font-semibold">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Type</th>
                <th className="p-3">Category</th>
                <th className="p-3">Description</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ledger.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50/50">
                  <td className="p-3">{new Date(entry.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      entry.type === "INCOME" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                    }`}>
                      {entry.type}
                    </span>
                  </td>
                  <td className="p-3 font-semibold">{entry.category}</td>
                  <td className="p-3">{entry.description || "N/A"}</td>
                  <td className={`p-3 text-right font-mono font-bold ${
                    entry.type === "INCOME" ? "text-emerald-600" : "text-red-600"
                  }`}>
                    {entry.type === "INCOME" ? "+" : "-"}{formatRupees(entry.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
