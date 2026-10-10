import { requireRole } from "@/lib/auth";
import { MemberRole } from "@prisma/client";
import AdminDashboard from "./AdminDashboard";

export const metadata = {
  title: "Admin Dashboard | Skyline Student Association",
  description: "Admin control panel for Skyline SSA — manage members, events, ledger, and merchandise.",
};

export default async function AdminPage() {
  // Enforce ADMIN role on the server; unauthenticated/unauthorized users get redirected to /login
  const user = await requireRole([MemberRole.ADMIN]);

  return (
    <AdminDashboard
      userName={user.name}
      userEmail={user.email}
    />
  );
}