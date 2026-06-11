"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveConfigs } from "../actions";
import ImageUploader from "@/components/ImageUploader";
import { toast } from "sonner";

const TEXT_FIELDS = [
  { key: "whatsapp", label: "WhatsApp (somente números, com DDI)", placeholder: "5543999999999" },
  { key: "instagram", label: "Instagram (sem @)", placeholder: "saomiguelestofadosdecor" },
  { key: "address", label: "Endereço", placeholder: "Norte Shopping, Londrina – PR" },
  { key: "hours", label: "Horário de Funcionamento", placeholder: "Seg a Sáb: 10h–22h | Dom: 13h–21h" },
  { key: "whatsapp_message", label: "Mensagem padrão do WhatsApp", placeholder: "Olá! Gostaria de saber mais..." },
];

export default function ConfigForm({ configMap }: { configMap: Record<string, string> }) {
  const [heroImage, setHeroImage] = useState(configMap.hero_image ?? "");

  async function handleAction(formData: FormData) {
    formData.set("hero_image", heroImage);
    try {
      await saveConfigs(formData);
      toast.success("Configurações salvas!");
    } catch {
      toast.error("Erro ao salvar. Tente novamente.");
    }
  }

  return (
    <form action={handleAction} className="flex flex-col gap-6">
      <div className="flex flex-col gap-5 bg-card rounded-2xl border p-6">
        <h2 className="font-display text-base font-semibold text-[#3a2e22]">Informações da loja</h2>
        {TEXT_FIELDS.map((field) => (
          <div key={field.key} className="flex flex-col gap-1.5">
            <Label htmlFor={field.key}>{field.label}</Label>
            <Input
              id={field.key}
              name={field.key}
              defaultValue={configMap[field.key] ?? ""}
              placeholder={field.placeholder}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-5 bg-card rounded-2xl border p-6">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-base font-semibold text-[#3a2e22]">Foto principal da Home</h2>
          <p className="text-xs text-muted-foreground">Aparece no lado direito do banner principal do site.</p>
        </div>
        <ImageUploader
          value={heroImage}
          onChange={setHeroImage}
          label=""
          folder="san-miguel-lp/home"
        />
      </div>

      <Button type="submit" className="self-start bg-caramelo hover:bg-caramelo-dark text-white">
        Salvar configurações
      </Button>
    </form>
  );
}
