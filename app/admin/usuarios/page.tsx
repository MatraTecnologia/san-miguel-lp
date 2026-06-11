import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import AddUserDialog from "./_components/AddUserDialog";
import UserActions from "./_components/UserActions";

export default async function UsuariosPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const currentUserId = session?.user?.id ?? "";

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-taupe tracking-widest uppercase font-medium mb-1">Gestão</p>
          <h1 className="font-display text-3xl font-semibold text-[#2a1f14]">Usuários</h1>
        </div>
        <AddUserDialog />
      </div>

      <div className="bg-white rounded-2xl border border-[#e8ddd0] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#faf7f2] hover:bg-[#faf7f2] border-b border-[#e8ddd0]">
              <TableHead className="w-12 text-xs font-semibold text-taupe uppercase tracking-wide">Avatar</TableHead>
              <TableHead className="text-xs font-semibold text-taupe uppercase tracking-wide">Nome</TableHead>
              <TableHead className="text-xs font-semibold text-taupe uppercase tracking-wide">E-mail</TableHead>
              <TableHead className="text-xs font-semibold text-taupe uppercase tracking-wide">Perfil</TableHead>
              <TableHead className="text-xs font-semibold text-taupe uppercase tracking-wide">Membro desde</TableHead>
              <TableHead className="text-right text-xs font-semibold text-taupe uppercase tracking-wide">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-16 text-muted-foreground text-sm">
                  Nenhum usuário cadastrado ainda.
                </TableCell>
              </TableRow>
            )}
            {users.map((user) => {
              const initial = user.name?.charAt(0).toUpperCase() ?? "?";
              const isAdmin = user.role === "admin";
              const isCurrentUser = user.id === currentUserId;

              return (
                <TableRow key={user.id} className="border-b border-[#f0e8da] hover:bg-[#fdf9f4]">
                  <TableCell className="py-4">
                    <div className="w-9 h-9 rounded-full bg-[#f0e8da] flex items-center justify-center text-sm font-semibold text-[#2a1f14]">
                      {initial}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-sm text-[#2a1f14]">
                    {user.name}
                    {isCurrentUser && (
                      <span className="ml-2 text-[10px] text-taupe font-normal">(você)</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-taupe">{user.email}</TableCell>
                  <TableCell>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        isAdmin
                          ? "bg-amber-100 text-amber-700"
                          : "bg-[#f0e8da] text-taupe"
                      }`}
                    >
                      {isAdmin ? "Admin" : "Cliente"}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-taupe">
                    {format(new Date(user.createdAt), "dd MMM yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell className="text-right py-4">
                    <UserActions
                      userId={user.id}
                      currentRole={user.role}
                      isCurrentUser={isCurrentUser}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
