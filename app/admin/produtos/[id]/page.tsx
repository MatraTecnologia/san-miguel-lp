import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductForm from "../_components/ProductForm";

export default async function EditarProdutoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { order: "asc" } } },
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-[#3a2e22]">Editar Produto</h1>
      <ProductForm categories={categories} product={product} />
    </div>
  );
}
