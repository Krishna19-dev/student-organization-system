import React, { useState, useEffect } from "react";
import { getDemoUser } from "@/lib/auth-demo";
import { GUEST_DEMO_CREDENTIALS } from "@/lib/demo-credentials";
import ProfileClient from "./ProfileClient";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getDemoUser().then((u) => {
      setUser(u || {
        name: GUEST_DEMO_CREDENTIALS.name,
        email: GUEST_DEMO_CREDENTIALS.email,
        role: GUEST_DEMO_CREDENTIALS.role,
      });
    });
  }, []);

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