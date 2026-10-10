import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, Download, Filter, Search, Calendar, 
  ArrowUpRight, ArrowDownRight, Tag, BookOpen, CheckCircle 
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  category: "DUES" | "TICKETS" | "SPONSORSHIP" | "MERCH" | "FUNDRAISER" | "EXPENSE" | "CLAIM";
  type: "CREDIT" | "DEBIT";
  amount: number;
  balanceAfter: number;
  eventRef?: string;
  refId: string;
}

const INITIAL_LEDGER: LedgerEntry[] = [
  { id: "TX-1092", date: "2026-10-10", description: "Tech Summit 2026 Non-member Tickets (Bulk batch)", category: "TICKETS", type: "CREDIT", amount: 15000, balanceAfter: 193300, eventRef: "Tech Summit 2026", refId: "TCK-BATCH-99" },
  { id: "TX-1091", date: "2026-10-09", description: "Reimbursement: Cloud Server Hosting (Rahul S)", category: "CLAIM", type: "DEBIT", amount: 3200, balanceAfter: 178300, eventRef: "HackOdoo 2026", refId: "CLM-882" },
  { id: "TX-1090", date: "2026-10-08", description: "Gold Tier Sponsorship - Infosys Labs", category: "SPONSORSHIP", type: "CREDIT", amount: 25000, balanceAfter: 181500, eventRef: "Tech Summit 2026", refId: "SPON-INFO-01" },
  { id: "TX-1089", date: "2026-10-07", description: "Merchandise Store Orders: 12 Hoodies & 8 Badges", category: "MERCH", type: "CREDIT", amount: 9600, balanceAfter: 156500, refId: "ORD-BATCH-41" },
  { id: "TX-1088", date: "2026-10-05", description: "Catering advance payment - Green Leaf Hospitality", category: "EXPENSE", type: "DEBIT", amount: 18000, balanceAfter: 146900, eventRef: "Tech Summit 2026", refId: "INV-GL-401" },
  { id: "TX-1087", date: "2026-10-04", description: "Annual Premium Membership Renewals (32 members)", category: "DUES", type: "CREDIT", amount: 16000, balanceAfter: 164900, refId: "DUES-OCT-01" },
  { id: "TX-1086", date: "2026-10-02", description: "Annual Tech Aid Drive - Offline Collection Batch 1", category: "FUNDRAISER", type: "CREDIT", amount: 14500, balanceAfter: 148900, eventRef: "Campus Tech Aid 2026", refId: "FND-COL-12" },
  { id: "TX-1085", date: "2026-09-28", description: "Venue Stage & AV Equipment Deposit", category: "EXPENSE", type: "DEBIT", amount: 12000, balanceAfter: 134400, eventRef: "Tech Summit 2026", refId: "INV-AV-09" },
  { id: "TX-1084", date: "2026-09-25", description: "Silver Sponsor - DevCraft Solutions", category: "SPONSORSHIP", type: "CREDIT", amount: 15000, balanceAfter: 146400, eventRef: "HackOdoo 2026", refId: "SPON-DEV-02" },
  { id: "TX-1083", date: "2026-09-20", description: "Reimbursement: Hackathon Refreshments (Priya M)", category: "CLAIM", type: "DEBIT", amount: 4500, balanceAfter: 131400, eventRef: "HackOdoo 2026", refId: "CLM-870" }
];

export default function FinanceLedgerPage() {
  const [entries, setEntries] = useState<LedgerEntry[]>(INITIAL_LEDGER);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedEvent, setSelectedEvent] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const categories = ["ALL", "DUES", "TICKETS", "SPONSORSHIP", "MERCH", "FUNDRAISER", "EXPENSE", "CLAIM"];
  const eventList = ["ALL", "Tech Summit 2026", "HackOdoo 2026", "Campus Tech Aid 2026"];

  const filteredEntries = entries.filter((item) => {
    const matchesCategory = selectedCategory === "ALL" || item.category === selectedCategory;
    const matchesEvent = selectedEvent === "ALL" || (item.eventRef && item.eventRef === selectedEvent);
    const matchesSearch = 
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.refId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesEvent && matchesSearch;
  });

  const handleExportCSV = () => {
    const headers = ["Transaction ID", "Date", "Description", "Category", "Type", "Amount (INR)", "Balance After (INR)", "Event Ref", "Reference ID"];
    const rows = filteredEntries.map(e => [
      e.id,
      e.date,
      `"${e.description.replace(/"/g, '""')}"`,
      e.category,
      e.type,
      e.amount,
      e.balanceAfter,
      `"${e.eventRef || ""}"`,
      e.refId
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `odoo_finance_ledger_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <DashboardLayout
      role="TREASURER"
      breadcrumb={[
        { label: "Treasury", href: "/finance" },
        { label: "Full General Ledger" }
      ]}
      title="Single-Entry General Ledger"
      subtitle="Immutable financial records, transaction audit IDs, and real-time category tagging."
      actions={
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#4A1942] hover:bg-[#3a1232] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            {downloadSuccess ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
                <span>Exported!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </>
            )}
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Filters and search bar */}
        <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by description, transaction ID, or reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#4A1942]/20 focus:border-[#4A1942] outline-none transition-all"
              />
            </div>

            {/* Event Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 whitespace-nowrap">Filter Event:</span>
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-[#4A1942]/20"
              >
                {eventList.map((evt) => (
                  <option key={evt} value={evt}>{evt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-gray-100">
            <span className="text-xs font-bold text-gray-400 mr-2 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-[#4A1942] text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Ledger Table */}
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
              <h2 className="font-bold text-gray-900 text-sm">Transaction Journal</h2>
              <p className="text-xs text-gray-500">Showing {filteredEntries.length} recorded entries</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400 font-bold uppercase">Current Net Balance</span>
              <div className="text-base font-black font-mono text-[#017E84]">₹1,93,300</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Tx ID & Date</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Event Ref</th>
                  <th className="py-3 px-4 text-right">Debit / Credit</th>
                  <th className="py-3 px-4 text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-medium">
                {filteredEntries.map((entry) => {
                  const isCredit = entry.type === "CREDIT";
                  return (
                    <tr key={entry.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-gray-900">{entry.id}</span>
                        <div className="text-[11px] text-gray-400">{entry.date}</div>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="text-gray-900 font-semibold truncate">{entry.description}</div>
                        <div className="text-[11px] font-mono text-gray-400">Ref: {entry.refId}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${
                          entry.category === "DUES" ? "bg-purple-100 text-purple-700" :
                          entry.category === "TICKETS" ? "bg-teal-100 text-teal-800" :
                          entry.category === "SPONSORSHIP" ? "bg-amber-100 text-amber-800" :
                          entry.category === "MERCH" ? "bg-blue-100 text-blue-800" :
                          entry.category === "FUNDRAISER" ? "bg-emerald-100 text-emerald-800" :
                          entry.category === "CLAIM" ? "bg-rose-100 text-rose-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {entry.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {entry.eventRef ? (
                          <span className="text-gray-700 font-medium">{entry.eventRef}</span>
                        ) : (
                          <span className="text-gray-300 font-mono italic">None (General)</span>
                        )}
                      </td>
                      <td className={`py-3.5 px-4 whitespace-nowrap text-right font-mono font-bold ${
                        isCredit ? "text-emerald-600" : "text-rose-600"
                      }`}>
                        <div className="flex items-center justify-end gap-1">
                          {isCredit ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                          <span>{isCredit ? "+" : "-"}₹{entry.amount.toLocaleString("en-IN")}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-right font-mono font-bold text-gray-900">
                        ₹{entry.balanceAfter.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
