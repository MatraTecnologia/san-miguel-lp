import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "mysql" }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      // TODO: integrar com serviço de email (ex: Resend, Nodemailer)
      console.log(`[reset-password] Link para ${user.email}: ${url}`);
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        // TODO: integrar com serviço de email (ex: Resend, Nodemailer)
        console.log(`[email-otp] OTP para ${email} (${type}): ${otp}`);
      },
      otpLength: 6,
      expiresIn: 300, // 5 minutos
    }),
  ],
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"],
});

export type Session = typeof auth.$Infer.Session;
