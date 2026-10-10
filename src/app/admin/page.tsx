import { getDemoUser } from "@/lib/auth-demo";
import { redirect } from "next/navigation";
import AdminDashboard from "./AdminDashboard";

export const metadata = {
  title: "Admin Dashboard | Skyline Student Association",
  description: "Admin control panel for Skyline SSA — manage members, events, ledger, and merchandise.",
};

export default async function AdminPage() {
  const user = await getDemoUser();

  // Only ADMIN role can access this page
  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <AdminDashboard
      userName={user.name}
      userEmail={user.email}
    />
  );
}