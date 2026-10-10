import React from "react";
import Link from "next/link";
import { Compass } from "lucide-react";
import SignupForm from "./SignupForm";

export const metadata = {
  title: "Create Member Account | Skyline Student Association",
  description: "Join Skyline Student Association to get member passes, merchandise discounts, and community event access.",
};

export default function SignupPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto shadow-md">
          <Compass className="w-6 h-6 text-secondary-light" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-body tracking-tight">
          Join Skyline Association
        </h1>
        <p className="text-xs sm:text-sm text-muted">
          Create your account to unlock member discounts, tickets, and portal access.
        </p>
      </div>

      {/* Signup Card */}
      <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-gray-subtle shadow-md space-y-6">
        <SignupForm />
      </div>

      {/* Bottom Switcher */}
      <div className="text-center text-xs text-muted space-y-2">
        <p>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-secondary hover:underline">
            Sign In here &rarr;
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
