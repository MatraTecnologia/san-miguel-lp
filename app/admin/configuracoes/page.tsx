import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveConfigs } from "./actions";

const CONFIG_FIELDS = [
  { key: "whatsapp", label: "WhatsApp (somente números, com DDI)", placeholder: "5543999999999" },
  { key: "instagram", label: "Instagram (sem @)", placeholder: "saomiguelestofadosdecor" },
  { key: "address", label: "Endereço", placeholder: "Norte Shopping, Londrina – PR" },
  { key: "hours", label: "Horário de Funcionamento", placeholder: "Seg a Sáb: 10h–22h | Dom: 13h–21h" },
  { key: "whatsapp_message", label: "Mensagem padrão do WhatsApp", placeholder: "Olá! Gostaria de saber mais..." },
];

export default async function ConfiguracoesPage() {
  const configs = await prisma.storeConfig.findMany();
  const configMap = Object.fromEntries(configs.map((c) => [c.key, c.value]));

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <h1 className="font-display text-2xl font-semibold text-[#3a2e22]">Configurações</h1>

      <form action={saveConfigs} className="flex flex-col gap-5 bg-card rounded-2xl border p-6">
        {CONFIG_FIELDS.map((field) => (
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

        <Button type="submit" className="mt-2 bg-caramelo hover:bg-caramelo-dark text-white">
          Salvar configurações
        </Button>
      </form>
    </div>
  );
}
