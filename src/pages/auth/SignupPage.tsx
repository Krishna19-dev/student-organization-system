import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Sparkles, ShieldCheck, CheckCircle2, ArrowRight, 
  Lock, Mail, User, Compass, HelpCircle 
} from "lucide-react";
import { setDemoUser } from "@/lib/auth-demo";

export default function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tier, setTier] = useState<"BASIC" | "PREMIUM">("PREMIUM");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Save temporary registration in localStorage
    const pendingRegistration = {
      name,
      email,
      tier,
      duesAmount: tier === "PREMIUM" ? 599 : 299,
      tierName: tier === "PREMIUM" ? "Premium Executive" : "Standard Basic",
    };
    localStorage.setItem("pending_membership", JSON.stringify(pendingRegistration));

    // Fast transition to payment
    setTimeout(() => {
      navigate(`/join/pay?tier=${tier.toLowerCase()}`);
    }, 600);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 sm:py-16 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[#4A1942] text-white flex items-center justify-center mx-auto shadow-md">
          <Compass className="w-6 h-6 text-[#017E84]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Join Skyline Student Association
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Unlock discounted events, voting rights, digital ID pass, and campus shop discounts.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Full Student Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aanya Sharma"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#4A1942]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Campus Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. aanya@skyline.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#4A1942]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Create Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#4A1942]"
              />
            </div>
          </div>

          {/* Tier Picker */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Select Membership Tier</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Basic Tier */}
              <button
                type="button"
                onClick={() => setTier("BASIC")}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  tier === "BASIC"
                    ? "border-[#017E84] bg-teal-50/50 shadow-xs ring-2 ring-[#017E84]/30"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-gray-900">Basic Tier</span>
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">ANNUAL</span>
                  </div>
                  <div className="text-xl font-black font-mono text-gray-900 mt-1">₹299</div>
                  <ul className="text-[11px] text-gray-500 mt-2 space-y-1">
                    <li>• Digital Student Pass</li>
                    <li>• 10% Merch Discount</li>
                    <li>• Standard Event Access</li>
                  </ul>
                </div>
              </button>

              {/* Premium Tier */}
              <button
                type="button"
                onClick={() => setTier("PREMIUM")}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between relative ${
                  tier === "PREMIUM"
                    ? "border-[#4A1942] bg-purple-50/50 shadow-xs ring-2 ring-[#4A1942]/30"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-[#4A1942] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#E4A900]" />
                      Premium Tier
                    </span>
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">POPULAR</span>
                  </div>
                  <div className="text-xl font-black font-mono text-gray-900 mt-1">₹599</div>
                  <ul className="text-[11px] text-gray-600 mt-2 space-y-1">
                    <li>• Free Summit Entry</li>
                    <li>• 20% Merch Discount</li>
                    <li>• Fast-Track QR Priority</li>
                    <li>• Council Voting Rights</li>
                  </ul>
                </div>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-[#4A1942] hover:bg-[#3a1232] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Preparing Registration...</span>
            ) : (
              <>
                <span>Continue to Dues Payment (₹{tier === "PREMIUM" ? 599 : 299})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-gray-400 pt-2 border-t border-gray-100">
          Already registered?{" "}
          <Link to="/login" className="text-[#017E84] font-bold hover:underline">
            Sign In to Skyline Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
