"use client";

import { MessageCircle } from "lucide-react";

interface Props {
  productId?: string;
  productName?: string;
  whatsapp: string;
  message: string;
  className?: string;
  label?: string;
}

export default function WhatsAppButton({ productId, productName, whatsapp, message, className, label = "Comprar via WhatsApp" }: Props) {
  async function handleClick() {
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, source: "product_page" }),
    }).catch(() => {});

    const text = productName
      ? `Olá! Tenho interesse no produto: *${productName}*. ${message}`
      : message;

    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`, "_blank");
  }

  return (
    <button
      onClick={handleClick}
      className={className ?? "flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-sans font-semibold text-sm px-6 py-3 rounded-full transition-colors w-full"}
    >
      <MessageCircle className="w-4 h-4" />
      {label}
    </button>
  );
}
