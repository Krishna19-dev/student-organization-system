import React from "react";
import Link from "next/link";
import { Compass, CheckCircle2, ShoppingBag, Ticket } from "lucide-react";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Portal Sign In | Skyline Student Association",
  description: "Sign into the Skyline Student Association member & officer operations portal with Guest demo account.",
};

export default function LoginPage() {
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const isLoggedOut = searchParams?.get("loggedOut") === "true";

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto shadow-md">
          <Compass className="w-6 h-6 text-secondary-light" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-body tracking-tight">
          Skyline Portal Sign In
        </h1>
        <p className="text-xs sm:text-sm text-muted">
          Access your member pass, event tickets, or officer desk.
        </p>
      </div>

      {/* Logged Out Notice */}
      {isLoggedOut && (
        <div className="p-3 rounded-xl bg-status-success-light border border-status-success/30 text-xs text-status-success-dark flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
          <span>You have successfully signed out of the demo session.</span>
        </div>
      )}

      {/* Login Card */}
      <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-gray-subtle shadow-md space-y-6">
        <LoginForm />
      </div>

      {/* Guest Visitor Option Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-teal-50/40 border border-slate-200/90 text-left space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#017E84]/10 text-[#017E84] flex items-center justify-center shrink-0 mt-0.5">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                Visitor Access
              </span>
              <span className="text-xs font-bold text-gray-900">No Annual Dues Required</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Only here to buy merchandise or event tickets? Register as a Guest to order gear and passes without paying membership dues.
            </p>
          </div>
        </div>

        <Link
          href="/signup?intent=guest"
          className="w-full py-2.5 px-4 rounded-xl bg-[#017E84] hover:bg-[#016368] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>Register as Guest &rarr;</span>
        </Link>
      </div>

      {/* Bottom Switcher */}
      <div className="text-center text-xs text-muted space-y-2">
        <p>
          Looking for full voting rights & member perks?{" "}
          <Link href="/signup" className="font-semibold text-secondary hover:underline">
            Register as a Member &rarr;
          </Link>
        </p>
        <p>
          Want to explore membership plans first?{" "}
          <Link href="/membership" className="font-semibold text-secondary hover:underline">
            View Membership Tiers &rarr;
          </Link>
        </p>
        <p>
          <Link href="/" className="text-primary hover:underline font-medium">
            &larr; Return to Skyline Home
          </Link>
        </p>
      </div>
    </div>
  );
}
