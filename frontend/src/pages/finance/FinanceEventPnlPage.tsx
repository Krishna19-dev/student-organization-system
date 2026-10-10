import React from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, TrendingUp, TrendingDown, DollarSign, Calendar, 
  Users, CheckCircle2, Receipt, ArrowUpRight, ArrowDownRight, Tag 
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

export default function FinanceEventPnlPage() {
  const { id } = useParams<{ id: string }>();

  // Event mock financial dataset
  const eventData = {
    id: id || "tech-summit-2026",
    title: "National Tech Summit 2026",
    date: "November 15, 2026",
    venue: "Main Auditorium, Campus Center",
    capacity: 250,
    registered: 242,
    checkedIn: 228,
    
    // Revenue breakdown
    income: {
      memberTickets: { count: 180, price: 0, total: 0 },
      nonMemberTickets: { count: 62, price: 500, total: 31000 },
      sponsorships: [
        { sponsor: "Infosys Labs (Gold Tier)", amount: 25000 },
        { sponsor: "DevCraft Solutions (Silver Tier)", amount: 15000 },
      ],
      totalIncome: 71000
    },

    // Expenses breakdown
    expenses: [
      { category: "Venue Stage & AV Equipment Deposit", amount: 12000, vendor: "City Sound & Light Rentals", ref: "INV-AV-09" },
      { category: "Catering & Refreshments Advance", amount: 18000, vendor: "Green Leaf Hospitality", ref: "INV-GL-401" },
      { category: "Reimbursement: Badges & Printing", amount: 4800, vendor: "Neha Sharma (Claim CLM-901)", ref: "CLM-901" },
      { category: "Reimbursement: Hardware Logistics", amount: 1450, vendor: "Karthik Verma (Claim CLM-902)", ref: "CLM-902" },
      { category: "Speaker Mementos & Honorarium", amount: 8000, vendor: "Artisans Guild", ref: "INV-SPK-12" }
    ]
  };

  const totalExpenses = eventData.expenses.reduce((sum, item) => sum + item.amount, 0);
  const netPnL = eventData.income.totalIncome - totalExpenses;
  const isProfitable = netPnL >= 0;
  const profitMargin = ((netPnL / eventData.income.totalIncome) * 100).toFixed(1);

  return (
    <DashboardLayout
      role="TREASURER"
      breadcrumb={[
        { label: "Treasury", href: "/finance" },
        { label: "Event Financials" },
        { label: eventData.title }
      ]}
      title={`P&L Statement: ${eventData.title}`}
      subtitle="Comprehensive revenue attribution, approved expense line items, and margin yield."
      actions={
        <Link
          to="/finance"
          className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Treasury Hub</span>
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Gross Event Income</span>
            <div className="text-xl font-black font-mono text-emerald-600 mt-1">
              ₹{eventData.income.totalIncome.toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-gray-500 mt-1">Tickets + Corporate Grants</div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Disbursed Expenses</span>
            <div className="text-xl font-black font-mono text-rose-600 mt-1">
              ₹{totalExpenses.toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-gray-500 mt-1">{eventData.expenses.length} itemized line vouchers</div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Net Surplus / Margin</span>
            <div className={`text-xl font-black font-mono mt-1 ${isProfitable ? "text-[#017E84]" : "text-red-600"}`}>
              {isProfitable ? "+" : ""}₹{netPnL.toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] font-semibold text-emerald-600 mt-1">
              {profitMargin}% net margin yield
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Turnout Yield</span>
            <div className="text-xl font-black font-mono text-gray-900 mt-1">
              {eventData.checkedIn} / {eventData.registered}
            </div>
            <div className="text-[11px] text-gray-500 mt-1">
              {((eventData.checkedIn / eventData.registered) * 100).toFixed(0)}% check-in rate
            </div>
          </div>
        </div>

        {/* Breakdown Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Income Column */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-sm text-gray-900">Revenue Credits (Gross)</h3>
              </div>
              <span className="font-mono font-bold text-sm text-emerald-600">
                ₹{eventData.income.totalIncome.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-2">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Ticket Admissions</span>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-700">Member Tickets (Dues-inclusive)</span>
                  <span className="font-mono font-bold text-gray-900">{eventData.income.memberTickets.count} × ₹0 = ₹0</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-1 border-t border-emerald-100">
                  <span className="text-gray-700">Non-Member Public Tickets</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {eventData.income.nonMemberTickets.count} × ₹500 = ₹{eventData.income.nonMemberTickets.total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 space-y-2">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Corporate Grants & Sponsorship</span>
                {eventData.income.sponsorships.map((spon, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-gray-700 font-medium">{spon.sponsor}</span>
                    <span className="font-mono font-bold text-amber-700">₹{spon.amount.toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Expenses Column */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ArrowDownRight className="w-4 h-4 text-rose-600" />
                <h3 className="font-bold text-sm text-gray-900">Expenses & Claims (Debits)</h3>
              </div>
              <span className="font-mono font-bold text-sm text-rose-600">
                ₹{totalExpenses.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="divide-y divide-gray-100 text-xs">
              {eventData.expenses.map((exp, idx) => (
                <div key={idx} className="py-3 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-gray-800">{exp.category}</div>
                    <div className="text-[11px] text-gray-400">{exp.vendor} • Ref: {exp.ref}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-rose-600">-₹{exp.amount.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                to="/finance/claims"
                className="w-full py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 flex items-center justify-center gap-1.5 transition-all"
              >
                <Receipt className="w-3.5 h-3.5 text-[#017E84]" />
                <span>View All Associated Expense Claims</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
