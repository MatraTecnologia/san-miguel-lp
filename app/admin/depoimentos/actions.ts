"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function approveTestimonial(id: string) {
  await prisma.testimonial.update({ where: { id }, data: { approved: true } });
  revalidatePath("/admin/depoimentos");
  revalidatePath("/");
}

export async function deleteTestimonial(id: string) {
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/admin/depoimentos");
  revalidatePath("/");
}

export async function createTestimonial(formData: FormData) {
  const name = formData.get("name") as string;
  const text = formData.get("text") as string;
  const stars = parseInt(formData.get("stars") as string) || 5;

  await prisma.testimonial.create({ data: { name, text, stars, approved: true } });
  revalidatePath("/admin/depoimentos");
  revalidatePath("/");
}
