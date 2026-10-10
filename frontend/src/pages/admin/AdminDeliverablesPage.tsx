import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Award, AlertTriangle, CheckCircle2, Clock, 
  Upload, User, FileText, ChevronRight 
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

interface Deliverable {
  id: string;
  sponsorName: string;
  item: string;
  event: string;
  assignedTo: string;
  dueDate: string;
  isOverdue: boolean;
  status: "PENDING" | "FULFILLED";
  proofName?: string;
}

const INITIAL_DELIVERABLES: Deliverable[] = [
  {
    id: "DLV-01",
    sponsorName: "Google Cloud",
    item: "Display 2x Roll-up Banners at Entry Gate & Main Stage",
    event: "Skyline Tech Summit 2026",
    assignedTo: "Ananya Iyer",
    dueDate: "Oct 20, 2026",
    isOverdue: false,
    status: "FULFILLED",
    proofName: "photo_banner_entry.jpg",
  },
  {
    id: "DLV-02",
    sponsorName: "Google Cloud",
    item: "Distribute 100x GCP Developer stickers in attendee kits",
    event: "Skyline Tech Summit 2026",
    assignedTo: "Dev Patel",
    dueDate: "Oct 15, 2026",
    isOverdue: true,
    status: "PENDING",
  },
  {
    id: "DLV-03",
    sponsorName: "Red Bull India",
    item: "Place energy drink chilling cooler at Hackathon lounge",
    event: "Campus Hackathon 2026",
    assignedTo: "Rohan Mehta",
    dueDate: "Sep 28, 2026",
    isOverdue: false,
    status: "FULFILLED",
    proofName: "cooler_installation.png",
  },
  {
    id: "DLV-04",
    sponsorName: "GitHub Education",
    item: "Include GitHub Octocat logo on all digital posters",
    event: "Skyline Tech Summit 2026",
    assignedTo: "Rohan Varma",
    dueDate: "Oct 18, 2026",
    isOverdue: false,
    status: "PENDING",
  },
];

export default function AdminDeliverablesPage() {
  const [deliverables, setDeliverables] = useState<Deliverable[]>(INITIAL_DELIVERABLES);

  const handleAttachProof = (id: string) => {
    setDeliverables(
      deliverables.map((d) =>
        d.id === id ? { ...d, status: "FULFILLED" as const, isOverdue: false, proofName: "uploaded_proof_photo.jpg" } : d
      )
    );
  };

  return (
    <DashboardLayout
      role="PRESIDENT"
      breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Sponsor Deliverables" }]}
      title="Sponsor Commitment Deliverables"
      subtitle="Ensure volunteer proof execution for contractual corporate sponsorship perks."
    >
      <div className="space-y-4">
        {deliverables.map((d) => (
          <div
            key={d.id}
            className={`bg-white rounded-3xl border p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 ${
              d.isOverdue ? "border-red-200 bg-red-50/20" : "border-gray-100"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-purple-900">{d.id}</span>
                <span className="text-xs font-black text-gray-900 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-[#E4A900]" />
                  {d.sponsorName}
                </span>
                {d.isOverdue && (
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-red-100 text-red-800 flex items-center gap-1">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    OVERDUE ACTION
                  </span>
                )}
              </div>

              <h4 className="text-sm font-bold text-gray-900">{d.item}</h4>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                <span>Event: <strong>{d.event}</strong></span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#017E84]" />
                  Assigned: <strong>{d.assignedTo}</strong>
                </span>
                <span className="flex items-center gap-1 text-gray-400">
                  <Clock className="w-3.5 h-3.5" />
                  Due: {d.dueDate}
                </span>
              </div>
            </div>

            {/* Status & Proof Button */}
            <div className="flex items-center gap-3 self-start md:self-center">
              {d.status === "FULFILLED" ? (
                <div className="text-right">
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase block">
                    FULFILLED &amp; VERIFIED
                  </span>
                  <span className="text-[10px] font-mono text-gray-400 mt-1 block">
                    Proof: {d.proofName}
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => handleAttachProof(d.id)}
                  className="px-4 py-2 rounded-xl bg-[#017E84] hover:bg-[#016368] text-white text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Attach Photo Proof</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
