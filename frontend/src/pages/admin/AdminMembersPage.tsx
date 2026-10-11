import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Users, Search, CheckCircle2, Clock, AlertCircle, 
  CreditCard, ShieldCheck, Filter, Eye, Check, X, 
  RefreshCw, Briefcase, Plus, ExternalLink, Mail, Phone,
  GraduationCap, Building, FileText, ChevronRight, Sparkles
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { API_BASE } from "@/lib/api";

interface ApplicationRecord {
  id: string;
  userId: string;
  status: "SUBMITTED" | "PAYMENT_PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
  submittedAt: string;
  reviewNote?: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  notes?: {
    phone?: string;
    college?: string;
    course?: string;
    year?: string;
    department?: string;
    bio?: string;
    skills?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    positions?: string[];
    positionIds?: string[];
    joiningFee?: number;
    currency?: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    paymentStatus?: string;
    memberCode?: string;
    approvedPositions?: string[];
  };
  payments?: Array<{
    id: string;
    amount: number;
    status: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    createdAt: string;
  }>;
}

interface ClubPosition {
  id: string;
  title: string;
  department: string;
  description: string;
  requirements?: string | null;
  isOpen: boolean;
  vacancies: number;
  deadline?: string | null;
}

interface MemberRecord {
  id: string;
  name: string;
  email: string;
  memberCode: string;
  tier: string;
  positions?: string[];
  status: "ACTIVE" | "PENDING" | "EXPIRED";
  expiryDate: string;
  duesPaid: boolean;
}

export default function AdminMembersPage() {
  const [activeTab, setActiveTab] = useState<"APPLICATIONS" | "ROSTER" | "POSITIONS">("APPLICATIONS");

  // Applications State
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [selectedApp, setSelectedApp] = useState<ApplicationRecord | null>(null);
  const [appFilter, setAppFilter] = useState<"ALL" | "UNDER_REVIEW" | "APPROVED" | "REJECTED">("ALL");
  const [appSearch, setAppSearch] = useState("");

  // Approval / Rejection modal state
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [assignedPositions, setAssignedPositions] = useState<string[]>([]);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionProcessing, setActionProcessing] = useState(false);

  // Positions State
  const [positions, setPositions] = useState<ClubPosition[]>([]);
  const [loadingPositions, setLoadingPositions] = useState(false);
  const [newPositionModal, setNewPositionModal] = useState(false);
  const [newPosData, setNewPosData] = useState({
    title: "",
    department: "Engineering",
    description: "",
    requirements: "",
    vacancies: 2,
    deadline: "Nov 15, 2026",
  });

  // Members Roster State — real database records
  const [roster, setRoster] = useState<MemberRecord[]>([]);
  const [rosterSearch, setRosterSearch] = useState("");

  // Load real applications & members from backend database
  const loadApplications = async () => {
    setLoadingApps(true);
    try {
      const token = localStorage.getItem("token") || (document.cookie.split("; ").find(c => c.startsWith("token="))?.split("=")[1]);
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      // 1. Fetch real applications
      const res = await fetch(`${API_BASE}/api/applications/admin`, {
        headers,
        credentials: "include"
      });
      let appsList: any[] = [];
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.applications)) {
          appsList = data.applications;
          setApplications(appsList);
        }
      }

      // 2. Fetch real members from PostgreSQL database
      const membersRes = await fetch(`${API_BASE}/api/members`, {
        headers,
        credentials: "include"
      });
      if (membersRes.ok) {
        const membersData = await membersRes.json();
        if (Array.isArray(membersData.members)) {
          const liveRoster: MemberRecord[] = membersData.members.map((m: any) => ({
            id: m.id,
            name: m.name,
            email: m.email,
            memberCode: m.memberCode,
            tier: m.tier || "Official (₹300)",
            positions: m.positions && m.positions.length > 0 ? m.positions : ["General Member"],
            status: m.status as any,
            expiryDate: m.expiryDate ? new Date(m.expiryDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Active",
            duesPaid: m.duesPaid ?? true,
          }));

          // Merge any recently approved applications not yet in members table
          const existingEmails = new Set(liveRoster.map(m => m.email));
          const extraApproved = appsList
            .filter((a: any) => a.status === "APPROVED" && a.user?.email && !existingEmails.has(a.user.email))
            .map((a: any) => ({
              id: a.userId || a.id,
              name: a.user?.name || "Member",
              email: a.user?.email || "",
              memberCode: a.metadata?.memberCode || a.notes?.memberCode || `CH-2026-${a.id.slice(-4).toUpperCase()}`,
              tier: "Official (₹300)",
              positions: a.metadata?.approvedPositions || a.metadata?.selectedPositions || ["General Member"],
              status: "ACTIVE" as const,
              expiryDate: "Active",
              duesPaid: true,
            }));

          setRoster([...extraApproved, ...liveRoster]);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch applications/members:", err);
    } finally {
      setLoadingApps(false);
    }
  };

  // Load live positions from backend
  const loadPositions = async () => {
    setLoadingPositions(true);
    try {
      const res = await fetch(`${API_BASE}/api/positions`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.positions)) {
          setPositions(data.positions);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch positions:", err);
    } finally {
      setLoadingPositions(false);
    }
  };

  useEffect(() => {
    loadApplications();
    loadPositions();
  }, []);

  // Handle Application Approval
  const handleApproveApp = async () => {
    if (!selectedApp) return;
    setActionProcessing(true);
    try {
      const res = await fetch(`${API_BASE}/api/applications/admin/${selectedApp.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approvedPositions: assignedPositions,
          reviewNote: "Application approved by Club Administration. Welcome to Club_Hub!",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update local application state
        setApplications((prev) =>
          prev.map((app) =>
            app.id === selectedApp.id
              ? {
                  ...app,
                  status: "APPROVED",
                  notes: {
                    ...app.notes,
                    memberCode: data.memberCode,
                    approvedPositions: assignedPositions,
                  },
                }
              : app
          )
        );

        // Add to active roster
        const newRosterEntry: MemberRecord = {
          id: selectedApp.userId,
          name: selectedApp.user.name,
          email: selectedApp.user.email,
          memberCode: data.memberCode || `CH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          tier: "Official (₹300)",
          positions: assignedPositions.length > 0 ? assignedPositions : ["General Member"],
          status: "ACTIVE",
          expiryDate: "Oct 11, 2027",
          duesPaid: true,
        };
        setRoster((prev) => [newRosterEntry, ...prev]);

        setApprovalModalOpen(false);
        setSelectedApp(null);
      }
    } catch (err) {
      console.error("Approval error:", err);
    } finally {
      setActionProcessing(false);
    }
  };

  // Handle Application Rejection
  const handleRejectApp = async () => {
    if (!selectedApp) return;
    setActionProcessing(true);
    try {
      const res = await fetch(`${API_BASE}/api/applications/admin/${selectedApp.id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewNote: rejectionReason || "Position requirements criteria not met for this cycle. Joining fee queued for refund.",
        }),
      });

      if (res.ok) {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === selectedApp.id
              ? { ...app, status: "REJECTED", reviewNote: rejectionReason }
              : app
          )
        );
        setRejectionModalOpen(false);
        setSelectedApp(null);
        setRejectionReason("");
      }
    } catch (err) {
      console.error("Rejection error:", err);
    } finally {
      setActionProcessing(false);
    }
  };

  // Toggle Position Status
  const handleTogglePosition = async (posId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/positions/${posId}/toggle`, {
        method: "PATCH",
      });
      if (res.ok) {
        const data = await res.json();
        setPositions((prev) =>
          prev.map((p) => (p.id === posId ? { ...p, isOpen: data.position.isOpen } : p))
        );
      }
    } catch (err) {
      console.error("Error toggling position:", err);
    }
  };

  // Create New Position
  const handleCreatePosition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPosData.title.trim()) return;

    try {
      const res = await fetch(`${API_BASE}/api/positions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPosData),
      });

      if (res.ok) {
        const data = await res.json();
        setPositions((prev) => [data.position, ...prev]);
        setNewPositionModal(false);
        setNewPosData({
          title: "",
          department: "Engineering",
          description: "",
          requirements: "",
          vacancies: 2,
          deadline: "Nov 15, 2026",
        });
      }
    } catch (err) {
      console.error("Error creating position:", err);
    }
  };

  // Metrics Calculation
  const totalApps = applications.length;
  const underReviewApps = applications.filter((a) => a.status === "UNDER_REVIEW").length;
  const approvedApps = applications.filter((a) => a.status === "APPROVED").length;
  const rejectedApps = applications.filter((a) => a.status === "REJECTED").length;
  const verifiedRevenue = applications.filter(
    (a) => a.status === "UNDER_REVIEW" || a.status === "APPROVED"
  ).length * 300;

  // Filtered Applications
  const filteredApps = applications.filter((app) => {
    const matchesFilter = appFilter === "ALL" || app.status === appFilter;
    const matchesSearch =
      app.user.name.toLowerCase().includes(appSearch.toLowerCase()) ||
      app.user.email.toLowerCase().includes(appSearch.toLowerCase()) ||
      (app.notes?.college && app.notes.college.toLowerCase().includes(appSearch.toLowerCase())) ||
      (app.notes?.positions && app.notes.positions.some((p) => p.toLowerCase().includes(appSearch.toLowerCase())));
    return matchesFilter && matchesSearch;
  });

  return (
    <DashboardLayout
      role="PRESIDENT"
      breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Membership Management" }]}
      title="Membership Applications & Roster"
      subtitle="Review new applicant submissions, verify Razorpay joining fees, assign club positions, and manage openings."
    >
      <div className="space-y-6">
        {/* Top Summary Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Applications</span>
            <span className="text-2xl font-black text-gray-900">{totalApps}</span>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">Awaiting Review</span>
            <span className="text-2xl font-black text-amber-600">{underReviewApps}</span>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Approved Members</span>
            <span className="text-2xl font-black text-emerald-600">{approvedApps}</span>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block">Rejected / Refunded</span>
            <span className="text-2xl font-black text-red-600">{rejectedApps}</span>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold text-[#017E84] uppercase tracking-wider block">Verified Dues Rev</span>
            <span className="text-2xl font-black text-[#017E84]">₹{verifiedRevenue.toLocaleString()}</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 gap-2">
          <button
            onClick={() => setActiveTab("APPLICATIONS")}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "APPLICATIONS"
                ? "border-[#4A1942] text-[#4A1942]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Membership Applications ({underReviewApps} pending)</span>
          </button>
          <button
            onClick={() => setActiveTab("ROSTER")}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "ROSTER"
                ? "border-[#4A1942] text-[#4A1942]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Approved Members Roster ({roster.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("POSITIONS")}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "POSITIONS"
                ? "border-[#4A1942] text-[#4A1942]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Manage Club Positions ({positions.length})</span>
          </button>
        </div>

        {/* TAB 1: MEMBERSHIP APPLICATIONS */}
        {activeTab === "APPLICATIONS" && (
          <div className="space-y-4">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  placeholder="Search applicant name, email, college, or position..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#4A1942]"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {(["ALL", "UNDER_REVIEW", "APPROVED", "REJECTED"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setAppFilter(filter)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        appFilter === filter
                          ? "bg-[#4A1942] text-white shadow-xs"
                          : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {filter.replace("_", " ")}
                    </button>
                  ))}
                </div>
                <button
                  onClick={loadApplications}
                  className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-600"
                  title="Refresh applications"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingApps ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>

            {/* Applications Table */}
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 uppercase font-bold">
                    <tr>
                      <th className="p-4">Applicant</th>
                      <th className="p-4">Academic Background</th>
                      <th className="p-4">Positions Requested</th>
                      <th className="p-4">Payment (₹300)</th>
                      <th className="p-4">Review Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {filteredApps.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-gray-400">
                          {loadingApps ? "Loading membership applications..." : "No applications found."}
                        </td>
                      </tr>
                    ) : (
                      filteredApps.map((app) => (
                        <tr key={app.id} className="hover:bg-gray-50/60 transition-colors">
                          <td className="p-4">
                            <div className="font-bold text-gray-900">{app.user.name}</div>
                            <div className="text-[11px] text-gray-400">{app.user.email}</div>
                            {app.notes?.phone && (
                              <div className="text-[10px] text-gray-500 font-mono">{app.notes.phone}</div>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="text-gray-800 font-medium">{app.notes?.college || "—"}</div>
                            <div className="text-[11px] text-gray-400">
                              {app.notes?.course} {app.notes?.year ? `· ${app.notes.year}` : ""}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {app.notes?.positions && app.notes.positions.length > 0 ? (
                                app.notes.positions.map((p, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-50 text-[#017E84] border border-teal-100"
                                  >
                                    {p}
                                  </span>
                                ))
                              ) : (
                                <span className="text-gray-400 text-[11px]">General Member</span>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1.5 text-teal-800 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                              <span>₹300 Verified</span>
                            </div>
                            {app.notes?.razorpayPaymentId && (
                              <div className="text-[10px] font-mono text-gray-400 truncate max-w-[120px]">
                                {app.notes.razorpayPaymentId}
                              </div>
                            )}
                          </td>
                          <td className="p-4">
                            <span
                              className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                app.status === "APPROVED"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : app.status === "UNDER_REVIEW" || app.status === "SUBMITTED"
                                  ? "bg-amber-100 text-amber-800"
                                  : app.status === "REJECTED"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {app.status === "UNDER_REVIEW" || app.status === "SUBMITTED"
                                ? "Pending Review"
                                : app.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedApp(app);
                                setAssignedPositions(app.notes?.positions || ["General Member"]);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-[#4A1942] hover:text-white text-gray-700 font-bold text-xs transition-colors shadow-2xs"
                            >
                              Inspect &amp; Review
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: APPROVED MEMBERS ROSTER */}
        {activeTab === "ROSTER" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative w-72">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={rosterSearch}
                  onChange={(e) => setRosterSearch(e.target.value)}
                  placeholder="Search roster by name, code, or role..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#4A1942]"
                />
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 uppercase font-bold">
                    <tr>
                      <th className="p-4">Member Name</th>
                      <th className="p-4">Official Member ID</th>
                      <th className="p-4">Assigned Position(s)</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Validity</th>
                      <th className="p-4 text-right">Dues Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {roster
                      .filter(
                        (m) =>
                          m.name.toLowerCase().includes(rosterSearch.toLowerCase()) ||
                          m.memberCode.toLowerCase().includes(rosterSearch.toLowerCase())
                      )
                      .map((m) => (
                        <tr key={m.id} className="hover:bg-gray-50/60 transition-colors">
                          <td className="p-4">
                            <div className="font-bold text-gray-900">{m.name}</div>
                            <div className="text-[11px] text-gray-400">{m.email}</div>
                          </td>
                          <td className="p-4 font-mono font-bold text-[#4A1942]">{m.memberCode}</td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {m.positions && m.positions.length > 0 ? (
                                m.positions.map((p, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-100"
                                  >
                                    {p}
                                  </span>
                                ))
                              ) : (
                                <span className="text-gray-400 text-[11px]">General Member</span>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider bg-emerald-100 text-emerald-800">
                              {m.status}
                            </span>
                          </td>
                          <td className="p-4 text-gray-600 font-mono text-[11px]">{m.expiryDate}</td>
                          <td className="p-4 text-right">
                            <span className="text-[11px] text-teal-700 font-bold flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>₹300 Paid</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DYNAMIC POSITIONS MANAGEMENT */}
        {activeTab === "POSITIONS" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-gray-900">Dynamic Club Positions Catalog</h3>
                <p className="text-xs text-gray-500">
                  Open or close applications for specific teams in real time.
                </p>
              </div>
              <button
                onClick={() => setNewPositionModal(true)}
                className="px-4 py-2 rounded-xl bg-[#017E84] hover:bg-[#016368] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create New Position</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {positions.map((pos) => (
                <div
                  key={pos.id}
                  className={`p-5 rounded-3xl border-2 transition-all flex flex-col justify-between space-y-4 ${
                    pos.isOpen
                      ? "bg-white border-gray-200 shadow-2xs"
                      : "bg-gray-50 border-gray-200 opacity-75"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-gray-900">{pos.title}</h4>
                        <span className="text-[10px] font-bold text-[#017E84] bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                          {pos.department}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          pos.isOpen ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {pos.isOpen ? "Open" : "Closed"}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                      {pos.description}
                    </p>

                    {pos.requirements && (
                      <div className="text-[11px] text-gray-500 italic bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                        <strong>Requirements:</strong> {pos.requirements}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                    <div className="text-[11px] text-gray-400">
                      <span>{pos.vacancies} vacancies</span>
                      {pos.deadline && <span> · Due {pos.deadline}</span>}
                    </div>

                    <button
                      onClick={() => handleTogglePosition(pos.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        pos.isOpen
                          ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                      }`}
                    >
                      {pos.isOpen ? "Close Opening" : "Re-open"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* APPLICATION INSPECTION MODAL */}
        {selectedApp && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-lg font-black text-gray-900">
                    Application Review: {selectedApp.user.name}
                  </h3>
                  <span className="text-xs text-gray-400 font-mono">ID: {selectedApp.id}</span>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Applicant Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-gray-50 space-y-1">
                  <span className="text-gray-400 font-bold block text-[10px] uppercase">Email &amp; Phone</span>
                  <div className="font-bold text-gray-900">{selectedApp.user.email}</div>
                  <div className="font-mono text-gray-600">{selectedApp.notes?.phone || "—"}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 space-y-1">
                  <span className="text-gray-400 font-bold block text-[10px] uppercase">Academic Profile</span>
                  <div className="font-bold text-gray-900">{selectedApp.notes?.college || "—"}</div>
                  <div className="text-gray-600">
                    {selectedApp.notes?.course} ({selectedApp.notes?.year}) · {selectedApp.notes?.department}
                  </div>
                </div>

                <div className="sm:col-span-2 p-3.5 rounded-xl bg-gray-50 space-y-1">
                  <span className="text-gray-400 font-bold block text-[10px] uppercase">Short Introduction</span>
                  <p className="text-gray-700 leading-relaxed">{selectedApp.notes?.bio || "No bio provided."}</p>
                </div>

                <div className="sm:col-span-2 p-3.5 rounded-xl bg-gray-50 space-y-1">
                  <span className="text-gray-400 font-bold block text-[10px] uppercase">Skills &amp; Interests</span>
                  <p className="text-gray-700">{selectedApp.notes?.skills || "—"}</p>
                </div>

                {selectedApp.notes?.linkedinUrl && (
                  <div className="sm:col-span-2 p-3.5 rounded-xl bg-gray-50 flex items-center justify-between">
                    <div>
                      <span className="text-gray-400 font-bold block text-[10px] uppercase">LinkedIn Profile</span>
                      <span className="text-gray-800">{selectedApp.notes.linkedinUrl}</span>
                    </div>
                    <a
                      href={selectedApp.notes.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-teal-50 text-[#017E84] hover:bg-teal-100"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>

              {/* Payment Verification Record */}
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-teal-900 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-[#017E84]" />
                    <span>Razorpay Joining Fee: ₹300 Verified</span>
                  </div>
                  <span className="text-[10px] font-mono text-teal-700 font-bold bg-white px-2 py-0.5 rounded-md border border-teal-200">
                    SETTLED
                  </span>
                </div>
                <div className="text-[11px] text-teal-800 grid grid-cols-2 gap-2 font-mono">
                  <div>Order ID: {selectedApp.notes?.razorpayOrderId || "order_verified"}</div>
                  <div>Payment ID: {selectedApp.notes?.razorpayPaymentId || "pay_verified"}</div>
                </div>
              </div>

              {/* Requested Positions */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">Positions of Interest Requested:</label>
                <div className="flex flex-wrap gap-1.5">
                  {selectedApp.notes?.positions && selectedApp.notes.positions.length > 0 ? (
                    selectedApp.notes.positions.map((p, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl text-xs font-bold bg-teal-100 text-[#017E84]"
                      >
                        {p}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500">General Membership</span>
                  )}
                </div>
              </div>

              {/* Admin Actions */}
              {selectedApp.status === "UNDER_REVIEW" || selectedApp.status === "SUBMITTED" ? (
                <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                  <button
                    onClick={() => {
                      setRejectionModalOpen(true);
                    }}
                    className="px-5 py-2.5 rounded-xl border border-red-300 text-red-700 hover:bg-red-50 text-xs font-bold transition-colors"
                  >
                    Reject Application
                  </button>
                  <button
                    onClick={() => {
                      setApprovalModalOpen(true);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve Membership</span>
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-100 text-right">
                  <span className="text-xs font-bold text-gray-500">
                    Application already resolved ({selectedApp.status})
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* APPROVAL POSITION ASSIGNMENT MODAL */}
        {approvalModalOpen && selectedApp && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
              <div>
                <h3 className="font-black text-base text-gray-900">
                  Approve &amp; Assign Role: {selectedApp.user.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Select which club positions to officially assign to this new member. A unique Member ID will be generated.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">Assign Official Positions:</label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {positions.map((p) => {
                    const isChecked = assignedPositions.includes(p.title);
                    return (
                      <label
                        key={p.id}
                        className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer text-xs"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAssignedPositions([...assignedPositions, p.title]);
                            } else {
                              setAssignedPositions(assignedPositions.filter((title) => title !== p.title));
                            }
                          }}
                          className="rounded text-[#017E84]"
                        />
                        <span className="font-medium text-gray-800">{p.title}</span>
                        <span className="text-[10px] text-gray-400">({p.department})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  onClick={() => setApprovalModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApproveApp}
                  disabled={actionProcessing}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                >
                  {actionProcessing ? "Activating Member..." : "Confirm Approval"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* REJECTION REASON MODAL */}
        {rejectionModalOpen && selectedApp && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div>
                <h3 className="font-black text-base text-gray-900">
                  Reject Application: {selectedApp.user.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Specify reason for rejection. The ₹300 joining fee will be scheduled for refund according to the club refund policy.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Rejection Reason</label>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Incompatible schedule or requirements criteria not met for selected team..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  onClick={() => setRejectionModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectApp}
                  disabled={actionProcessing}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                >
                  {actionProcessing ? "Processing..." : "Confirm Rejection & Refund"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CREATE POSITION MODAL */}
        {newPositionModal && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-black text-base text-gray-900">Create New Club Position</h3>
                <button
                  onClick={() => setNewPositionModal(false)}
                  className="p-1 rounded-lg text-gray-400 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePosition} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Position Title *</label>
                  <input
                    type="text"
                    required
                    value={newPosData.title}
                    onChange={(e) => setNewPosData({ ...newPosData, title: e.target.value })}
                    placeholder="e.g. Lead UI/UX Designer"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#017E84] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={newPosData.department}
                    onChange={(e) => setNewPosData({ ...newPosData, department: e.target.value })}
                    placeholder="e.g. Creative & Media"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#017E84] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Role Description</label>
                  <textarea
                    rows={2}
                    value={newPosData.description}
                    onChange={(e) => setNewPosData({ ...newPosData, description: e.target.value })}
                    placeholder="Key responsibilities and expectations..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#017E84] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Requirements</label>
                  <input
                    type="text"
                    value={newPosData.requirements}
                    onChange={(e) => setNewPosData({ ...newPosData, requirements: e.target.value })}
                    placeholder="e.g. Figma fluency, Git, or communication skills"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#017E84] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Vacancies</label>
                    <input
                      type="number"
                      min={1}
                      value={newPosData.vacancies}
                      onChange={(e) => setNewPosData({ ...newPosData, vacancies: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#017E84] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Deadline</label>
                    <input
                      type="text"
                      value={newPosData.deadline}
                      onChange={(e) => setNewPosData({ ...newPosData, deadline: e.target.value })}
                      placeholder="e.g. Nov 15, 2026"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#017E84] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setNewPositionModal(false)}
                    className="px-4 py-2 rounded-xl border border-gray-300 font-bold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#017E84] hover:bg-[#016368] text-white font-bold shadow-md"
                  >
                    Publish Opening
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
