import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, MessageSquareQuote, TrendingUp, MousePointerClick } from "lucide-react";
import LeadsChart from "./_components/LeadsChart";

export default async function AdminDashboard() {
  const [totalProducts, totalTestimonials, totalLeads, recentLeads] = await Promise.all([
    prisma.product.count({ where: { active: true } }),
    prisma.testimonial.count({ where: { approved: true } }),
    prisma.lead.count(),
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
      include: { product: { select: { name: true } } },
    }),
  ]);

  // Leads dos últimos 7 dias agrupados por dia
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const leadsPerDay = await prisma.lead.groupBy({
    by: ["createdAt"],
    where: { createdAt: { gte: sevenDaysAgo } },
    _count: true,
  });

  // Produtos mais clicados
  const topProducts = await prisma.lead.groupBy({
    by: ["productId"],
    where: { productId: { not: null } },
    _count: { productId: true },
    orderBy: { _count: { productId: "desc" } },
    take: 5,
  });

  const topProductIds = topProducts.map((p) => p.productId!);
  const productNames = await prisma.product.findMany({
    where: { id: { in: topProductIds } },
    select: { id: true, name: true },
  });

  const topProductsWithNames = topProducts.map((p) => ({
    name: productNames.find((n) => n.id === p.productId)?.name ?? "—",
    count: p._count.productId,
  }));

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-semibold text-[#3a2e22]">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Produtos Ativos</CardTitle>
            <Package className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalProducts}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Depoimentos</CardTitle>
            <MessageSquareQuote className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalTestimonials}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Leads Total</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalLeads}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Leads Hoje</CardTitle>
            <MousePointerClick className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {recentLeads.filter((l) => {
                const today = new Date();
                return l.createdAt.toDateString() === today.toDateString();
              }).length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Leads — últimos 7 dias</CardTitle>
          </CardHeader>
          <CardContent>
            <LeadsChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Produtos mais clicados</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-3">
              {topProductsWithNames.length === 0 && (
                <li className="text-sm text-muted-foreground">Sem dados ainda.</li>
              )}
              {topProductsWithNames.map((p, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span className="truncate max-w-[140px]">{p.name}</span>
                  <span className="font-semibold text-caramelo">{p.count}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
