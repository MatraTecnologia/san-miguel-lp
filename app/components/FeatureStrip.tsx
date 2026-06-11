import { Truck, ShieldCheck, Star, HeadphonesIcon } from "lucide-react";

const features = [
  { icon: Truck, label: "Entrega em Londrina", sub: "Região metropolitana" },
  { icon: ShieldCheck, label: "Garantia de Qualidade", sub: "Materiais selecionados" },
  { icon: Star, label: "Preço Justo", sub: "Melhores condições" },
  { icon: HeadphonesIcon, label: "Atendimento Personalizado", sub: "Segunda a Domingo" },
];

export default function FeatureStrip() {
  return (
    <section className="bg-white border-b border-areia">
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {features.map((f) => (
          <div key={f.label} className="flex items-center gap-3">
            <div className="shrink-0 w-10 h-10 rounded-full bg-champanhe flex items-center justify-center">
              <f.icon className="w-4.5 h-4.5 text-caramelo" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-sans font-semibold text-sm text-[#3a2e22] leading-tight">{f.label}</p>
              <p className="font-sans text-xs text-taupe">{f.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
