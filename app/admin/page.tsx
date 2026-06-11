import { prisma } from "@/lib/prisma";
import { Package, MessageSquareQuote, TrendingUp, MousePointerClick, ArrowUpRight, ExternalLink, Users } from "lucide-react";
import LeadsChart from "./_components/LeadsChart";
import Link from "next/link";

export default async function AdminDashboard() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const [totalProducts, totalTestimonials, totalLeads, leadsToday, totalClients, topProducts, dailyLeadsRaw] = await Promise.all([
    prisma.product.count({ where: { active: true } }),
    prisma.testimonial.count({ where: { approved: true } }),
    prisma.lead.count(),
    prisma.lead.count({ where: { createdAt: { gte: today } } }),
    prisma.user.count({ where: { role: "customer" } }),
    prisma.lead.groupBy({
      by: ["productId"],
      where: { productId: { not: null } },
      _count: { productId: true },
      orderBy: { _count: { productId: "desc" } },
      take: 5,
    }),
    prisma.lead.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  // Build 7-day chart data
  const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sevenDaysAgo);
    d.setDate(d.getDate() + i);
    const label = DAYS[d.getDay()];
    const count = dailyLeadsRaw.filter((l) => {
      const ld = new Date(l.createdAt);
      return ld.toDateString() === d.toDateString();
    }).length;
    return { day: label, leads: count };
  });

  // Top products with names
  const productIds = topProducts.map((p) => p.productId!);
  const productNames = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true },
  });
  const topProductsWithNames = topProducts.map((p) => ({
    name: productNames.find((n) => n.id === p.productId)?.name ?? "Produto removido",
    count: p._count.productId,
  }));

  const maxCount = topProductsWithNames[0]?.count ?? 1;

  const stats = [
    {
      label: "Produtos ativos",
      value: totalProducts,
      icon: Package,
      href: "/admin/produtos",
      color: "text-caramelo",
      bg: "bg-caramelo/10",
    },
    {
      label: "Depoimentos",
      value: totalTestimonials,
      icon: MessageSquareQuote,
      href: "/admin/depoimentos",
      color: "text-[#7c9c6e]",
      bg: "bg-[#7c9c6e]/10",
    },
    {
      label: "Leads total",
      value: totalLeads,
      icon: TrendingUp,
      href: "#",
      color: "text-[#6e8fab]",
      bg: "bg-[#6e8fab]/10",
    },
    {
      label: "Leads hoje",
      value: leadsToday,
      icon: MousePointerClick,
      href: "#",
      color: "text-[#b07ab0]",
      bg: "bg-[#b07ab0]/10",
    },
    {
      label: "Clientes",
      value: totalClients,
      icon: Users,
      href: "/admin/usuarios",
      color: "text-[#6e8fab]",
      bg: "bg-[#6e8fab]/10",
    },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-taupe tracking-widest uppercase font-medium mb-1">Visão geral</p>
          <h1 className="font-display text-3xl font-semibold text-[#2a1f14]">Dashboard</h1>
        </div>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-xs font-medium text-taupe hover:text-caramelo transition-colors border border-[#ddd4c5] px-3 py-2 rounded-lg hover:border-caramelo/50 bg-white"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Ver site
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group bg-white rounded-2xl border border-[#e8ddd0] p-5 flex flex-col gap-4 hover:border-caramelo/30 hover:shadow-md hover:shadow-caramelo/5 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-caramelo transition-colors" />
            </div>
            <div>
              <p className="font-display text-3xl font-bold text-[#2a1f14] leading-none mb-1.5">{s.value}</p>
              <p className="text-xs text-taupe font-medium">{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Leads chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e8ddd0] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-base font-semibold text-[#2a1f14]">Interesse por dia</h2>
              <p className="text-xs text-taupe mt-0.5">Últimos 7 dias</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-taupe bg-[#f5f0e8] px-3 py-1.5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-caramelo inline-block" />
              Leads
            </div>
          </div>
          <LeadsChart data={chartData} />
        </div>

        {/* Top products */}
        <div className="bg-white rounded-2xl border border-[#e8ddd0] p-6">
          <div className="mb-6">
            <h2 className="font-display text-base font-semibold text-[#2a1f14]">Mais clicados</h2>
            <p className="text-xs text-taupe mt-0.5">Por interesse no WhatsApp</p>
          </div>
          <div className="flex flex-col gap-4">
            {topProductsWithNames.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem dados ainda.</p>
            ) : (
              topProductsWithNames.map((p, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#3a2e22] truncate max-w-[150px]">{p.name}</span>
                    <span className="text-xs font-bold text-caramelo">{p.count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#f0e8da] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-caramelo to-[#b8882a] transition-all duration-700"
                      style={{ width: `${(p.count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "Adicionar produto", href: "/admin/produtos/novo", desc: "Cadastrar novo item no catálogo" },
          { label: "Nova categoria", href: "/admin/categorias", desc: "Organizar produtos por tipo" },
          { label: "Configurações", href: "/admin/configuracoes", desc: "WhatsApp, horários, foto da home" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col gap-1 bg-white rounded-2xl border border-[#e8ddd0] px-5 py-4 hover:border-caramelo/40 hover:shadow-sm transition-all group"
          >
            <span className="text-sm font-semibold text-[#2a1f14] group-hover:text-caramelo transition-colors">{item.label}</span>
            <span className="text-xs text-taupe">{item.desc}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
