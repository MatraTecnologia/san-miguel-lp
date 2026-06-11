export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import WhatsAppButton from "@/app/components/WhatsAppButton";
import ProductCard from "@/app/components/ProductCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const [product, config] = await Promise.all([
    prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { order: "asc" } },
        category: true,
      },
    }),
    prisma.storeConfig.findMany(),
  ]);

  if (!product || !product.active) notFound();

  const configMap = Object.fromEntries(config.map((c) => [c.key, c.value]));
  const whatsapp = configMap.whatsapp ?? "5543999999999";
  const message = configMap.whatsapp_message ?? "Olá! Gostaria de saber mais sobre os produtos.";

  const related = await prisma.product.findMany({
    where: { active: true, categoryId: product.categoryId, NOT: { id: product.id } },
    take: 4,
    include: { images: true, category: { select: { name: true } } },
  });

  const primaryImage = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const price = product.price ? Number(product.price) : null;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="pt-16 flex-1">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="flex flex-col gap-3">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-champanhe">
                {primaryImage ? (
                  <Image src={primaryImage.url} alt={product.name} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-fendi">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.images.map((img) => (
                    <div key={img.id} className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-champanhe border-2 border-areia">
                      <Image src={img.url} alt={product.name} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-6 sticky top-24">
              {product.category && (
                <span className="font-sans text-xs text-caramelo uppercase tracking-[0.2em]">{product.category.name}</span>
              )}
              <h1 className="font-display text-3xl md:text-4xl font-semibold text-[#3a2e22] leading-tight">
                {product.name}
              </h1>

              {price ? (
                <div className="flex flex-col gap-1">
                  <p className="font-sans text-sm text-taupe">Preço</p>
                  <p className="font-sans font-bold text-3xl text-[#3a2e22]">
                    R$ {price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              ) : (
                <p className="font-sans text-lg text-taupe">Consulte o preço via WhatsApp</p>
              )}

              {product.description && (
                <p className="font-sans text-taupe text-base leading-relaxed">{product.description}</p>
              )}

              <div className="flex flex-col gap-3 pt-2">
                <WhatsAppButton
                  productId={product.id}
                  productName={product.name}
                  whatsapp={whatsapp}
                  message={message}
                />
                <p className="font-sans text-xs text-taupe text-center">
                  Você será redirecionado ao WhatsApp para finalizar o pedido.
                </p>
              </div>

              <div className="border-t border-areia pt-5 flex flex-col gap-2">
                <div className="flex gap-2 items-center text-sm text-taupe font-sans">
                  <span className="w-2 h-2 rounded-full bg-[#25D366]" />
                  Atendimento personalizado na loja ou pelo WhatsApp
                </div>
                <div className="flex gap-2 items-center text-sm text-taupe font-sans">
                  <span className="w-2 h-2 rounded-full bg-caramelo" />
                  Entrega disponível em Londrina e região
                </div>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-20 flex flex-col gap-8">
              <h2 className="font-display text-2xl font-semibold text-[#3a2e22]">Produtos Relacionados</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} whatsapp={whatsapp} message={message} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
