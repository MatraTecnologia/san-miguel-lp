"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const KEYS = ["whatsapp", "instagram", "address", "hours", "whatsapp_message", "hero_image"];

export async function saveConfigs(formData: FormData) {
  for (const key of KEYS) {
    const value = formData.get(key) as string;
    await prisma.storeConfig.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
  revalidatePath("/");
  revalidatePath("/admin/configuracoes");
}
