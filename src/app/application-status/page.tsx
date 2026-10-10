"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, CheckCircle, XCircle, CreditCard, ShieldCheck, ArrowRight, RefreshCw } from "lucide-react";
import { API_BASE } from "@/lib/api";

export default function ApplicationStatusPage() {
  const [token, setToken] = useState<string | null>(null);
  const [application, setApplication] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const foundToken = cookies.find((c) => c.startsWith("token="));
    if (foundToken) {
      setToken(foundToken.split("=")[1]);
    }
  }, []);

  const loadStatus = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/applications/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setApplication(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadStatus();
  }, [token]);

  const status = application?.status || "NONE";

  return (
    <div className="max-w-xl mx-auto px-4 py-12 sm:py-16 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto shadow-md">
          <ShieldCheck className="w-6 h-6 text-secondary-light" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Application Tracking Portal
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Real-time status of your Skyline Student Association membership application.
        </p>
      </div>

      {/* Main Status Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-md space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <span className="text-xs font-bold text-gray-500 uppercase">Application State</span>
          <button
            onClick={loadStatus}
            disabled={loading}
            className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Check Updates</span>
          </button>
        </div>

        {/* State Banners */}
        {status === "UNDER_REVIEW" && (
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-3 text-center">
            <Clock className="w-10 h-10 text-amber-600 mx-auto animate-pulse" />
            <h3 className="font-bold text-base text-amber-900">Application Under Review</h3>
            <p className="text-xs text-amber-800 leading-relaxed max-w-md mx-auto">
              Your membership dues have been received and verified. The President is currently reviewing applications in the executive queue.
            </p>
            <div className="pt-2 text-[11px] text-amber-600">
              Submitted: {application.submittedAt ? new Date(application.submittedAt).toLocaleString() : "Recently"}
            </div>
          </div>
        )}

        {status === "APPROVED" && (
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3 text-center">
            <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-base text-emerald-900">Application Approved!</h3>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Congratulations! Your membership is active. You can now access your digital member card and discounted merchandise.
            </p>
            <Link
              href="/member"
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
            <h3 className="font-bold text-base text-red-900">Application Not Approved</h3>
            {application.reviewNote && (
              <div className="p-3 bg-white rounded-xl border border-red-200 text-xs text-red-800 font-medium">
                Reason from Reviewer: &quot;{application.reviewNote}&quot;
              </div>
            )}
            <p className="text-xs text-red-700 leading-relaxed">
              Your dues payment has been refunded to your original payment method. You may re-apply for future semesters.
            </p>
          </div>
        )}

        {status === "PAYMENT_PENDING" && (
          <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 space-y-3 text-center">
            <CreditCard className="w-10 h-10 text-blue-600 mx-auto" />
            <h3 className="font-bold text-base text-blue-900">Dues Payment Pending</h3>
            <p className="text-xs text-blue-800 leading-relaxed">
              Complete your annual membership dues to submit your application for review.
            </p>
            <Link
              href="/pay"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-blue-700 transition-all mt-2"
            >
              <span>Proceed to Dues Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {status === "NONE" && (
          <div className="text-center py-8 space-y-3 text-gray-500 text-xs">
            <p>You have not submitted an application yet.</p>
            <Link
              href="/register"
              className="inline-block px-4 py-2 bg-primary text-white rounded-xl font-bold"
            >
              Submit Membership Application &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
