import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { approveTestimonial, deleteTestimonial } from "./actions";
import AddTestimonialDialog from "./_components/AddTestimonialDialog";
import { CheckCircle2, Clock } from "lucide-react";

export default async function DepoimentosPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-taupe tracking-widest uppercase font-medium mb-1">Gestão</p>
          <h1 className="font-display text-3xl font-semibold text-[#2a1f14]">Depoimentos</h1>
        </div>
        <AddTestimonialDialog />
      </div>

      <div className="bg-white rounded-2xl border border-[#e8ddd0] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#faf7f2] hover:bg-[#faf7f2] border-b border-[#e8ddd0]">
              <TableHead className="text-xs font-semibold text-taupe uppercase tracking-wide">Cliente</TableHead>
              <TableHead className="text-xs font-semibold text-taupe uppercase tracking-wide">Depoimento</TableHead>
              <TableHead className="text-xs font-semibold text-taupe uppercase tracking-wide">Estrelas</TableHead>
              <TableHead className="text-xs font-semibold text-taupe uppercase tracking-wide">Status</TableHead>
              <TableHead className="text-right text-xs font-semibold text-taupe uppercase tracking-wide">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-16 text-muted-foreground text-sm">
                  Nenhum depoimento cadastrado ainda.
                </TableCell>
              </TableRow>
            )}
            {testimonials.map((t) => (
              <TableRow key={t.id} className="border-b border-[#f0e8da] hover:bg-[#fdf9f4]">
                <TableCell className="font-semibold text-sm text-[#2a1f14] whitespace-nowrap py-4">{t.name}</TableCell>
                <TableCell className="text-sm text-taupe max-w-xs">
                  <span className="line-clamp-2">{t.text}</span>
                </TableCell>
                <TableCell>
                  <span className="text-caramelo tracking-wider text-sm">{"★".repeat(t.stars)}</span>
                </TableCell>
                <TableCell>
                  {t.approved ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5a8a52] bg-[#edf7eb] px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      Publicado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#8a7a52] bg-[#fdf7ed] px-2.5 py-1 rounded-full">
                      <Clock className="w-3 h-3" />
                      Pendente
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right py-4">
                  <div className="flex gap-2 justify-end">
                    {!t.approved && (
                      <form action={approveTestimonial.bind(null, t.id)}>
                        <Button variant="outline" size="sm" type="submit" className="text-xs border-[#ddd4c5] hover:border-caramelo hover:text-caramelo">
                          Publicar
                        </Button>
                      </form>
                    )}
                    <form action={deleteTestimonial.bind(null, t.id)}>
                      <Button variant="ghost" size="sm" type="submit" className="text-xs text-destructive hover:text-destructive hover:bg-destructive/5">
                        Excluir
                      </Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
