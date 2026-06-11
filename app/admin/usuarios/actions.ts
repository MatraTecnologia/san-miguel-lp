"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

// Better-auth uses scrypt internally. Since we're inserting directly, we use
// Node crypto's scrypt to produce a compatible hash string.
// Format better-auth expects: "$scrypt$N=16384,r=8,p=1$<salt>$<hash>" (base64)
async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("base64url");
  const hash = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, 64, { N: 16384, r: 8, p: 1 }, (err, key) => {
      if (err) reject(err);
      else resolve(key);
    });
  });
  return `$scrypt$N=16384,r=8,p=1$${salt}$${hash.toString("base64url")}`;
}

export async function createUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = (formData.get("role") as string) || "customer";

  if (!name || !email || !password) {
    throw new Error("Preencha todos os campos obrigatórios.");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("Já existe um usuário com este e-mail.");
  }

  const hashedPassword = await hashPassword(password);
  const userId = crypto.randomUUID();

  await prisma.user.create({
    data: {
      id: userId,
      name,
      email,
      emailVerified: true,
      role,
      accounts: {
        create: {
          id: crypto.randomUUID(),
          accountId: email,
          providerId: "credential",
          password: hashedPassword,
        },
      },
    },
  });

  revalidatePath("/admin/usuarios");
}

export async function updateUserRole(userId: string, role: "admin" | "customer") {
  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });
  revalidatePath("/admin/usuarios");
}

export async function deleteUser(userId: string) {
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/usuarios");
}
