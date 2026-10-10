"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass, User, Mail, Lock, Shield, Sparkles, CheckCircle, ArrowRight, AlertCircle } from "lucide-react";
import { API_BASE } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [intent, setIntent] = useState<"GUEST" | "MEMBER" | "LEAD">("MEMBER");
  const [tier, setTier] = useState<"BASIC" | "PREMIUM">("BASIC");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [skills, setSkills] = useState("");
  const [desiredPosition, setDesiredPosition] = useState("COORDINATOR");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload: Record<string, unknown> = {
        name,
        email,
        password,
        intent,
      };

      if (intent !== "GUEST") {
        payload.tier = tier;
        payload.skills = skills;
        payload.notes = notes;
        if (intent === "LEAD") {
          payload.desiredPosition = desiredPosition;
        }
      }

      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Registration failed");
      }

      // Store cookie client-side
      document.cookie = `token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `skyline_demo_user=${encodeURIComponent(
        JSON.stringify({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.effective.role,
          status: data.effective.status,
          dashboard: data.dashboard,
          token: data.token,
        })
      )}; path=/; max-age=604800; SameSite=Lax`;

      if (data.dashboard) {
        router.push(data.dashboard);
      } else if (intent === "GUEST") {
        router.push("/guest");
      } else {
        router.push("/pay");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 sm:py-14 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto shadow-md">
          <Compass className="w-6 h-6 text-secondary-light" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-body tracking-tight">
          Join Skyline Association
        </h1>
        <p className="text-xs sm:text-sm text-muted">
          Create an account as a Campus Guest, Active Member, or Leadership Volunteer.
        </p>
      </div>

      {/* Main Registration Card */}
      <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-gray-subtle shadow-md space-y-6">
        {/* Intent Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            Choose Your Intent
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "GUEST", title: "Guest", desc: "Tickets & Merch" },
              { id: "MEMBER", title: "General Member", desc: "Discounts & Voting" },
              { id: "LEAD", title: "Student Lead", desc: "Executive Team" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setIntent(item.id as typeof intent)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  intent === item.id
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-bold text-sm text-gray-900">{item.title}</div>
                <div className="text-[11px] text-gray-500">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahul@skyline.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password (min 8 chars)</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Membership Tier Options (if not GUEST) */}
          {intent !== "GUEST" && (
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wide block">
                Select Membership Tier
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => setTier("BASIC")}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    tier === "BASIC"
                      ? "border-primary bg-white ring-2 ring-primary/20 shadow-sm"
                      : "border-gray-200 bg-white/60"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm">BASIC TIER</span>
                    <span className="text-xs font-bold text-primary">₹500 / yr</span>
                  </div>
                  <span className="text-[11px] text-gray-500 block mt-1">10% Merch discount & member badge</span>
                </div>

                <div
                  onClick={() => setTier("PREMIUM")}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    tier === "PREMIUM"
                      ? "border-primary bg-white ring-2 ring-primary/20 shadow-sm"
                      : "border-gray-200 bg-white/60"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm">PREMIUM TIER</span>
                    <span className="text-xs font-bold text-purple-600">₹1,000 / yr</span>
                  </div>
                  <span className="text-[11px] text-gray-500 block mt-1">20% Merch discount & priority access</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Skills & Background (min 5 chars)
                </label>
                <input
                  type="text"
                  required
                  minLength={5}
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. React, Event Management, Public Speaking, Photography"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              {intent === "LEAD" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Desired Leadership Position
                  </label>
                  <select
                    value={desiredPosition}
                    onChange={(e) => setDesiredPosition(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    <option value="TECHNICAL_LEAD">Technical Lead</option>
                    <option value="OPERATIONS_LEAD">Operations Lead</option>
                    <option value="EVENT_LEAD">Event Lead</option>
                    <option value="COORDINATOR">General Coordinator</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Notes / Why Join? (Optional)</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tell us what you'd like to achieve at Skyline..."
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-hover shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Creating Account...
              </span>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="text-center text-xs text-muted space-y-2">
        <p>
          Already registered?{" "}
          <Link href="/login" className="font-semibold text-secondary hover:underline">
            Sign In to your portal &rarr;
          </Link>
        </p>
      </div>
    </div>
  );
}
