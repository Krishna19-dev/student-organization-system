import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  BarChart2, Users, DollarSign, TrendingUp, TrendingDown, 
  ArrowLeft, Download, CheckCircle2, AlertCircle 
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { getStoredEvents } from "@/lib/events-store";

export default function AdminEventReportPage() {
  const { id } = useParams<{ id: string }>();
  const [eventData, setEventData] = useState<any>(null);

  useEffect(() => {
    const events = getStoredEvents();
    const ev = events.find((e) => e.id === id) || events[0];
    if (ev) {
      const cap = ev.capacity || ev.totalSeats || 120;
      const sold = ev.tickets || ev.seatsSold || 108;
      const attended = Math.max(0, Math.round(sold * 0.9));
      const noShows = sold - attended;
      const ticketRev = sold * (ev.price || 200);
      const sponsorRev = 40000;
      const expenses = Math.round(ticketRev * 0.6) + 15000;
      const net = ticketRev + sponsorRev - expenses;

      setEventData({
        eventId: ev.id,
        title: ev.title,
        seatsCapacity: cap,
        seatsSold: sold,
        attended,
        noShows,
        grossTicketRevenue: ticketRev,
        sponsorshipRevenue: sponsorRev,
        totalExpenses: expenses,
        netProfit: net,
        attendanceRate: `${Math.round((attended / (sold || 1)) * 100)}%`,
      });
    }
  }, [id]);

  const report = eventData || {
    eventId: id || "EVT-001",
    title: "Campus Event Report",
    seatsCapacity: 120,
    seatsSold: 108,
    attended: 98,
    noShows: 10,
    grossTicketRevenue: 19500,
    sponsorshipRevenue: 40000,
    totalExpenses: 28500,
    netProfit: 31000,
    attendanceRate: "90.7%",
  };


  return (
    <DashboardLayout
      role="PRESIDENT"
      breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Events", href: "/admin/events" }, { label: `${id || "EVT-001"} Report` }]}
      title={`Executive Event Report (${report.eventId})`}
      subtitle="Attendance reconciliation, turnover metrics, and single-ledger net financial result."
      actions={
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-all shadow-xs"
        >
          <Download className="w-4 h-4 text-[#017E84]" />
          <span>Export PDF Report</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Top KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
            <span className="text-xs text-gray-500">Seats Sold</span>
            <div className="text-2xl font-black text-gray-900 font-mono mt-1">
              {report.seatsSold} <span className="text-xs text-gray-400 font-normal">/ {report.seatsCapacity}</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-bold block mt-1">90% Capacity Fill</span>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
            <span className="text-xs text-gray-500">Actual Attended</span>
            <div className="text-2xl font-black text-teal-600 font-mono mt-1">
              {report.attended}
            </div>
            <span className="text-[11px] text-gray-400 block mt-1">{report.noShows} No-Shows</span>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
            <span className="text-xs text-gray-500">Gross Inflow</span>
            <div className="text-2xl font-black text-emerald-600 font-mono mt-1">
              ₹{(report.grossTicketRevenue + report.sponsorshipRevenue).toLocaleString("en-IN")}
            </div>
            <span className="text-[11px] text-gray-400 block mt-1">Tickets + Sponsors</span>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
            <span className="text-xs text-gray-500">Net Surplus / Result</span>
            <div className="text-2xl font-black text-[#4A1942] font-mono mt-1">
              +₹{report.netProfit.toLocaleString("en-IN")}
            </div>
            <span className="text-[11px] text-emerald-600 font-bold block mt-1">Credited to Vault</span>
          </div>
        </div>

        {/* Financial Breakdown Table */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-gray-900">Financial Performance Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase font-bold">
                <tr>
                  <th className="p-3">Category</th>
                  <th className="p-3">Component</th>
                  <th className="p-3 text-right">Amount (INR)</th>
                  <th className="p-3">Audit Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                <tr>
                  <td className="p-3 font-bold text-emerald-700">INCOME</td>
                  <td className="p-3">Verified Member &amp; Guest Ticket Sales</td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-700">+₹19,500</td>
                  <td className="p-3 text-gray-400 font-mono text-[11px]">LED-TKT-8841</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-emerald-700">INCOME</td>
                  <td className="p-3">Google Cloud Title Sponsorship Grant</td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-700">+₹40,000</td>
                  <td className="p-3 text-gray-400 font-mono text-[11px]">LED-SPN-2210</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-red-700">EXPENSE</td>
                  <td className="p-3">Auditorium Stage Sound &amp; Mic Setup</td>
                  <td className="p-3 text-right font-mono font-bold text-red-700">-₹12,000</td>
                  <td className="p-3 text-gray-400 font-mono text-[11px]">CLM-EXP-5521</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-red-700">EXPENSE</td>
                  <td className="p-3">Attendee Lunch Boxes &amp; Refreshments</td>
                  <td className="p-3 text-right font-mono font-bold text-red-700">-₹16,500</td>
                  <td className="p-3 text-gray-400 font-mono text-[11px]">CLM-EXP-5534</td>
                </tr>
                <tr className="bg-purple-50/50 font-bold">
                  <td className="p-3 text-[#4A1942]" colSpan={2}>NET OPERATIONAL SURPLUS</td>
                  <td className="p-3 text-right font-mono text-sm text-[#4A1942]">+₹31,000</td>
                  <td className="p-3 text-[11px] text-teal-700">POSTED TO CLUB RESERVE</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
