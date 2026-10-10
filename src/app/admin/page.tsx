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
  AlertCircle,
  Clock,
  Plus
} from "lucide-react";
import { API_BASE } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"applications" | "members" | "election" | "orders" | "audit">("applications");
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [applications, setApplications] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [expiring, setExpiring] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);

  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [electUserId, setElectUserId] = useState("");
  const [electRole, setElectRole] = useState("TREASURER");

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const foundToken = cookies.find((c) => c.startsWith("token="));
    if (foundToken) setToken(foundToken.split("=")[1]);
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
        setMembers((await mRes.json()).items || []);
        setExpiring((await eRes.json()) || []);
      } else if (activeTab === "orders") {
        const res = await fetch(`${API_BASE}/api/admin/orders`, { headers });
        setOrders((await res.json()).orders || []);
      } else if (activeTab === "election") {
        const [rRes, mRes] = await Promise.all([
          fetch(`${API_BASE}/api/admin/roles`, { headers }),
          fetch(`${API_BASE}/api/admin/members`, { headers }),
        ]);
        setRoles((await rRes.json()) || []);
        setMembers((await mRes.json()).items || []);
      } else if (activeTab === "audit") {
        const res = await fetch(`${API_BASE}/api/admin/audit`, { headers });
        setAuditLogs((await res.json()).items || []);
      }
    } catch (err: any) {
      setStatusMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (token) loadData(); }, [token, activeTab]);

  const handleApprove = async (id: string, desiredPosition: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/applications/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ assignedPosition: desiredPosition }),
      });
      if (res.ok) { setStatusMessage("Application approved!"); loadData(); }
      else { const d = await res.json(); setStatusMessage(`Failed: ${d.error?.message}`); }
    } catch (e: any) { setStatusMessage(`Error: ${e.message}`); }
  };

  const handleReject = async (id: string) => {
    if (!rejectReason) { alert("Enter rejection reason"); return; }
    try {
      const res = await fetch(`${API_BASE}/api/admin/applications/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ note: rejectReason }),
      });
      if (res.ok) { setStatusMessage("Rejected."); setRejectId(null); setRejectReason(""); loadData(); }
      else { const d = await res.json(); setStatusMessage(`Failed: ${d.error?.message}`); }
    } catch (e: any) { setStatusMessage(`Error: ${e.message}`); }
  };

  const handleElect = async () => {
    if (!electUserId) { alert("Select candidate"); return; }
    try {
      const res = await fetch(`${API_BASE}/api/admin/election`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId: electUserId, role: electRole }),
      });
      if (res.ok) { setStatusMessage("Officer elected!"); loadData(); }
      else { const d = await res.json(); setStatusMessage(`Failed: ${d.error?.message}`); }
    } catch (e: any) { setStatusMessage(`Error: ${e.message}`); }
  };

  const tabs = [
    { id: "applications", label: "Applications", icon: FileText, count: applications.length },
    { id: "members", label: "Members", icon: Users, count: members.length },
    { id: "election", label: "Elections", icon: Award },
    { id: "orders", label: "Orders", icon: ShoppingBag, count: orders.length },
    { id: "audit", label: "Audit Logs", icon: Clock, count: auditLogs.length },
  ] as const;

  return (
    <DashboardLayout
      role="PRESIDENT"
      breadcrumb={[{ label: "Admin" }]}
      title="President Operations Portal"
      subtitle="Applications queue, member roster, officer elections, and audited operations."
      actions={
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#4A1942] hover:bg-[#3a1232] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      }
    >
      {/* Status Message */}
      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs font-medium text-purple-900 flex items-center justify-between">
          <span>{statusMessage}</span>
          <button onClick={() => setStatusMessage(null)} className="text-purple-600 font-bold ml-4">✕</button>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Pending Applications", value: applications.length, icon: FileText, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Active Members", value: members.length, icon: Users, color: "text-teal-600", bg: "bg-teal-50" },
          { label: "Expiring Soon", value: expiring.length, icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Open Orders", value: orders.length, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div className={`w-8 h-8 rounded-xl ${stat.bg} flex items-center justify-center mb-2`}>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex gap-0 border-b border-gray-100 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
                  isActive
                    ? "border-[#4A1942] text-[#4A1942] bg-purple-50/50"
                    : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                {"count" in tab && tab.count !== undefined && tab.count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${isActive ? "bg-[#4A1942] text-white" : "bg-gray-200 text-gray-600"}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-5">
          {/* Applications Tab */}
          {activeTab === "applications" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-gray-900">Pending Review ({applications.length})</span>
                <span className="text-xs text-gray-400">Oldest first</span>
              </div>
              {applications.length === 0 ? (
                <div className="p-10 text-center text-gray-400 text-sm bg-gray-50 rounded-xl">
                  No applications currently under review.
                </div>
              ) : (
                applications.map((app) => (
                  <div key={app.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <span className="font-bold text-gray-900 text-sm">{app.user?.name}</span>
                        <span className="text-xs text-gray-500 ml-2">({app.user?.email})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700">{app.type} ({app.tier})</span>
                        {app.desiredPosition !== "NONE" && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700">{app.desiredPosition}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 bg-white p-3 rounded-lg border border-gray-100">
                      <p><strong>Skills:</strong> {app.skills || "Not specified"}</p>
                      {app.notes && <p><strong>Notes:</strong> {app.notes}</p>}
                    </div>
                    {rejectId === app.id ? (
                      <div className="p-3 bg-red-50 rounded-xl space-y-2 border border-red-200">
                        <input
                          type="text" value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Reason for rejection (required)"
                          className="w-full text-xs p-2 rounded-lg border border-red-300 focus:outline-none"
                        />
                        <div className="flex gap-2">
                          <button onClick={() => handleReject(app.id)} className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold">Confirm Reject</button>
                          <button onClick={() => setRejectId(null)} className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => setRejectId(app.id)} className="px-3.5 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold flex items-center gap-1.5">
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                        <button onClick={() => handleApprove(app.id, app.desiredPosition)} className="px-4 py-1.5 bg-[#017E84] hover:bg-[#016368] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm">
                          <CheckCircle className="w-3.5 h-3.5" /> Approve
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Members Tab */}
          {activeTab === "members" && (
            <div className="space-y-4">
              {expiring.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5 mb-2">
                    <AlertCircle className="w-4 h-4" /> Expiring Within 30 Days ({expiring.length})
                  </span>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {expiring.map((m) => (
                      <div key={m.id} className="text-xs bg-white p-2.5 rounded-lg border border-amber-200 flex justify-between">
                        <span className="font-bold">{m.user?.name} ({m.memberCode})</span>
                        <span className="text-amber-700">{new Date(m.expiryDate).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-600 uppercase font-bold">
                    <tr>
                      <th className="p-3">Member</th>
                      <th className="p-3">Code</th>
                      <th className="p-3">Tier</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Expires</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {members.map((m) => (
                      <tr key={m.id} className="hover:bg-gray-50">
                        <td className="p-3 font-bold text-gray-900">{m.user?.name}<span className="text-gray-400 font-normal ml-1">({m.user?.email})</span></td>
                        <td className="p-3 font-mono font-bold text-[#4A1942]">{m.memberCode}</td>
                        <td className="p-3">{m.membershipPlan?.tier}</td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">{m.status}</span></td>
                        <td className="p-3">{new Date(m.expiryDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Election Tab */}
          {activeTab === "election" && (
            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-gray-50 rounded-xl border border-gray-100 p-5 space-y-4">
                <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2"><Award className="w-4 h-4 text-[#4A1942]" /> Elect Officer</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Target Office</label>
                    <select value={electRole} onChange={(e) => setElectRole(e.target.value)} className="w-full text-xs p-2.5 rounded-xl border border-gray-200 font-bold bg-white">
                      <option value="TREASURER">Treasurer</option>
                      <option value="PRESIDENT">President / Co-President</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Candidate</label>
                    <select value={electUserId} onChange={(e) => setElectUserId(e.target.value)} className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white">
                      <option value="">-- Choose Candidate --</option>
                      {members.map((m) => (<option key={m.user?.id} value={m.user?.id}>{m.user?.name} ({m.memberCode})</option>))}
                    </select>
                  </div>
                  <button onClick={handleElect} className="w-full py-2.5 bg-[#4A1942] text-white rounded-xl text-xs font-bold hover:bg-[#3a1232] transition-all shadow-sm">
                    Execute Election Appointment
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl border border-gray-100 p-5 space-y-3">
                <h3 className="font-bold text-sm text-gray-900">Role History</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {roles.map((r) => (
                    <div key={r.id} className="p-3 rounded-lg border border-gray-100 bg-white text-xs flex justify-between items-center">
                      <div>
                        <span className="font-bold text-gray-900">{r.user?.name}</span>
                        <span className="block text-gray-500 text-[11px]">{r.role}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${r.isCurrent ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-500"}`}>
                        {r.isCurrent ? "ACTIVE" : "PAST"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-600 uppercase font-bold">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Items</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="p-3 font-mono text-[#4A1942]">{o.id.slice(0, 10)}…</td>
                      <td className="p-3 font-bold text-gray-900">{o.user?.name}</td>
                      <td className="p-3">
                        {o.items?.map((it: any) => (
                          <span key={it.id} className="inline-block bg-gray-100 px-2 py-0.5 rounded mr-1 text-[11px]">
                            {it.productVariant?.product?.name} x{it.quantity}
                          </span>
                        ))}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${o.status === "COLLECTED" ? "bg-emerald-100 text-emerald-800" : o.status === "PAID" ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="p-3">{new Date(o.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Audit Tab */}
          {activeTab === "audit" && (
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-600 uppercase font-bold">
                  <tr>
                    <th className="p-3">Action</th>
                    <th className="p-3">Actor</th>
                    <th className="p-3">Target</th>
                    <th className="p-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="p-3 font-bold text-[#4A1942]">{log.action}</td>
                      <td className="p-3">{log.actor?.name || log.actorId}</td>
                      <td className="p-3 font-mono text-gray-400 text-[11px]">{log.target || log.targetId}</td>
                      <td className="p-3">{new Date(log.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
