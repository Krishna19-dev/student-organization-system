import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Kanban, PlusCircle, CheckCircle2, Clock, User, 
  Flag, Award, ArrowLeft, MoreHorizontal 
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

interface TaskItem {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  isSponsorDeliverable?: boolean;
}

const INITIAL_TASKS: TaskItem[] = [
  {
    id: "TSK-101",
    title: "Stage audio/visual equipment check with vendor",
    assignee: "Ananya Iyer",
    dueDate: "Oct 21, 2026",
    status: "TODO",
  },
  {
    id: "TSK-102",
    title: "Print 120 Attendee Badges and Lanyards",
    assignee: "Rohan Mehta",
    dueDate: "Oct 22, 2026",
    status: "IN_PROGRESS",
  },
  {
    id: "TSK-103",
    title: "Sponsor: Display Google Cloud banner at registration desk",
    assignee: "Dev Patel",
    dueDate: "Oct 23, 2026",
    status: "IN_PROGRESS",
    isSponsorDeliverable: true,
  },
  {
    id: "TSK-104",
    title: "Confirm keynote speaker hospitality and airport pickup",
    assignee: "Rohan Varma",
    dueDate: "Oct 19, 2026",
    status: "DONE",
  },
  {
    id: "TSK-105",
    title: "Sponsor: Place Red Bull cooler at breakout lounge",
    assignee: "Ananya Iyer",
    dueDate: "Oct 20, 2026",
    status: "DONE",
    isSponsorDeliverable: true,
  },
];

export default function AdminEventTasksPage() {
  const { id } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newAssignee, setNewAssignee] = useState("Ananya Iyer");
  const [isSponsor, setIsSponsor] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const moveTask = (taskId: string, newStatus: TaskItem["status"]) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    const newTask: TaskItem = {
      id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
      title: newTaskTitle,
      assignee: newAssignee,
      dueDate: "Oct 24, 2026",
      status: "TODO",
      isSponsorDeliverable: isSponsor,
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
    setIsSponsor(false);
    setShowAddModal(false);
  };

  const columns: { key: TaskItem["status"]; label: string; bg: string; dot: string }[] = [
    { key: "TODO", label: "To Do", bg: "bg-gray-100", dot: "bg-gray-400" },
    { key: "IN_PROGRESS", label: "In Progress", bg: "bg-blue-50", dot: "bg-blue-500" },
    { key: "DONE", label: "Completed", bg: "bg-emerald-50", dot: "bg-emerald-500" },
  ];

  return (
    <DashboardLayout
      role="PRESIDENT"
      breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Events", href: "/admin/events" }, { label: `${id || "EVT-001"} Tasks` }]}
      title={`Event Task Board (${id || "EVT-001"})`}
      subtitle="Supervise volunteer task execution and verified sponsor deliverable tracking."
      actions={
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#4A1942] hover:bg-[#3a1232] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key);
          return (
            <div key={col.key} className="bg-gray-50/70 rounded-3xl p-4 border border-gray-100 space-y-3">
              {/* Column Header */}
              <div className="flex items-center justify-between px-2 py-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                  <span className="font-bold text-xs text-gray-800">{col.label}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-gray-600 shadow-2xs border border-gray-100">
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks List */}
              <div className="space-y-2.5">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-mono text-purple-900 font-bold">{task.id}</span>
                      {task.isSponsorDeliverable && (
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                          <Award className="w-2.5 h-2.5" />
                          SPONSOR
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-gray-900 leading-snug">
                      {task.title}
                    </h4>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-[11px] text-gray-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-[#017E84]" />
                        <strong>{task.assignee}</strong>
                      </span>
                      <span className="flex items-center gap-1 text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        {task.dueDate}
                      </span>
                    </div>

                    {/* Move controls */}
                    <div className="flex gap-1 pt-1">
                      {col.key !== "TODO" && (
                        <button
                          onClick={() => moveTask(task.id, col.key === "DONE" ? "IN_PROGRESS" : "TODO")}
                          className="flex-1 py-1 rounded-lg text-[10px] font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                        >
                          &larr; Prev
                        </button>
                      )}
                      {col.key !== "DONE" && (
                        <button
                          onClick={() => moveTask(task.id, col.key === "TODO" ? "IN_PROGRESS" : "DONE")}
                          className="flex-1 py-1 rounded-lg text-[10px] font-bold bg-[#017E84] hover:bg-[#016368] text-white transition-colors"
                        >
                          Next &rarr;
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="font-bold text-sm text-gray-900">Add Volunteer Kanban Task</h3>
            <form onSubmit={handleAddTask} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Set up sponsor backdrop banner"
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Assign Volunteer</label>
                <select
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white"
                >
                  <option value="Ananya Iyer">Ananya Iyer (Operations Crew)</option>
                  <option value="Rohan Mehta">Rohan Mehta (Tech Volunteer)</option>
                  <option value="Dev Patel">Dev Patel (Member Volunteer)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="sponsorCheckAdmin"
                  checked={isSponsor}
                  onChange={(e) => setIsSponsor(e.target.checked)}
                  className="rounded text-[#017E84]"
                />
                <label htmlFor="sponsorCheckAdmin" className="text-xs text-gray-700 font-medium">
                  This task is an agreed Sponsor Deliverable
                </label>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#4A1942] text-white text-xs font-bold"
                >
                  Create Task
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
    </DashboardLayout>
  );
}
