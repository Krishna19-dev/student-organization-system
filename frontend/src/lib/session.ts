// ─────────────────────────────────────────────────────────────────────────────
//  Session & Token Management via jose
//  Uses secure, HttpOnly cookies with HMAC-SHA256 signatures.
// ─────────────────────────────────────────────────────────────────────────────

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { MemberRole } from "@prisma/client";

export const SESSION_COOKIE_NAME = "clubmanage_session";
const SESSION_EXPIRY = "7d"; // 7 days

// Encode secret key for jose
function getSecretKey() {
  const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error(
      "SECURITY ERROR: Neither JWT_SECRET nor NEXTAUTH_SECRET is configured. Please provide a secure secret key in your .env file."
    );
  }
  return new TextEncoder().encode(secret);
}

export interface SessionPayload {
  userId: string;
  memberId: string;
  name: string;
  email: string;
  role: MemberRole;
}

/**
 * Signs and issues a secure JWT session token.
 */
export async function createSessionToken(payload: SessionPayload): Promise<string> {
  const secretKey = getSecretKey();
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_EXPIRY)
    .sign(secretKey);
}

/**
 * Verifies a JWT session token and returns the payload.
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const secretKey = getSecretKey();
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Sets a cryptographically secure HttpOnly session cookie.
 */
export async function setSessionCookie(payload: SessionPayload): Promise<void> {
  const token = await createSessionToken(payload);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  });
}

/**
 * Removes the session cookie on logout.
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  // Also clear legacy demo cookie if present
  cookieStore.delete("skyline_demo_user");
}
