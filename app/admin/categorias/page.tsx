import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { deleteCategory } from "./actions";
import AddCategoryDialog from "./_components/AddCategoryDialog";
import EditCategoryDialog from "./_components/EditCategoryDialog";

export default async function CategoriasPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-taupe tracking-widest uppercase font-medium mb-1">Gestão</p>
          <h1 className="font-display text-3xl font-semibold text-[#2a1f14]">Categorias</h1>
        </div>
        <AddCategoryDialog nextOrder={categories.length + 1} />
      </div>

      <div className="bg-white rounded-2xl border border-[#e8ddd0] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#faf7f2] hover:bg-[#faf7f2] border-b border-[#e8ddd0]">
              <TableHead className="w-16 text-xs font-semibold text-taupe uppercase tracking-wide">Imagem</TableHead>
              <TableHead className="text-xs font-semibold text-taupe uppercase tracking-wide">Nome</TableHead>
              <TableHead className="text-xs font-semibold text-taupe uppercase tracking-wide">Slug</TableHead>
              <TableHead className="text-xs font-semibold text-taupe uppercase tracking-wide">Produtos</TableHead>
              <TableHead className="text-xs font-semibold text-taupe uppercase tracking-wide">Ordem</TableHead>
              <TableHead className="text-right text-xs font-semibold text-taupe uppercase tracking-wide">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-16 text-muted-foreground text-sm">
                  Nenhuma categoria cadastrada ainda.
                </TableCell>
              </TableRow>
            )}
            {categories.map((cat) => (
              <TableRow key={cat.id} className="border-b border-[#f0e8da] hover:bg-[#fdf9f4]">
                <TableCell className="py-4">
                  {cat.image ? (
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#f0e8da] relative">
                      <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-[#f0e8da]" />
                  )}
                </TableCell>
                <TableCell className="font-semibold text-sm text-[#2a1f14]">{cat.name}</TableCell>
                <TableCell className="text-xs text-taupe font-mono bg-[#f5f0e8] px-2 py-0.5 rounded w-fit">{cat.slug}</TableCell>
                <TableCell>
                  <span className="text-xs font-semibold text-caramelo bg-caramelo/10 px-2 py-1 rounded-full">
                    {cat._count.products}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-taupe">{cat.order}</TableCell>
                <TableCell className="text-right py-4">
                  <div className="flex gap-1 justify-end">
                    <EditCategoryDialog category={cat} />
                    <form action={deleteCategory.bind(null, cat.id)}>
                      <Button
                        variant="ghost"
                        size="sm"
                        type="submit"
                        className="text-xs text-destructive hover:text-destructive hover:bg-destructive/5"
                        disabled={cat._count.products > 0}
                      >
                        Excluir
                      </Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
