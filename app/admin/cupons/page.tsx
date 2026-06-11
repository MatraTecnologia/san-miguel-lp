import { prisma } from "@/lib/prisma";
import AddCouponDialog from "./_components/AddCouponDialog";
import AssignCouponDialog from "./_components/AssignCouponDialog";
import { deleteCoupon } from "./actions";
import { Button } from "@/components/ui/button";

export default async function AdminCuponsPage() {
  const [coupons, users] = await Promise.all([
    prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
      include: { assignments: { include: { coupon: false } } },
    }),
    prisma.user.findMany({
      where: { role: "customer" },
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-taupe tracking-widest uppercase font-medium mb-1">Promoções</p>
          <h1 className="font-display text-3xl font-semibold text-[#2a1f14]">Cupons</h1>
        </div>
        <AddCouponDialog />
      </div>

      <div className="bg-white rounded-2xl border border-[#e8ddd0] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#faf7f2] border-b border-[#e8ddd0]">
              {["Código", "Desconto", "Tipo", "Uso", "Validade", "Clientes", ""].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-taupe uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-16 text-sm text-muted-foreground">
                  Nenhum cupom criado ainda.
                </td>
              </tr>
            )}
            {coupons.map((c) => {
              const used = c.assignments.filter((a) => a.usedAt).length;
              const total = c.assignments.length;
              const expired = c.expiresAt && c.expiresAt < new Date();
              return (
                <tr key={c.id} className="border-b border-[#f0e8da] hover:bg-[#fdf9f4]">
                  <td className="px-5 py-4">
                    <span className="font-mono font-bold text-sm text-caramelo tracking-widest">{c.code}</span>
                    {c.description && <p className="text-xs text-taupe mt-0.5">{c.description}</p>}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-display text-base font-bold text-[#2a1f14]">
                      {c.type === "percent" ? `${Number(c.discount)}%` : `R$ ${Number(c.discount).toFixed(2)}`}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-taupe bg-[#f0e8da] px-2 py-1 rounded-full">
                      {c.type === "percent" ? "Percentual" : "Valor fixo"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-taupe">
                    {used}/{total} {total === 1 ? "uso" : "usos"}
                  </td>
                  <td className="px-5 py-4 text-xs">
                    {c.expiresAt ? (
                      <span className={expired ? "text-destructive" : "text-[#5a8a52]"}>
                        {new Date(c.expiresAt).toLocaleDateString("pt-BR")}
                      </span>
                    ) : (
                      <span className="text-taupe">Sem limite</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <AssignCouponDialog couponId={c.id} couponCode={c.code} users={users} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <form action={deleteCoupon.bind(null, c.id)}>
                      <Button variant="ghost" size="sm" type="submit" className="text-xs text-destructive hover:text-destructive hover:bg-destructive/5">
                        Excluir
                      </Button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
