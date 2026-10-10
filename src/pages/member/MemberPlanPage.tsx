import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ShieldCheck, Sparkles, CheckCircle2, RefreshCw, 
  ArrowRight, Clock, Award, HelpCircle 
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { getDemoUser } from "@/lib/auth-demo";

export default function MemberPlanPage() {
  const [user, setUser] = useState<any>(null);
  const [renewing, setRenewing] = useState(false);
  const [renewed, setRenewed] = useState(false);

  useEffect(() => {
    getDemoUser().then(setUser);
  }, []);

  const tier = user?.tier || "PREMIUM";
  const startDate = "Nov 01, 2026";
  const expiryDate = renewed ? "Oct 31, 2028" : "Oct 31, 2027";

  const handleRenew = () => {
    setRenewing(true);
    setTimeout(() => {
      setRenewing(false);
      setRenewed(true);
    }, 1200);
  };

  return (
    <DashboardLayout
      role="MEMBER"
      breadcrumb={[{ label: "Member Hub", href: "/me" }, { label: "Membership" }]}
      title="Membership Subscription & Tier"
      subtitle="Manage your annual association dues, benefits tier, and term renewals."
    >
      <div className="max-w-3xl space-y-6">
        {/* Active Plan Card */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
            <div>
              <span className="text-[10px] font-bold text-[#017E84] uppercase tracking-wider">Current Active Plan</span>
              <h2 className="text-2xl font-black text-gray-900 mt-0.5">
                {tier === "PREMIUM" ? "Premium Executive Tier" : "Basic Student Tier"}
              </h2>
              <span className="text-xs text-gray-400">Term Dues Paid: ₹{tier === "PREMIUM" ? 599 : 299} / year</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                Active &amp; Good Standing
              </span>
            </div>
          </div>

          {/* Timeline details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Term Activated</span>
              <div className="text-sm font-bold text-gray-900">{startDate}</div>
              <span className="text-[11px] text-gray-500">Verified by Single Ledger Credit</span>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 space-y-1">
              <span className="text-[10px] font-bold text-purple-600 uppercase">Current Expiry Date</span>
              <div className="text-sm font-black text-[#4A1942]">{expiryDate}</div>
              <span className="text-[11px] text-purple-700">{renewed ? "Extended by +365 Days!" : "Auto-renews or manual extension"}</span>
            </div>
          </div>

          {/* Renew Action */}
          <div className="p-5 rounded-2xl bg-[#FAF7F9] border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-xs text-gray-900">Extend Term by +1 Year (₹599)</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Lock in your voting eligibility and member merchandise discounts for the upcoming academic year.
              </p>
            </div>

            <button
              onClick={handleRenew}
              disabled={renewing || renewed}
              className="px-6 py-2.5 rounded-xl bg-[#4A1942] hover:bg-[#3a1232] text-white text-xs font-bold transition-all disabled:opacity-50 shrink-0 shadow-xs"
            >
              {renewing ? "Processing..." : renewed ? "Term Extended!" : "Renew Membership"}
            </button>
          </div>
        </div>

        {/* Benefits Included List */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-gray-900">Your Active Tier Benefits</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              "100% Free Entry to Flagship Tech Summits",
              "20% Discount across Campus Merch Catalog",
              "Digital QR Gate Access Pass",
              "Annual General Body Briefing Voting Rights",
              "Priority Registration for Workshops & Hackathons",
              "Direct Participation in Volunteer Task Boards",
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-100 text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-[#017E84] shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
