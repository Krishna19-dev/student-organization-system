// ─────────────────────────────────────────────────────────────────────────────
//  Session & Token Types (Client-Safe)
// ─────────────────────────────────────────────────────────────────────────────

export const SESSION_COOKIE_NAME = "clubmanage_session";
export const DEMO_COOKIE_NAME = "skyline_demo_user";

export type ClientMemberRole =
  | "PRESIDENT"
  | "TREASURER"
  | "VOLUNTEER"
  | "MEMBER"
  | "GUEST";

export interface SessionPayload {
  userId: string;
  memberId: string;
  name: string;
  email: string;
  role: ClientMemberRole;
}

