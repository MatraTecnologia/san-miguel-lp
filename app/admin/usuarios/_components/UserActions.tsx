"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { updateUserRole, deleteUser } from "../actions";
import { toast } from "sonner";

interface UserActionsProps {
  userId: string;
  currentRole: string;
  isCurrentUser: boolean;
}

export default function UserActions({ userId, currentRole, isCurrentUser }: UserActionsProps) {
  const [rolePending, startRoleTransition] = useTransition();
  const [deletePending, startDeleteTransition] = useTransition();

  const isAdmin = currentRole === "admin";

  function handleRoleToggle() {
    const newRole = isAdmin ? "customer" : "admin";
    startRoleTransition(async () => {
      try {
        await updateUserRole(userId, newRole);
        toast.success(
          newRole === "admin" ? "Usuário promovido a admin." : "Usuário definido como cliente."
        );
      } catch {
        toast.error("Erro ao alterar perfil. Tente novamente.");
      }
    });
  }

  function handleDelete() {
    if (!window.confirm("Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.")) return;
    startDeleteTransition(async () => {
      try {
        await deleteUser(userId);
        toast.success("Usuário excluído.");
      } catch {
        toast.error("Erro ao excluir usuário. Tente novamente.");
      }
    });
  }

  return (
    <div className="flex gap-1 justify-end">
      <Button
        variant="ghost"
        size="sm"
        className="text-xs text-[#2a1f14] hover:bg-[#f0e8da]"
        onClick={handleRoleToggle}
        disabled={rolePending || isCurrentUser}
      >
        {rolePending ? "..." : isAdmin ? "Tornar cliente" : "Tornar admin"}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="text-xs text-destructive hover:text-destructive hover:bg-destructive/5"
        onClick={handleDelete}
        disabled={deletePending || isCurrentUser}
      >
        {deletePending ? "..." : "Excluir"}
      </Button>
    </div>
  );
}
