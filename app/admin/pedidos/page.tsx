import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Clock, CheckCircle2, Truck, Package, XCircle } from "lucide-react";

const STATUS: Record<string, { label: string; icon: typeof Clock; color: string }> = {
  pending:    { label: "Aguardando", icon: Clock,        color: "text-[#8a7a52] bg-[#fdf7ed]" },
  confirmed:  { label: "Confirmado", icon: CheckCircle2, color: "text-[#5a8a52] bg-[#edf7eb]" },
  delivering: { label: "Em entrega", icon: Truck,        color: "text-[#4a7aa8] bg-[#edf3fb]" },
  delivered:  { label: "Entregue",   icon: Package,      color: "text-[#5a8a52] bg-[#edf7eb]" },
  cancelled:  { label: "Cancelado",  icon: XCircle,      color: "text-destructive bg-destructive/10" },
};

export default async function AdminPedidosPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
    },
  });

  // Get user names
  const userIds = [...new Set(orders.map((o) => o.userId))];
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, email: true },
  });
  const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    delivering: orders.filter((o) => o.status === "delivering").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      <div>
        <p className="text-xs text-taupe tracking-widest uppercase font-medium mb-1">Gestão</p>
        <h1 className="font-display text-3xl font-semibold text-[#2a1f14]">Pedidos</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total", value: stats.total, color: "text-caramelo bg-caramelo/10" },
          { label: "Aguardando", value: stats.pending, color: "text-[#8a7a52] bg-[#fdf7ed]" },
          { label: "Em entrega", value: stats.delivering, color: "text-[#4a7aa8] bg-[#edf3fb]" },
          { label: "Entregues", value: stats.delivered, color: "text-[#5a8a52] bg-[#edf7eb]" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#e8ddd0] p-4 flex flex-col gap-2">
            <span className={`text-xs font-semibold px-2 py-1 rounded-full self-start ${s.color}`}>{s.label}</span>
            <span className="font-display text-3xl font-bold text-[#2a1f14]">{s.value}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#e8ddd0] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#faf7f2] border-b border-[#e8ddd0]">
              {["Pedido", "Cliente", "Itens", "Total", "Status", "Data", ""].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-taupe uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-16 text-sm text-muted-foreground">
                  Nenhum pedido ainda.
                </td>
              </tr>
            )}
            {orders.map((order) => {
              const s = STATUS[order.status] ?? STATUS.pending;
              const Icon = s.icon;
              const user = userMap[order.userId];
              return (
                <tr key={order.id} className="border-b border-[#f0e8da] hover:bg-[#fdf9f4]">
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs font-bold text-[#2a1f14]">
                      #{order.id.slice(-6).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-sm font-medium text-[#2a1f14]">{user?.name ?? "—"}</p>
                      <p className="text-xs text-taupe">{user?.email ?? "—"}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-taupe">{order.items.length}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-[#2a1f14]">
                    {order.totalPrice
                      ? `R$ ${Number(order.totalPrice).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                      : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${s.color}`}>
                      <Icon className="w-3 h-3" />
                      {s.label}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-taupe whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/pedidos/${order.id}`}
                      className="text-xs text-caramelo hover:underline font-medium"
                    >
                      Gerenciar
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
