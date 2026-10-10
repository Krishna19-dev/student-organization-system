import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Gavel, Award, Users, CheckCircle2, Clock, 
  Calendar, ShieldCheck, Plus 
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

interface RoleAssignment {
  id: string;
  userName: string;
  userEmail: string;
  role: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  termTitle: string;
}

const INITIAL_ROLES: RoleAssignment[] = [
  { id: "R-1", userName: "Arjun Mehta", userEmail: "president@skyline.test", role: "PRESIDENT", startDate: "Jul 01, 2026", endDate: "Jun 30, 2027", isCurrent: true, termTitle: "2026-2027 Executive Term" },
  { id: "R-2", userName: "Priya Sharma", userEmail: "treasurer@skyline.test", role: "TREASURER", startDate: "Jul 01, 2026", endDate: "Jun 30, 2027", isCurrent: true, termTitle: "2026-2027 Executive Term" },
  { id: "R-3", userName: "Rohan Varma", userEmail: "rohan.v@skyline.test", role: "GENERAL SECRETARY", startDate: "Jul 01, 2026", endDate: "Jun 30, 2027", isCurrent: true, termTitle: "2026-2027 Executive Term" },
  { id: "R-4", userName: "Ananya Iyer", userEmail: "ananya@skyline.test", role: "LEAD OPERATIONS VOLUNTEER", startDate: "Aug 01, 2026", endDate: "Jun 30, 2027", isCurrent: true, termTitle: "2026-2027 Operations Term" },
  { id: "R-5", userName: "Vikram Sen", userEmail: "vikram@skyline.test", role: "PAST PRESIDENT", startDate: "Jul 01, 2025", endDate: "Jun 30, 2026", isCurrent: false, termTitle: "2025-2026 Executive Term" },
];

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<RoleAssignment[]>(INITIAL_ROLES);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newRoleTitle, setNewRoleTitle] = useState("TREASURER");
  const [showAdd, setShowAdd] = useState(false);

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName) return;
    const item: RoleAssignment = {
      id: `R-${roles.length + 1}`,
      userName: newUserName,
      userEmail: newUserEmail,
      role: newRoleTitle,
      startDate: "Oct 15, 2026",
      endDate: "Jun 30, 2027",
      isCurrent: true,
      termTitle: "2026-2027 Council Appointment",
    };
    setRoles([item, ...roles]);
    setNewUserName("");
    setNewUserEmail("");
    setShowAdd(false);
  };

  return (
    <DashboardLayout
      role="PRESIDENT"
      breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Role Assignments" }]}
      title="Officer Portfolios & Term Timelines"
      subtitle="Supervise constitutional role assignments, tenure start/end dates, and appointment history."
      actions={
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#4A1942] hover:bg-[#3a1232] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Appoint Officer</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Timeline Table */}
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase font-bold">
                <tr>
                  <th className="p-4">Officer Name</th>
                  <th className="p-4">Assigned Portfolio</th>
                  <th className="p-4">Term Tenure</th>
                  <th className="p-4">Tenure Duration</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {roles.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{r.userName}</div>
                      <div className="text-[11px] text-gray-400">{r.userEmail}</div>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-[#4A1942]">{r.role}</span>
                      <div className="text-[11px] text-gray-400">{r.termTitle}</div>
                    </td>
                    <td className="p-4 text-gray-600 font-mono text-[11px]">
                      {r.startDate} &rarr; {r.endDate}
                    </td>
                    <td className="p-4 text-gray-500">1 Academic Year</td>
                    <td className="p-4 text-right">
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          r.isCurrent
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {r.isCurrent ? "ACTIVE TERM" : "PAST TERM"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl">
              <h3 className="font-bold text-sm text-gray-900">Appoint Council Officer</h3>
              <form onSubmit={handleAddRole} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Student Name</label>
                  <input
                    type="text"
                    required
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="e.g. Tanvi Verma"
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Campus Email</label>
                  <input
                    type="email"
                    required
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="e.g. tanvi@skyline.edu"
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Office Portfolio</label>
                  <select
                    value={newRoleTitle}
                    onChange={(e) => setNewRoleTitle(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white"
                  >
                    <option value="TREASURER">Treasurer</option>
                    <option value="GENERAL SECRETARY">General Secretary</option>
                    <option value="HEAD OF LOGISTICS">Head of Logistics</option>
                    <option value="COMMUNICATIONS LEAD">Communications Lead</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#4A1942] text-white text-xs font-bold"
                  >
                    Confirm Appointment
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
