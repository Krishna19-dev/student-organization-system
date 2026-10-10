import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Award, DollarSign, Gift, FileText, CheckCircle2, 
  Clock, ArrowRight, Download, Plus 
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

interface SponsorItem {
  id: string;
  name: string;
  stage: "LEAD" | "CONTACTED" | "COMMITTED" | "FULFILLED";
  contributionType: "CASH" | "IN_KIND";
  amountOrVal: number;
  deliverablesCount: number;
  contactPerson: string;
  notes: string;
}

const INITIAL_SPONSORS: SponsorItem[] = [
  { id: "SPN-01", name: "Google Cloud", stage: "FULFILLED", contributionType: "CASH", amountOrVal: 40000, deliverablesCount: 2, contactPerson: "sarah.w@google.com", notes: "Title sponsor for Skyline Tech Summit 2026." },
  { id: "SPN-02", name: "Red Bull India", stage: "COMMITTED", contributionType: "IN_KIND", amountOrVal: 15000, deliverablesCount: 1, contactPerson: "vikas.k@redbull.in", notes: "Provided 150 energy drinks and hackathon chiller." },
  { id: "SPN-03", name: "GitHub Education", stage: "CONTACTED", contributionType: "IN_KIND", amountOrVal: 20000, deliverablesCount: 1, contactPerson: "partners@github.edu", notes: "Negotiating student swag bag coupons and stickers." },
  { id: "SPN-04", name: "Zerodha Tech Foundation", stage: "LEAD", contributionType: "CASH", amountOrVal: 50000, deliverablesCount: 0, contactPerson: "grants@zerodha.org", notes: "Initial proposal submitted for campus open-source grants." },
];

export default function AdminSponsorsPage() {
  const { id } = useParams<{ id: string }>();
  const [sponsors, setSponsors] = useState<SponsorItem[]>(INITIAL_SPONSORS);
  const [receiptGenerated, setReceiptGenerated] = useState<string | null>(null);

  const handleGenerateReceipt = (sponsorId: string) => {
    const s = sponsors.find((item) => item.id === sponsorId);
    setReceiptGenerated(`Receipt generated for ${s?.name} (₹${s?.amountOrVal.toLocaleString("en-IN")})`);
    setTimeout(() => {
      window.print();
      setReceiptGenerated(null);
    }, 800);
  };

  const stages: ("LEAD" | "CONTACTED" | "COMMITTED" | "FULFILLED")[] = [
    "LEAD",
    "CONTACTED",
    "COMMITTED",
    "FULFILLED",
  ];

  return (
    <DashboardLayout
      role="PRESIDENT"
      breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Sponsor Pipeline" }]}
      title="Corporate Sponsorship Pipeline"
      subtitle="Track partnership stages, cash/in-kind contributions, and generate official 80G tax receipts."
    >
      <div className="space-y-6">
        {receiptGenerated && (
          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#017E84]" />
            <span>{receiptGenerated}</span>
          </div>
        )}

        {/* Pipeline Stage Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stages.map((stage) => {
            const list = sponsors.filter((s) => s.stage === stage);
            return (
              <div key={stage} className="bg-gray-50/80 rounded-3xl p-4 border border-gray-100 space-y-3">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[11px] font-black uppercase text-gray-700 tracking-wider">
                    {stage}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-gray-500 border border-gray-100">
                    {list.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {list.map((spn) => (
                    <div
                      key={spn.id}
                      className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-xs text-gray-900">{spn.name}</span>
                        <span
                          className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                            spn.contributionType === "CASH"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {spn.contributionType}
                        </span>
                      </div>

                      <div className="text-base font-black font-mono text-[#4A1942]">
                        ₹{spn.amountOrVal.toLocaleString("en-IN")}
                      </div>

                      <p className="text-[11px] text-gray-500 line-clamp-2">{spn.notes}</p>

                      <div className="pt-2 border-t border-gray-50 flex items-center justify-between text-[11px]">
                        <span className="text-gray-400 font-mono">{spn.id}</span>
                        <button
                          onClick={() => handleGenerateReceipt(spn.id)}
                          className="font-bold text-[#017E84] hover:underline flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Receipt PDF</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
