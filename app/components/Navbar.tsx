"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-b border-areia">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-display text-xl font-semibold text-[#3a2e22] tracking-tight">São Miguel</span>
          <span className="font-sans text-[9px] tracking-[0.25em] text-caramelo uppercase">Estofados Decor</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {[["Início", "/"], ["Produtos", "/produtos"], ["Sobre", "/#sobre"], ["Contato", "/#contato"]].map(([label, href]) => (
            <Link key={href} href={href} className="font-sans text-sm text-taupe hover:text-caramelo transition-colors">
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://wa.me/5543999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 bg-[#25D366] text-white font-sans text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#1ebe5d] transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp
          </a>
          <button className="md:hidden p-1" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5 text-[#3a2e22]" /> : <Menu className="w-5 h-5 text-[#3a2e22]" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-areia px-6 py-4 flex flex-col gap-4">
          {[["Início", "/"], ["Produtos", "/produtos"], ["Sobre", "/#sobre"], ["Contato", "/#contato"]].map(([label, href]) => (
            <Link key={href} href={href} className="font-sans text-sm text-taupe" onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
          <a
            href="https://wa.me/5543999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25D366] text-white font-sans text-xs font-semibold px-4 py-2.5 rounded-full w-fit"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}
