"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { saveProduct } from "../actions";
import Image from "next/image";
import { X } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";

function toSlug(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

type Category = { id: string; name: string };
type ProductImage = { url: string };
type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: unknown;
  categoryId: string | null;
  active: boolean;
  featured: boolean;
  images: ProductImage[];
};

export default function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const [images, setImages] = useState<string[]>(product?.images.map((i) => i.url) ?? []);
  const [uploadUrl, setUploadUrl] = useState("");
  const [active, setActive] = useState(product?.active ?? true);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [name, setName] = useState(product?.name ?? "");

  const slug = product?.slug ?? toSlug(name);
  const folder = slug ? `san-miguel-lp/produtos/${slug}` : "san-miguel-lp/produtos";

  function addImage(url: string) {
    if (url) {
      setImages((prev) => [...prev, url]);
      setUploadUrl("");
    }
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <form action={saveProduct} className="flex flex-col gap-5 bg-card rounded-2xl border p-6">
      {product && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="active" value={String(active)} />
      <input type="hidden" name="featured" value={String(featured)} />
      {images.map((url) => (
        <input key={url} type="hidden" name="imageUrls" value={url} />
      ))}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nome do produto *</Label>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" name="description" defaultValue={product?.description ?? ""} rows={4} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="price">Preço (R$)</Label>
          <Input id="price" name="price" type="number" step="0.01" defaultValue={product?.price ? String(product.price) : ""} placeholder="0,00" />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Categoria</Label>
          <Select name="categoryId" defaultValue={product?.categoryId ?? ""}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar..." />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer text-sm">
          <input
            type="checkbox"
            className="w-4 h-4 rounded"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
          />
          Ativo
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-sm">
          <input
            type="checkbox"
            className="w-4 h-4 rounded"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          Destaque na loja
        </label>
      </div>

      <div className="flex flex-col gap-3">
        <Label>Imagens do produto</Label>

        <ImageUploader
          value={uploadUrl}
          onChange={(url) => { addImage(url); }}
          label=""
          folder={folder}
        />

        {images.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {images.map((url, i) => (
              <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border bg-muted group">
                <Image src={url} alt="" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                {i === 0 && (
                  <span className="absolute bottom-0 left-0 right-0 bg-caramelo/90 text-white text-[10px] text-center py-0.5">
                    Principal
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" className="bg-caramelo hover:bg-caramelo-dark text-white">
          {product ? "Salvar alterações" : "Criar produto"}
        </Button>
        <Button type="button" variant="outline" onClick={() => history.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
