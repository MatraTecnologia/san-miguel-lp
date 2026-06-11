const attributes = [
  {
    label: "Sofisticação",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3l14 9-14 9V3z" />
      </svg>
    ),
  },
  {
    label: "Conforto",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12h18M3 12c0-3.314 2.686-6 6-6h6c3.314 0 6 2.686 6 6M3 12v4a1 1 0 001 1h16a1 1 0 001-1v-4" />
      </svg>
    ),
  },
  {
    label: "Elegância",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
      </svg>
    ),
  },
  {
    label: "Preço Justo",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
    ),
  },
  {
    label: "Acolhimento",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    label: "Atendimento Personalizado",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function About() {
  return (
    <section className="bg-champanhe py-20 px-6">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-12">
        <div className="flex flex-col items-center text-center gap-4">
          <span className="font-sans text-caramelo text-xs tracking-[0.25em] uppercase">
            Nossa história
          </span>
          <h2 className="font-display text-4xl font-semibold text-[#3a2e22]">
            Sobre a São Miguel
          </h2>
          <p className="font-sans text-taupe text-base leading-relaxed max-w-2xl">
            Somos uma loja especializada em estofados e decoração, localizada no coração de Londrina — no Norte Shopping. Há anos transformamos lares com peças que unem estética, durabilidade e conforto real. Cada cliente é recebido com atenção personalizada para encontrar exatamente o que procura.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
          {attributes.map((attr) => (
            <div
              key={attr.label}
              className="flex flex-col items-center gap-3 bg-marfim rounded-2xl p-5 text-center shadow-sm"
            >
              <div className="text-caramelo">{attr.icon}</div>
              <span className="font-sans font-semibold text-sm text-[#3a2e22] tracking-wide">
                {attr.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
