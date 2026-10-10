import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { 
  CreditCard, ShieldCheck, CheckCircle2, ArrowRight, 
  Sparkles, AlertCircle, Compass 
} from "lucide-react";
import { setDemoUser } from "@/lib/auth-demo";

export default function JoinPayPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tierParam = searchParams.get("tier");

  const [regData, setRegData] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("pending_membership");
    if (stored) {
      try {
        setRegData(JSON.parse(stored));
      } catch {}
    } else {
      setRegData({
        name: "Student Applicant",
        email: "member@skyline.edu",
        tier: tierParam === "basic" ? "BASIC" : "PREMIUM",
        duesAmount: tierParam === "basic" ? 299 : 599,
        tierName: tierParam === "basic" ? "Standard Basic" : "Premium Executive",
      });
    }
  }, [tierParam]);

  const handleRazorpayPay = () => {
    setIsProcessing(true);

    setTimeout(() => {
      // Create user session in demo auth
      const newUser = {
        name: regData?.name || "New Skyline Member",
        email: regData?.email || "member@skyline.edu",
        role: "MEMBER" as const,
        dashboard: "/me",
        status: "ACTIVE",
        tier: regData?.tier || "PREMIUM",
      };
      setDemoUser(newUser);

      setIsProcessing(false);
      setIsPaid(true);

      // Redirect to digital card in 1.2s
      setTimeout(() => {
        navigate("/me/card");
      }, 1200);
    }, 1500);
  };

  if (!regData) return null;

  return (
    <div className="max-w-lg mx-auto px-4 py-12 sm:py-16 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[#017E84] text-white flex items-center justify-center mx-auto shadow-md">
          <CreditCard className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Annual Dues Checkout
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Single-entry auditable ledger settlement via Razorpay Gateway.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
        {/* Order Summary */}
        <div className="p-4 rounded-2xl bg-[#FAF7F9] border border-gray-100 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">Applicant:</span>
            <span className="font-bold text-gray-900">{regData.name} ({regData.email})</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">Plan Tier:</span>
            <span className="font-bold text-[#4A1942] uppercase">{regData.tierName}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">Validity:</span>
            <span className="font-medium text-gray-700">365 Days (Full Academic Term)</span>
          </div>

          <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline">
            <span className="text-xs font-bold text-gray-900">Total Dues Payable:</span>
            <span className="text-2xl font-black font-mono text-[#017E84]">
              ₹{regData.duesAmount}
            </span>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>PostgreSQL Zero-Float Accounting: Instant Ledger Credit Generation.</span>
        </div>

        {/* Pay Button */}
        <div>
          {isPaid ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
              <div className="text-xs font-bold text-emerald-900">
                Payment Success! Activating Digital Member Card...
              </div>
            </div>
          ) : (
            <button
              onClick={handleRazorpayPay}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-xl bg-[#017E84] hover:bg-[#016368] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Settling via Razorpay Gateway...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Pay ₹{regData.duesAmount} & Activate Card</span>
                </>
              )}
            </button>
          )}
        </div>

        <div className="text-center text-xs text-gray-400">
          <Link to="/signup" className="hover:underline">
            &larr; Change membership tier
          </Link>
        </div>
      </div>
    </div>
  );
}
