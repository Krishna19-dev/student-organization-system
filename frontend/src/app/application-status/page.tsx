import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { 
  Clock, CheckCircle, XCircle, CreditCard, ShieldCheck, 
  ArrowRight, RefreshCw, Search, Sparkles, Building, User, Mail 
} from "lucide-react";
import { API_BASE } from "@/lib/api";

export default function ApplicationStatusPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlId = searchParams.get("id") || "";

  const [searchId, setSearchId] = useState(urlId);
  const [token, setToken] = useState<string | null>(null);
  const [application, setApplication] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const foundToken = cookies.find((c) => c.startsWith("token="));
    if (foundToken) {
      setToken(foundToken.split("=")[1]);
    }
  }, []);

  const loadStatus = async (idToQuery?: string) => {
    const targetId = idToQuery || searchId.trim();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (targetId) {
        // Direct query by Application ID
        const res = await fetch(`${API_BASE}/api/applications/status/${encodeURIComponent(targetId)}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Application not found with that reference ID.");
        }
        setApplication(data.application);
      } else if (token) {
        // Authenticated user's application
        const res = await fetch(`${API_BASE}/api/applications/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "No application found for your account.");
        }
        setApplication(data);
      } else {
        setErrorMsg("Please enter your Application Reference ID to check status.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to load application status.");
      setApplication(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (urlId) {
      setSearchId(urlId);
      loadStatus(urlId);
    } else if (token) {
      loadStatus();
    }
  }, [urlId, token]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      setSearchParams({ id: searchId.trim() });
      loadStatus(searchId.trim());
    }
  };

  const status = application?.status || "NONE";

  return (
    <div className="max-w-xl mx-auto px-4 py-12 sm:py-16 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[#017E84] text-white flex items-center justify-center mx-auto shadow-md">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Application Tracking Portal
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Check the real-time status of your Club_Hub membership application and joining fee.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter Application Reference ID..."
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#017E84] focus:outline-none bg-white font-mono"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !searchId.trim()}
          className="px-5 py-2.5 rounded-xl bg-[#017E84] hover:bg-[#016368] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0"
        >
          {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <span>Search</span>}
        </button>
      </form>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
          {errorMsg}
        </div>
      )}

      {/* Main Status Card */}
      {application && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Application ID</span>
              <span className="text-xs font-mono font-bold text-gray-900">{application.id}</span>
            </div>
            <button
              onClick={() => loadStatus()}
              disabled={loading}
              className="flex items-center gap-1 text-xs text-[#017E84] font-bold hover:underline"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Status Display */}
          {(status === "UNDER_REVIEW" || status === "SUBMITTED" || status === "PAYMENT_VERIFIED") && (
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-3 text-center">
              <Clock className="w-10 h-10 text-amber-600 mx-auto animate-pulse" />
              <h3 className="font-bold text-base text-amber-950">Application Under Administrative Review</h3>
              <p className="text-xs text-amber-800 leading-relaxed max-w-md mx-auto">
                “Your Club_Hub membership application and payment have been received successfully. Your application is now awaiting administrative review. Our club administration aims to review your information within one working day. Once approved, you will receive instructions to activate your member account and access your official membership ID.”
              </p>
              <div className="pt-2 text-[11px] text-amber-700 font-medium">
                Submitted: {application.submittedAt ? new Date(application.submittedAt).toLocaleDateString() : "Recently"}
              </div>
            </div>
          )}

          {status === "APPROVED" && (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3 text-center">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-base text-emerald-950">Application Approved!</h3>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Welcome to Club_Hub! Your membership has been officially approved. You can now access your member dashboard and digital membership card.
              </p>
              <Link
                to="/me"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-emerald-700 transition-all mt-2"
              >
                <span>Open Member Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {status === "REJECTED" && (
            <div className="p-5 rounded-2xl bg-red-50 border border-red-200 space-y-3 text-center">
              <XCircle className="w-10 h-10 text-red-600 mx-auto" />
              <h3 className="font-bold text-base text-red-950">Application Not Approved</h3>
              {application.reviewNote && (
                <div className="p-3 bg-white rounded-xl border border-red-200 text-xs text-red-800 font-medium">
                  Reviewer note: &quot;{application.reviewNote}&quot;
                </div>
              )}
              <p className="text-xs text-red-700 leading-relaxed">
                Your ₹300 joining fee has been scheduled for refund in accordance with Club_Hub&apos;s refund policy.
              </p>
            </div>
          )}

          {status === "PAYMENT_PENDING" && (
            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 space-y-3 text-center">
              <CreditCard className="w-10 h-10 text-blue-600 mx-auto" />
              <h3 className="font-bold text-base text-blue-950">Joining Fee Pending</h3>
              <p className="text-xs text-blue-800 leading-relaxed">
                Complete the ₹300 joining fee to submit your application for administrative review.
              </p>
              <Link
                to={`/signup?step=3`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-blue-700 transition-all mt-2"
              >
                <span>Proceed to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Details breakdown */}
          {application.user && (
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2 text-xs">
              <div className="font-bold text-gray-900">Applicant Information</div>
              <div className="grid grid-cols-2 gap-2 text-gray-600">
                <div>Name: <span className="font-medium text-gray-800">{application.user.name}</span></div>
                <div>Email: <span className="font-medium text-gray-800">{application.user.email}</span></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty default prompt */}
      {!application && !loading && (
        <div className="bg-white rounded-3xl p-8 border border-gray-200 text-center space-y-3 text-gray-500 text-xs shadow-2xs">
          <p>Don't have an application yet? Apply to join Club_Hub today!</p>
          <Link
            to="/signup"
            className="inline-block px-5 py-2.5 bg-[#017E84] text-white rounded-xl font-bold shadow-sm hover:bg-[#016368] transition-colors"
          >
            Apply for Membership (₹300) &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}
