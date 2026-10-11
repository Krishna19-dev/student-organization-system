import { DemoUser, DEMO_COOKIE_NAME, AUTH_TOKEN_COOKIE } from "./demo-credentials";

export const AUTH_STATE_EVENT = "skyline_auth_changed";

/**
 * Synchronously reads the current authenticated user from localStorage or document.cookie.
 */
export function getDemoUserSync(): DemoUser | null {
  if (typeof window === "undefined") return null;
  const session = localStorage.getItem(DEMO_COOKIE_NAME);
  if (session) {
    try {
      const parsed = JSON.parse(session) as DemoUser;
      if (parsed && parsed.email) return parsed;
    } catch {}
  }
  const cookies = document.cookie.split("; ");
  const sessionCookie = cookies.find((c) => c.startsWith(`${DEMO_COOKIE_NAME}=`));
  if (!sessionCookie) return null;
  try {
    const val = sessionCookie.split("=").slice(1).join("=");
    const parsed = JSON.parse(decodeURIComponent(val)) as DemoUser;
    if (parsed && parsed.email) return parsed;
    return null;
  } catch {
    return null;
  }
}

export async function getDemoUser(): Promise<DemoUser | null> {
  return getDemoUserSync();
}

export async function getAuthToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(AUTH_TOKEN_COOKIE);
  if (token) return token;
  const cookies = document.cookie.split("; ");
  const tokenCookie = cookies.find((c) => c.startsWith(`${AUTH_TOKEN_COOKIE}=`));
  return tokenCookie ? tokenCookie.split("=")[1] : null;
}

export async function setDemoUser(user: DemoUser, token?: string): Promise<void> {
  if (typeof window === "undefined") return;
  const json = JSON.stringify(user);
  localStorage.setItem(DEMO_COOKIE_NAME, json);
  document.cookie = `${DEMO_COOKIE_NAME}=${encodeURIComponent(json)}; path=/; SameSite=Lax`;
  if (token) {
    localStorage.setItem(AUTH_TOKEN_COOKIE, token);
    document.cookie = `${AUTH_TOKEN_COOKIE}=${token}; path=/; max-age=604800; SameSite=Lax`;
  }
  window.dispatchEvent(new Event(AUTH_STATE_EVENT));
  window.dispatchEvent(new StorageEvent("storage", { key: DEMO_COOKIE_NAME }));
}

export const LOCAL_MOCK_KEYS = [
  DEMO_COOKIE_NAME,
  AUTH_TOKEN_COOKIE,
  "skyline_members",
  "pending_membership",
  "user_tickets",
  "user_orders",
];

export async function clearDemoUser(): Promise<void> {
  if (typeof window === "undefined") return;
  for (const k of LOCAL_MOCK_KEYS) {
    try {
      localStorage.removeItem(k);
    } catch {}
  }
  document.cookie = `${DEMO_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; SameSite=Lax`;
  document.cookie = `${AUTH_TOKEN_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; SameSite=Lax`;
  window.dispatchEvent(new Event(AUTH_STATE_EVENT));
  window.dispatchEvent(new StorageEvent("storage", { key: DEMO_COOKIE_NAME }));
}

export function clearAllLocalData(): void {
  clearDemoUser();
}

