"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { deleteProduct } from "../actions";

type Product = {
  id: string;
  name: string;
  active: boolean;
  featured: boolean;
  price: unknown;
  category: { name: string } | null;
  images: { url: string }[];
};

export default function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Excluir este produto?")) return;
    setDeleting(id);
    await deleteProduct(id);
    router.refresh();
    setDeleting(null);
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground text-sm">
        Nenhum produto cadastrado ainda.
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Foto</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                {p.images[0] ? (
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted relative">
                    <Image src={p.images[0].url} alt={p.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-muted" />
                )}
              </TableCell>
              <TableCell className="font-medium">{p.name}</TableCell>
              <TableCell className="text-muted-foreground text-sm">{p.category?.name ?? "—"}</TableCell>
              <TableCell className="text-sm">
                {p.price ? `R$ ${Number(p.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "—"}
              </TableCell>
              <TableCell>
                <div className="flex gap-1.5">
                  <Badge variant={p.active ? "default" : "secondary"}>
                    {p.active ? "Ativo" : "Inativo"}
                  </Badge>
                  {p.featured && <Badge variant="outline">Destaque</Badge>}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/produtos/${p.id}`}>
                      <Pencil className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    disabled={deleting === p.id}
                    onClick={() => handleDelete(p.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
