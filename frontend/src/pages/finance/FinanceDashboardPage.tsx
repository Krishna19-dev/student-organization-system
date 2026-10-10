import React from "react";
import { Link } from "react-router-dom";
import { 
  TrendingUp, TrendingDown, DollarSign, BookOpen, 
  Receipt, ArrowUpRight, ArrowDownRight, CreditCard, 
  Calendar, HandCoins, Download 
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

export default function FinanceDashboardPage() {
  const metrics = {
    totalIncome: 247500,
    totalExpenses: 54200,
    netBalance: 193300,
  };

  const categories = [
    { name: "DUES", label: "Membership Dues", amount: 98000, percentage: 39.6, color: "bg-purple-600" },
    { name: "TICKETS", label: "Event Ticket Sales", amount: 48500, percentage: 19.6, color: "bg-teal-600" },
    { name: "SPONSORSHIP", label: "Corporate Grants", amount: 50000, percentage: 20.2, color: "bg-amber-500" },
    { name: "MERCH", label: "Store Merchandise", amount: 22500, percentage: 9.1, color: "bg-blue-600" },
    { name: "FUNDRAISER", label: "Campaign Drives", amount: 28500, percentage: 11.5, color: "bg-emerald-600" },
  ];

  return (
    <DashboardLayout
      role="TREASURER"
      breadcrumb={[{ label: "Treasury" }]}
      title="Financial Oversight Dashboard"
      subtitle="Single-entry integer accounting, income categorization, and reserves reconciliation."
      actions={
        <div className="flex gap-2">
          <Link
            to="/finance/ledger"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#4A1942] hover:bg-[#3a1232] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Full Ledger</span>
          </Link>
          <Link
            to="/finance/claims"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Receipt className="w-3.5 h-3.5 text-[#017E84]" />
            <span>Claims Queue</span>
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Core Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Gross Income Credits</span>
              <div className="text-2xl font-black font-mono text-emerald-600 mt-1">
                ₹{metrics.totalIncome.toLocaleString("en-IN")}
              </div>
              <span className="text-[11px] text-gray-500 flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                Verified across 5 revenue channels
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Operational Expenses</span>
              <div className="text-2xl font-black font-mono text-red-600 mt-1">
                ₹{metrics.totalExpenses.toLocaleString("en-IN")}
              </div>
              <span className="text-[11px] text-gray-500 flex items-center gap-1 mt-1">
                <ArrowDownRight className="w-3 h-3 text-red-600" />
                Audited volunteer claims &amp; venues
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <TrendingDown className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Net Association Vault</span>
              <div className="text-2xl font-black font-mono text-[#4A1942] mt-1">
                ₹{metrics.netBalance.toLocaleString("en-IN")}
              </div>
              <span className="text-[11px] text-teal-700 font-bold flex items-center gap-1 mt-1">
                Zero-float integer precision verified
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#4A1942] flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Income-by-Category Chart & Breakdown */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-gray-900">Revenue Channels (Income-by-Category)</h3>
              <p className="text-xs text-gray-500">Distribution across DUES, TICKETS, MERCH, SPONSORSHIP, and FUNDRAISER.</p>
            </div>
            <span className="text-xs font-mono font-bold text-[#017E84]">Total: ₹{metrics.totalIncome.toLocaleString("en-IN")}</span>
          </div>

          {/* Segmented Bar Chart */}
          <div className="w-full h-4 rounded-full overflow-hidden flex bg-gray-100">
            {categories.map((c) => (
              <div
                key={c.name}
                style={{ width: `${c.percentage}%` }}
                className={`${c.color} h-full transition-all`}
                title={`${c.name}: ₹${c.amount} (${c.percentage}%)`}
              />
            ))}
          </div>

          {/* Category List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {categories.map((c) => (
              <div key={c.name} className="p-3.5 rounded-2xl bg-gray-50/70 border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className={`w-3 h-3 rounded-md ${c.color}`} />
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">{c.name}</span>
                    <span className="text-[10px] text-gray-400">{c.label}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-gray-900 block">₹{c.amount.toLocaleString("en-IN")}</span>
                  <span className="text-[10px] font-mono text-gray-400">{c.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fast Action Shortcuts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/finance/events/EVT-001"
            className="p-5 rounded-3xl bg-white border border-gray-100 hover:border-teal-300 transition-colors shadow-xs flex justify-between items-center group"
          >
            <div>
              <span className="text-[10px] font-bold text-[#017E84] uppercase">Per-Event Analysis</span>
              <h4 className="font-bold text-sm text-gray-900 mt-0.5">Skyline Summit 2026 P&amp;L</h4>
              <span className="text-xs text-gray-500">Income vs Expenses reconciliation sheet</span>
            </div>
            <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-[#017E84] transition-colors" />
          </Link>

          <Link
            to="/finance/fundraisers/FND-001"
            className="p-5 rounded-3xl bg-white border border-gray-100 hover:border-purple-300 transition-colors shadow-xs flex justify-between items-center group"
          >
            <div>
              <span className="text-[10px] font-bold text-[#4A1942] uppercase">Fundraiser Takings</span>
              <h4 className="font-bold text-sm text-gray-900 mt-0.5">Record Campaign Proceeds</h4>
              <span className="text-xs text-gray-500">Log verified cash/UPI collections to ledger</span>
            </div>
            <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-[#4A1942] transition-colors" />
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
