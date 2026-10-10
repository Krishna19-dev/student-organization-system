"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Users, Calendar, ShoppingBag, Receipt,
  LogOut, Bell, Search,
  ArrowUpRight, ArrowDownRight, CheckCircle2, Clock, Package,
  Ticket, CreditCard, BarChart3, Menu, X,
  Eye, Download, Filter, ArrowUp, ArrowDown, Check,
  PlusCircle
} from "lucide-react";

// ─── TYPES & DATA DEFINITIONS ──────────────────────────────────────────────────

interface Transaction {
  id: string;
  desc: string;
  type: "CREDIT" | "DEBIT";
  amount: number;
  date: string;
  category: string;
  reference?: string;
}

interface Member {
  id: string;
  name: string;
  role: "ADMIN" | "TREASURER" | "VOLUNTEER" | "MEMBER";
  tier: "Premium" | "Basic";
  joined: string;
  status: "active" | "pending";
  paid: string;
}

interface EventItem {
  id: string;
  title: string;
  description?: string;
  date: string;
  tickets: number;
  capacity: number;
  price: number;
  revenue: string;
  status: "upcoming" | "completed";
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: "TXN-9042", desc: "Ticket Sale: Tech Summit 2026", type: "CREDIT", amount: 250, date: "Oct 09, 2026", category: "Ticketing", reference: "ORD-9901" },
  { id: "TXN-8821", desc: "Merch: Crest Fleece Hoodie (L)", type: "CREDIT", amount: 799, date: "Oct 09, 2026", category: "Merchandise", reference: "ORD-9884" },
  { id: "TXN-7914", desc: "2x Teal Enamel Crest Pin", type: "CREDIT", amount: 298, date: "Oct 05, 2026", category: "Merchandise", reference: "ORD-9820" },
  { id: "TXN-6512", desc: "Ticket: Acoustic Sunset Jam", type: "CREDIT", amount: 150, date: "Oct 04, 2026", category: "Ticketing", reference: "ORD-9772" },
  { id: "TXN-5301", desc: "Venue Booking: Auditorium A", type: "DEBIT", amount: 5000, date: "Oct 01, 2026", category: "Operations", reference: "INV-5510" },
  { id: "TXN-4822", desc: "Merch Printing: 50 Hoodies", type: "DEBIT", amount: 18000, date: "Sep 28, 2026", category: "Procurement", reference: "INV-5489" },
];

const INITIAL_MEMBERS: Member[] = [
  { id: "SKY-001", name: "Aanya Sharma", role: "MEMBER", tier: "Premium", joined: "Sep 2026", status: "active", paid: "₹599" },
  { id: "SKY-002", name: "Rohan Mehta", role: "VOLUNTEER", tier: "Basic", joined: "Aug 2026", status: "active", paid: "₹299" },
  { id: "SKY-003", name: "Priya Kapoor", role: "TREASURER", tier: "Premium", joined: "Jul 2026", status: "active", paid: "₹599" },
  { id: "SKY-004", name: "Dev Patel", role: "MEMBER", tier: "Basic", joined: "Sep 2026", status: "active", paid: "₹299" },
  { id: "SKY-005", name: "Sneha Reddy", role: "MEMBER", tier: "Premium", joined: "Oct 2026", status: "pending", paid: "₹599" },
  { id: "SKY-006", name: "Arjun Nair", role: "VOLUNTEER", tier: "Basic", joined: "Aug 2026", status: "active", paid: "₹299" },
];

const INITIAL_EVENTS: EventItem[] = [
  { id: "EVT-001", title: "Skyline Tech & Design Summit 2026", description: "Flagship annual convention with keynote speeches, product breakdowns, and portfolio reviews.", date: "Oct 24, 2026", tickets: 48, capacity: 120, price: 250, revenue: "₹12,000", status: "upcoming" },
  { id: "EVT-002", title: "Acoustic Sunset Open Mic & Jam", description: "Unplugged acoustic evening with live campus vocalists, poets, and student guitarists.", date: "Nov 02, 2026", tickets: 32, capacity: 80, price: 150, revenue: "₹4,800", status: "upcoming" },
  { id: "EVT-003", title: "Annual General Body Meeting", description: "Mandatory association briefing covering constitutional updates, finances, and elections.", date: "Oct 18, 2026", tickets: 90, capacity: 200, price: 0, revenue: "₹0", status: "upcoming" },
  { id: "EVT-004", title: "Campus Hackathon 2026", description: "24-hour sprint building real campus utilities and open source projects.", date: "Sep 28, 2026", tickets: 75, capacity: 75, price: 250, revenue: "₹18,750", status: "completed" },
];

const ROLE_BADGE: Record<string, string> = {
  ADMIN: "badge-danger",
  TREASURER: "badge-warning",
  VOLUNTEER: "badge-info",
  MEMBER: "badge-basic",
};

const TIER_BADGE: Record<string, string> = {
  Premium: "badge-premium",
  Basic: "badge-basic",
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function AdminDashboard({
  userName = "Krishna Choudhary",
  userEmail = "admin@skyline.edu",
}: {
  userName?: string;
  userEmail?: string;
}) {
  const [activeTab, setActiveTab] = useState<"overview" | "members" | "events" | "ledger">("ledger");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Living State Collections
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);

  // Modal States
  const [activeModal, setActiveModal] = useState<"NONE" | "TRANSACTION" | "MEMBER" | "EVENT">("NONE");

  // Form State: New Transaction
  const [newTxnDesc, setNewTxnDesc] = useState("");
  const [newTxnType, setNewTxnType] = useState<"CREDIT" | "DEBIT">("CREDIT");
  const [newTxnAmount, setNewTxnAmount] = useState("");
  const [newTxnCategory, setNewTxnCategory] = useState("Ticketing");

  // Form State: New Member
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<Member["role"]>("MEMBER");
  const [newMemberTier, setNewMemberTier] = useState<Member["tier"]>("Basic");

  // Form State: New Event
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDesc, setNewEventDesc] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventCapacity, setNewEventCapacity] = useState("100");
  const [newEventPrice, setNewEventPrice] = useState("150");

  // Ledger Filter states
  const [ledgerTypeFilter, setLedgerTypeFilter] = useState<"ALL" | "CREDIT" | "DEBIT">("ALL");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleLogout = () => {
    document.cookie = "skyline_demo_user=; path=/; max-age=0; samesite=lax";
    window.location.href = "/login?loggedOut=true";
  };

  // Living Ledger Metrics
  const ledgerMetrics = useMemo(() => {
    const baseCredits = 197500;
    const baseDebits = 13000;
    
    // Add dynamically added transactions
    const addedCredits = transactions
      .slice(INITIAL_TRANSACTIONS.length)
      .filter(t => t.type === "CREDIT")
      .reduce((sum, t) => sum + t.amount, 0);

    const addedDebits = transactions
      .slice(INITIAL_TRANSACTIONS.length)
      .filter(t => t.type === "DEBIT")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalCredits = baseCredits + addedCredits;
    const totalDebits = baseDebits + addedDebits;
    const netBalance = totalCredits - totalDebits;

    return { totalCredits, totalDebits, netBalance };
  }, [transactions]);

  // Handlers to Add Entities
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTxnDesc || !newTxnAmount) return;

    const parsedAmount = Math.max(1, parseInt(newTxnAmount, 10) || 0);
    const newTxn: Transaction = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      desc: newTxnDesc,
      type: newTxnType,
      amount: parsedAmount,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      category: newTxnCategory,
      reference: `MAN-${Date.now().toString().slice(-4)}`
    };

    setTransactions([newTxn, ...transactions]);
    setNewTxnDesc("");
    setNewTxnAmount("");
    setActiveModal("NONE");
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName) return;

    const newMember: Member = {
      id: `SKY-${String(members.length + 1).padStart(3, "0")}`,
      name: newMemberName,
      role: newMemberRole,
      tier: newMemberTier,
      joined: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      status: "active",
      paid: newMemberTier === "Premium" ? "₹599" : "₹299"
    };

    setMembers([newMember, ...members]);
    setNewMemberName("");
    setActiveModal("NONE");
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle || !newEventDate) return;

    const capacityNum = parseInt(newEventCapacity, 10) || 50;
    const priceNum = parseInt(newEventPrice, 10) || 0;
    const newEvent: EventItem = {
      id: `EVT-${String(events.length + 1).padStart(3, "0")}`,
      title: newEventTitle,
      description: newEventDesc || undefined,
      date: newEventDate,
      tickets: 0,
      capacity: capacityNum,
      price: priceNum,
      revenue: "₹0",
      status: "upcoming"
    };

    setEvents([newEvent, ...events]);
    setNewEventTitle("");
    setNewEventDesc("");
    setNewEventDate("");
    setNewEventPrice("150");
    setActiveModal("NONE");
  };

  // Filtered transactions for the ledger view
  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      const matchesType = ledgerTypeFilter === "ALL" || txn.type === ledgerTypeFilter;
      const matchesSearch =
        searchQuery === "" ||
        txn.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [transactions, ledgerTypeFilter, searchQuery]);

  // CSV Export implementation preserving real data
  const handleExportCSV = () => {
    const headers = ["Transaction ID", "Description", "Type", "Amount (INR)", "Date", "Category", "Reference"];
    const rows = filteredTransactions.map(t => [
      t.id,
      `"${t.desc.replace(/"/g, '""')}"`,
      t.type,
      t.amount,
      `"${t.date}"`,
      t.category,
      t.reference || ""
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `skyline_ledger_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-page flex">
      {/* ── SIDEBAR (240-256px SaaS Layout) ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 sm:w-64 bg-primary text-white flex flex-col border-r border-primary-hover shadow-xl transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:flex shrink-0`}
      >
        {/* Brand / Logo Area */}
        <div className="h-16 px-5 border-b border-primary-hover/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface text-primary flex items-center justify-center font-black text-sm shadow-sm">
              S
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight block leading-tight text-white">ClubManage</span>
              <span className="text-[10px] text-primary-light/70 font-medium tracking-wide">Skyline SSA Admin</span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-primary-light hover:bg-primary-hover hover:text-white transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Admin Compact Profile Header */}
        <div className="px-4 py-3.5 border-b border-primary-hover/40 bg-primary-hover/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-secondary text-white font-bold text-xs flex items-center justify-center shrink-0">
              {userName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-semibold text-xs text-white block truncate leading-tight">{userName}</span>
              <span className="text-[10px] text-primary-light/80 truncate block">{userEmail}</span>
            </div>
            <span className="badge-danger text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">
              ADMIN
            </span>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          {/* Section: WORKSPACE */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold tracking-wider text-primary-light/60 uppercase mb-2">
              Workspace
            </p>
            {[
              { label: "Overview", tab: "overview", icon: BarChart3 },
              { label: "Members", tab: "members", icon: Users },
              { label: "Events", tab: "events", icon: Calendar },
            ].map(({ label, tab, icon: Icon }) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab as typeof activeTab); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === tab
                    ? "bg-surface text-primary font-bold shadow-sm"
                    : "text-primary-light hover:bg-primary-hover hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Section: MANAGEMENT */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold tracking-wider text-primary-light/60 uppercase mb-2">
              Management
            </p>
            <button
              onClick={() => { setActiveTab("ledger"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === "ledger"
                  ? "bg-surface text-primary font-bold shadow-sm"
                  : "text-primary-light hover:bg-primary-hover hover:text-white"
              }`}
            >
              <Receipt className="w-4 h-4 shrink-0" />
              <span>Ledger</span>
              <span className="ml-auto text-[9px] px-1.5 py-0.2 bg-secondary/30 text-secondary-light rounded font-bold">
                AUDIT
              </span>
            </button>

            <Link
              href="/merch"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-primary-light hover:bg-primary-hover hover:text-white transition-all"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>Merch Store</span>
            </Link>
          </div>

          {/* Section: EXTERNAL / PUBLIC */}
          <div className="space-y-1 pt-2 border-t border-primary-hover/30">
            <Link
              href="/"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-primary-light/80 hover:bg-primary-hover hover:text-white transition-all"
            >
              <Eye className="w-4 h-4 shrink-0" />
              <span>View Public Portal</span>
            </Link>
          </div>
        </nav>

        {/* Sidebar Bottom: Sign Out */}
        <div className="p-3 border-t border-primary-hover/40 bg-primary-hover/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-red-200 hover:bg-red-900/30 hover:text-red-100 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0 text-red-300" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 bg-surface border-b border-gray-subtle px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-muted hover:bg-page transition-colors"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[11px] text-muted">
                <span>Admin</span>
                <span>/</span>
                <span>Finance</span>
                <span>/</span>
                <span className="font-semibold text-body capitalize">{activeTab}</span>
              </div>
              <h1 className="text-sm font-bold text-body capitalize leading-tight">
                {activeTab === "ledger" ? "Ledger" : activeTab}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative hidden md:block">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search records or IDs..."
                className="w-56 lg:w-64 pl-9 pr-3 py-1.5 rounded-lg border border-gray-subtle bg-page text-xs text-body placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all"
              />
            </div>

            {/* Notification Indicator */}
            <button
              className="p-2 rounded-lg border border-gray-subtle text-muted hover:bg-page transition-colors relative"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-status-danger rounded-full" />
            </button>

            {/* User Profile Chip */}
            <div className="flex items-center gap-2 pl-2 border-l border-gray-subtle">
              <div className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                {userName.charAt(0)}
              </div>
              <span className="text-xs font-semibold text-body hidden sm:inline-block">
                {userName.split(" ")[0]}
              </span>
            </div>
          </div>
        </header>

        {/* Page Main Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto">

          {/* ══════════════════════════════════════════════════════════════════════
              LEDGER TAB (FINANCIAL SAAS INTERFACE)
          ══════════════════════════════════════════════════════════════════════ */}
          {activeTab === "ledger" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Ledger Page Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-subtle">
                <div>
                  <h2 className="text-xl font-bold text-body tracking-tight">
                    Financial Ledger
                  </h2>
                  <p className="text-xs text-muted mt-0.5">
                    Track credits, debits and the association&apos;s financial activity.
                  </p>
                </div>

                {/* Filter, Log Transaction, and Export CSV Actions */}
                <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                  {/* Log Transaction Button */}
                  <button
                    onClick={() => setActiveModal("TRANSACTION")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary-hover text-white text-xs font-semibold transition-colors shadow-xs"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Log Transaction</span>
                  </button>

                  {/* Filter Dropdown Button */}
                  <div className="relative">
                    <button
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                        ledgerTypeFilter !== "ALL"
                          ? "border-secondary bg-secondary-light text-secondary"
                          : "border-gray-subtle bg-surface hover:bg-page text-body"
                      }`}
                    >
                      <Filter className="w-3.5 h-3.5 text-muted" />
                      <span>Type: {ledgerTypeFilter}</span>
                    </button>

                    {/* Filter Popover Panel */}
                    {isFilterOpen && (
                      <div className="absolute right-0 mt-1.5 w-36 bg-surface border border-gray-subtle rounded-lg shadow-lg py-1 z-30">
                        {(["ALL", "CREDIT", "DEBIT"] as const).map((typeOption) => (
                          <button
                            key={typeOption}
                            onClick={() => {
                              setLedgerTypeFilter(typeOption);
                              setIsFilterOpen(false);
                            }}
                            className="w-full px-3 py-1.5 text-xs text-left font-medium text-body hover:bg-page flex items-center justify-between"
                          >
                            <span>{typeOption === "ALL" ? "All Types" : typeOption}</span>
                            {ledgerTypeFilter === typeOption && (
                              <Check className="w-3.5 h-3.5 text-secondary" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Export CSV Button */}
                  <button
                    onClick={handleExportCSV}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold transition-colors shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Financial Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Total Credits */}
                <div className="bg-surface rounded-xl border border-gray-subtle p-4 sm:p-5 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-muted mb-2">
                    <span className="text-xs font-semibold text-muted">Total Credits</span>
                    <span className="p-1 rounded-md bg-status-success-light text-status-success-dark">
                      <ArrowUp className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold tracking-tight text-status-success-dark font-mono">
                      ₹{ledgerMetrics.totalCredits.toLocaleString("en-IN")}
                    </div>
                    <span className="text-[11px] text-muted block mt-1">
                      Verified member &amp; ticket revenues
                    </span>
                  </div>
                </div>

                {/* Total Debits */}
                <div className="bg-surface rounded-xl border border-gray-subtle p-4 sm:p-5 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-muted mb-2">
                    <span className="text-xs font-semibold text-muted">Total Debits</span>
                    <span className="p-1 rounded-md bg-status-danger-light text-status-danger-dark">
                      <ArrowDown className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold tracking-tight text-status-danger-dark font-mono">
                      ₹{ledgerMetrics.totalDebits.toLocaleString("en-IN")}
                    </div>
                    <span className="text-[11px] text-muted block mt-1">
                      Procurement &amp; operational expenses
                    </span>
                  </div>
                </div>

                {/* Net Balance */}
                <div className="bg-surface rounded-xl border border-gray-subtle p-4 sm:p-5 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-muted mb-2">
                    <span className="text-xs font-semibold text-muted">Net Balance</span>
                    <span className="p-1 rounded-md bg-primary-light text-primary">
                      <CreditCard className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold tracking-tight text-primary font-mono">
                      ₹{ledgerMetrics.netBalance.toLocaleString("en-IN")}
                    </div>
                    <span className="text-[11px] text-muted block mt-1">
                      Auditable zero-float integer accounting
                    </span>
                  </div>
                </div>
              </div>

              {/* Ledger Transaction Audit Log Table */}
              <div className="bg-surface rounded-xl border border-gray-subtle shadow-xs overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-surface">
                  <div>
                    <h3 className="text-xs font-bold text-body tracking-tight uppercase text-muted">
                      Audit Trail Records ({filteredTransactions.length})
                    </h3>
                  </div>
                  {searchQuery && (
                    <span className="text-[11px] text-muted">
                      Filtered by query: <strong className="text-body font-mono">&ldquo;{searchQuery}&rdquo;</strong>
                    </span>
                  )}
                </div>

                {/* Table Layout */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-subtle bg-page/60 text-[11px] font-semibold text-muted uppercase tracking-wider">
                        <th className="py-2.5 px-4 font-semibold">Txn ID</th>
                        <th className="py-2.5 px-4 font-semibold">Description</th>
                        <th className="py-2.5 px-4 font-semibold">Category</th>
                        <th className="py-2.5 px-4 font-semibold">Type</th>
                        <th className="py-2.5 px-4 font-semibold text-right">Amount (₹)</th>
                        <th className="py-2.5 px-4 font-semibold text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-subtle text-xs">
                      {filteredTransactions.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-muted">
                            No ledger transactions matching the selected criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredTransactions.map((txn) => (
                          <tr
                            key={txn.id}
                            className="hover:bg-page/70 transition-colors group"
                          >
                            {/* Transaction ID */}
                            <td className="py-3 px-4 font-mono text-[11px] text-muted font-medium whitespace-nowrap">
                              {txn.id}
                            </td>

                            {/* Description */}
                            <td className="py-3 px-4 text-body font-medium">
                              <span className="block">{txn.desc}</span>
                              {txn.reference && (
                                <span className="text-[10px] text-muted font-mono block">Ref: {txn.reference}</span>
                              )}
                            </td>

                            {/* Category */}
                            <td className="py-3 px-4 text-muted whitespace-nowrap">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-page border border-gray-subtle text-body">
                                {txn.category}
                              </span>
                            </td>

                            {/* Type Badge */}
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${
                                  txn.type === "CREDIT"
                                    ? "bg-status-success-light text-status-success-dark"
                                    : "bg-status-danger-light text-status-danger-dark"
                                }`}
                              >
                                {txn.type}
                              </span>
                            </td>

                            {/* Amount */}
                            <td
                              className={`py-3 px-4 text-right font-mono font-semibold whitespace-nowrap ${
                                txn.type === "CREDIT"
                                  ? "text-status-success-dark"
                                  : "text-status-danger-dark"
                              }`}
                            >
                              {txn.type === "CREDIT" ? "+" : "-"}₹{txn.amount.toLocaleString("en-IN")}
                            </td>

                            {/* Date */}
                            <td className="py-3 px-4 text-right text-muted text-[11px] whitespace-nowrap">
                              {txn.date}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer Summary */}
                <div className="px-4 py-2.5 border-t border-gray-subtle bg-page/40 flex items-center justify-between text-[11px] text-muted">
                  <span>Single-entry accounting verified</span>
                  <span>Currency: INR (₹)</span>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════
              OVERVIEW TAB
          ══════════════════════════════════════════════════════════════════════ */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-subtle">
                <div>
                  <h2 className="text-xl font-bold text-body tracking-tight">
                    Executive Overview
                  </h2>
                  <p className="text-xs text-muted mt-0.5">Summary of Skyline SSA operations and performance metrics.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveModal("TRANSACTION")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-white text-xs font-semibold hover:bg-secondary-hover transition-colors shadow-xs"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Log Transaction</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("ledger")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors shadow-xs"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Open Financial Ledger</span>
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Active Members", value: members.length.toString(), change: `+${members.length}`, trend: "up", icon: Users, color: "primary" },
                  { label: "Events Total", value: events.length.toString(), change: "+2", trend: "up", icon: Calendar, color: "secondary" },
                  { label: "Ledger Balance", value: `₹${ledgerMetrics.netBalance.toLocaleString("en-IN")}`, change: "+₹12,400", trend: "up", icon: CreditCard, color: "primary" },
                  { label: "Merch in Stock", value: "140", change: "-24 sold", trend: "down", icon: Package, color: "secondary" },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="bg-surface rounded-xl border border-gray-subtle p-4 shadow-xs">
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          stat.color === "primary" ? "bg-primary-light text-primary" : "bg-secondary-light text-secondary"
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-[10px] font-bold flex items-center gap-0.5 ${
                          stat.trend === "up" ? "text-status-success-dark" : "text-status-warning-dark"
                        }`}>
                          {stat.trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {stat.change}
                        </span>
                      </div>
                      <div className="font-bold text-xl text-body font-mono">{stat.value}</div>
                      <div className="text-xs text-muted mt-0.5">{stat.label}</div>
                    </div>
                  );
                })}
              </div>

              {/* Two Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Events */}
                <div className="bg-surface rounded-xl border border-gray-subtle shadow-xs">
                  <div className="px-4 py-3 border-b border-gray-subtle flex items-center justify-between">
                    <h3 className="font-semibold text-xs text-body flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-secondary" />
                      Upcoming Events
                    </h3>
                    <button onClick={() => setActiveTab("events")} className="text-[11px] font-semibold text-primary hover:underline">
                      View all ({events.length})
                    </button>
                  </div>
                  <div className="divide-y divide-gray-subtle">
                    {events.slice(0, 3).map((ev) => (
                      <div key={ev.id} className="px-4 py-2.5 flex items-center justify-between gap-3 text-xs">
                        <div className="min-w-0">
                          <p className="font-semibold text-body truncate">{ev.title}</p>
                          <p className="text-[10px] text-muted">{ev.date}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-mono font-semibold text-primary">{ev.tickets}/{ev.capacity}</span>
                          <span className="text-[10px] text-muted block">tickets</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Ledger Snapshot */}
                <div className="bg-surface rounded-xl border border-gray-subtle shadow-xs">
                  <div className="px-4 py-3 border-b border-gray-subtle flex items-center justify-between">
                    <h3 className="font-semibold text-xs text-body flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-primary" />
                      Recent Transactions
                    </h3>
                    <button onClick={() => setActiveTab("ledger")} className="text-[11px] font-semibold text-primary hover:underline">
                      View full ledger
                    </button>
                  </div>
                  <div className="divide-y divide-gray-subtle">
                    {transactions.slice(0, 4).map((txn) => (
                      <div key={txn.id} className="px-4 py-2.5 flex items-center justify-between gap-3 text-xs">
                        <div className="min-w-0">
                          <p className="font-medium text-body truncate">{txn.desc}</p>
                          <p className="text-[10px] font-mono text-muted">{txn.id}</p>
                        </div>
                        <span className={`font-mono font-bold shrink-0 ${
                          txn.type === "CREDIT" ? "text-status-success-dark" : "text-status-danger-dark"
                        }`}>
                          {txn.type === "CREDIT" ? "+" : "-"}₹{txn.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════
              MEMBERS TAB
          ══════════════════════════════════════════════════════════════════════ */}
          {activeTab === "members" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between gap-3 pb-2 border-b border-gray-subtle">
                <div>
                  <h2 className="text-xl font-bold text-body tracking-tight">Member Registry</h2>
                  <p className="text-xs text-muted">All active registered members and membership records.</p>
                </div>
                <button
                  onClick={() => setActiveModal("MEMBER")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Member</span>
                </button>
              </div>

              <div className="bg-surface rounded-xl border border-gray-subtle overflow-hidden shadow-xs">
                <div className="grid grid-cols-6 px-4 py-2.5 bg-page border-b border-gray-subtle text-[10px] font-bold text-muted uppercase tracking-wider">
                  <span className="col-span-2">Member</span>
                  <span>Role</span>
                  <span>Tier</span>
                  <span>Status</span>
                  <span className="text-right">Paid</span>
                </div>
                <div className="divide-y divide-gray-subtle">
                  {members.map((m) => (
                    <div key={m.id} className="grid grid-cols-6 px-4 py-3 items-center hover:bg-page transition-colors text-xs">
                      <div className="col-span-2 flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-primary-light text-primary font-bold text-xs flex items-center justify-center shrink-0">
                          {m.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-body truncate">{m.name}</p>
                          <p className="text-[10px] font-mono text-muted">{m.id}</p>
                        </div>
                      </div>
                      <span className={`${ROLE_BADGE[m.role] || "badge-basic"} text-[9px] font-bold px-1.5 py-0.5 rounded uppercase w-fit`}>
                        {m.role}
                      </span>
                      <span className={`${TIER_BADGE[m.tier] || "badge-basic"} text-[9px] font-bold px-1.5 py-0.5 rounded w-fit`}>
                        {m.tier}
                      </span>
                      <span className={`font-semibold flex items-center gap-1 ${
                        m.status === "active" ? "text-status-success-dark" : "text-status-warning-dark"
                      }`}>
                        {m.status === "active" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {m.status}
                      </span>
                      <span className="font-mono font-semibold text-body text-right">{m.paid}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════
              EVENTS TAB
          ══════════════════════════════════════════════════════════════════════ */}
          {activeTab === "events" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between gap-3 pb-2 border-b border-gray-subtle">
                <div>
                  <h2 className="text-xl font-bold text-body tracking-tight">Event Operations</h2>
                  <p className="text-xs text-muted">Upcoming events, registrations and seat occupancy.</p>
                </div>
                <button
                  onClick={() => setActiveModal("EVENT")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary-hover text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Create Event</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.map((ev) => (
                  <div key={ev.id} className="bg-surface rounded-xl border border-gray-subtle p-5 shadow-xs">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-body">{ev.title}</h3>
                        {ev.description && (
                          <p className="text-xs text-muted mt-0.5 line-clamp-2 leading-relaxed">
                            {ev.description}
                          </p>
                        )}
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0 ${
                        ev.status === "upcoming" ? "badge-info" : "badge-success"
                      }`}>
                        {ev.status}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-muted">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-secondary shrink-0" />
                        <span>{ev.date}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Ticket className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="font-mono">{ev.tickets} / {ev.capacity} tickets issued</span>
                        </div>
                        <span className="font-mono font-bold text-body bg-page border border-gray-subtle px-2 py-0.5 rounded text-[11px]">
                          {ev.price === 0 ? "FREE" : `₹${ev.price} / ticket`}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 mb-2">
                      <div className="w-full h-1.5 bg-page rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${Math.round((ev.tickets / ev.capacity) * 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-subtle flex items-center justify-between text-xs">
                      <span>Revenue: <strong className="font-mono text-primary">{ev.revenue}</strong></span>
                      <span className="text-[10px] font-mono text-muted">{ev.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          INTERACTIVE MODALS FOR ADDING RECORDS
      ══════════════════════════════════════════════════════════════════════ */}

      {/* 1. Modal: Log Transaction */}
      {activeModal === "TRANSACTION" && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl border border-gray-subtle shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-subtle mb-4">
              <h3 className="font-bold text-base text-body flex items-center gap-2">
                <Receipt className="w-4 h-4 text-primary" />
                Log Ledger Entry
              </h3>
              <button
                onClick={() => setActiveModal("NONE")}
                className="p-1 rounded-lg hover:bg-page text-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-body block mb-1">Description / Memo</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Refreshments for General Meeting"
                  value={newTxnDesc}
                  onChange={(e) => setNewTxnDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-subtle bg-page text-body focus:outline-none focus:ring-2 focus:ring-secondary/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-body block mb-1">Entry Type</label>
                  <select
                    value={newTxnType}
                    onChange={(e) => setNewTxnType(e.target.value as "CREDIT" | "DEBIT")}
                    className="w-full px-3 py-2 rounded-xl border border-gray-subtle bg-page text-body focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  >
                    <option value="CREDIT">Credit (Income +)</option>
                    <option value="DEBIT">Debit (Expense -)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-body block mb-1">Amount in Rupees (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 1500"
                    value={newTxnAmount}
                    onChange={(e) => setNewTxnAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-subtle bg-page text-body font-mono focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-body block mb-1">Category</label>
                <select
                  value={newTxnCategory}
                  onChange={(e) => setNewTxnCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-subtle bg-page text-body focus:outline-none focus:ring-2 focus:ring-secondary/50"
                >
                  <option value="Ticketing">Ticketing</option>
                  <option value="Merchandise">Merchandise</option>
                  <option value="Operations">Operations</option>
                  <option value="Procurement">Procurement</option>
                  <option value="Sponsorship">Sponsorship</option>
                </select>
              </div>

              <div className="pt-3 border-t border-gray-subtle flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal("NONE")}
                  className="px-4 py-2 rounded-xl border border-gray-subtle hover:bg-page text-body font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary-hover text-white font-semibold transition-colors shadow-xs"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal: Add Member */}
      {activeModal === "MEMBER" && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl border border-gray-subtle shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-subtle mb-4">
              <h3 className="font-bold text-base text-body flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Enroll New Member
              </h3>
              <button
                onClick={() => setActiveModal("NONE")}
                className="p-1 rounded-lg hover:bg-page text-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-body block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Sharma"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-subtle bg-page text-body focus:outline-none focus:ring-2 focus:ring-secondary/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-body block mb-1">Role Assignment</label>
                  <select
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value as Member["role"])}
                    className="w-full px-3 py-2 rounded-xl border border-gray-subtle bg-page text-body focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  >
                    <option value="MEMBER">Member</option>
                    <option value="VOLUNTEER">Volunteer</option>
                    <option value="TREASURER">Treasurer</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-body block mb-1">Membership Tier</label>
                  <select
                    value={newMemberTier}
                    onChange={(e) => setNewMemberTier(e.target.value as Member["tier"])}
                    className="w-full px-3 py-2 rounded-xl border border-gray-subtle bg-page text-body focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  >
                    <option value="Basic">Basic (₹299)</option>
                    <option value="Premium">Premium (₹599)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-subtle flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal("NONE")}
                  className="px-4 py-2 rounded-xl border border-gray-subtle hover:bg-page text-body font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold transition-colors shadow-xs"
                >
                  Register Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal: Create Event */}
      {activeModal === "EVENT" && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl border border-gray-subtle shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-subtle mb-4">
              <h3 className="font-bold text-base text-body flex items-center gap-2">
                <Calendar className="w-4 h-4 text-secondary" />
                Schedule New Event
              </h3>
              <button
                onClick={() => setActiveModal("NONE")}
                className="p-1 rounded-lg hover:bg-page text-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-body block mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Winter Cultural Gala 2026"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-subtle bg-page text-body focus:outline-none focus:ring-2 focus:ring-secondary/50"
                />
              </div>

              <div>
                <label className="font-semibold text-body block mb-1">Event Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief summary of event agenda, special guests, or dress code..."
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-subtle bg-page text-body focus:outline-none focus:ring-2 focus:ring-secondary/50 resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="font-semibold text-body block mb-1">Date &amp; Schedule</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nov 14, 2026"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-subtle bg-page text-body focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  />
                </div>

                <div className="col-span-1">
                  <label className="font-semibold text-body block mb-1">Seat Capacity</label>
                  <input
                    type="number"
                    required
                    min="10"
                    placeholder="e.g. 150"
                    value={newEventCapacity}
                    onChange={(e) => setNewEventCapacity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-subtle bg-page text-body font-mono focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  />
                </div>

                <div className="col-span-1">
                  <label className="font-semibold text-body block mb-1">Ticket Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="0 for Free"
                    value={newEventPrice}
                    onChange={(e) => setNewEventPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-subtle bg-page text-body font-mono focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-subtle flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal("NONE")}
                  className="px-4 py-2 rounded-xl border border-gray-subtle hover:bg-page text-body font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary-hover text-white font-semibold transition-colors shadow-xs"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}