import Image from "next/image";
import Link from "next/link";

type Category = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
};

export default function CategoryGrid({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="bg-marfim py-20 px-6" id="categorias">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        <div className="flex flex-col items-center text-center gap-3">
          <span className="font-sans text-caramelo text-xs tracking-[0.25em] uppercase">Explore</span>
          <h2 className="font-display text-4xl font-semibold text-[#3a2e22]">Categorias</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/produtos?categoria=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-square bg-areia block"
            >
              {cat.image ? (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-fendi" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
                <span className="font-display text-lg font-semibold text-white">{cat.name}</span>
                <span className="font-sans text-xs text-white/70 group-hover:text-caramelo transition-colors">
                  Ver →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
