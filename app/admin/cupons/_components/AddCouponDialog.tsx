"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { createCoupon } from "../actions";
import { toast } from "sonner";

export default function AddCouponDialog() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("percent");

  async function handleAction(formData: FormData) {
    formData.set("type", type);
    try {
      await createCoupon(formData);
      toast.success("Cupom criado!");
      setOpen(false);
    } catch {
      toast.error("Erro ao criar cupom.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-caramelo hover:bg-caramelo-dark text-white gap-2 rounded-xl">
          <Plus className="w-4 h-4" /> Novo Cupom
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar cupom</DialogTitle>
        </DialogHeader>
        <form action={handleAction} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <Label>Código</Label>
            <Input name="code" required placeholder="PROMO20" className="font-mono uppercase" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Descrição (opcional)</Label>
            <Input name="description" placeholder="Ex: Desconto inauguração" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Tipo</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="percent">Percentual (%)</SelectItem>
                  <SelectItem value="fixed">Valor fixo (R$)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>{type === "percent" ? "Desconto (%)" : "Desconto (R$)"}</Label>
              <Input name="discount" type="number" step="0.01" min="0" required placeholder={type === "percent" ? "10" : "50.00"} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Validade (opcional)</Label>
            <Input name="expiresAt" type="date" />
          </div>
          <Button type="submit" className="bg-caramelo hover:bg-caramelo-dark text-white">Criar cupom</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
