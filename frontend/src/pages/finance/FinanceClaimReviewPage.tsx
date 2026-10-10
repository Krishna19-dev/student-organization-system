import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, CheckCircle, XCircle, AlertCircle, DollarSign, 
  Receipt, FileText, User, Calendar, ExternalLink, ShieldCheck, Check 
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { DEMO_CLAIMS, ExpenseClaim } from "./FinanceClaimsPage";

export default function FinanceClaimReviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const foundClaim = DEMO_CLAIMS.find((c) => c.id === id) || {
    id: id || "CLM-901",
    claimantName: "Neha Sharma",
    claimantEmail: "neha.sharma@campus.edu",
    eventRef: "Tech Summit 2026",
    category: "PRINTING" as const,
    description: "Speaker badges, banners, and stage agenda laminates printed at City Print Hub",
    amount: 4800,
    submittedAt: "2026-10-09",
    status: "PENDING" as const,
    receiptUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80"
  };

  const [claim, setClaim] = useState<ExpenseClaim>(foundClaim);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleApprove = () => {
    setClaim(prev => ({
      ...prev,
      status: "APPROVED",
      approvedAt: new Date().toISOString().split("T")[0]
    }));
    setFeedbackMessage({ text: "Claim approved successfully! It is now queued for payout disbursement.", type: "success" });
  };

  const handleMarkPaid = () => {
    setClaim(prev => ({
      ...prev,
      status: "PAID",
      paidAt: new Date().toISOString().split("T")[0]
    }));
    setFeedbackMessage({ text: `Payout of ₹${claim.amount} disbursed! Debit entry logged to ledger.`, type: "success" });
  };

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      alert("Please enter a specific reason for rejection to notify the claimant.");
      return;
    }
    setClaim(prev => ({
      ...prev,
      status: "REJECTED",
      rejectionReason: rejectReason.trim()
    }));
    setShowRejectModal(false);
    setFeedbackMessage({ text: "Claim rejected and reason logged.", type: "error" });
  };

  return (
    <DashboardLayout
      role="TREASURER"
      breadcrumb={[
        { label: "Treasury", href: "/finance" },
        { label: "Claims Queue", href: "/finance/claims" },
        { label: `Audit ${claim.id}` }
      ]}
      title={`Review Claim: ${claim.id}`}
      subtitle={`Submitted by ${claim.claimantName} for ${claim.eventRef}`}
      actions={
        <Link
          to="/finance/claims"
          className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Queue</span>
        </Link>
      }
    >
      <div className="space-y-6 max-w-5xl mx-auto">
        {feedbackMessage && (
          <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold ${
            feedbackMessage.type === "success" 
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800" 
              : "bg-rose-50 border border-rose-200 text-rose-800"
          }`}>
            {feedbackMessage.type === "success" ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Claim Details & Audit Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Claim Status</span>
                  <div className="mt-1">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                      claim.status === "PENDING" ? "bg-amber-100 text-amber-800" :
                      claim.status === "APPROVED" ? "bg-blue-100 text-blue-800" :
                      claim.status === "PAID" ? "bg-emerald-100 text-emerald-800" :
                      "bg-rose-100 text-rose-800"
                    }`}>
                      {claim.status}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Claim Amount</span>
                  <div className="text-2xl font-black font-mono text-gray-900 mt-0.5">
                    ₹{claim.amount.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              {/* Claimant Information */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Claimant Information</h3>
                <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100">
                  <div>
                    <span className="text-gray-400 font-medium">Claimant:</span>
                    <div className="font-bold text-gray-800">{claim.claimantName}</div>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium">Email:</span>
                    <div className="font-bold text-gray-800">{claim.claimantEmail}</div>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium">Event Charged:</span>
                    <div className="font-bold text-[#017E84]">{claim.eventRef}</div>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium">Expense Category:</span>
                    <div className="font-bold text-gray-800">{claim.category}</div>
                  </div>
                </div>
              </div>

              {/* Expense Narrative */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Itemized Description</h3>
                <div className="p-4 bg-gray-50 rounded-2xl text-xs text-gray-700 leading-relaxed font-medium">
                  {claim.description}
                </div>
              </div>

              {claim.rejectionReason && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>Rejection Reason Logged:</span>
                  </div>
                  <p className="font-medium">{claim.rejectionReason}</p>
                </div>
              )}

              {/* Audit Controls & Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-2.5">
                {claim.status === "PENDING" && (
                  <>
                    <button
                      onClick={handleApprove}
                      className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve Claim</span>
                    </button>
                    <button
                      onClick={() => setShowRejectModal(true)}
                      className="py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-rose-200 transition-all"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </>
                )}

                {claim.status === "APPROVED" && (
                  <button
                    onClick={handleMarkPaid}
                    className="w-full py-2.5 px-4 bg-[#017E84] hover:bg-[#01686d] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>Mark as PAID & Log to Ledger</span>
                  </button>
                )}

                {claim.status === "PAID" && (
                  <div className="w-full py-2.5 px-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Reimbursement Settled on {claim.paidAt || "2026-10-10"}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Receipt Preview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-[#4A1942]" />
                  <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Proof of Expense</h3>
                </div>
                {claim.receiptUrl && (
                  <a
                    href={claim.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#017E84] hover:underline flex items-center gap-1"
                  >
                    <span>Full size</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div className="border border-gray-200 rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center min-h-[300px]">
                {claim.receiptUrl ? (
                  <img
                    src={claim.receiptUrl}
                    alt="Expense Receipt"
                    className="w-full h-auto object-cover max-h-[420px]"
                  />
                ) : (
                  <div className="text-center p-8 text-gray-400 text-xs">
                    <Receipt className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <span>No receipt image attached</span>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-gray-400 italic text-center">
                Audited against organization financial guidelines. Tax invoices require GSTIN verification.
              </p>
            </div>
          </div>
        </div>

        {/* Rejection Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertCircle className="w-5 h-5" />
                <h3 className="font-bold text-base text-gray-900">Reject Expense Claim</h3>
              </div>
              <p className="text-xs text-gray-600">
                Please provide a clear justification. This explanation will be emailed to <span className="font-bold text-gray-800">{claim.claimantName}</span>.
              </p>

              <div>
                <textarea
                  rows={4}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Missing tax invoice; personal taxi ride not pre-authorized by President..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReject}
                  className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition-all"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
