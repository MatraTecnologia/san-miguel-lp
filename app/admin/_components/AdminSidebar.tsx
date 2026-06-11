"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, Tag, MessageSquareQuote, Settings, LogOut, Menu, X, ShoppingBag, Ticket } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { useState } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Pedidos", href: "/admin/pedidos", icon: ShoppingBag },
  { label: "Produtos", href: "/admin/produtos", icon: Package },
  { label: "Categorias", href: "/admin/categorias", icon: Tag },
  { label: "Cupons", href: "/admin/cupons", icon: Ticket },
  { label: "Depoimentos", href: "/admin/depoimentos", icon: MessageSquareQuote },
  { label: "Configurações", href: "/admin/configuracoes", icon: Settings },
];

export default function AdminSidebar({ user }: { user: { name: string; email: string } }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-[#e8ddd0]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-caramelo to-[#b8882a] flex items-center justify-center shadow-sm">
            <span className="text-white font-display text-sm font-bold">S</span>
          </div>
          <div>
            <p className="font-display text-sm font-semibold text-[#2a1f14] leading-tight">São Miguel</p>
            <p className="text-[10px] text-taupe tracking-widest uppercase">Admin</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        <p className="px-3 text-[10px] font-semibold text-taupe/70 uppercase tracking-widest mb-2">Menu</p>
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                active
                  ? "bg-caramelo text-white shadow-sm shadow-caramelo/30"
                  : "text-[#5a4a3a] hover:bg-[#ede5d8] hover:text-[#2a1f14]"
              )}
            >
              <item.icon className={cn("w-4 h-4 shrink-0", active ? "text-white" : "text-taupe")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-[#e8ddd0]">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#ede5d8]">
          <div className="w-7 h-7 rounded-full bg-caramelo/20 flex items-center justify-center shrink-0">
            <span className="text-caramelo font-semibold text-xs uppercase">{user.name?.[0] ?? "A"}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#2a1f14] truncate">{user.name}</p>
            <p className="text-[10px] text-taupe truncate">{user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            title="Sair"
            className="text-taupe hover:text-destructive transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 rounded-xl bg-white shadow-md flex items-center justify-center border border-[#e8ddd0]"
      >
        <Menu className="w-4 h-4 text-taupe" />
      </button>

      {/* Mobile overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-taupe hover:text-[#2a1f14]">
              <X className="w-4 h-4" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 bg-white border-r border-[#e8ddd0] min-h-screen sticky top-0">
        <SidebarContent />
      </aside>
    </>
  );
}
