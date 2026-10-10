import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Receipt, Clock, CheckCircle2, XCircle, DollarSign, 
  Search, ArrowRight, Eye, Calendar, User, FileText 
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

export interface ExpenseClaim {
  id: string;
  claimantName: string;
  claimantEmail: string;
  eventRef: string;
  category: "TRAVEL" | "CATERING" | "LOGISTICS" | "PRINTING" | "SOFTWARE";
  description: string;
  amount: number;
  submittedAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "PAID";
  receiptUrl?: string;
  rejectionReason?: string;
  approvedAt?: string;
  paidAt?: string;
}

export const DEMO_CLAIMS: ExpenseClaim[] = [
  {
    id: "CLM-901",
    claimantName: "Neha Sharma",
    claimantEmail: "neha.sharma@campus.edu",
    eventRef: "Tech Summit 2026",
    category: "PRINTING",
    description: "Speaker badges, banners, and stage agenda laminates printed at City Print Hub",
    amount: 4800,
    submittedAt: "2026-10-09",
    status: "PENDING",
    receiptUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "CLM-902",
    claimantName: "Karthik Verma",
    claimantEmail: "karthik.v@campus.edu",
    eventRef: "Tech Summit 2026",
    category: "LOGISTICS",
    description: "Emergency Uber courier delivery of spare microcontrollers and cables",
    amount: 1450,
    submittedAt: "2026-10-08",
    status: "PENDING",
    receiptUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "CLM-882",
    claimantName: "Rahul Sundaram",
    claimantEmail: "rahul.s@campus.edu",
    eventRef: "HackOdoo 2026",
    category: "SOFTWARE",
    description: "AWS cloud server hosting and load balancer cluster for 36-hour hackathon",
    amount: 3200,
    submittedAt: "2026-10-05",
    status: "APPROVED",
    approvedAt: "2026-10-07",
    receiptUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "CLM-870",
    claimantName: "Priya Menon",
    claimantEmail: "priya.m@campus.edu",
    eventRef: "HackOdoo 2026",
    category: "CATERING",
    description: "Midnight snacks, coffee and energy drinks for hackathon participants",
    amount: 4500,
    submittedAt: "2026-09-18",
    status: "PAID",
    approvedAt: "2026-09-19",
    paidAt: "2026-09-20",
    receiptUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "CLM-855",
    claimantName: "Ananya Roy",
    claimantEmail: "ananya.roy@campus.edu",
    eventRef: "Campus Tech Aid 2026",
    category: "TRAVEL",
    description: "Personal taxi fare without prior executive authorization or itemized breakdown",
    amount: 2800,
    submittedAt: "2026-09-12",
    status: "REJECTED",
    rejectionReason: "Personal cab travel not pre-authorized by President; missing itemized receipt.",
    receiptUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80"
  }
];

export default function FinanceClaimsPage() {
  const [claims, setClaims] = useState<ExpenseClaim[]>(DEMO_CLAIMS);
  const [activeStatus, setActiveStatus] = useState<string>("PENDING");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClaims = claims.filter((claim) => {
    const matchesStatus = activeStatus === "ALL" || claim.status === activeStatus;
    const matchesSearch = 
      claim.claimantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.eventRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = claims.filter(c => c.status === "PENDING").length;

  return (
    <DashboardLayout
      role="TREASURER"
      breadcrumb={[
        { label: "Treasury", href: "/finance" },
        { label: "Expense Claims" }
      ]}
      title="Expense Reimbursement Claims Queue"
      subtitle="Verify volunteer and executive receipts, audit event budget caps, and disburse payouts."
    >
      <div className="space-y-6">
        {/* Top Status Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-3xl border border-gray-100 p-4 shadow-xs">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {[
              { id: "PENDING", label: "Pending Verification", count: pendingCount, color: "bg-amber-100 text-amber-800" },
              { id: "APPROVED", label: "Approved (Ready for Payout)", count: claims.filter(c => c.status === "APPROVED").length, color: "bg-blue-100 text-blue-800" },
              { id: "PAID", label: "Settled / Paid", count: claims.filter(c => c.status === "PAID").length, color: "bg-emerald-100 text-emerald-800" },
              { id: "REJECTED", label: "Rejected", count: claims.filter(c => c.status === "REJECTED").length, color: "bg-rose-100 text-rose-800" },
              { id: "ALL", label: "All Claims", count: claims.length, color: "bg-gray-100 text-gray-800" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveStatus(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeStatus === tab.id
                    ? "bg-[#4A1942] text-white shadow-xs"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  activeStatus === tab.id ? "bg-white/20 text-white" : tab.color
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search claims..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#4A1942]/20"
            />
          </div>
        </div>

        {/* Claims List */}
        <div className="space-y-3">
          {filteredClaims.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 text-sm">No claims in this filter</h3>
              <p className="text-xs text-gray-500 mt-1">
                {activeStatus === "PENDING"
                  ? "Great job! All submitted expense claims have been processed."
                  : "No reimbursement requests match your search criteria."}
              </p>
            </div>
          ) : (
            filteredClaims.map((claim) => (
              <div
                key={claim.id}
                className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs hover:border-purple-200 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-xs text-gray-900">{claim.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      claim.status === "PENDING" ? "bg-amber-100 text-amber-800" :
                      claim.status === "APPROVED" ? "bg-blue-100 text-blue-800" :
                      claim.status === "PAID" ? "bg-emerald-100 text-emerald-800" :
                      "bg-rose-100 text-rose-800"
                    }`}>
                      {claim.status}
                    </span>
                    <span className="text-[11px] font-bold text-[#017E84] bg-teal-50 px-2 py-0.5 rounded">
                      {claim.eventRef}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase bg-gray-50 px-2 py-0.5 rounded">
                      {claim.category}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-gray-800 line-clamp-1">
                    {claim.description}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-gray-500">
                    <span className="flex items-center gap-1 font-medium">
                      <User className="w-3 h-3 text-gray-400" />
                      {claim.claimantName} ({claim.claimantEmail})
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      Submitted: {claim.submittedAt}
                    </span>
                  </div>

                  {claim.rejectionReason && (
                    <div className="mt-2 text-xs text-rose-700 bg-rose-50 border border-rose-100 rounded-xl p-2.5">
                      <span className="font-bold">Rejection note:</span> {claim.rejectionReason}
                    </div>
                  )}
                </div>

                <div className="flex md:flex-col items-end justify-between w-full md:w-auto gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Amount</span>
                    <div className="text-lg font-black font-mono text-gray-900">
                      ₹{claim.amount.toLocaleString("en-IN")}
                    </div>
                  </div>

                  <Link
                    to={`/finance/claims/${claim.id}`}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#4A1942] hover:bg-[#3a1232] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Review & Audit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
