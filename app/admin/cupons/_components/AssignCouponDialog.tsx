"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { assignCoupon } from "../actions";
import { toast } from "sonner";

interface User { id: string; name: string; email: string }

interface Props {
  couponId: string;
  couponCode: string;
  users: User[];
}

export default function AssignCouponDialog({ couponId, couponCode, users }: Props) {
  const [open, setOpen] = useState(false);

  async function handleAssign(userId: string) {
    try {
      await assignCoupon(couponId, userId);
      toast.success("Cupom atribuído!");
    } catch {
      toast.error("Erro ao atribuir cupom.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-xs text-taupe hover:text-caramelo gap-1.5">
          <Users className="w-3.5 h-3.5" /> Atribuir
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atribuir cupom <span className="text-caramelo font-mono">{couponCode}</span></DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 mt-2 max-h-72 overflow-y-auto">
          {users.length === 0 && (
            <p className="text-sm text-muted-foreground py-4 text-center">Nenhum cliente cadastrado ainda.</p>
          )}
          {users.map((u) => (
            <div key={u.id} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-[#fdf9f4] border border-transparent hover:border-[#e8ddd0]">
              <div>
                <p className="text-sm font-medium text-[#2a1f14]">{u.name}</p>
                <p className="text-xs text-taupe">{u.email}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="text-xs border-[#ddd4c5] hover:border-caramelo hover:text-caramelo"
                onClick={() => handleAssign(u.id)}
              >
                Atribuir
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
