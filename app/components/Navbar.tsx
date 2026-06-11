"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, MessageCircle, User, LogOut } from "lucide-react";
import CartDrawer from "@/components/CartDrawer";
import { authClient, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const WHATSAPP = "5543999999999";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.refresh();
  }

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

        <div className="flex items-center gap-2">
          {/* Cart */}
          <CartDrawer whatsapp={WHATSAPP} message="Olá! Gostaria de fazer um pedido." />

          {/* Account */}
          {session ? (
            <div className="relative group hidden md:block">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-champanhe transition-colors text-sm text-taupe">
                <div className="w-6 h-6 rounded-full bg-caramelo/20 flex items-center justify-center">
                  <span className="text-caramelo text-xs font-semibold">{session.user.name?.[0]?.toUpperCase()}</span>
                </div>
                <span className="text-xs font-medium max-w-[80px] truncate">{session.user.name?.split(" ")[0]}</span>
              </button>
              <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-[#e8ddd0] shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link href="/conta" className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#3a2e22] hover:bg-[#fdf9f4]">
                  <User className="w-3.5 h-3.5 text-taupe" />
                  Minha conta
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-[#fdf9f4]"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sair
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/entrar"
              className="hidden md:flex items-center gap-1.5 text-sm text-taupe hover:text-caramelo transition-colors px-2 py-1.5"
            >
              <User className="w-4 h-4" />
              Entrar
            </Link>
          )}

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${WHATSAPP}`}
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
          {session ? (
            <>
              <Link href="/conta" className="font-sans text-sm text-taupe" onClick={() => setOpen(false)}>Minha conta</Link>
              <button onClick={handleSignOut} className="text-left font-sans text-sm text-destructive">Sair</button>
            </>
          ) : (
            <Link href="/entrar" className="font-sans text-sm text-caramelo font-medium" onClick={() => setOpen(false)}>
              Entrar / Criar conta
            </Link>
          )}
          <a
            href={`https://wa.me/${WHATSAPP}`}
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
