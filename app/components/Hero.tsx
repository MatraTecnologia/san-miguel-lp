export default function Hero() {
  return (
    <section className="relative bg-[#3a2e22] text-marfim overflow-hidden">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 70% 50%, #D6A25F 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 py-24 md:py-36 flex flex-col items-center text-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-caramelo" />
            <span className="font-sans text-caramelo text-xs tracking-[0.25em] uppercase">
              Estofados &amp; Decor
            </span>
            <span className="h-px w-10 bg-caramelo" />
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-semibold text-marfim leading-tight">
            São Miguel
          </h1>

          <p className="font-sans text-champanhe text-lg md:text-xl tracking-wide">
            Conforto que transforma seu lar.
          </p>
        </div>

        <p className="font-sans text-areia text-base md:text-lg max-w-md leading-relaxed">
          Sofás, poltronas e móveis de alto padrão para quem valoriza elegância e bem-estar no dia a dia.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <a
            href="https://wa.me/5543999999999?text=Olá! Vi o site e gostaria de saber mais sobre os produtos."
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans font-semibold text-sm tracking-wide px-8 py-4 rounded-full bg-caramelo text-white hover:bg-caramelo-dark transition-colors"
          >
            Fale no WhatsApp
          </a>
          <a
            href="https://instagram.com/saomiguelestofadosdecor"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans font-semibold text-sm tracking-wide px-8 py-4 rounded-full border border-areia text-areia hover:bg-areia/10 transition-colors"
          >
            Ver no Instagram
          </a>
        </div>

        <div className="mt-6 flex flex-col items-center gap-1 text-areia font-sans text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-caramelo" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Norte Shopping · Londrina, PR</span>
        </div>
      </div>
    </section>
  );
}
