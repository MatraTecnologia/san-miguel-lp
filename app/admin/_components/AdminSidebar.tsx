"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Package, Tag, MessageSquareQuote, Settings, LogOut } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const nav = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Produtos", href: "/admin/produtos", icon: Package },
  { label: "Categorias", href: "/admin/categorias", icon: Tag },
  { label: "Depoimentos", href: "/admin/depoimentos", icon: MessageSquareQuote },
  { label: "Configurações", href: "/admin/configuracoes", icon: Settings },
];

export default function AdminSidebar({ user }: { user: { name: string; email: string } }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <div className="flex flex-col gap-0.5">
          <span className="font-display text-base font-semibold text-[#3a2e22]">São Miguel</span>
          <span className="text-xs text-muted-foreground">Painel Admin</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            {nav.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname === item.href}>
                  <Link href={item.href}>
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium truncate">{user.name}</span>
          <span className="text-xs text-muted-foreground truncate">{user.email}</span>
          <button
            onClick={handleSignOut}
            className="mt-2 flex items-center gap-2 text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sair
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
