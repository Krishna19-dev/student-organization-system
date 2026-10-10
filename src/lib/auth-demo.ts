import { DemoUser, DEMO_COOKIE_NAME, AUTH_TOKEN_COOKIE } from "./demo-credentials";

export async function getDemoUser(): Promise<DemoUser | null> {
  if (typeof window === "undefined") return null;
  const session = localStorage.getItem(DEMO_COOKIE_NAME);
  if (session) {
    try {
      return JSON.parse(session) as DemoUser;
    } catch {}
  }
  const cookies = document.cookie.split("; ");
  const sessionCookie = cookies.find((c) => c.startsWith(`${DEMO_COOKIE_NAME}=`));
  if (!sessionCookie) return null;
  try {
    const val = sessionCookie.split("=").slice(1).join("=");
    return JSON.parse(decodeURIComponent(val)) as DemoUser;
  } catch {
    return null;
  }
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
}

export async function clearDemoUser(): Promise<void> {
  if (typeof window === "undefined") return;
  localStorage.removeItem(DEMO_COOKIE_NAME);
  localStorage.removeItem(AUTH_TOKEN_COOKIE);
  document.cookie = `${DEMO_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
  document.cookie = `${AUTH_TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}
