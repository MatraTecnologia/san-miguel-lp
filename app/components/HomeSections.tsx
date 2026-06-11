import { prisma } from "@/lib/prisma";
import ProductCard from "./ProductCard";
import CategoryGrid from "./CategoryGrid";
import Testimonials from "./Testimonials";

async function getWhatsapp() {
  const configs = await prisma.storeConfig.findMany({
    where: { key: { in: ["whatsapp", "whatsapp_message"] } },
  });
  const map = Object.fromEntries(configs.map((c) => [c.key, c.value]));
  return {
    whatsapp: map.whatsapp ?? "5543999999999",
    message: map.whatsapp_message ?? "Olá! Gostaria de saber mais sobre os produtos.",
  };
}

export async function HomeCategoryGrid() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });
  return <CategoryGrid categories={categories} />;
}

export async function HomeFeaturedProducts() {
  const { whatsapp, message } = await getWhatsapp();
  const featured = await prisma.product.findMany({
    where: { active: true, featured: true },
    orderBy: { order: "asc" },
    take: 6,
    include: { images: true, category: { select: { name: true } } },
  });

  if (featured.length === 0) return null;

  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        <div className="flex flex-col items-center text-center gap-3">
          <span className="font-sans text-caramelo text-xs tracking-[0.25em] uppercase">Selecionados</span>
          <h2 className="font-display text-4xl font-semibold text-[#3a2e22]">Produtos em Destaque</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} whatsapp={whatsapp} message={message} />
          ))}
        </div>
      </div>
    </section>
  );
}

export async function HomeLatestProducts() {
  const { whatsapp, message } = await getWhatsapp();
  const latest = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    take: 8,
    include: { images: true, category: { select: { name: true } } },
  });

  if (latest.length === 0) return null;

  return (
    <section className="bg-marfim py-20 px-6" id="novidades">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-2">
            <span className="font-sans text-caramelo text-xs tracking-[0.25em] uppercase">Novidades</span>
            <h2 className="font-display text-4xl font-semibold text-[#3a2e22]">Chegadas Recentes</h2>
          </div>
          <a href="/produtos" className="font-sans text-sm text-caramelo hover:underline underline-offset-4 hidden md:block">
            Ver todos →
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {latest.map((p) => (
            <ProductCard key={p.id} product={p} whatsapp={whatsapp} message={message} />
          ))}
        </div>
        <a href="/produtos" className="font-sans text-sm text-caramelo hover:underline underline-offset-4 text-center md:hidden">
          Ver todos os produtos →
        </a>
      </div>
    </section>
  );
}

export async function HomeTestimonialsSection() {
  return <Testimonials />;
}
