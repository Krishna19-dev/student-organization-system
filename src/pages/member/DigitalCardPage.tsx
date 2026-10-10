import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  CreditCard, QrCode, ShieldCheck, Download, 
  Sparkles, CheckCircle2, RefreshCw, ArrowLeft 
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { getDemoUser } from "@/lib/auth-demo";

export default function DigitalCardPage() {
  const [user, setUser] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getDemoUser().then(setUser);
  }, []);

  const memberCode = "SKY-2026-9041";
  const name = user?.name || "Student Member";
  const email = user?.email || "member@skyline.edu";
  const tier = user?.tier || "PREMIUM";
  const expiryDate = "Oct 31, 2027";

  return (
    <DashboardLayout
      role="MEMBER"
      breadcrumb={[{ label: "Member Hub", href: "/me" }, { label: "Digital Card" }]}
      title="Digital Membership Card"
      subtitle="Mobile-first verified identity badge for gate entry, voting, and merchandise discounts."
    >
      <div className="max-w-md mx-auto space-y-6">
        {/* Mobile-first Physical Card Emulation */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#4A1942] via-[#361130] to-[#017E84] text-white p-6 sm:p-7 shadow-xl overflow-hidden border border-white/20">
          {/* Background Decorative Rings */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -left-10 -top-10 w-36 h-36 rounded-full bg-teal-400/10 pointer-events-none" />

          {/* Card Top Brand */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white text-[#4A1942] font-black text-xs flex items-center justify-center">
                  S
                </div>
                <span className="font-bold text-sm tracking-tight">Skyline SSA</span>
              </div>
              <span className="text-[10px] text-teal-200 uppercase tracking-widest block mt-0.5">
                Official Student Identity Pass
              </span>
            </div>

            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white border border-white/30 backdrop-blur-xs">
              {tier} TIER
            </span>
          </div>

          {/* QR Code Container */}
          <div className="bg-white rounded-2xl p-4 my-4 flex flex-col items-center justify-center shadow-inner">
            <QrCode className="w-36 h-36 text-[#4A1942]" />
            <span className="text-[10px] font-mono font-bold text-gray-500 mt-1">
              SCAN AT GATES & BOOTHS
            </span>
          </div>

          {/* Card Member Meta */}
          <div className="space-y-3 pt-2">
            <div>
              <span className="text-[10px] text-purple-200 uppercase tracking-wider block">Member Full Name</span>
              <h3 className="text-lg font-black tracking-tight">{name}</h3>
              <span className="text-xs text-purple-200 block truncate">{email}</span>
            </div>

            <div className="flex justify-between items-end pt-3 border-t border-white/20 text-xs">
              <div>
                <span className="text-[9px] text-purple-200 uppercase tracking-wider block">Member Token</span>
                <span className="font-mono font-bold text-teal-200">{memberCode}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-purple-200 uppercase tracking-wider block">Valid Thru</span>
                <span className="font-mono font-bold text-emerald-300">{expiryDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              navigator.clipboard.writeText(memberCode);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex-1 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <span>{copied ? "Copied Member Code!" : "Copy Member Code"}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 py-3 rounded-xl bg-[#017E84] hover:bg-[#016368] text-white font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Pass</span>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
