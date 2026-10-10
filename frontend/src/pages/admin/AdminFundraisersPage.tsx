import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  HandCoins, Target, CheckCircle2, Clock, Users, 
  PlusCircle, ArrowRight, BarChart2 
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

interface FundraiserItem {
  id: string;
  title: string;
  targetAmount: number;
  raisedAmount: number;
  totalTasks: number;
  completedTasks: number;
  status: "ACTIVE" | "COMPLETED";
  tasks: { id: string; name: string; done: boolean; volunteer: string }[];
}

const INITIAL_FUNDRAISERS: FundraiserItem[] = [
  {
    id: "FND-001",
    title: "Annual Hackathon Student Travel Grants Fund",
    targetAmount: 50000,
    raisedAmount: 38500,
    totalTasks: 6,
    completedTasks: 4,
    status: "ACTIVE",
    tasks: [
      { id: "FT-1", name: "Alumni outreach email campaign", done: true, volunteer: "Rohan Mehta" },
      { id: "FT-2", name: "Campus coffee stand fundraiser day 1", done: true, volunteer: "Ananya Iyer" },
      { id: "FT-3", name: "Corporate CSR matching pitch to TechCorp", done: true, volunteer: "Priya Sharma" },
      { id: "FT-4", name: "Campus coffee stand fundraiser day 2", done: true, volunteer: "Ananya Iyer" },
      { id: "FT-5", name: "Merchandise batch proceeds allocation", done: false, volunteer: "Dev Patel" },
      { id: "FT-6", name: "Final donor receipt dispatch", done: false, volunteer: "Rohan Varma" },
    ],
  },
  {
    id: "FND-002",
    title: "Library Open-Access Robotics Hardware Kits",
    targetAmount: 25000,
    raisedAmount: 25000,
    totalTasks: 4,
    completedTasks: 4,
    status: "COMPLETED",
    tasks: [
      { id: "FT-7", name: "Hardware BOM pricing negotiation", done: true, volunteer: "Dev Patel" },
      { id: "FT-8", name: "Sponsorship micro-grant application", done: true, volunteer: "Priya Sharma" },
      { id: "FT-9", name: "Kit unboxing and lab inventory check", done: true, volunteer: "Rohan Mehta" },
      { id: "FT-10", name: "Handover to library faculty rep", done: true, volunteer: "Arjun Mehta" },
    ],
  },
];

export default function AdminFundraisersPage() {
  const { id } = useParams<{ id: string }>();
  const [fundraisers, setFundraisers] = useState<FundraiserItem[]>(INITIAL_FUNDRAISERS);

  const selected = id ? fundraisers.find((f) => f.id === id) || fundraisers[0] : fundraisers[0];

  const toggleTask = (taskId: string) => {
    setFundraisers(
      fundraisers.map((f) => {
        if (f.id !== selected.id) return f;
        const updatedTasks = f.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t));
        const completed = updatedTasks.filter((t) => t.done).length;
        return { ...f, tasks: updatedTasks, completedTasks: completed };
      })
    );
  };

  const progressPercent = Math.round((selected.raisedAmount / selected.targetAmount) * 100);
  const taskPercent = Math.round((selected.completedTasks / selected.totalTasks) * 100);

  return (
    <DashboardLayout
      role="PRESIDENT"
      breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Campaign Fundraisers" }]}
      title="Fundraising Campaigns & Milestone Boards"
      subtitle="Track donation drives, corporate matching targets, and volunteer execution kanban."
    >
      <div className="space-y-6">
        {/* Campaign Switcher Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {fundraisers.map((f) => (
            <Link
              key={f.id}
              to={`/admin/fundraisers/${f.id}`}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                selected.id === f.id
                  ? "bg-[#4A1942] text-white shadow-xs"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <HandCoins className="w-3.5 h-3.5 text-[#017E84]" />
              <span>{f.title}</span>
            </Link>
          ))}
        </div>

        {/* Selected Campaign Overview */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <span className="text-[10px] font-mono text-purple-900 font-bold">{selected.id}</span>
              <h2 className="text-xl font-black text-gray-900 mt-0.5">{selected.title}</h2>
            </div>
            <span
              className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                selected.status === "ACTIVE"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {selected.status}
            </span>
          </div>

          {/* Progress Bars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Amount Progress */}
            <div className="p-5 rounded-2xl bg-teal-50/50 border border-teal-100 space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-teal-900">Capital Raised</span>
                <span className="text-lg font-black font-mono text-[#017E84]">
                  ₹{selected.raisedAmount.toLocaleString("en-IN")} <span className="text-xs text-gray-400 font-normal">/ ₹{selected.targetAmount.toLocaleString("en-IN")}</span>
                </span>
              </div>
              <div className="w-full bg-teal-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#017E84] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, progressPercent)}%` }}
                />
              </div>
              <span className="text-[11px] text-teal-800 font-bold block text-right">{progressPercent}% of target reached</span>
            </div>

            {/* Task Progress */}
            <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-purple-900">Volunteer Deliverables</span>
                <span className="text-lg font-black font-mono text-[#4A1942]">
                  {selected.completedTasks} <span className="text-xs text-gray-400 font-normal">/ {selected.totalTasks} Done</span>
                </span>
              </div>
              <div className="w-full bg-purple-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#4A1942] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, taskPercent)}%` }}
                />
              </div>
              <span className="text-[11px] text-purple-800 font-bold block text-right">{taskPercent}% task completion</span>
            </div>
          </div>

          {/* Volunteer Task Board Checklist */}
          <div className="space-y-3 pt-2">
            <h3 className="font-bold text-sm text-gray-900">Execution Task Checklist</h3>
            <div className="space-y-2">
              {selected.tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    task.done
                      ? "bg-gray-50 border-gray-200 text-gray-400 line-through"
                      : "bg-white border-gray-100 hover:border-teal-300 text-gray-800 shadow-2xs"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.done}
                      readOnly
                      className="rounded text-[#017E84]"
                    />
                    <span className="text-xs font-bold">{task.name}</span>
                  </div>
                  <span className="text-[11px] font-medium text-gray-400 font-mono">
                    @{task.volunteer}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
