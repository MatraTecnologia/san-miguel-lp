"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCoupon(formData: FormData) {
  const code = (formData.get("code") as string).toUpperCase().trim();
  const description = formData.get("description") as string;
  const discount = parseFloat(formData.get("discount") as string);
  const type = formData.get("type") as string;
  const expiresAt = formData.get("expiresAt") as string;

  await prisma.coupon.create({
    data: {
      code,
      description: description || null,
      discount,
      type,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });
  revalidatePath("/admin/cupons");
}

export async function deleteCoupon(id: string) {
  await prisma.coupon.delete({ where: { id } });
  revalidatePath("/admin/cupons");
}

export async function assignCoupon(couponId: string, userId: string) {
  await prisma.couponAssignment.upsert({
    where: { couponId_userId: { couponId, userId } },
    update: {},
    create: { couponId, userId },
  });
  revalidatePath("/admin/cupons");
}
