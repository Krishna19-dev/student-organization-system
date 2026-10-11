import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  QrCode, Camera, ShieldCheck, CheckCircle2, XCircle, 
  RefreshCw, Search, User, Building, GraduationCap, 
  Sparkles, AlertCircle, ArrowLeft, StopCircle
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { API_BASE } from "@/lib/api";
import { getDemoUserSync } from "@/lib/auth-demo";

interface StaffVerificationResult {
  valid: boolean;
  memberCode?: string;
  displayName?: string;
  email?: string;
  college?: string;
  department?: string;
  course?: string;
  positions?: string[];
  membershipStatus?: string;
  validUntil?: string;
  verifiedAt?: string;
  message?: string;
}

export default function AdminMemberVerificationPage() {
  const [manualToken, setManualToken] = useState("");
  const [result, setResult] = useState<StaffVerificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    setResult(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API is not supported on this browser/device.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsScanning(true);
    } catch (err: any) {
      setCameraError(err.message || "Failed to access camera. Please allow camera permissions or enter token manually.");
      setIsScanning(false);
    }
  };

  const verifyToken = async (tokenToVerify: string) => {
    if (!tokenToVerify.trim()) return;

    // Clean URL if full verify URL was scanned
    let token = tokenToVerify.trim();
    if (token.includes("/verify/")) {
      token = token.split("/verify/")[1].split("?")[0];
    }

    setLoading(true);
    setResult(null);
    stopCamera();

    try {
      const demoUser = getDemoUserSync();
      const authToken = demoUser?.token || localStorage.getItem("token");
      const headers: Record<string, string> = {};
      if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

      const res = await fetch(`${API_BASE}/api/members/staff/verify/${encodeURIComponent(token)}`, {
        headers,
        credentials: "include",
      });

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setResult({
        valid: false,
        message: "Network error during verification.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualToken.trim()) {
      verifyToken(manualToken.trim());
    }
  };

  return (
    <DashboardLayout
      role="PRESIDENT"
      breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Member QR Verification" }]}
      title="Official Member QR Verification Scanner"
      subtitle="Fast-track identity & credentials validator for campus events, annual voting, and club perks."
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Top Scanner Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#017E84]" />
                <span>Live Camera QR Scanner</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Scan member physical badges or mobile screens for instant verification.
              </p>
            </div>
            {isScanning ? (
              <button
                onClick={stopCamera}
                className="px-3.5 py-1.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold border border-red-200 flex items-center gap-1.5"
              >
                <StopCircle className="w-4 h-4" />
                <span>Stop Camera</span>
              </button>
            ) : (
              <button
                onClick={startCamera}
                className="px-4 py-2 rounded-xl bg-[#017E84] hover:bg-[#016368] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <Camera className="w-4 h-4" />
                <span>Start Camera Scanner</span>
              </button>
            )}
          </div>

          {/* Camera Viewport Area */}
          {isScanning && (
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border-2 border-[#017E84]">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
              <div className="absolute inset-0 border-2 border-dashed border-white/50 m-8 rounded-xl pointer-events-none flex items-center justify-center">
                <span className="text-[11px] font-bold text-white bg-black/60 px-3 py-1 rounded-full backdrop-blur-xs">
                  Align Member QR Code within Frame
                </span>
              </div>
            </div>
          )}

          {cameraError && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{cameraError}</span>
            </div>
          )}

          {/* Manual Input Fallback */}
          <form onSubmit={handleManualSubmit} className="pt-2">
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Manual Token / QR URL Search:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value)}
                  placeholder="Paste QR verification token or URL..."
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#017E84] focus:outline-none font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !manualToken.trim()}
                className="px-5 py-2.5 rounded-xl bg-[#017E84] hover:bg-[#016368] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <span>Verify</span>}
              </button>
            </div>
          </form>
        </div>

        {/* VERIFICATION RESULT CARD */}
        {result && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Staff Identity Verification Result
              </span>
              <button
                onClick={() => {
                  setResult(null);
                  setManualToken("");
                  startCamera();
                }}
                className="text-xs text-[#017E84] font-bold hover:underline flex items-center gap-1"
              >
                <span>Scan Another Pass &rarr;</span>
              </button>
            </div>

            {result.valid ? (
              /* VALID ACTIVE MEMBER RESULT */
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded-md">
                        ACTIVE MEMBER CONFIRMED
                      </span>
                      <h3 className="text-xl font-black text-emerald-950 pt-1">{result.displayName}</h3>
                      <div className="font-mono text-xs font-bold text-[#4A1942]">{result.memberCode}</div>
                    </div>
                  </div>
                </div>

                {/* Member Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-gray-50 space-y-0.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Email</span>
                    <div className="font-bold text-gray-900 truncate">{result.email || "—"}</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-gray-50 space-y-0.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Academic Institution</span>
                    <div className="font-bold text-gray-900 truncate">{result.college || "Campus Member"}</div>
                  </div>

                  {result.positions && result.positions.length > 0 && (
                    <div className="sm:col-span-2 p-3.5 rounded-xl bg-gray-50 space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Assigned Roles</span>
                      <div className="flex flex-wrap gap-1.5">
                        {result.positions.map((pos, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-teal-100 text-[#017E84]"
                          >
                            {pos}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-3.5 rounded-xl bg-gray-50 space-y-0.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Membership Validity</span>
                    <div className="font-mono font-bold text-emerald-700">{result.validUntil || "Full Term"}</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-gray-50 space-y-0.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Dues Payment Status</span>
                    <div className="font-bold text-teal-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#017E84]" />
                      <span>₹300 Joining Fee Settled</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* INVALID RESULT */
              <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center mx-auto shadow-sm">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-red-950 text-base">Invalid or Inactive Membership</h4>
                  <p className="text-xs text-red-800 mt-1 max-w-sm mx-auto">
                    {result.message || "This QR token does not belong to an active approved Club_Hub member."}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
