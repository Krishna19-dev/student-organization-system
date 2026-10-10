import React from "react";
import Link from "next/link";
import { Compass, CheckCircle2 } from "lucide-react";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Portal Sign In | Skyline Student Association",
  description: "Sign into the Skyline Student Association member & officer operations portal with Guest demo account.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ loggedOut?: string }>;
}) {
  const resolvedParams = searchParams ? await searchParams : {};
  const isLoggedOut = resolvedParams.loggedOut === "true";

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

      {/* Bottom Switcher */}
      <div className="text-center text-xs text-muted space-y-2">
        <p>
          Don&apos;t have an account yet?{" "}
          <Link href="/signup" className="font-semibold text-secondary hover:underline">
            Register as a Member &rarr;
          </Link>
        </p>
        <p>
          Want member discounts and voting rights?{" "}
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
