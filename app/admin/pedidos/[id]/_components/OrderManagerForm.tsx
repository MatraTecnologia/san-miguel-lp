"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateOrder } from "../actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const STATUSES = [
  { value: "pending",    label: "Aguardando confirmação" },
  { value: "confirmed",  label: "Confirmado" },
  { value: "delivering", label: "Em entrega" },
  { value: "delivered",  label: "Entregue" },
  { value: "cancelled",  label: "Cancelado" },
];

interface Props {
  order: { id: string; status: string; notes: string; deliveryAt: string; warrantyAt: string };
}

export default function OrderManagerForm({ order }: Props) {
  const [status, setStatus] = useState(order.status);
  const [notes, setNotes] = useState(order.notes);
  const [deliveryAt, setDeliveryAt] = useState(order.deliveryAt);
  const [warrantyAt, setWarrantyAt] = useState(order.warrantyAt);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await updateOrder({ id: order.id, status, notes, deliveryAt: deliveryAt || null, warrantyAt: warrantyAt || null });
      toast.success("Pedido atualizado!");
    } catch {
      toast.error("Erro ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-[#e8ddd0] p-6 flex flex-col gap-5">
      <h2 className="font-display text-base font-semibold text-[#2a1f14]">Gerenciar pedido</h2>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-medium text-[#5a4a3a]">Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="border-[#ddd4c5]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-medium text-[#5a4a3a]">Previsão de entrega</Label>
          <Input
            type="date"
            value={deliveryAt}
            onChange={(e) => setDeliveryAt(e.target.value)}
            className="border-[#ddd4c5]"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-medium text-[#5a4a3a]">Garantia até</Label>
          <Input
            type="date"
            value={warrantyAt}
            onChange={(e) => setWarrantyAt(e.target.value)}
            className="border-[#ddd4c5]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-medium text-[#5a4a3a]">Observações internas</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Notas sobre o pedido, acordos feitos, etc."
          className="border-[#ddd4c5] resize-none"
        />
      </div>

      <Button
        onClick={handleSave}
        disabled={saving}
        className="bg-caramelo hover:bg-caramelo-dark text-white self-start"
      >
        {saving ? "Salvando..." : "Salvar alterações"}
      </Button>
    </div>
  );
}
