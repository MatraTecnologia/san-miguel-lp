"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfilePhoto(userId: string, imageUrl: string) {
  await prisma.user.update({ where: { id: userId }, data: { image: imageUrl } });
  revalidatePath("/conta");
}
