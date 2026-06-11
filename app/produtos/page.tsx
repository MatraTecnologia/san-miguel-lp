import { prisma } from "@/lib/prisma";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ProductCard from "@/app/components/ProductCard";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ categoria?: string }>;
}

export default async function ProdutosPage({ searchParams }: Props) {
  const { categoria } = await searchParams;

  const [config, categories, products] = await Promise.all([
    prisma.storeConfig.findMany(),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.product.findMany({
      where: {
        active: true,
        ...(categoria ? { category: { slug: categoria } } : {}),
      },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      include: { images: true, category: { select: { name: true } } },
    }),
  ]);

  const configMap = Object.fromEntries(config.map((c) => [c.key, c.value]));
  const whatsapp = configMap.whatsapp ?? "5543999999999";
  const message = configMap.whatsapp_message ?? "Olá! Gostaria de saber mais sobre os produtos.";
  const activeCategory = categories.find((c) => c.slug === categoria);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="pt-16 flex-1">
        <div className="bg-[#2a2018] py-14 px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="font-display text-4xl font-semibold text-marfim">
              {activeCategory ? activeCategory.name : "Todos os Produtos"}
            </h1>
            <p className="font-sans text-areia text-sm mt-2">
              {products.length} {products.length === 1 ? "produto encontrado" : "produtos encontrados"}
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-56 shrink-0">
            <div className="sticky top-24 flex flex-col gap-2">
              <p className="font-sans font-semibold text-xs uppercase tracking-wide text-taupe mb-1">Categorias</p>
              <Link
                href="/produtos"
                className={`font-sans text-sm px-3 py-2 rounded-lg transition-colors ${!categoria ? "bg-caramelo text-white" : "text-taupe hover:bg-champanhe"}`}
              >
                Todos
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/produtos?categoria=${cat.slug}`}
                  className={`font-sans text-sm px-3 py-2 rounded-lg transition-colors ${categoria === cat.slug ? "bg-caramelo text-white" : "text-taupe hover:bg-champanhe"}`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </aside>

          <div className="flex-1">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
                <p className="font-sans text-taupe text-lg">Nenhum produto encontrado nesta categoria.</p>
                <Link href="/produtos" className="font-sans text-sm text-caramelo underline underline-offset-4">
                  Ver todos os produtos
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} whatsapp={whatsapp} message={message} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
