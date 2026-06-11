import Image from "next/image";
import WhatsAppButton from "./WhatsAppButton";

interface Props {
  whatsapp: string;
  message: string;
  heroImage?: string;
}

export default function Hero({ whatsapp, message, heroImage }: Props) {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-[#2a2018] overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(ellipse at 80% 50%, rgba(214,162,95,0.15) 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 w-full grid md:grid-cols-2 gap-12 items-center py-28 md:py-20">
        <div className="flex flex-col gap-7">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-caramelo" />
            <span className="font-sans text-caramelo text-xs tracking-[0.3em] uppercase">Norte Shopping · Londrina, PR</span>
          </div>

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-marfim leading-[1.1]">
            Estofados que<br />
            <span className="text-caramelo">transformam</span><br />
            seu lar.
          </h1>

          <p className="font-sans text-areia text-lg leading-relaxed max-w-md">
            Sofás, poltronas e cadeiras de alto padrão. Visite nossa loja e encontre a peça perfeita para o seu espaço.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-sm">
            <WhatsAppButton
              whatsapp={whatsapp}
              message={message}
              label="Falar no WhatsApp"
              className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-sans font-semibold text-sm px-7 py-3.5 rounded-full transition-colors"
            />
            <a
              href="/produtos"
              className="flex items-center justify-center font-sans font-semibold text-sm px-7 py-3.5 rounded-full border border-areia/40 text-areia hover:bg-areia/10 transition-colors"
            >
              Ver produtos
            </a>
          </div>
        </div>

        <div className="hidden md:flex items-center justify-center">
          <div className="relative w-full aspect-[4/5] max-w-md rounded-3xl overflow-hidden bg-[#3a2e22]">
            {heroImage ? (
              <Image
                src={heroImage}
                alt="São Miguel Estofados"
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-areia/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-sans text-xs tracking-widest uppercase">Adicione uma foto na home</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
