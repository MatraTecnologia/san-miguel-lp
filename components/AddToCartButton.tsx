"use client";

import { ShoppingBag, Check } from "lucide-react";
import { useCart, type CartItem } from "@/lib/cart";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  product: Omit<CartItem, "quantity">;
  className?: string;
  label?: string;
}

export default function AddToCartButton({ product, className, label = "Adicionar ao carrinho" }: Props) {
  const addItem = useCart((s) => s.addItem);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product);
    toast.success(`${product.name} adicionado ao carrinho!`);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      onClick={handleAdd}
      className={
        className ??
        `flex items-center justify-center gap-2 border-2 border-caramelo text-caramelo hover:bg-caramelo hover:text-white font-sans font-semibold text-sm px-5 py-2.5 rounded-full transition-all duration-200 ${added ? "bg-caramelo text-white" : ""}`
      }
    >
      {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
      {added ? "Adicionado!" : label}
    </button>
  );
}
