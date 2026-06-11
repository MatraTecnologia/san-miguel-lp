import { prisma } from "@/lib/prisma";
import ProductForm from "../_components/ProductForm";

export default async function NovoProdutoPage() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-[#3a2e22]">Novo Produto</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
