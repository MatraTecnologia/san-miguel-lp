import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, CheckCircle2, Truck, Package, XCircle, MessageCircle, ShieldCheck, CalendarDays } from "lucide-react";

const STATUS_STEPS = [
  { key: "pending",    label: "Aguardando", icon: Clock },
  { key: "confirmed",  label: "Confirmado", icon: CheckCircle2 },
  { key: "delivering", label: "Em entrega", icon: Truck },
  { key: "delivered",  label: "Entregue",   icon: Package },
];

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/conta/entrar");

  const order = await prisma.order.findFirst({
    where: { id, userId: session.user.id },
    include: { items: true },
  });

  if (!order) notFound();

  const cancelled = order.status === "cancelled";
  const currentStep = cancelled ? -1 : STATUS_STEPS.findIndex((s) => s.key === order.status);

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-6">
      <Link href="/conta" className="flex items-center gap-2 text-sm text-taupe hover:text-caramelo transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Voltar para minha conta
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-taupe tracking-widest uppercase">Pedido</p>
          <h1 className="font-display text-2xl font-semibold text-[#2a1f14]">
            #{order.id.slice(-6).toUpperCase()}
          </h1>
          <p className="text-xs text-taupe mt-1">{new Date(order.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}</p>
        </div>
        {order.totalPrice && (
          <div className="text-right">
            <p className="text-xs text-taupe">Total</p>
            <p className="font-display text-xl font-bold text-[#2a1f14]">
              R$ {Number(order.totalPrice).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>
        )}
      </div>

      {/* Progress tracker */}
      {!cancelled ? (
        <div className="bg-white rounded-2xl border border-[#e8ddd0] p-6">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-4 h-0.5 bg-[#f0e8da] -z-0" />
            <div
              className="absolute left-0 top-4 h-0.5 bg-caramelo transition-all duration-700 -z-0"
              style={{ width: currentStep <= 0 ? "0%" : `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
            />
            {STATUS_STEPS.map((step, i) => {
              const done = i <= currentStep;
              const Icon = step.icon;
              return (
                <div key={step.key} className="flex flex-col items-center gap-2 z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${done ? "bg-caramelo border-caramelo" : "bg-white border-[#ddd4c5]"}`}>
                    <Icon className={`w-3.5 h-3.5 ${done ? "text-white" : "text-taupe"}`} />
                  </div>
                  <span className={`text-[10px] font-medium ${done ? "text-caramelo" : "text-taupe"}`}>{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-4 flex items-center gap-3">
          <XCircle className="w-5 h-5 text-destructive" />
          <p className="text-sm font-medium text-destructive">Este pedido foi cancelado.</p>
        </div>
      )}

      {/* Dates */}
      {(order.deliveryAt || order.warrantyAt) && (
        <div className="grid grid-cols-2 gap-3">
          {order.deliveryAt && (
            <div className="bg-white rounded-2xl border border-[#e8ddd0] p-4 flex gap-3 items-start">
              <CalendarDays className="w-4 h-4 text-caramelo mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-[#2a1f14]">Previsão de entrega</p>
                <p className="text-xs text-taupe mt-0.5">{new Date(order.deliveryAt).toLocaleDateString("pt-BR")}</p>
              </div>
            </div>
          )}
          {order.warrantyAt && (
            <div className="bg-white rounded-2xl border border-[#e8ddd0] p-4 flex gap-3 items-start">
              <ShieldCheck className="w-4 h-4 text-[#5a8a52] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-[#2a1f14]">Garantia até</p>
                <p className="text-xs text-taupe mt-0.5">{new Date(order.warrantyAt).toLocaleDateString("pt-BR")}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Notes */}
      {order.notes && (
        <div className="bg-[#fdf7ed] border border-[#e8d9b0] rounded-2xl p-4">
          <p className="text-xs font-semibold text-[#8a7a52] uppercase tracking-wide mb-1">Observações</p>
          <p className="text-sm text-[#5a4a3a]">{order.notes}</p>
        </div>
      )}

      {/* Items */}
      <div className="bg-white rounded-2xl border border-[#e8ddd0] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#f0e8da]">
          <h2 className="font-display text-sm font-semibold text-[#2a1f14]">
            {order.items.length} {order.items.length === 1 ? "item" : "itens"}
          </h2>
        </div>
        <div className="divide-y divide-[#f0e8da]">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 px-5 py-4">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#f0e8da] shrink-0">
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full" />
                )}
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
      </div>

      {/* Contact */}
      {order.whatsappMsg && (
        <a
          href={`https://wa.me/5543999999999?text=${encodeURIComponent("Olá! Preciso de informações sobre o pedido #" + order.id.slice(-6).toUpperCase())}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-sans font-semibold text-sm py-3.5 rounded-full transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Falar sobre este pedido
        </a>
      )}
    </div>
  );
}
