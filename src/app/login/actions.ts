"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { setSessionCookie, clearSessionCookie } from "@/lib/session";
import { LoginSchema, SignupSchema } from "@/lib/validations/auth";
import { MemberRole, MemberTier, MemberStatus } from "@prisma/client";
import { GUEST_DEMO_CREDENTIALS, ADMIN_DEMO_CREDENTIALS } from "@/lib/demo-credentials";
import { setDemoUser } from "@/lib/auth-demo";

export interface AuthActionResult {
  success?: boolean;
  error?: string;
}

/**
 * Normalizes email address.
 */
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Authenticates user via database or fallback demo credentials.
 */
export async function loginAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult | never> {
  const rawIdentifier = formData.get("email") as string;
  const rawPassword = formData.get("password") as string;

  const parseResult = LoginSchema.safeParse({
    emailOrId: rawIdentifier,
    password: rawPassword,
  });

  if (!parseResult.success) {
    return {
      error: parseResult.error.issues[0]?.message || "Invalid credentials provided.",
    };
  }

  const { emailOrId, password } = parseResult.data;
  const normalizedInput = emailOrId.toLowerCase();

  // 1. Check database first (if DB is reachable)
  try {
    const member = await prisma.member.findFirst({
      where: {
        OR: [
          { email: normalizedInput },
          { memberId: { equals: emailOrId.trim(), mode: "insensitive" } },
        ],
      },
    });

    if (member && member.passwordHash) {
      const isValid = await bcrypt.compare(password, member.passwordHash);
      if (isValid) {
        await setSessionCookie({
          userId: member.id,
          memberId: member.memberId,
          name: member.name,
          email: member.email,
          role: member.role,
        });

        if (member.role === MemberRole.ADMIN) {
          redirect("/admin");
        } else {
          redirect("/profile");
        }
      }
    }
  } catch (dbError) {
    console.warn("Database lookup bypassed or unreachable, falling back to demo check:", dbError);
  }

  // 2. Demo Admin Account Fallback (supports email or Member ID)
  if (
    (normalizedInput === normalizeEmail(ADMIN_DEMO_CREDENTIALS.email) ||
      emailOrId.trim().toUpperCase() === "SKY-ADM-0001") &&
    password === ADMIN_DEMO_CREDENTIALS.password
  ) {
    await setSessionCookie({
      userId: "demo-admin-id",
      memberId: "SKY-ADM-0001",
      name: ADMIN_DEMO_CREDENTIALS.name,
      email: ADMIN_DEMO_CREDENTIALS.email,
      role: MemberRole.ADMIN,
    });
    await setDemoUser({
      name: ADMIN_DEMO_CREDENTIALS.name,
      email: ADMIN_DEMO_CREDENTIALS.email,
      role: ADMIN_DEMO_CREDENTIALS.role,
    });
    redirect("/admin");
  }

  // 3. Demo Guest Account Fallback (supports email or Member ID)
  if (
    (normalizedInput === normalizeEmail(GUEST_DEMO_CREDENTIALS.email) ||
      emailOrId.trim().toUpperCase() === "SKY-2026-DEMO") &&
    password === GUEST_DEMO_CREDENTIALS.password
  ) {
    await setSessionCookie({
      userId: "demo-guest-id",
      memberId: "SKY-2026-DEMO",
      name: GUEST_DEMO_CREDENTIALS.name,
      email: GUEST_DEMO_CREDENTIALS.email,
      role: MemberRole.GUEST,
    });
    await setDemoUser({
      name: GUEST_DEMO_CREDENTIALS.name,
      email: GUEST_DEMO_CREDENTIALS.email,
      role: GUEST_DEMO_CREDENTIALS.role,
    });
    redirect("/?signedIn=guest");
  }

  // Generic security error — does not leak email or ID existence
  return {
    error: "Invalid email, Member ID or password. Please verify your credentials.",
  };
}

/**
 * Public User Registration
 * Enforces rule: All public signups receive MEMBER role only.
 */
export async function signupAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult | never> {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const parseResult = SignupSchema.safeParse(rawData);

  if (!parseResult.success) {
    return {
      error: parseResult.error.issues[0]?.message || "Please fill all required fields correctly.",
    };
  }

  const { name, email, password } = parseResult.data;

  try {
    // Check if email already registered
    const existing = await prisma.member.findUnique({
      where: { email },
    });

    if (existing) {
      return {
        error: "An account with this email address already exists. Please sign in instead.",
      };
    }

    // Secure password hashing
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Generate human-friendly Member ID
    const memberCount = await prisma.member.count();
    const formattedId = `SKY-${String(memberCount + 1).padStart(3, "0")}`;

    // Create user strictly with MEMBER role
    const newMember = await prisma.member.create({
      data: {
        memberId: formattedId,
        name,
        email,
        passwordHash,
        role: MemberRole.MEMBER,
        tier: MemberTier.BASIC,
        status: MemberStatus.ACTIVE,
        duePaidRs: 0,
      },
    });

    // Establish authenticated session
    await setSessionCookie({
      userId: newMember.id,
      memberId: newMember.memberId,
      name: newMember.name,
      email: newMember.email,
      role: newMember.role,
    });

    redirect("/profile?registered=true");
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Signup error:", error);
    return {
      error: "Unable to complete registration. If database is offline, please use quick demo logins.",
    };
  }
}

/**
 * Logout action clearing session cookies
 */
export async function logoutAction(): Promise<never> {
  await clearSessionCookie();
  redirect("/login?loggedOut=true");
}
