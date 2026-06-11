import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import Link from "next/link";
import ProductsTable from "./_components/ProductsTable";

export default async function ProdutosPage() {
  const products = await prisma.product.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    include: {
      category: { select: { name: true } },
      images: { where: { isPrimary: true }, take: 1 },
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-[#3a2e22]">Produtos</h1>
        <Button asChild className="bg-caramelo hover:bg-caramelo-dark text-white gap-2">
          <Link href="/admin/produtos/novo">
            <Plus className="w-4 h-4" /> Novo Produto
          </Link>
        </Button>
      </div>

      <ProductsTable products={products} />
    </div>
  );
}
