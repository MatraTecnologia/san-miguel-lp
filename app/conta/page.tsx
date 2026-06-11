import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ShoppingBag, Tag, Clock, ChevronRight, CheckCircle2, Truck, Package, XCircle } from "lucide-react";
import ProfilePhotoForm from "./_components/ProfilePhotoForm";
import { redirect } from "next/navigation";

const STATUS_LABEL: Record<string, { label: string; icon: typeof Clock; color: string }> = {
  pending:    { label: "Aguardando", icon: Clock,        color: "text-[#8a7a52] bg-[#fdf7ed]" },
  confirmed:  { label: "Confirmado", icon: CheckCircle2, color: "text-[#5a8a52] bg-[#edf7eb]" },
  delivering: { label: "Em entrega", icon: Truck,        color: "text-[#4a7aa8] bg-[#edf3fb]" },
  delivered:  { label: "Entregue",   icon: Package,      color: "text-[#5a8a52] bg-[#edf7eb]" },
  cancelled:  { label: "Cancelado",  icon: XCircle,      color: "text-destructive bg-destructive/10" },
};

export default async function ContaPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/conta/entrar");

  const [orders, coupons] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { items: true },
    }),
    prisma.couponAssignment.findMany({
      where: { userId: session.user.id },
      include: { coupon: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <ProfilePhotoForm
          userId={session.user.id}
          currentImage={session.user.image ?? ""}
          name={session.user.name}
        />
        <div>
          <h1 className="font-display text-2xl font-semibold text-[#2a1f14]">{session.user.name}</h1>
          <p className="text-sm text-taupe">{session.user.email}</p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { icon: ShoppingBag, label: "Pedidos", value: orders.length, href: "/conta/pedidos" },
          { icon: Tag, label: "Cupons", value: coupons.filter((c) => !c.usedAt && (!c.coupon.expiresAt || c.coupon.expiresAt > new Date())).length, href: "/conta/cupons" },
          { icon: CheckCircle2, label: "Entregues", value: orders.filter((o) => o.status === "delivered").length, href: "/conta/pedidos" },
        ].map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white rounded-2xl border border-[#e8ddd0] p-5 flex flex-col gap-3 hover:border-caramelo/40 hover:shadow-sm transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-caramelo/10 flex items-center justify-center">
              <s.icon className="w-4 h-4 text-caramelo" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-[#2a1f14]">{s.value}</p>
              <p className="text-xs text-taupe">{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-[#e8ddd0]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0e8da]">
          <h2 className="font-display text-base font-semibold text-[#2a1f14]">Pedidos recentes</h2>
          <Link href="/conta/pedidos" className="text-xs text-caramelo hover:underline flex items-center gap-1">
            Ver todos <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        {orders.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-taupe">Você ainda não fez nenhum pedido.</p>
            <Link href="/produtos" className="text-xs text-caramelo hover:underline mt-2 inline-block">
              Explorar produtos →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#f0e8da]">
            {orders.map((order) => {
              const s = STATUS_LABEL[order.status] ?? STATUS_LABEL.pending;
              const Icon = s.icon;
              return (
                <Link
                  key={order.id}
                  href={`/conta/pedidos/${order.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-[#fdf9f4] transition-colors"
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-[#2a1f14]">
                      Pedido #{order.id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-xs text-taupe">
                      {order.items.length} {order.items.length === 1 ? "item" : "itens"} ·{" "}
                      {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {order.totalPrice && (
                      <span className="text-sm font-bold text-[#2a1f14]">
                        R$ {Number(order.totalPrice).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    )}
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${s.color}`}>
                      <Icon className="w-3 h-3" />
                      {s.label}
                    </span>
                    <ChevronRight className="w-4 h-4 text-taupe" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Coupons */}
      {coupons.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#e8ddd0]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0e8da]">
            <h2 className="font-display text-base font-semibold text-[#2a1f14]">Meus cupons</h2>
          </div>
          <div className="divide-y divide-[#f0e8da]">
            {coupons.map((ca) => {
              const expired = ca.coupon.expiresAt && ca.coupon.expiresAt < new Date();
              const used = !!ca.usedAt;
              return (
                <div key={ca.id} className="flex items-center justify-between px-6 py-4">
                  <div className="flex flex-col gap-0.5">
                    <p className="font-mono font-bold text-sm text-caramelo tracking-widest">{ca.coupon.code}</p>
                    <p className="text-xs text-taupe">{ca.coupon.description ?? "Desconto especial"}</p>
                    {ca.coupon.expiresAt && (
                      <p className="text-[10px] text-taupe">
                        Válido até {new Date(ca.coupon.expiresAt).toLocaleDateString("pt-BR")}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-base font-bold text-caramelo">
                      {ca.coupon.type === "percent"
                        ? `${Number(ca.coupon.discount)}% OFF`
                        : `R$ ${Number(ca.coupon.discount).toFixed(2)} OFF`}
                    </span>
                    {used ? (
                      <span className="text-xs text-taupe bg-[#f0e8da] px-2 py-1 rounded-full">Usado</span>
                    ) : expired ? (
                      <span className="text-xs text-destructive bg-destructive/10 px-2 py-1 rounded-full">Expirado</span>
                    ) : (
                      <span className="text-xs text-[#5a8a52] bg-[#edf7eb] px-2 py-1 rounded-full">Disponível</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
