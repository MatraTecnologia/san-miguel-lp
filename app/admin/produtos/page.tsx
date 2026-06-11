import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import Link from "next/link";
import ProductsTable from "./_components/ProductsTable";

export default async function ProdutosPage() {
  const raw = await prisma.product.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    include: {
      category: { select: { name: true } },
      images: { where: { isPrimary: true }, take: 1 },
    },
  });

  const products = raw.map((p) => ({
    ...p,
    price: p.price ? p.price.toNumber() : null,
  }));

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-taupe tracking-widest uppercase font-medium mb-1">Catálogo</p>
          <h1 className="font-display text-3xl font-semibold text-[#2a1f14]">Produtos</h1>
        </div>
        <Button asChild className="bg-caramelo hover:bg-caramelo-dark text-white gap-2 rounded-xl">
          <Link href="/admin/produtos/novo">
            <Plus className="w-4 h-4" /> Novo Produto
          </Link>
        </Button>
      </div>

      <ProductsTable products={products} />
    </div>
  );
}
