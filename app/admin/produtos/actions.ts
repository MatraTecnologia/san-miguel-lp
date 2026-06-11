"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "@/lib/slugify";

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/produtos");
}

export async function saveProduct(formData: FormData) {
  const id = formData.get("id") as string | null;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;
  const categoryId = formData.get("categoryId") as string;
  const active = formData.get("active") === "true";
  const featured = formData.get("featured") === "true";
  const imageUrls = (formData.getAll("imageUrls") as string[]).filter(Boolean);

  const slug = slugify(name) + "-" + Date.now();

  const data = {
    name,
    description: description || null,
    price: price ? parseFloat(price) : null,
    categoryId: categoryId || null,
    active,
    featured,
  };

  if (id) {
    await prisma.product.update({ where: { id }, data });

    if (imageUrls.length > 0) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      await prisma.productImage.createMany({
        data: imageUrls.map((url, i) => ({
          url,
          productId: id,
          isPrimary: i === 0,
          order: i,
        })),
      });
    }
  } else {
    const product = await prisma.product.create({ data: { ...data, slug } });

    if (imageUrls.length > 0) {
      await prisma.productImage.createMany({
        data: imageUrls.map((url, i) => ({
          url,
          productId: product.id,
          isPrimary: i === 0,
          order: i,
        })),
      });
    }
  }

  revalidatePath("/admin/produtos");
  revalidatePath("/");
  redirect("/admin/produtos");
}
