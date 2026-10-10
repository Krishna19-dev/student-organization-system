// ─────────────────────────────────────────────────────────────────────────────
//  Server-side Authentication & Authorization Utilities
//  Role-based Access Control (RBAC) and user resolution.
// ─────────────────────────────────────────────────────────────────────────────

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MemberRole } from "@prisma/client";
import { SESSION_COOKIE_NAME, verifySessionToken } from "./session";
import { getDemoUser } from "./auth-demo";

export interface AuthUser {
  id: string;
  memberId: string;
  name: string;
  email: string;
  role: MemberRole;
}

/**
 * Resolves the currently authenticated user from either the new secure JWT session
 * or the fallback demo cookie (for backwards compatibility with demo flows).
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (sessionCookie?.value) {
    const payload = await verifySessionToken(sessionCookie.value);
    if (payload) {
      return {
        id: payload.userId,
        memberId: payload.memberId,
        name: payload.name,
        email: payload.email,
        role: payload.role,
      };
    }
  }

  // Fallback to legacy demo cookie if present
  const demoUser = await getDemoUser();
  if (demoUser) {
    return {
      id: "demo-user-id",
      memberId: demoUser.role === "ADMIN" ? "SKY-ADM-0001" : "SKY-2026-DEMO",
      name: demoUser.name,
      email: demoUser.email,
      role: demoUser.role as MemberRole,
    };
  }

  return null;
}

/**
 * Requires an authenticated user. Redirects to /login if unauthenticated.
 */
export async function requireAuth(redirectTo: string = "/login"): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(redirectTo);
  }
  return user;
}

/**
 * Requires one of the specified roles. Redirects to /login or throws an error.
 */
export async function requireRole(allowedRoles: MemberRole[], redirectTo: string = "/login"): Promise<AuthUser> {
  const user = await requireAuth(redirectTo);
  if (!allowedRoles.includes(user.role)) {
    redirect(redirectTo);
  }
  return user;
}

/**
 * Validates ownership of a resource or admin privileges.
 */
export async function requireOwnershipOrAdmin(ownerId: string, redirectTo: string = "/"): Promise<AuthUser> {
  const user = await requireAuth();
  if (user.role === MemberRole.ADMIN || user.id === ownerId || user.memberId === ownerId) {
    return user;
  }
  redirect(redirectTo);
}
