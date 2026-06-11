import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle2, Truck, Package, XCircle, ChevronRight, ShoppingBag } from "lucide-react";

const STATUS_LABEL: Record<string, { label: string; icon: typeof Clock; color: string }> = {
  pending:    { label: "Aguardando", icon: Clock,        color: "text-[#8a7a52] bg-[#fdf7ed]" },
  confirmed:  { label: "Confirmado", icon: CheckCircle2, color: "text-[#5a8a52] bg-[#edf7eb]" },
  delivering: { label: "Em entrega", icon: Truck,        color: "text-[#4a7aa8] bg-[#edf3fb]" },
  delivered:  { label: "Entregue",   icon: Package,      color: "text-[#5a8a52] bg-[#edf7eb]" },
  cancelled:  { label: "Cancelado",  icon: XCircle,      color: "text-destructive bg-destructive/10" },
};

export default async function PedidosPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/conta/entrar");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-6">
      <Link href="/conta" className="flex items-center gap-2 text-sm text-taupe hover:text-caramelo transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Voltar para minha conta
      </Link>

      <div>
        <p className="text-xs text-taupe tracking-widest uppercase">Minha conta</p>
        <h1 className="font-display text-2xl font-semibold text-[#2a1f14]">Meus pedidos</h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e8ddd0] p-10 flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-full bg-[#f0e8da] flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-taupe" />
          </div>
          <div>
            <p className="font-display text-base font-semibold text-[#2a1f14]">Nenhum pedido ainda</p>
            <p className="text-sm text-taupe mt-1">Seus pedidos aparecerão aqui após a compra.</p>
          </div>
          <Link href="/" className="mt-2 text-sm font-semibold text-caramelo hover:underline">
            Explorar produtos
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => {
            const status = STATUS_LABEL[order.status] ?? STATUS_LABEL.pending;
            const Icon = status.icon;
            return (
              <Link
                key={order.id}
                href={`/conta/pedidos/${order.id}`}
                className="bg-white rounded-2xl border border-[#e8ddd0] p-5 flex items-center gap-4 hover:border-caramelo transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-display text-sm font-semibold text-[#2a1f14]">
                      #{order.id.slice(-6).toUpperCase()}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${status.color}`}>
                      <Icon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </div>
                  <p className="text-xs text-taupe truncate">
                    {order.items.length} {order.items.length === 1 ? "item" : "itens"} &middot;{" "}
                    {new Date(order.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {order.totalPrice && (
                    <span className="font-display text-sm font-bold text-[#2a1f14]">
                      R$ {Number(order.totalPrice).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-taupe group-hover:text-caramelo transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
