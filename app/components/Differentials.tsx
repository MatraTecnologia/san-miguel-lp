const items = [
  {
    title: "Qualidade Garantida",
    description:
      "Trabalhamos apenas com materiais e fornecedores selecionados para garantir durabilidade e beleza em cada peça.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Preço Justo",
    description:
      "Acreditamos que conforto e elegância não precisam custar uma fortuna. Oferecemos as melhores condições de pagamento.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Atendimento Personalizado",
    description:
      "Nossa equipe está pronta para ajudar você a encontrar a peça ideal, levando em conta seu espaço, estilo e orçamento.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function Differentials() {
  return (
    <section className="bg-[#3a2e22] py-20 px-6">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-12">
        <div className="flex flex-col items-center text-center gap-3">
          <span className="font-sans text-caramelo text-xs tracking-[0.25em] uppercase">
            Nossos diferenciais
          </span>
          <h2 className="font-display text-4xl font-semibold text-marfim">
            Por que escolher a São Miguel?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {items.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center text-center gap-4 bg-white/5 rounded-3xl p-8 border border-white/10"
            >
              <div className="text-caramelo">{item.icon}</div>
              <h3 className="font-display text-xl font-semibold text-marfim">
                {item.title}
              </h3>
              <p className="font-sans text-areia text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
