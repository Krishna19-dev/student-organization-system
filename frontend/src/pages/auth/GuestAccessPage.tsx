import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Globe, 
  Sparkles, 
  ShoppingBag, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Lock, 
  Mail, 
  User, 
  Ticket,
  ShieldCheck,
  Compass
} from "lucide-react";
import { setDemoUser } from "@/lib/auth-demo";
import { loginWithGuestDemo } from "@/app/login/actions";

const API_BASE = "http://localhost:4000";

export default function GuestAccessPage() {
  const navigate = useNavigate();

  // Custom Guest Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQuickLoggingIn, setIsQuickLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  // 1-Click Instant Guest Visitor Access
  const handleInstantGuest = async () => {
    setIsQuickLoggingIn(true);
    setError(null);
    try {
      await loginWithGuestDemo();
    } catch (err: any) {
      console.warn("Instant guest login error:", err);
      // Fallback direct guest session
      await setDemoUser({
        name: "Visitor Guest",
        email: "guest@skyline.test",
        role: "GUEST",
        status: "NONE",
        positionTitle: null,
        dashboard: "/me",
      });
      window.location.href = "/me";
    } finally {
      setIsQuickLoggingIn(false);
    }
  };

  // Custom Guest Visitor Registration
  const handleRegisterGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          intent: "GUEST",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || data.message || "Guest registration failed.");
      }

      await setDemoUser(
        {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: "GUEST",
          status: "NONE",
          positionTitle: null,
          dashboard: "/me",
          token: data.token,
        },
        data.token
      );

      navigate("/me");
    } catch (err: any) {
      setError(err.message || "Could not register guest account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 sm:py-14 space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
          <Globe className="w-3.5 h-3.5 text-slate-600" />
          <span>Plan A · Public Visitor Access</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Continue as Guest
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto">
          Explore club initiatives, browse bulletins, and purchase event passes freely. 
          Guest access requires <span className="font-bold text-gray-900">₹0 joining fee</span> and no ongoing commitments.
        </p>
      </div>

      {/* Plan Features Card */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3 text-xs">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
            Guest Privileges Summary
          </span>
          <span className="font-mono font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full text-[10px]">
            ₹0 / Free Forever
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>Browse public club calendar &amp; events</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>Access official bulletins &amp; announcements</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>Purchase open tickets &amp; merchandise</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>No administrative dues or annual fees</span>
          </div>
        </div>
      </div>

      {/* 1-Click Instant Guest Access */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#017E84]" />
            <span>Option 1: Quick 1-Click Guest Access</span>
          </h2>
          <p className="text-xs text-gray-500">
            Start browsing instantly without creating a password or filling out a form.
          </p>
        </div>

        <button
          type="button"
          disabled={isQuickLoggingIn}
          onClick={handleInstantGuest}
          className="w-full py-3.5 px-4 rounded-xl bg-[#017E84] hover:bg-[#016368] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
        >
          {isQuickLoggingIn ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Launching Guest Session...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Instant Guest Login (₹0) &rarr;</span>
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4 text-xs text-gray-400 uppercase font-medium">
            Or Register a Free Account
          </span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Option 2: Register with Custom Email/Password */}
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-gray-800">
              Option 2: Register with Your Email
            </h3>
            <p className="text-xs text-gray-500">
              Create a personalized guest account to keep track of your ticket orders.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegisterGuest} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#017E84] focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="rahul@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#017E84] focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Password (min 8 chars)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#017E84] focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <Ticket className="w-4 h-4" />
                  <span>Register Free Guest Account</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Switch to Official ₹300 Membership */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-teal-50 to-emerald-50 border border-purple-200/70 text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4A1942]">
          <ShieldCheck className="w-4 h-4 text-[#4A1942]" />
          <span>Looking for full voting rights, goodies &amp; positions?</span>
        </div>
        <p className="text-xs text-gray-600 max-w-md mx-auto">
          Official Club_Hub Membership includes a digital ID card, goodies pack, and leadership position eligibility for a one-time ₹300 joining fee.
        </p>
        <div className="pt-1">
          <Link
            to="/signup"
            className="inline-flex items-center gap-1.5 font-bold text-xs text-[#017E84] hover:text-[#016368] hover:underline"
          >
            <span>Apply for Official Membership (₹300)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
