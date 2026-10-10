import { cookies } from "next/headers";
import { DemoUser, DEMO_COOKIE_NAME } from "./demo-credentials";

export async function getDemoUser(): Promise<DemoUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(DEMO_COOKIE_NAME);
  if (!sessionCookie?.value) {
    return null;
  }
  try {
    const user = JSON.parse(sessionCookie.value) as DemoUser;
    return user;
  } catch {
    return null;
  }
}

export async function setDemoUser(user: DemoUser): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(DEMO_COOKIE_NAME, JSON.stringify(user), {
    path: "/",
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  });
}

export async function clearDemoUser(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(DEMO_COOKIE_NAME);
}
