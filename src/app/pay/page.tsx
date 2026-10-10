"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, Sparkles } from "lucide-react";
import { API_BASE } from "@/lib/api";

export default function PayDuesPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [application, setApplication] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"ready" | "processing" | "success">("ready");

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const foundToken = cookies.find((c) => c.startsWith("token="));
    if (foundToken) {
      setToken(foundToken.split("=")[1]);
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/api/applications/mine`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.status === "UNDER_REVIEW") {
          router.push("/application-status");
        } else {
          setApplication(data);
        }
      })
      .catch((err) => setError(err.message));
  }, [token, router]);

  const handlePay = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    setStep("processing");

    try {
      // 1. Create Dues Order
      const orderRes = await fetch(`${API_BASE}/api/applications/pay`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error?.message || "Order creation failed");

      // 2. Verify payment (Razorpay mock verification)
      const verifyRes = await fetch(`${API_BASE}/api/applications/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          gatewayOrderId: orderData.gatewayOrderId,
          gatewayPaymentId: `pay_mock_${Date.now()}`,
          signature: "mock_signature",
        }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error?.message || "Payment verification failed");

      setStep("success");
      setTimeout(() => {
        router.push("/application-status");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
      setStep("ready");
    } finally {
      setLoading(false);
    }
  };

  const amountRupees = application?.tier === "PREMIUM" ? 1000 : 500;

  return (
    <div className="max-w-lg mx-auto px-4 py-12 sm:py-16 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto shadow-sm">
          <CreditCard className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Complete Membership Dues
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Pay your annual association dues to submit your application for Executive Board review.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Payment Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-md space-y-6">
        <div className="p-4 bg-gray-50 rounded-2xl border space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">Membership Tier:</span>
            <span className="font-bold text-gray-900">{application?.tier || "BASIC"}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">Application Type:</span>
            <span className="font-bold text-gray-900">{application?.type || "MEMBER"}</span>
          </div>
          <div className="flex justify-between items-center text-xs border-t pt-2">
            <span className="font-bold text-gray-800">Total Dues (1 Year):</span>
            <span className="text-lg font-black text-teal-700">₹{amountRupees}.00</span>
          </div>
        </div>

        {step === "success" ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-sm text-emerald-900">Dues Paid Successfully!</h3>
            <p className="text-xs text-emerald-700">
              Your application is now under Executive Review. Redirecting...
            </p>
          </div>
        ) : (
          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-teal-700 text-white font-bold text-sm hover:bg-teal-800 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Processing Payment...
              </span>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>Pay ₹{amountRupees}.00 via Razorpay</span>
              </>
            )}
          </button>
        )}

        <div className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>If rejected by the President, your dues are 100% refunded automatically.</span>
        </div>
      </div>
    </div>
  );
}
