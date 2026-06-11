import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import OrderManagerForm from "./_components/OrderManagerForm";

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) notFound();

  const user = await prisma.user.findUnique({
    where: { id: order.userId },
    select: { name: true, email: true, image: true },
  });

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <Link href="/admin/pedidos" className="flex items-center gap-2 text-sm text-taupe hover:text-caramelo transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Voltar para pedidos
      </Link>

      <div>
        <p className="text-xs text-taupe tracking-widest uppercase font-medium mb-1">Pedido</p>
        <h1 className="font-display text-3xl font-semibold text-[#2a1f14]">#{id.slice(-6).toUpperCase()}</h1>
        <p className="text-xs text-taupe mt-1">{new Date(order.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}</p>
      </div>

      {/* Customer */}
      <div className="bg-white rounded-2xl border border-[#e8ddd0] p-5 flex items-center gap-4">
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-caramelo/10">
          {user?.image ? (
            <Image src={user.image} alt={user.name ?? ""} fill className="object-cover" />
          ) : (
            <span className="w-full h-full flex items-center justify-center font-semibold text-caramelo">
              {user?.name?.[0]?.toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-[#2a1f14]">{user?.name}</p>
          <p className="text-xs text-taupe">{user?.email}</p>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl border border-[#e8ddd0] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#f0e8da]">
          <h2 className="font-display text-sm font-semibold text-[#2a1f14]">Itens do pedido</h2>
        </div>
        <div className="divide-y divide-[#f0e8da]">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 px-5 py-4">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#f0e8da] shrink-0">
                {item.imageUrl && <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#2a1f14]">{item.name}</p>
                <p className="text-xs text-taupe">Qtd: {item.quantity}</p>
              </div>
              {item.price && (
                <p className="text-sm font-bold text-[#2a1f14]">
                  R$ {(Number(item.price) * item.quantity).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              )}
            </div>
          ))}
        </div>
        {order.totalPrice && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-[#f0e8da] bg-[#faf7f2]">
            <span className="text-sm font-semibold text-taupe">Total</span>
            <span className="font-display text-lg font-bold text-[#2a1f14]">
              R$ {Number(order.totalPrice).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>
        )}
      </div>

      {/* Manager form */}
      <OrderManagerForm order={{
        id: order.id,
        status: order.status,
        notes: order.notes ?? "",
        deliveryAt: order.deliveryAt?.toISOString().split("T")[0] ?? "",
        warrantyAt: order.warrantyAt?.toISOString().split("T")[0] ?? "",
      }} />
    </div>
  );
}
