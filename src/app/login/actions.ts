import { setDemoUser, clearDemoUser } from "@/lib/auth-demo";
import { ALL_DEMO_ACCOUNTS, GUEST_DEMO_CREDENTIALS } from "@/lib/demo-credentials";

export interface AuthActionResult {
  success?: boolean;
  error?: string;
}

export async function loginWithAccountById(accountId: string): Promise<void> {
  const account = ALL_DEMO_ACCOUNTS.find((a) => a.id === accountId) || GUEST_DEMO_CREDENTIALS;

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
      window.location.href = data.dashboard || account.dashboard;
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

  window.location.href = account.dashboard;
}

export async function loginWithGuestDemo(): Promise<void> {
  return loginWithAccountById("guest");
}

/**
 * Authenticates user via database or fallback demo credentials.
 */
export async function loginAction(
  prevState: AuthActionResult | null,
  formData: FormData
<<<<<<< HEAD
): Promise<LoginActionResult> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
=======
): Promise<AuthActionResult | never> {
  const rawIdentifier = formData.get("email") as string;
  const rawPassword = formData.get("password") as string;
>>>>>>> origin/main

  const parseResult = LoginSchema.safeParse({
    emailOrId: rawIdentifier,
    password: rawPassword,
  });

  if (!parseResult.success) {
    return {
      error: parseResult.error.issues[0]?.message || "Invalid credentials provided.",
    };
  }

<<<<<<< HEAD
  try {
    // Attempt real authentication against backend
    const res = await fetch("http://localhost:4000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
=======
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
>>>>>>> origin/main
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
      window.location.href = data.dashboard || "/";
      return { success: true };
    }

    const errorData = await res.json().catch(() => null);
    if (errorData?.error?.message) {
      return { error: errorData.error.message };
    }
  } catch {
    // Fallback to checking local demo credentials
  }

<<<<<<< HEAD
  // Check demo credentials matching
  const matchingDemo = ALL_DEMO_ACCOUNTS.find(
    (a) => a.email.toLowerCase() === email && a.password === password
  );

  if (matchingDemo) {
=======
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
>>>>>>> origin/main
    await setDemoUser({
      name: matchingDemo.name,
      email: matchingDemo.email,
      role: matchingDemo.role,
      dashboard: matchingDemo.dashboard,
    });
    window.location.href = matchingDemo.dashboard;
    return { success: true };
  }

<<<<<<< HEAD
  return {
    error: "Invalid email or password. Please use one of the demo credentials below or register an account.",
  };
}

export async function logoutAction(): Promise<void> {
  await clearDemoUser();
  window.location.href = "/login?loggedOut=true";
=======
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
>>>>>>> origin/main
}
