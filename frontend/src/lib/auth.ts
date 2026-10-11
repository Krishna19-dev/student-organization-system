// ─────────────────────────────────────────────────────────────────────────────
//  Client Authentication & Authorization Types and Helpers
// ─────────────────────────────────────────────────────────────────────────────

import { ClientMemberRole } from "./session";
import { getDemoUserSync } from "./auth-demo";

export interface AuthUser {
  id: string;
  memberId?: string;
  name: string;
  email: string;
  role: ClientMemberRole;
}

/**
 * Resolves the currently authenticated user synchronously on the client.
 */
export function getCurrentUserSync(): AuthUser | null {
  const user = getDemoUserSync();
  if (!user) return null;
  return {
    id: user.id || "demo-user-id",
    memberId: user.id || "MBR-001",
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  return getCurrentUserSync();
}

