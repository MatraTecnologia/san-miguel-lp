"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { createUser } from "../actions";

export default function AddUserDialog() {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<"customer" | "admin">("customer");
  const [pending, setPending] = useState(false);

  async function handleAction(formData: FormData) {
    formData.set("role", role);
    setPending(true);
    try {
      await createUser(formData);
      toast.success("Usuário criado com sucesso!");
      setOpen(false);
      setRole("customer");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erro ao criar usuário. Tente novamente.";
      toast.error(message);
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-caramelo hover:bg-caramelo-dark text-white gap-2">
          <Plus className="w-4 h-4" /> Adicionar usuário
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Usuário</DialogTitle>
        </DialogHeader>
        <form action={handleAction} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" name="name" required placeholder="Nome completo" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" required placeholder="email@exemplo.com" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" name="password" type="password" required placeholder="Mínimo 6 caracteres" minLength={6} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Perfil</Label>
            <Select value={role} onValueChange={(v) => setRole(v as "customer" | "admin")}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar perfil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Cliente</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            className="bg-caramelo hover:bg-caramelo-dark text-white"
            disabled={pending}
          >
            {pending ? "Criando..." : "Criar usuário"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
