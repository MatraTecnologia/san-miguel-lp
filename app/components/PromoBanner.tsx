import Link from "next/link";

export default function PromoBanner() {
  return (
    <section className="bg-[#2a2018] py-20 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-caramelo" />
            <span className="font-sans text-caramelo text-xs tracking-[0.25em] uppercase">Norte Shopping</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-marfim leading-tight">
            Visite nossa loja<br />
            <span className="text-caramelo">e experimente</span><br />
            pessoalmente.
          </h2>
          <p className="font-sans text-areia text-base leading-relaxed max-w-sm">
            Nada substitui sentar no sofá perfeito. Venha até o Norte Shopping e deixe nossa equipe ajudar você a escolher.
          </p>
          <Link
            href="/produtos"
            className="inline-flex items-center gap-2 font-sans font-semibold text-sm text-[#3a2e22] bg-caramelo hover:bg-caramelo-dark px-7 py-3.5 rounded-full transition-colors w-fit"
          >
            Ver todos os produtos
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Seg a Sáb", value: "10h às 22h" },
            { label: "Dom e Feriados", value: "13h às 21h" },
            { label: "Localização", value: "Norte Shopping" },
            { label: "Cidade", value: "Londrina – PR" },
          ].map((item) => (
            <div key={item.label} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <p className="font-sans text-xs text-caramelo uppercase tracking-wide mb-1">{item.label}</p>
              <p className="font-sans font-semibold text-marfim text-sm">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
