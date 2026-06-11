import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { approveTestimonial, deleteTestimonial } from "./actions";
import AddTestimonialDialog from "./_components/AddTestimonialDialog";

export default async function DepoimentosPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-[#3a2e22]">Depoimentos</h1>
        <AddTestimonialDialog />
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Depoimento</TableHead>
              <TableHead>Estrelas</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground text-sm">
                  Nenhum depoimento cadastrado.
                </TableCell>
              </TableRow>
            )}
            {testimonials.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium whitespace-nowrap">{t.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{t.text}</TableCell>
                <TableCell>{"★".repeat(t.stars)}</TableCell>
                <TableCell>
                  <Badge variant={t.approved ? "default" : "secondary"}>
                    {t.approved ? "Publicado" : "Pendente"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    {!t.approved && (
                      <form action={approveTestimonial.bind(null, t.id)}>
                        <Button variant="outline" size="sm" type="submit">
                          Publicar
                        </Button>
                      </form>
                    )}
                    <form action={deleteTestimonial.bind(null, t.id)}>
                      <Button variant="ghost" size="sm" type="submit" className="text-destructive hover:text-destructive">
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
