"use client";

import React, { useState, useEffect } from "react";
import {
  CheckSquare, QrCode, Receipt, CheckCircle,
  AlertTriangle, XCircle, RefreshCw, Upload
} from "lucide-react";
import { API_BASE } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";

export default function VolunteerPage() {
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"tasks" | "scanner" | "expenses">("tasks");
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Scanner
  const [scanToken, setScanToken] = useState("");
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [scanning, setScanning] = useState(false);

  // Expense
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [submittingExpense, setSubmittingExpense] = useState(false);

  useEffect(() => {
    const c = document.cookie.split("; ").find(x => x.startsWith("token="));
    if (c) setToken(c.split("=")[1]);
  }, []);

  const loadTasks = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/api/tasks/mine`, { headers: { Authorization: `Bearer ${token}` } });
      const d = await r.json();
      setTasks(Array.isArray(d) ? d : []);
    } catch (e: any) { setMessage(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (token) loadTasks(); }, [token]);

  const updateStatus = async (taskId: string, status: string) => {
    await fetch(`${API_BASE}/api/tasks/${taskId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    setMessage(`Task → ${status}`);
    loadTasks();
  };

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setScanning(true); setScanResult(null);
    try {
      const r = await fetch(`${API_BASE}/api/tickets/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ qrToken: scanToken.trim() }),
      });
      setScanResult(await r.json());
    } catch (e: any) { setScanResult({ result: "ERROR", message: e.message }); }
    finally { setScanning(false); }
  };

  const handleExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptFile) { alert("Attach receipt"); return; }
    setSubmittingExpense(true);
    try {
      const fd = new FormData();
      fd.append("amount", (parseFloat(amount) * 100).toString());
      fd.append("description", description);
      fd.append("receipt", receiptFile);
      const r = await fetch(`${API_BASE}/api/expenses`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
      if (r.ok) { setMessage("Claim submitted!"); setAmount(""); setDescription(""); setReceiptFile(null); }
      else { const d = await r.json(); setMessage(d.error?.message || "Failed"); }
    } catch (e: any) { setMessage(e.message); }
    finally { setSubmittingExpense(false); }
  };

  const tabs = [
    { id: "tasks", label: "My Tasks", icon: CheckSquare },
    { id: "scanner", label: "QR Check-In", icon: QrCode },
    { id: "expenses", label: "Expense Claim", icon: Receipt },
  ] as const;

  const statusColors: Record<string, string> = {
    DONE: "bg-emerald-100 text-emerald-800",
    IN_PROGRESS: "bg-blue-100 text-blue-800",
    TODO: "bg-gray-100 text-gray-700",
  };

  return (
    <DashboardLayout
      role="VOLUNTEER"
      breadcrumb={[{ label: "Operations" }]}
      title="Volunteer Operations Desk"
      subtitle="Execute assigned tasks, perform live QR ticket check-in, and submit expense claims."
      actions={
        <button onClick={loadTasks} disabled={loading}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Sync Board
        </button>
      }
    >
      {message && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-900 flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage(null)} className="font-bold ml-4">✕</button>
        </div>
      )}

      {/* Stat strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "To-Do", count: tasks.filter(t => t.status === "TODO").length, color: "text-gray-600", bg: "bg-gray-50" },
          { label: "In Progress", count: tasks.filter(t => t.status === "IN_PROGRESS").length, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Done", count: tasks.filter(t => t.status === "DONE").length, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl border border-gray-100 p-4 shadow-sm text-center`}>
            <div className={`text-2xl font-black ${s.color}`}>{s.count}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
                  isActive ? "border-amber-500 text-amber-700 bg-amber-50/50" : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}>
                <Icon className="w-3.5 h-3.5" /> {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-5">
          {/* Tasks board */}
          {activeTab === "tasks" && (
            <div className="space-y-3">
              {tasks.length === 0 ? (
                <div className="p-10 text-center text-gray-400 text-sm bg-gray-50 rounded-xl">No tasks assigned. All clear!</div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tasks.map(task => (
                    <div key={task.id} className="bg-gray-50 rounded-xl border border-gray-100 p-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${statusColors[task.status] || "bg-gray-100 text-gray-700"}`}>
                          {task.status}
                        </span>
                        {task.dueDate && <span className="text-[11px] text-gray-400">Due {new Date(task.dueDate).toLocaleDateString()}</span>}
                      </div>
                      <h3 className="font-bold text-sm text-gray-900">{task.title}</h3>
                      {task.event && <span className="text-xs text-blue-600">Event: {task.event.title}</span>}
                      {task.fundraiser && <span className="text-xs text-purple-600">Fundraiser: {task.fundraiser.title}</span>}
                      <div className="border-t pt-3 flex gap-1.5 flex-wrap">
                        {task.status !== "TODO" && (
                          <button onClick={() => updateStatus(task.id, "TODO")} className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] rounded-lg font-bold">To-Do</button>
                        )}
                        {task.status !== "IN_PROGRESS" && (
                          <button onClick={() => updateStatus(task.id, "IN_PROGRESS")} className="px-2.5 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-[11px] rounded-lg font-bold">In Progress</button>
                        )}
                        {task.status !== "DONE" && (
                          <button onClick={() => updateStatus(task.id, "DONE")} className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] rounded-lg font-bold ml-auto">
                            ✓ Done
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Scanner */}
          {activeTab === "scanner" && (
            <div className="max-w-md mx-auto space-y-5">
              <div className="text-center space-y-1">
                <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-3">
                  <QrCode className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="font-bold text-base text-gray-900">Ticket Check-In Scanner</h3>
                <p className="text-xs text-gray-500">Paste or type the attendee QR token to validate entry.</p>
              </div>
              <form onSubmit={handleCheckIn} className="space-y-3">
                <input type="text" required value={scanToken} onChange={e => setScanToken(e.target.value)}
                  placeholder="Paste QR token (e.g. a4f7abc…)"
                  className="w-full p-3 font-mono text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50" />
                <button type="submit" disabled={scanning}
                  className="w-full py-3 bg-amber-600 text-white font-bold text-sm rounded-xl hover:bg-amber-700 transition-all shadow-md">
                  {scanning ? "Verifying…" : "Validate Ticket Entry"}
                </button>
              </form>
              {scanResult && (
                <div className={`p-4 rounded-2xl border text-center space-y-2 ${
                  scanResult.result === "VALID" ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                  : scanResult.result === "ALREADY_USED" ? "bg-amber-50 border-amber-300 text-amber-900"
                  : "bg-red-50 border-red-300 text-red-900"
                }`}>
                  <div className="flex items-center justify-center gap-2 font-black text-base">
                    {scanResult.result === "VALID" && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                    {scanResult.result === "ALREADY_USED" && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                    {scanResult.result === "INVALID" && <XCircle className="w-5 h-5 text-red-600" />}
                    {scanResult.result}
                  </div>
                  {scanResult.result === "VALID" && (
                    <div className="text-xs"><p><strong>Attendee:</strong> {scanResult.ticket?.user?.name || "Guest"}</p>
                    <p><strong>Event:</strong> {scanResult.ticket?.event?.title}</p></div>
                  )}
                  {scanResult.result === "ALREADY_USED" && <p className="text-xs">Already scanned — entry denied.</p>}
                  {scanResult.result === "INVALID" && <p className="text-xs">No ticket found for this token.</p>}
                </div>
              )}
            </div>
          )}

          {/* Expense claim */}
          {activeTab === "expenses" && (
            <div className="max-w-lg mx-auto space-y-5">
              <div className="text-center space-y-1">
                <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-3">
                  <Receipt className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="font-bold text-base text-gray-900">Submit Expense Claim</h3>
                <p className="text-xs text-gray-500">Attach receipt for Treasurer review and reimbursement.</p>
              </div>
              <form onSubmit={handleExpense} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Amount (₹)</label>
                  <input type="number" step="0.01" required value={amount} onChange={e => setAmount(e.target.value)}
                    placeholder="e.g. 450.00"
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50" />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Description</label>
                  <input type="text" required value={description} onChange={e => setDescription(e.target.value)}
                    placeholder="e.g. Event poster printing & markers"
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50" />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Receipt (PDF / PNG / JPG)</label>
                  <label className="flex items-center gap-3 w-full p-3 rounded-xl border-2 border-dashed border-gray-200 hover:border-amber-400 cursor-pointer transition-all bg-gray-50">
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-500">{receiptFile ? receiptFile.name : "Click to attach receipt…"}</span>
                    <input type="file" required accept="image/*,application/pdf" className="hidden"
                      onChange={e => setReceiptFile(e.target.files?.[0] || null)} />
                  </label>
                </div>
                <button type="submit" disabled={submittingExpense}
                  className="w-full py-3 bg-amber-600 text-white font-bold text-sm rounded-xl hover:bg-amber-700 transition-all shadow-md">
                  {submittingExpense ? "Submitting…" : "Send to Treasurer"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
