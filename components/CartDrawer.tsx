"use client";

import { useCart } from "@/lib/cart";
import { ShoppingBag, X, Minus, Plus, Trash2, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface Props {
  whatsapp: string;
  message: string;
}

export default function CartDrawer({ whatsapp, message }: Props) {
  const { items, removeItem, updateQty, clear, total, count } = useCart();
  const [open, setOpen] = useState(false);
  const itemCount = count();

  function buildWhatsAppMessage() {
    const lines = items.map((item) => {
      const price = item.price
        ? `R$ ${(item.price * item.quantity).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
        : "preço a consultar";
      return `• *${item.quantity}x ${item.name}* — ${price}`;
    });

    const totalValue = total();
    const totalLine = totalValue > 0
      ? `\n*Total estimado: R$ ${totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}*`
      : "";

    return `Olá! Tenho interesse nos seguintes produtos:\n\n${lines.join("\n")}${totalLine}\n\nAguardo retorno!`;
  }

  async function handleCheckout() {
    const text = buildWhatsAppMessage();
    // Save order to DB (fire and forget — doesn't block WhatsApp)
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, imageUrl: i.image })),
        whatsappMsg: text,
      }),
    }).catch(() => {});
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`, "_blank");
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-champanhe transition-colors"
        aria-label="Carrinho"
      >
        <ShoppingBag className="w-5 h-5 text-[#3a2e22]" />
        {itemCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 min-w-[18px] min-h-[18px] flex items-center justify-center bg-caramelo text-white text-[10px] font-bold rounded-full leading-none px-1">
            {itemCount > 9 ? "9+" : itemCount}
          </span>
        )}
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          {/* Drawer */}
          <div className="w-full max-w-sm bg-white shadow-2xl flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0e8da]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-caramelo" />
                <span className="font-display text-base font-semibold text-[#2a1f14]">Carrinho</span>
                {itemCount > 0 && (
                  <span className="text-xs text-taupe">({itemCount} {itemCount === 1 ? "item" : "itens"})</span>
                )}
              </div>
              <button onClick={() => setOpen(false)} className="text-taupe hover:text-[#2a1f14] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-champanhe flex items-center justify-center">
                    <ShoppingBag className="w-7 h-7 text-fendi" />
                  </div>
                  <p className="font-sans text-sm text-taupe">Seu carrinho está vazio.</p>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-xs text-caramelo hover:underline"
                  >
                    Continuar comprando
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 rounded-xl bg-[#fdf9f4] border border-[#f0e8da]">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-champanhe shrink-0">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[#f0e8da]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                      <p className="font-sans text-sm font-semibold text-[#2a1f14] line-clamp-2 leading-snug">{item.name}</p>
                      {item.price ? (
                        <p className="text-xs font-bold text-caramelo">
                          R$ {(item.price * item.quantity).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </p>
                      ) : (
                        <p className="text-xs text-taupe">Preço a consultar</p>
                      )}
                      <div className="flex items-center justify-between mt-0.5">
                        <div className="flex items-center gap-1.5 border border-[#e8ddd0] rounded-full px-1 py-0.5">
                          <button
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                            className="w-5 h-5 flex items-center justify-center text-taupe hover:text-[#2a1f14] transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-semibold text-[#2a1f14] w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            className="w-5 h-5 flex items-center justify-center text-taupe hover:text-[#2a1f14] transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-taupe hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-4 py-4 border-t border-[#f0e8da] flex flex-col gap-3">
                {total() > 0 && (
                  <div className="flex items-center justify-between px-1">
                    <span className="font-sans text-sm text-taupe">Total estimado</span>
                    <span className="font-display text-lg font-bold text-[#2a1f14]">
                      R$ {total().toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-sans font-semibold text-sm px-5 py-3.5 rounded-full transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Finalizar pelo WhatsApp
                </button>
                <button
                  onClick={clear}
                  className="text-xs text-center text-taupe hover:text-destructive transition-colors"
                >
                  Limpar carrinho
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
