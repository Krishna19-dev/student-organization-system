import { setDemoUser, clearDemoUser } from "@/lib/auth-demo";
import { ALL_DEMO_ACCOUNTS, GUEST_DEMO_CREDENTIALS } from "@/lib/demo-credentials";

export interface AuthActionResult {
  success?: boolean;
  error?: string;
}

export async function loginWithAccountById(accountId: string): Promise<void> {
  const account = ALL_DEMO_ACCOUNTS.find((a) => a.id === accountId) || GUEST_DEMO_CREDENTIALS;
  const redirectParam = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("redirect") : null;
  const safeRedirect = redirectParam && redirectParam.startsWith("/") ? redirectParam : null;

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
      window.location.href = safeRedirect || data.dashboard || account.dashboard;
      return;
    }
  } catch {
    // Fallback direct demo session below
  }

  // Fallback direct demo session
  await setDemoUser({
    name: account.name,
    email: account.email,
    role: account.role,
    dashboard: account.dashboard,
  });

  window.location.href = safeRedirect || account.dashboard;
}

export async function loginWithGuestDemo(): Promise<void> {
  return loginWithAccountById("guest");
}

/**
 * Authenticates user via API or fallback demo credentials.
 */
export async function loginAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const redirectParam = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("redirect") : null;
  const safeRedirect = redirectParam && redirectParam.startsWith("/") ? redirectParam : null;

  if (!email || !password) {
    return {
      error: "Please enter both email/member ID and password.",
    };
  }

  try {
    // Attempt real authentication against backend API
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
      window.location.href = safeRedirect || data.dashboard || "/";
      return { success: true };
    }

    const errorData = await res.json().catch(() => null);
    if (errorData?.error?.message) {
      return { error: errorData.error.message };
    }
  } catch {
    // Backend unavailable, fallback to checking local demo accounts
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
    window.location.href = safeRedirect || matchingDemo.dashboard;
    return { success: true };
  }

  return {
    error: "Invalid email or password. Please use one of the demo credentials below or register an account.",
  };
}

/**
 * Public User Registration
 */
export async function signupAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const redirectParam = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("redirect") : null;
  const safeRedirect = redirectParam && redirectParam.startsWith("/") ? redirectParam : null;

  if (!name || !email || !password) {
    return { error: "Please fill in all required fields." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  if (confirmPassword && password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  try {
    const res = await fetch("http://localhost:4000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      await setDemoUser(
        {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: "MEMBER",
          dashboard: "/me",
          token: data.token,
        },
        data.token
      );
      window.location.href = safeRedirect || "/me?registered=true";
      return { success: true };
    }
  } catch {
    // Fallback to demo member session
  }

  await setDemoUser({
    name,
    email,
    role: "MEMBER",
    dashboard: "/me",
  });

  window.location.href = safeRedirect || "/me?registered=true";
  return { success: true };
}

/**
 * Logout action clearing session
 */
export async function logoutAction(): Promise<void> {
  await clearDemoUser();
  window.location.href = "/?loggedOut=true";
}
