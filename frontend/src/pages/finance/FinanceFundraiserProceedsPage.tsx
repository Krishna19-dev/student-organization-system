import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, HandCoins, PlusCircle, CheckCircle, 
  DollarSign, FileText, Calendar, User, TrendingUp 
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

interface OfflineDonation {
  id: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  paymentMode: "CASH" | "UPI" | "CHEQUE" | "BANK_TRANSFER";
  referenceNo: string;
  loggedAt: string;
}

export default function FinanceFundraiserProceedsPage() {
  const { id } = useParams<{ id: string }>();

  const campaign = {
    id: id || "tech-aid-2026",
    title: "Campus Tech Aid 2026 Drive",
    targetAmount: 50000,
    currentRaised: 36500,
    onlineRaised: 22000,
    offlineRaised: 14500,
  };

  const [donations, setDonations] = useState<OfflineDonation[]>([
    { id: "DON-101", donorName: "Alumni Batch 2022", donorEmail: "alumni22@campus.edu", amount: 10000, paymentMode: "BANK_TRANSFER", referenceNo: "NEFT-991823", loggedAt: "2026-10-02" },
    { id: "DON-102", donorName: "Dean Dr. V. Raman", donorEmail: "vraman@university.edu", amount: 4500, paymentMode: "UPI", referenceNo: "UPI-884910", loggedAt: "2026-10-03" }
  ]);

  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState<"CASH" | "UPI" | "CHEQUE" | "BANK_TRANSFER">("UPI");
  const [referenceNo, setReferenceNo] = useState("");
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const handleSubmitDonation = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseInt(amount);
    if (!donorName.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Please provide valid donor details and an integer amount.");
      return;
    }

    const newDonation: OfflineDonation = {
      id: `DON-${Date.now().toString().slice(-4)}`,
      donorName: donorName.trim(),
      donorEmail: donorEmail.trim() || "offline@anonymous.org",
      amount: parsedAmount,
      paymentMode,
      referenceNo: referenceNo.trim() || `OFFLINE-${Date.now().toString().slice(-6)}`,
      loggedAt: new Date().toISOString().split("T")[0]
    };

    setDonations([newDonation, ...donations]);
    setSuccessNotice(`₹${parsedAmount.toLocaleString("en-IN")} credited directly to Single-Entry Ledger under category 'FUNDRAISER'.`);
    setDonorName("");
    setDonorEmail("");
    setAmount("");
    setReferenceNo("");
    setTimeout(() => setSuccessNotice(null), 5000);
  };

  const totalOfflineLogged = donations.reduce((sum, d) => sum + d.amount, 0);
  const totalRaisedNow = campaign.onlineRaised + totalOfflineLogged;
  const progressPercent = Math.min(100, Math.round((totalRaisedNow / campaign.targetAmount) * 100));

  return (
    <DashboardLayout
      role="TREASURER"
      breadcrumb={[
        { label: "Treasury", href: "/finance" },
        { label: "Fundraisers" },
        { label: campaign.title }
      ]}
      title={`Log Campaign Proceeds: ${campaign.title}`}
      subtitle="Record offline collection cash/UPI receipts directly into the single-entry treasury ledger."
      actions={
        <Link
          to="/finance"
          className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Treasury Hub</span>
        </Link>
      }
    >
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Goal Overview Progress Card */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Fundraiser Goal Tracking</span>
              <h2 className="text-lg font-bold text-gray-900">{campaign.title}</h2>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-gray-400">Total Progress</span>
              <div className="text-2xl font-black font-mono text-[#017E84]">
                ₹{totalRaisedNow.toLocaleString("en-IN")}{" "}
                <span className="text-xs text-gray-400 font-sans font-semibold">/ ₹{campaign.targetAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs pt-2 border-t border-gray-100">
            <div>
              <span className="text-gray-400">Online Gateway Proceeds:</span>
              <div className="font-mono font-bold text-gray-800">₹{campaign.onlineRaised.toLocaleString("en-IN")}</div>
            </div>
            <div>
              <span className="text-gray-400">Offline Logged Proceeds:</span>
              <div className="font-mono font-bold text-emerald-600">₹{totalOfflineLogged.toLocaleString("en-IN")}</div>
            </div>
            <div>
              <span className="text-gray-400">Campaign Target Yield:</span>
              <div className="font-bold text-purple-700">{progressPercent}% Achieved</div>
            </div>
          </div>
        </div>

        {successNotice && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs font-semibold text-emerald-800">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Log Proceeds Form */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <PlusCircle className="w-4 h-4 text-[#4A1942]" />
              <h3 className="font-bold text-sm text-gray-900">Record Offline Contribution</h3>
            </div>

            <form onSubmit={handleSubmitDonation} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Donor / Entity Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe / Alumni Chapter"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#4A1942]/20"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Donor Email (Optional)</label>
                <input
                  type="email"
                  placeholder="donor@example.com"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#4A1942]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Amount (INR) *</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    placeholder="e.g. 5000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono font-bold outline-none focus:ring-2 focus:ring-[#4A1942]/20"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Payment Method</label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value as any)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold outline-none focus:ring-2 focus:ring-[#4A1942]/20"
                  >
                    <option value="UPI">UPI Transfer</option>
                    <option value="CASH">Cash in Hand</option>
                    <option value="BANK_TRANSFER">Bank Wire (NEFT/IMPS)</option>
                    <option value="CHEQUE">Cheque / Demand Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Payment Reference / UTR #</label>
                <input
                  type="text"
                  placeholder="e.g. UPI Ref # or Receipt Voucher #"
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#4A1942]/20"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#4A1942] hover:bg-[#3a1232] text-white rounded-xl font-bold transition-all shadow-xs flex items-center justify-center gap-2 pt-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Credit to Treasury Ledger</span>
              </button>
            </form>
          </div>

          {/* Right: Recorded offline donations log */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <HandCoins className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-sm text-gray-900">Recorded Offline Donations</h3>
              </div>
              <span className="text-xs text-gray-400 font-semibold">{donations.length} records</span>
            </div>

            <div className="divide-y divide-gray-100">
              {donations.map((don) => (
                <div key={don.id} className="py-3.5 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-gray-900">{don.donorName}</div>
                    <div className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
                      <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-600 uppercase">
                        {don.paymentMode}
                      </span>
                      <span>Ref: {don.referenceNo}</span>
                      <span>• {don.loggedAt}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-mono font-bold text-emerald-600">
                      +₹{don.amount.toLocaleString("en-IN")}
                    </span>
                    <div className="text-[10px] text-gray-400 font-medium">Logged & Reconciled</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                to="/finance/ledger"
                className="text-xs font-bold text-[#017E84] hover:underline flex items-center gap-1"
              >
                <span>View updated General Ledger</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
