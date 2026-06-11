import Image from "next/image";
import Link from "next/link";
import WhatsAppButton from "./WhatsAppButton";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: unknown;
  images: { url: string; isPrimary: boolean }[];
  category: { name: string } | null;
};

interface Props {
  product: Product;
  whatsapp: string;
  message: string;
}

export default function ProductCard({ product, whatsapp, message }: Props) {
  const image = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const price = product.price ? Number(product.price) : null;

  return (
    <div className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-areia/60 hover:border-caramelo/40 hover:shadow-lg transition-all duration-300">
      <Link href={`/produtos/${product.slug}`} className="block relative aspect-square overflow-hidden bg-champanhe">
        {image ? (
          <Image
            src={image.url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-fendi" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </Link>

      <div className="flex flex-col gap-3 p-4">
        {product.category && (
          <span className="font-sans text-xs text-caramelo uppercase tracking-wide">{product.category.name}</span>
        )}
        <Link href={`/produtos/${product.slug}`}>
          <h3 className="font-display text-base font-semibold text-[#3a2e22] leading-snug hover:text-caramelo transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        {price ? (
          <p className="font-sans font-bold text-lg text-[#3a2e22]">
            R$ {price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        ) : (
          <p className="font-sans text-sm text-taupe">Consulte o preço</p>
        )}

        <WhatsAppButton
          productId={product.id}
          productName={product.name}
          whatsapp={whatsapp}
          message={message}
          label="Tenho interesse"
          className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-sans font-semibold text-xs px-4 py-2.5 rounded-full transition-colors mt-auto"
        />
      </div>
    </div>
  );
}
