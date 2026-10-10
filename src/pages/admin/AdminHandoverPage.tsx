import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  BookOpen, Calendar, User, FileText, ChevronRight, 
  Archive, ShieldCheck, Download 
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

interface HandoverReport {
  id: string;
  term: string;
  outgoingOfficer: string;
  role: string;
  submissionDate: string;
  executiveSummary: string;
  keyAchievements: string[];
  pendingObligations: string[];
  keyAccountCredentials: string[];
}

const HANDOVER_ARCHIVES: HandoverReport[] = [
  {
    id: "HND-2025-26",
    term: "Academic Year 2025 - 2026",
    outgoingOfficer: "Vikram Sen",
    role: "President",
    submissionDate: "June 28, 2026",
    executiveSummary: "Successfully transitioned the student association from paper ticketing to digital QR passes. Vault reserves closed with surplus ₹1,20,000.",
    keyAchievements: [
      "Secured title corporate sponsorship with Google Cloud for ₹40,000",
      "Organized Hackathon with 75 participants and zero safety incidents",
      "Drafted and ratified the 2026 Student Association Constitution amendment",
    ],
    pendingObligations: [
      "Complete annual audit submission to university faculty dean by Nov 2026",
      "Renew campus domain and cloud hosting by Dec 2026",
    ],
    keyAccountCredentials: [
      "Razorpay Merchant Dashboard (Account: skyline_treasury)",
      "Campus Auditorium Priority Booking Registry",
    ],
  },
  {
    id: "HND-2024-25",
    term: "Academic Year 2024 - 2025",
    outgoingOfficer: "Kavya Nair",
    role: "President",
    submissionDate: "June 25, 2025",
    executiveSummary: "Founded the Skyline Student Association chapter and established official club recognition with the Student Activities Board.",
    keyAchievements: [
      "Recruited 200 charter members across 4 engineering departments",
      "Launched initial merchandise run (hoodies and caps)",
      "Set up PostgreSQL ledger database for financial tracking",
    ],
    pendingObligations: [
      "Formalize annual election guidelines",
    ],
    keyAccountCredentials: [
      "GitHub Organization: skyline-student-association",
    ],
  },
];

export default function AdminHandoverPage() {
  const [selectedArchive, setSelectedArchive] = useState<HandoverReport>(HANDOVER_ARCHIVES[0]);

  return (
    <DashboardLayout
      role="PRESIDENT"
      breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Handover Notes" }]}
      title="Council Handover Notes Archive"
      subtitle="Read-only institutional memory repository preserved across outgoing executive terms."
    >
      <div className="space-y-6">
        {/* Term Switcher */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {HANDOVER_ARCHIVES.map((arch) => (
            <button
              key={arch.id}
              onClick={() => setSelectedArchive(arch)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                selectedArchive.id === arch.id
                  ? "bg-[#4A1942] text-white shadow-xs"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Archive className="w-3.5 h-3.5 text-[#017E84]" />
              <span>{arch.term} ({arch.outgoingOfficer})</span>
            </button>
          ))}
        </div>

        {/* Selected Archive Card */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <span className="text-[10px] font-mono text-purple-900 font-bold">{selectedArchive.id}</span>
              <h2 className="text-xl font-black text-gray-900 mt-0.5">{selectedArchive.term} Handover</h2>
              <span className="text-xs text-gray-400">
                Submitted by {selectedArchive.outgoingOfficer} ({selectedArchive.role}) on {selectedArchive.submissionDate}
              </span>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>
          </div>

          {/* Executive Summary */}
          <div className="p-4 rounded-2xl bg-[#FAF7F9] border border-gray-100 space-y-1">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Executive Overview</h4>
            <p className="text-xs text-gray-600 leading-relaxed">{selectedArchive.executiveSummary}</p>
          </div>

          {/* Key Achievements */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>Term Milestones &amp; Achievements</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedArchive.keyAchievements.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs text-emerald-900">
                  • {item}
                </div>
              ))}
            </div>
          </div>

          {/* Pending Obligations */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              Carried-Over Obligations for Incoming Council
            </h4>
            <div className="space-y-2">
              {selectedArchive.pendingObligations.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-amber-50/50 border border-amber-100 text-xs text-amber-900">
                  &rarr; {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
