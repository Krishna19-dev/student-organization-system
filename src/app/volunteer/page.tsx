"use client";

import React, { useState, useEffect } from "react";
import { 
  CheckSquare, 
  QrCode, 
  Receipt, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Upload, 
  RefreshCw 
} from "lucide-react";
import { API_BASE } from "@/lib/api";

export default function VolunteerPage() {
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"tasks" | "scanner" | "expenses">("tasks");
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Scanner State
  const [scanToken, setScanToken] = useState("");
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [scanning, setScanning] = useState(false);

  // Expense Claim State
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [submittingExpense, setSubmittingExpense] = useState(false);

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const foundToken = cookies.find((c) => c.startsWith("token="));
    if (foundToken) {
      setToken(foundToken.split("=")[1]);
    }
  }, []);

  const loadTasks = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/tasks/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadTasks();
  }, [token]);

  const handleUpdateStatus = async (taskId: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/tasks/${taskId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setMessage(`Task status updated to ${newStatus}`);
        loadTasks();
      }
    } catch (err: any) {
      setMessage(`Failed to update: ${err.message}`);
    }
  };

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanToken.trim()) return;
    setScanning(true);
    setScanResult(null);

    try {
      const res = await fetch(`${API_BASE}/api/tickets/checkin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ qrToken: scanToken.trim() }),
      });

      const data = await res.json();
      setScanResult(data);
    } catch (err: any) {
      setScanResult({ result: "ERROR", message: err.message });
    } finally {
      setScanning(false);
    }
  };

  const handleSubmitExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptFile || !amount || !description) {
      alert("Please fill all fields and attach a receipt file");
      return;
    }

    setSubmittingExpense(true);
    try {
      const formData = new FormData();
      formData.append("amount", (parseFloat(amount) * 100).toString());
      formData.append("description", description);
      formData.append("receipt", receiptFile);

      const res = await fetch(`${API_BASE}/api/expenses`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        setMessage("Expense claim submitted for Treasurer review!");
        setAmount("");
        setDescription("");
        setReceiptFile(null);
      } else {
        const d = await res.json();
        setMessage(`Submission failed: ${d.error?.message || "Error"}`);
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSubmittingExpense(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <CheckSquare className="w-6 h-6" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Volunteer Operations Desk
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Execute assigned tasks, complete sponsor deliverables, and scan QR event tickets at entry.
          </p>
        </div>

        <button
          onClick={loadTasks}
          disabled={loading}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Sync Board</span>
        </button>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-900 flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage(null)} className="text-amber-700 font-bold ml-4">✕</button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b pb-2">
        {[
          { id: "tasks", label: "My Tasks Board", icon: CheckSquare },
          { id: "scanner", label: "Ticket Check-In Scanner", icon: QrCode },
          { id: "expenses", label: "Submit Expense Claim", icon: Receipt },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                isActive
                  ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: TASKS BOARD */}
      {activeTab === "tasks" && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-gray-900">Assigned Tasks ({tasks.length})</h2>

          {tasks.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-gray-200 text-gray-500 text-sm">
              No tasks currently assigned to you. Enjoy your day!
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <div key={task.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        task.status === "DONE"
                          ? "bg-emerald-100 text-emerald-800"
                          : task.status === "IN_PROGRESS"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {task.status}
                      </span>
                      {task.dueDate && (
                        <span className="text-[11px] text-gray-400">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-sm text-gray-900">{task.title}</h3>

                    {task.event && (
                      <span className="text-xs text-blue-600 block">
                        Event: {task.event.title}
                      </span>
                    )}
                    {task.fundraiser && (
                      <span className="text-xs text-purple-600 block">
                        Fundraiser: {task.fundraiser.title}
                      </span>
                    )}
                  </div>

                  <div className="border-t pt-3 flex gap-1.5">
                    {task.status !== "TODO" && (
                      <button
                        onClick={() => handleUpdateStatus(task.id, "TODO")}
                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] rounded-lg font-bold"
                      >
                        To-Do
                      </button>
                    )}
                    {task.status !== "IN_PROGRESS" && (
                      <button
                        onClick={() => handleUpdateStatus(task.id, "IN_PROGRESS")}
                        className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-[11px] rounded-lg font-bold"
                      >
                        In Progress
                      </button>
                    )}
                    {task.status !== "DONE" && (
                      <button
                        onClick={() => handleUpdateStatus(task.id, "DONE")}
                        className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] rounded-lg font-bold ml-auto"
                      >
                        Mark Done ✓
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TICKET SCANNER */}
      {activeTab === "scanner" && (
        <div className="max-w-md mx-auto bg-white p-6 rounded-3xl border border-gray-200 shadow-md space-y-6">
          <div className="text-center space-y-1">
            <h3 className="font-bold text-lg text-gray-900">Event Entrance Check-In Scanner</h3>
            <p className="text-xs text-gray-500">Scan QR or enter the attendee&apos;s 32-char token.</p>
          </div>

          <form onSubmit={handleCheckIn} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Ticket QR Token</label>
              <input
                type="text"
                required
                value={scanToken}
                onChange={(e) => setScanToken(e.target.value)}
                placeholder="Paste or scan token (e.g. a4f7...)"
                className="w-full p-3 font-mono text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={scanning}
              className="w-full py-3 bg-amber-600 text-white font-bold text-sm rounded-xl hover:bg-amber-700 transition-all shadow-md flex items-center justify-center gap-2"
            >
              {scanning ? "Verifying..." : "Validate Ticket Entry"}
            </button>
          </form>

          {/* Validation Result Box */}
          {scanResult && (
            <div className={`p-4 rounded-2xl border text-center space-y-2 ${
              scanResult.result === "VALID"
                ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                : scanResult.result === "ALREADY_USED"
                ? "bg-amber-50 border-amber-300 text-amber-900"
                : "bg-red-50 border-red-300 text-red-900"
            }`}>
              <div className="flex items-center justify-center gap-2 font-black text-base">
                {scanResult.result === "VALID" && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                {scanResult.result === "ALREADY_USED" && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                {scanResult.result === "INVALID" && <XCircle className="w-5 h-5 text-red-600" />}
                <span>RESULT: {scanResult.result}</span>
              </div>

              {scanResult.result === "VALID" && (
                <div className="text-xs">
                  <p><strong>Attendee:</strong> {scanResult.ticket?.user?.name || "Guest"}</p>
                  <p><strong>Event:</strong> {scanResult.ticket?.event?.title}</p>
                </div>
              )}

              {scanResult.result === "ALREADY_USED" && (
                <p className="text-xs">
                  This pass was already scanned and used earlier. Entry denied.
                </p>
              )}

              {scanResult.result === "INVALID" && (
                <p className="text-xs">
                  No ticket was found matching this token in the association records.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: EXPENSE CLAIM */}
      {activeTab === "expenses" && (
        <div className="max-w-lg mx-auto bg-white p-6 rounded-3xl border border-gray-200 shadow-md space-y-5">
          <div className="text-center space-y-1">
            <h3 className="font-bold text-lg text-gray-900">Submit Volunteer Expense Claim</h3>
            <p className="text-xs text-gray-500">Attach proof of purchase for club reimbursement review.</p>
          </div>

          <form onSubmit={handleSubmitExpense} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Expense Amount (in Rupees ₹)</label>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 450.00"
                className="w-full p-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Description / Purpose</label>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Event poster printing & markers"
                className="w-full p-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Receipt Attachment (PDF / PNG / JPG)</label>
              <input
                type="file"
                required
                accept="image/*,application/pdf"
                onChange={(e) => setReceiptFile(e.target.files ? e.target.files[0] : null)}
                className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
              />
            </div>

            <button
              type="submit"
              disabled={submittingExpense}
              className="w-full py-3 bg-amber-600 text-white font-bold text-sm rounded-xl hover:bg-amber-700 transition-all shadow-md flex items-center justify-center gap-2"
            >
              {submittingExpense ? "Submitting..." : "Send to Treasurer for Approval"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
