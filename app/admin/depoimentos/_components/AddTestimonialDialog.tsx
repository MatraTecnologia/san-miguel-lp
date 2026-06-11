"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { createTestimonial } from "../actions";

export default function AddTestimonialDialog() {
  const [open, setOpen] = useState(false);

  async function handleAction(formData: FormData) {
    await createTestimonial(formData);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-caramelo hover:bg-caramelo-dark text-white gap-2">
          <Plus className="w-4 h-4" /> Adicionar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Depoimento</DialogTitle>
        </DialogHeader>
        <form action={handleAction} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Nome do cliente</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="text">Depoimento</Label>
            <Textarea id="text" name="text" rows={4} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="stars">Estrelas (1–5)</Label>
            <Input id="stars" name="stars" type="number" min={1} max={5} defaultValue={5} />
          </div>
          <Button type="submit" className="bg-caramelo hover:bg-caramelo-dark text-white">
            Salvar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
