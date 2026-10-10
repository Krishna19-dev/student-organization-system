import { getDemoUser } from "@/lib/auth-demo";
import { GUEST_DEMO_CREDENTIALS } from "@/lib/demo-credentials";
import ProfileClient from "./ProfileClient";

export const metadata = {
  title: "My Profile - Tickets & Merch | Skyline Student Association",
  description:
    "View your purchased event tickets, merchandise orders, and single-ledger receipts in your Skyline Student Association profile.",
};

export default async function ProfilePage() {
  const user = await getDemoUser();

  const displayUser = user ?? {
    name: GUEST_DEMO_CREDENTIALS.name,
    email: GUEST_DEMO_CREDENTIALS.email,
    role: GUEST_DEMO_CREDENTIALS.role,
  };

  return (
    <main className="min-h-screen bg-page py-10">
      <ProfileClient
        userName={displayUser.name}
        userEmail={displayUser.email}
        userRole={displayUser.role}
      />
    </main>
  );
}