import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ShieldCheck, CheckCircle2, XCircle, Clock, 
  RefreshCw, User, Sparkles, Building, Calendar, ArrowRight
} from "lucide-react";
import { API_BASE } from "@/lib/api";

interface VerificationResult {
  valid: boolean;
  memberCode?: string;
  displayName?: string;
  membershipStatus?: string;
  validUntil?: string;
  positions?: string[];
  message?: string;
}

export default function MemberVerifyPage() {
  const { token } = useParams<{ token: string }>();
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchVerification = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/members/verify/${encodeURIComponent(token)}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({
        valid: false,
        message: "Failed to connect to verification server. Please check your network.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerification();
  }, [token]);

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[#017E84] text-white flex items-center justify-center mx-auto shadow-md">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Club_Hub Member Verification
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Official real-time membership credential verification ledger.
        </p>
      </div>

      {/* Main Verification Result Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl space-y-6">
        {loading ? (
          <div className="text-center py-10 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-[#017E84] mx-auto" />
            <p className="text-xs font-bold text-gray-600">Verifying member credential token...</p>
          </div>
        ) : result?.valid ? (
          /* ACTIVE VALID MEMBER */
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm border border-emerald-200">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-300">
                Official Verified Member
              </span>
              <h2 className="text-2xl font-black text-gray-900 pt-2">{result.displayName}</h2>
              <div className="font-mono text-sm font-bold text-[#4A1942]">{result.memberCode}</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F9] border border-gray-100 text-left space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-gray-200/60 pb-2">
                <span className="text-gray-500 font-bold">Membership Status:</span>
                <span className="font-black text-emerald-700 uppercase bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                  {result.membershipStatus || "ACTIVE"}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200/60 pb-2">
                <span className="text-gray-500 font-bold">Validity:</span>
                <span className="font-mono font-bold text-gray-800">{result.validUntil || "Full Term"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-bold">Organization:</span>
                <span className="font-bold text-gray-900">Club_Hub Student Association</span>
              </div>
            </div>

            <p className="text-[11px] text-gray-400">
              Verified by Club_Hub Cryptographic Ledger · Authenticity Guaranteed
            </p>
          </div>
        ) : (
          /* INVALID OR EXPIRED MEMBER */
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-sm border border-red-200">
              <XCircle className="w-9 h-9" />
            </div>

            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-50 text-red-700 border border-red-300">
                Invalid / Expired Pass
              </span>
              <h2 className="text-xl font-black text-gray-900 pt-2">Verification Failed</h2>
            </div>

            <div className="p-4 rounded-2xl bg-red-50/60 border border-red-100 text-xs text-red-800 text-left leading-relaxed">
              {result?.message || "The scanned QR verification token is not recognized or the membership has expired."}
            </div>

            <div className="pt-2">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 transition-colors"
              >
                <span>Return to Club_Hub Home</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
