"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { saveCategory } from "../actions";
import ImageUploader from "@/components/ImageUploader";

type Category = { id: string; name: string; slug: string; image: string | null; order: number };

export default function EditCategoryDialog({ category }: { category: Category }) {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(category.image ?? "");

  async function handleAction(formData: FormData) {
    formData.set("image", image);
    await saveCategory(formData);
    setOpen(false);
  }

  const folder = `san-miguel-lp/categorias/${category.slug}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Pencil className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Categoria</DialogTitle>
        </DialogHeader>
        <form action={handleAction} className="flex flex-col gap-4 mt-2">
          <input type="hidden" name="id" value={category.id} />
          <input type="hidden" name="slug" value={category.slug} />
          <div className="flex flex-col gap-1.5">
            <Label>Nome</Label>
            <Input name="name" defaultValue={category.name} required />
          </div>
          <ImageUploader value={image} onChange={setImage} label="Imagem da Categoria" folder={folder} />
          <div className="flex flex-col gap-1.5">
            <Label>Ordem de exibição</Label>
            <Input name="order" type="number" defaultValue={category.order} />
          </div>
          <Button type="submit" className="bg-caramelo hover:bg-caramelo-dark text-white">
            Salvar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
