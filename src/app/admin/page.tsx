"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Users, 
  Award, 
  ShoppingBag, 
  FileText, 
  CheckCircle, 
  XCircle, 
  CreditCard, 
  RefreshCw, 
  Search, 
  AlertCircle,
  Clock
} from "lucide-react";
import { API_BASE } from "@/lib/api";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"applications" | "members" | "election" | "orders" | "audit">("applications");
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Data states
  const [applications, setApplications] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [expiring, setExpiring] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);

  // Action states
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [electUserId, setElectUserId] = useState("");
  const [electRole, setElectRole] = useState("VP_EVENTS");

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
    setStatusMessage(null);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      if (activeTab === "applications") {
        const res = await fetch(`${API_BASE}/api/admin/applications?status=UNDER_REVIEW`, { headers });
        const data = await res.json();
        setApplications(data.items || []);
      } else if (activeTab === "members") {
        const [mRes, eRes] = await Promise.all([
          fetch(`${API_BASE}/api/admin/members`, { headers }),
          fetch(`${API_BASE}/api/admin/memberships/expiring`, { headers }),
        ]);
        const mData = await mRes.json();
        const eData = await eRes.json();
        setMembers(mData.items || []);
        setExpiring(eData || []);
      } else if (activeTab === "orders") {
        const res = await fetch(`${API_BASE}/api/admin/orders`, { headers });
        const data = await res.json();
        setOrders(data.orders || []);
      } else if (activeTab === "election") {
        const [rRes, mRes] = await Promise.all([
          fetch(`${API_BASE}/api/admin/roles`, { headers }),
          fetch(`${API_BASE}/api/admin/members`, { headers }),
        ]);
        const rData = await rRes.json();
        const mData = await mRes.json();
        setRoles(rData || []);
        setMembers(mData.items || []);
      } else if (activeTab === "audit") {
        const res = await fetch(`${API_BASE}/api/admin/audit`, { headers });
        const data = await res.json();
        setAuditLogs(data.items || []);
      }
    } catch (err: any) {
      setStatusMessage(`Error loading data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadData();
  }, [token, activeTab]);

  const handleApprove = async (id: string, desiredPosition: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/applications/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ assignedPosition: desiredPosition }),
      });
      if (res.ok) {
        setStatusMessage("Application approved successfully!");
        loadData();
      } else {
        const d = await res.json();
        setStatusMessage(`Approval failed: ${d.error?.message || "Error"}`);
      }
    } catch (e: any) {
      setStatusMessage(`Error: ${e.message}`);
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectReason) {
      alert("Please enter a rejection reason");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/admin/applications/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ note: rejectReason }),
      });
      if (res.ok) {
        setStatusMessage("Application rejected and refund logged.");
        setRejectId(null);
        setRejectReason("");
        loadData();
      } else {
        const d = await res.json();
        setStatusMessage(`Rejection failed: ${d.error?.message || "Error"}`);
      }
    } catch (e: any) {
      setStatusMessage(`Error: ${e.message}`);
    }
  };

  const handleElect = async () => {
    if (!electUserId) {
      alert("Please select a candidate");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/admin/election`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId: electUserId, role: electRole }),
      });
      if (res.ok) {
        setStatusMessage("Officer elected successfully!");
        loadData();
      } else {
        const d = await res.json();
        setStatusMessage(`Election failed: ${d.error?.message || "Error"}`);
      }
    } catch (e: any) {
      setStatusMessage(`Error: ${e.message}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <ShieldCheck className="w-6 h-6" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              President Operations Portal
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Executive oversight: Applications Queue, Member Roster, Officer Elections, Orders & Audit Logs.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs font-medium text-purple-900 flex items-center justify-between">
          <span>{statusMessage}</span>
          <button onClick={() => setStatusMessage(null)} className="text-purple-600 font-bold ml-4">
            ✕
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b pb-2">
        {[
          { id: "applications", label: "Applications Queue", icon: FileText },
          { id: "members", label: "Members & Expiry", icon: Users },
          { id: "election", label: "Officer Elections", icon: Award },
          { id: "orders", label: "Merch Orders", icon: ShoppingBag },
          { id: "audit", label: "Audit Logs", icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Applications Queue */}
      {activeTab === "applications" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Pending Review ({applications.length})</h2>
            <span className="text-xs text-gray-500">Sorted by submission date (Oldest first)</span>
          </div>

          {applications.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-gray-200 text-gray-500 text-sm">
              No applications currently under review.
            </div>
          ) : (
            <div className="grid gap-4">
              {applications.map((app) => (
                <div key={app.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b pb-3">
                    <div>
                      <span className="font-bold text-gray-900 text-base">{app.user?.name}</span>
                      <span className="text-xs text-gray-500 ml-2">({app.user?.email})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700">
                        {app.type} ({app.tier})
                      </span>
                      {app.desiredPosition !== "NONE" && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700">
                          Role: {app.desiredPosition}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-gray-700 space-y-1 bg-gray-50 p-3 rounded-xl">
                    <p><strong>Skills:</strong> {app.skills || "Not specified"}</p>
                    {app.notes && <p><strong>Notes:</strong> {app.notes}</p>}
                    <p className="text-gray-400">
                      Payment ID: {app.payment?.orderId || app.paymentId} | Paid: ₹{((app.payment?.amount || 0) / 100).toFixed(2)}
                    </p>
                  </div>

                  {rejectId === app.id ? (
                    <div className="p-3 bg-red-50 rounded-xl space-y-2 border border-red-200">
                      <label className="block text-xs font-bold text-red-800">Reason for rejection (Required):</label>
                      <input
                        type="text"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="e.g. Incomplete application or prerequisites missing"
                        className="w-full text-xs p-2 rounded-lg border border-red-300 focus:outline-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReject(app.id)}
                          className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold"
                        >
                          Confirm Rejection & Refund
                        </button>
                        <button
                          onClick={() => setRejectId(null)}
                          className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        onClick={() => setRejectId(app.id)}
                        className="flex items-center gap-1.5 px-3.5 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition-all"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => handleApprove(app.id, app.desiredPosition)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve & Activate</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Members & Expiry */}
      {activeTab === "members" && (
        <div className="space-y-6">
          {/* Expiring Soon Banner */}
          {expiring.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
              <span className="text-xs font-bold text-amber-800 uppercase flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Expiring Within 30 Days ({expiring.length})</span>
              </span>
              <div className="grid sm:grid-cols-2 gap-2">
                {expiring.map((m) => (
                  <div key={m.id} className="text-xs bg-white p-2.5 rounded-xl border border-amber-200 flex justify-between">
                    <div>
                      <span className="font-bold text-gray-900">{m.user?.name}</span> ({m.memberCode})
                    </div>
                    <span className="text-amber-700 font-semibold">
                      Expires: {new Date(m.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Members Table */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b font-bold text-sm text-gray-800">
              Active Member Directory ({members.length})
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-gray-50 text-gray-700 uppercase font-semibold">
                  <tr>
                    <th className="p-3">Member Name</th>
                    <th className="p-3">Member Code</th>
                    <th className="p-3">Tier</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Expiry Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {members.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50/50">
                      <td className="p-3 font-bold text-gray-900">{m.user?.name} ({m.user?.email})</td>
                      <td className="p-3 font-mono font-bold text-purple-700">{m.memberCode}</td>
                      <td className="p-3">{m.membershipPlan?.tier}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {m.status}
                        </span>
                      </td>
                      <td className="p-3">{new Date(m.expiryDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Elections */}
      {activeTab === "election" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              <span>Elect Officer to Executive Board</span>
            </h3>
            <p className="text-xs text-gray-500">
              Select an active member to appoint as VP of Events or Treasurer. This will atomically end the previous officer&apos;s term.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Target Office</label>
                <select
                  value={electRole}
                  onChange={(e) => setElectRole(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-300 font-bold"
                >
                  <option value="VP_EVENTS">VP of Events</option>
                  <option value="TREASURER">Treasurer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Eligible Member Candidate</label>
                <select
                  value={electUserId}
                  onChange={(e) => setElectUserId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-300"
                >
                  <option value="">-- Choose Candidate --</option>
                  {members.map((m) => (
                    <option key={m.user?.id} value={m.user?.id}>
                      {m.user?.name} ({m.memberCode}) - {m.user?.email}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleElect}
                className="w-full py-2.5 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition-all shadow-sm"
              >
                Execute Election Appointment
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-gray-900">Role Assignments History</h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {roles.map((r) => (
                <div key={r.id} className="p-3 rounded-xl border text-xs flex justify-between items-center bg-gray-50">
                  <div>
                    <span className="font-bold text-gray-900">{r.user?.name}</span>
                    <span className="block text-[11px] text-gray-500">{r.role}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    r.isCurrent ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-600"
                  }`}>
                    {r.isCurrent ? "ACTIVE HOLDER" : "PAST"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Merch Orders */}
      {activeTab === "orders" && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b font-bold text-sm text-gray-800">
            Association Store Orders ({orders.length})
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase font-semibold">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Items Ordered</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/50">
                    <td className="p-3 font-mono text-purple-700">{o.id.slice(0, 10)}...</td>
                    <td className="p-3 font-bold text-gray-900">{o.user?.name} ({o.user?.email})</td>
                    <td className="p-3">
                      {o.items?.map((it: any) => (
                        <span key={it.id} className="inline-block bg-gray-100 px-2 py-0.5 rounded mr-1 text-[11px]">
                          {it.productVariant?.product?.name} ({it.productVariant?.size}) x{it.quantity}
                        </span>
                      ))}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        o.status === "COLLECTED"
                          ? "bg-emerald-100 text-emerald-800"
                          : o.status === "PAID"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3">{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Audit Logs */}
      {activeTab === "audit" && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b font-bold text-sm text-gray-800">
            Immutable Audit Trail ({auditLogs.length})
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase font-semibold">
                <tr>
                  <th className="p-3">Action</th>
                  <th className="p-3">Actor</th>
                  <th className="p-3">Target / Details</th>
                  <th className="p-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50">
                    <td className="p-3 font-bold text-purple-700">{log.action}</td>
                    <td className="p-3">{log.actor?.name || log.actorId}</td>
                    <td className="p-3 font-mono text-[11px] text-gray-500">{log.target || log.targetId}</td>
                    <td className="p-3">{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
