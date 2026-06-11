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
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-[#3a2e22]">Categorias</h1>
        <AddCategoryDialog nextOrder={categories.length + 1} />
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Imagem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Produtos</TableHead>
              <TableHead>Ordem</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-sm">
                  Nenhuma categoria cadastrada.
                </TableCell>
              </TableRow>
            )}
            {categories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell>
                  {cat.image ? (
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted relative">
                      <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-muted" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{cat.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm font-mono">{cat.slug}</TableCell>
                <TableCell className="text-sm">{cat._count.products}</TableCell>
                <TableCell className="text-sm">{cat.order}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <EditCategoryDialog category={cat} />
                    <form action={deleteCategory.bind(null, cat.id)}>
                      <Button variant="ghost" size="sm" type="submit" className="text-destructive hover:text-destructive"
                        disabled={cat._count.products > 0}>
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
