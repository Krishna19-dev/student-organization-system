"use server";

import { redirect } from "next/navigation";
import { setDemoUser, clearDemoUser } from "@/lib/auth-demo";
import { GUEST_DEMO_CREDENTIALS } from "@/lib/demo-credentials";

export interface LoginActionResult {
  success?: boolean;
  error?: string;
}

export async function loginWithGuestDemo(): Promise<never> {
  await setDemoUser({
    name: GUEST_DEMO_CREDENTIALS.name,
    email: GUEST_DEMO_CREDENTIALS.email,
    role: GUEST_DEMO_CREDENTIALS.role,
  });

  redirect("/?signedIn=guest");
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

  // Check against Guest Demo Credentials
  if (
    email === GUEST_DEMO_CREDENTIALS.email &&
    password === GUEST_DEMO_CREDENTIALS.password
  ) {
    await setDemoUser({
      name: GUEST_DEMO_CREDENTIALS.name,
      email: GUEST_DEMO_CREDENTIALS.email,
      role: GUEST_DEMO_CREDENTIALS.role,
    });
    redirect("/?signedIn=guest");
  }

  // If credentials don't match the guest demo
  return {
    error: `Invalid credentials. Please use the Guest Demo Account: email "${GUEST_DEMO_CREDENTIALS.email}" and password "${GUEST_DEMO_CREDENTIALS.password}".`,
  };
}

export async function logoutAction(): Promise<never> {
  await clearDemoUser();
  redirect("/login?loggedOut=true");
}
