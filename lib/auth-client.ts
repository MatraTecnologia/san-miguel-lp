"use client";
import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL: BASE,
  plugins: [emailOTPClient()],
});

export const { signIn, signOut, signUp, emailOtp } = authClient;
// useSession must be called as authClient.useSession() in components (better-auth/react hook)

/** Workaround: Better Auth 1.6.16 client calls /email-otp/sign-in but server registers /sign-in/email-otp */
export async function signInWithOtp(email: string, otp: string) {
  const res = await fetch(`${BASE}/api/auth/sign-in/email-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, otp }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return { error: data };
  return { data };
}
