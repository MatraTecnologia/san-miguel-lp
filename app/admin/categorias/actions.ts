"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import slugify from "@/lib/slugify";

export async function deleteCategory(id: string) {
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categorias");
  revalidatePath("/");
}

export async function saveCategory(formData: FormData) {
  const id = formData.get("id") as string | null;
  const name = formData.get("name") as string;
  const image = formData.get("image") as string;
  const order = parseInt(formData.get("order") as string) || 0;
  const slug = id
    ? (formData.get("slug") as string)
    : slugify(name);

  if (id) {
    await prisma.category.update({
      where: { id },
      data: { name, image: image || null, order },
    });
  } else {
    await prisma.category.create({
      data: { name, slug, image: image || null, order },
    });
  }

  revalidatePath("/admin/categorias");
  revalidatePath("/");
}
