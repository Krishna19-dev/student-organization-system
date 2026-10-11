import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  CreditCard, QrCode, ShieldCheck, Download, Printer,
  Sparkles, CheckCircle2, RefreshCw, ArrowLeft, Copy,
  Clock, AlertCircle, ExternalLink, Calendar, Building, User
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { API_BASE } from "@/lib/api";
import { getDemoUserSync } from "@/lib/auth-demo";

interface MemberCardData {
  hasActiveCard: boolean;
  memberCode?: string;
  displayName?: string;
  email?: string;
  college?: string;
  department?: string;
  course?: string;
  year?: string;
  positions?: string[];
  tier?: string;
  membershipStatus?: string;
  issuedAt?: string;
  expiryDate?: string;
  validUntil?: string;
  qrToken?: string;
  qrCodeDataUrl?: string;
  verificationUrl?: string;
  message?: string;
}

export default function DigitalCardPage() {
  const [cardData, setCardData] = useState<MemberCardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadCardData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const demoUser = getDemoUserSync();
      const token = demoUser?.token || localStorage.getItem("token");
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/api/members/me/id-card`, {
        headers,
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setCardData(data);
      } else {
        // Fallback for demo mode
        if (demoUser && demoUser.role !== "GUEST") {
          setCardData({
            hasActiveCard: true,
            memberCode: "MEM-2026-0001",
            displayName: demoUser.name || "Aanya Sharma",
            email: demoUser.email || "aanya@college.edu",
            college: "Bangalore Institute of Technology",
            department: "Computer Science",
            course: "B.Tech Computer Science",
            year: "2nd Year",
            positions: ["Technical Lead", "Web Development Team"],
            tier: "Official Member",
            membershipStatus: "ACTIVE",
            validUntil: "Oct 11, 2027",
            qrCodeDataUrl: "",
            verificationUrl: `${window.location.origin}/verify/demo-active-token`,
          });
        } else {
          setCardData({
            hasActiveCard: false,
            message: "You are currently browsing as Guest. Complete official membership registration and administrative approval to generate your official Member ID and QR Pass.",
          });
        }
      }
    } catch (err: any) {
      console.warn("Card load error:", err);
      setErrorMsg("Failed to load digital member card.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCardData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCode = () => {
    if (cardData?.memberCode) {
      navigator.clipboard.writeText(cardData.memberCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <DashboardLayout
      role="MEMBER"
      breadcrumb={[{ label: "Member Hub", href: "/me" }, { label: "Digital Member ID Card" }]}
      title="Digital Membership Card"
      subtitle="Official verified student identity badge for event gate fast-track, voting, and merchandise discounts."
    >
      {/* Print-specific style */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-card-area, #printable-card-area * {
            visibility: visible;
          }
          #printable-card-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="max-w-xl mx-auto space-y-6">
        {loading ? (
          <div className="bg-white rounded-3xl p-12 border border-gray-200 text-center space-y-3">
            <RefreshCw className="w-6 h-6 animate-spin text-[#017E84] mx-auto" />
            <p className="text-xs text-gray-500 font-bold">Loading official membership identity...</p>
          </div>
        ) : cardData?.hasActiveCard ? (
          <>
            {/* PRINTABLE CARD AREA */}
            <div id="printable-card-area" className="space-y-4">
              {/* Premium Member ID Card */}
              <div className="relative rounded-3xl bg-gradient-to-br from-[#4A1942] via-[#2F0F2A] to-[#017E84] text-white p-6 sm:p-8 shadow-2xl overflow-hidden border border-white/20">
                {/* Decorative Background Elements */}
                <div className="absolute -right-12 -bottom-12 w-56 h-56 rounded-full bg-white/5 pointer-events-none blur-2xl" />
                <div className="absolute -left-12 -top-12 w-48 h-48 rounded-full bg-teal-400/10 pointer-events-none blur-xl" />

                {/* Card Header: Brand & Status Badge */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-white text-[#4A1942] font-black text-sm flex items-center justify-center shadow-md">
                        C
                      </div>
                      <div>
                        <span className="font-black text-base tracking-tight block leading-tight">Club_Hub</span>
                        <span className="text-[10px] text-teal-200 uppercase tracking-widest block">
                          Student Organization Pass
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 backdrop-blur-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>ACTIVE</span>
                  </span>
                </div>

                {/* QR Code Container */}
                <div className="bg-white rounded-2xl p-4 my-5 flex flex-col items-center justify-center shadow-2xl text-center">
                  {cardData.qrCodeDataUrl ? (
                    <img
                      src={cardData.qrCodeDataUrl}
                      alt="Member Verification QR Code"
                      className="w-44 h-44 object-contain rounded-lg"
                    />
                  ) : (
                    <div className="w-44 h-44 bg-gray-50 flex items-center justify-center rounded-lg">
                      <QrCode className="w-36 h-36 text-[#4A1942]" />
                    </div>
                  )}
                  <span className="text-[10px] font-mono font-bold text-gray-500 mt-2 tracking-wider">
                    SCAN TO VERIFY OFFICIAL MEMBERSHIP
                  </span>
                </div>

                {/* Card Member Meta */}
                <div className="space-y-4 pt-2">
                  <div>
                    <span className="text-[10px] text-purple-200 uppercase tracking-wider block font-bold">
                      Official Member Name
                    </span>
                    <h3 className="text-xl font-black tracking-tight text-white">{cardData.displayName}</h3>
                    <span className="text-xs text-teal-200 block truncate">{cardData.email}</span>
                  </div>

                  {cardData.positions && cardData.positions.length > 0 && (
                    <div>
                      <span className="text-[9px] text-purple-200 uppercase tracking-wider block font-bold mb-1">
                        Assigned Club Role(s)
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {cardData.positions.map((pos, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/20 text-teal-100 border border-white/20"
                          >
                            {pos}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-end pt-3 border-t border-white/20 text-xs">
                    <div>
                      <span className="text-[9px] text-purple-200 uppercase tracking-wider block font-bold">
                        Official Member ID
                      </span>
                      <span className="font-mono font-black text-sm text-teal-200 tracking-wider">
                        {cardData.memberCode}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-purple-200 uppercase tracking-wider block font-bold">
                        Valid Thru
                      </span>
                      <span className="font-mono font-bold text-emerald-300">
                        {cardData.validUntil || "Full Term"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#017E84] shrink-0" />
                <span>
                  This digital pass is valid only while Club_Hub membership remains active. Staff can scan the QR code to verify live credentials.
                </span>
              </div>
            </div>

            {/* ACTION BUTTONS (Hidden in Print) */}
            <div className="no-print grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleCopyCode}
                className="py-3 px-4 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4 text-gray-500" />
                <span>{copied ? "Copied Member Code!" : "Copy Member Code"}</span>
              </button>

              <button
                onClick={handlePrint}
                className="py-3 px-4 rounded-xl bg-[#017E84] hover:bg-[#016368] text-white font-bold text-xs transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Card</span>
              </button>
            </div>
          </>
        ) : (
          /* UNAPPROVED / GUEST STATE */
          <div className="bg-white rounded-3xl p-8 border border-gray-200 text-center space-y-6 shadow-sm">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
              <Clock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-gray-900">Official Member Card Not Yet Active</h2>
              <p className="text-xs text-gray-600 leading-relaxed max-w-md mx-auto">
                {cardData?.message || "You need an approved official Club_Hub membership to receive a digital ID card and secure QR pass."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/application-status"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#017E84] hover:bg-[#016368] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span>Track Application Status</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/signup?plan=official"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all"
              >
                Apply for Membership (₹300)
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
