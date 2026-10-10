"use server";

import { redirect } from "next/navigation";
import { setDemoUser, clearDemoUser } from "@/lib/auth-demo";
import { ALL_DEMO_ACCOUNTS, GUEST_DEMO_CREDENTIALS } from "@/lib/demo-credentials";

export interface LoginActionResult {
  success?: boolean;
  error?: string;
}

export async function loginWithAccountById(accountId: string): Promise<never> {
  const account = ALL_DEMO_ACCOUNTS.find((a) => a.id === accountId) || GUEST_DEMO_CREDENTIALS;

  try {
    // Attempt real login with backend API
    const res = await fetch("http://localhost:4000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: account.email, password: account.password }),
    });

    if (res.ok) {
      const data = await res.json();
      await setDemoUser(
        {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.effective.role,
          status: data.effective.status,
          positionTitle: data.effective.positionTitle,
          dashboard: data.dashboard || account.dashboard,
          token: data.token,
        },
        data.token
      );
      redirect(data.dashboard || account.dashboard);
    }
  } catch (err: unknown) {
    // If redirect happens in Next.js, rethrow it
    if (err && typeof err === "object" && "digest" in err && typeof (err as { digest: string }).digest === "string" && (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
  }

  // Fallback direct demo session
  await setDemoUser({
    name: account.name,
    email: account.email,
    role: account.role,
    dashboard: account.dashboard,
  });

  redirect(account.dashboard);
}

export async function loginWithGuestDemo(): Promise<never> {
  return loginWithAccountById("guest");
}

export async function loginAction(
  prevState: LoginActionResult | null,
  formData: FormData
): Promise<LoginActionResult | never> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please enter both email address and password." };
  }

  try {
    // Attempt real authentication against backend
    const res = await fetch("http://localhost:4000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      await setDemoUser(
        {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.effective.role,
          status: data.effective.status,
          positionTitle: data.effective.positionTitle,
          dashboard: data.dashboard,
          token: data.token,
        },
        data.token
      );
      redirect(data.dashboard || "/");
    }

    const errorData = await res.json().catch(() => null);
    if (errorData?.error?.message) {
      return { error: errorData.error.message };
    }
  } catch (err: unknown) {
    if (err && typeof err === "object" && "digest" in err && typeof (err as { digest: string }).digest === "string" && (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
  }

  // Check demo credentials matching
  const matchingDemo = ALL_DEMO_ACCOUNTS.find(
    (a) => a.email.toLowerCase() === email && a.password === password
  );

  if (matchingDemo) {
    await setDemoUser({
      name: matchingDemo.name,
      email: matchingDemo.email,
      role: matchingDemo.role,
      dashboard: matchingDemo.dashboard,
    });
    redirect(matchingDemo.dashboard);
  }

  return {
    error: "Invalid email or password. Please use one of the demo credentials below or register an account.",
  };
}

export async function logoutAction(): Promise<never> {
  await clearDemoUser();
  redirect("/login?loggedOut=true");
}
