import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Megaphone, Send, CheckCircle2, Globe, Lock } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

export default function AdminNewAnnouncementPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState<"PUBLIC" | "MEMBERS">("PUBLIC");
  const [published, setPublished] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPublished(true);
    setTimeout(() => {
      navigate("/announcements");
    }, 1000);
  };

  return (
    <DashboardLayout
      role="PRESIDENT"
      breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Compose Bulletin" }]}
      title="Publish Campus Announcement"
      subtitle="Broadcast announcements to the public campus portal or restricted member channels."
    >
      <div className="max-w-2xl bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs">
        {published && (
          <div className="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Bulletin broadcasted! Redirecting to announcements feed...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Post Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Call for Hackathon Project Mentors"
              className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4A1942]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Target Audience</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAudience("PUBLIC")}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                  audience === "PUBLIC"
                    ? "border-[#017E84] bg-teal-50 text-[#017E84] font-bold"
                    : "border-gray-200 bg-white text-gray-600"
                }`}
              >
                <Globe className="w-4 h-4" />
                <span className="text-xs">PUBLIC (Visible to Everyone)</span>
              </button>

              <button
                type="button"
                onClick={() => setAudience("MEMBERS")}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                  audience === "MEMBERS"
                    ? "border-[#4A1942] bg-purple-50 text-[#4A1942] font-bold"
                    : "border-gray-200 bg-white text-gray-600"
                }`}
              >
                <Lock className="w-4 h-4" />
                <span className="text-xs">MEMBERS ONLY (Logged-In)</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Bulletin Content</label>
            <textarea
              rows={6}
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write the full announcement text, agenda, instructions, or meeting links..."
              className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4A1942]"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#4A1942] hover:bg-[#3a1232] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Bulletin</span>
            </button>
            <Link
              to="/admin"
              className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
