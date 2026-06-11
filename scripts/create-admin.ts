/**
 * Cria o primeiro usuário admin.
 * Uso: npx tsx scripts/create-admin.ts
 */
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "mysql" }),
  emailAndPassword: { enabled: true },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
});

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@saomiguel.com";
  const password = process.env.ADMIN_PASSWORD ?? "trocar123";
  const name = "Admin";

  const result = await auth.api.signUpEmail({
    body: { email, password, name },
  });

  console.log("Admin criado:", result);
}

main().catch(console.error);
