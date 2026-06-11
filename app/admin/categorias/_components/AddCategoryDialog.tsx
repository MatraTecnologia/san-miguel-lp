"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { saveCategory } from "../actions";
import ImageUploader from "@/components/ImageUploader";

function toSlug(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AddCategoryDialog({ nextOrder }: { nextOrder: number }) {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState("");
  const [name, setName] = useState("");

  async function handleAction(formData: FormData) {
    formData.set("image", image);
    await saveCategory(formData);
    setOpen(false);
    setImage("");
    setName("");
  }

  const slug = toSlug(name);
  const folder = slug ? `san-miguel-lp/categorias/${slug}` : "san-miguel-lp/categorias";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-caramelo hover:bg-caramelo-dark text-white gap-2">
          <Plus className="w-4 h-4" /> Nova Categoria
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Categoria</DialogTitle>
        </DialogHeader>
        <form action={handleAction} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <Label>Nome</Label>
            <Input
              name="name"
              required
              placeholder="Ex: Sofás"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <ImageUploader value={image} onChange={setImage} label="Imagem da Categoria" folder={folder} />
          <div className="flex flex-col gap-1.5">
            <Label>Ordem de exibição</Label>
            <Input name="order" type="number" defaultValue={nextOrder} />
          </div>
          <Button type="submit" className="bg-caramelo hover:bg-caramelo-dark text-white">
            Criar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
