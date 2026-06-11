const categories = [
  {
    title: "Sofás",
    description: "Modelos para todos os estilos e ambientes.",
    bg: "#C4A882",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 opacity-40" fill="none" viewBox="0 0 24 24" stroke="white">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12h18M3 12c0-3.314 2.686-6 6-6h6c3.314 0 6 2.686 6 6M3 12v4a1 1 0 001 1h16a1 1 0 001-1v-4M5 17v2m14-2v2" />
      </svg>
    ),
  },
  {
    title: "Poltronas",
    description: "Conforto e sofisticação para seu espaço.",
    bg: "#B9A58E",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 opacity-40" fill="none" viewBox="0 0 24 24" stroke="white">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 10V7a7 7 0 0114 0v3M5 10a2 2 0 00-2 2v2a2 2 0 002 2h14a2 2 0 002-2v-2a2 2 0 00-2-2M5 10h14M8 16v3m8-3v3" />
      </svg>
    ),
  },
  {
    title: "Cadeiras",
    description: "Design elegante para sala de jantar e escritório.",
    bg: "#A08B73",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 opacity-40" fill="none" viewBox="0 0 24 24" stroke="white">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 3h6v10H9zM7 13h10v2H7zm2 2v4m6-4v4M9 21h6" />
      </svg>
    ),
  },
  {
    title: "Decoração",
    description: "Peças que complementam e valorizam o ambiente.",
    bg: "#D6A25F",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 opacity-40" fill="none" viewBox="0 0 24 24" stroke="white">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 3C8 3 5 7 5 11c0 5 7 10 7 10s7-5 7-10c0-4-3-8-7-8z" />
      </svg>
    ),
  },
];

export default function Products() {
  return (
    <section className="bg-marfim py-20 px-6">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-12">
        <div className="flex flex-col items-center text-center gap-3">
          <span className="font-sans text-caramelo text-xs tracking-[0.25em] uppercase">
            O que oferecemos
          </span>
          <h2 className="font-display text-4xl font-semibold text-[#3a2e22]">
            Nossas Categorias
          </h2>
          <p className="font-sans text-taupe text-base max-w-md">
            Explore nossa seleção de móveis e encontre a peça perfeita para o seu lar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="relative rounded-3xl overflow-hidden group cursor-pointer"
            >
              <div
                className="h-52 w-full flex items-center justify-center"
                style={{ backgroundColor: cat.bg }}
              >
                {cat.icon}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex flex-col justify-end p-6">
                <h3 className="font-display text-2xl font-semibold text-white">
                  {cat.title}
                </h3>
                <p className="font-sans text-white/80 text-sm mt-1">
                  {cat.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <a
          href="https://instagram.com/saomiguelestofadosdecor"
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans font-semibold text-sm tracking-wide px-8 py-4 rounded-full border-2 border-caramelo text-caramelo hover:bg-caramelo hover:text-white transition-colors"
        >
          Ver mais produtos no Instagram
        </a>
      </div>
    </section>
  );
}
