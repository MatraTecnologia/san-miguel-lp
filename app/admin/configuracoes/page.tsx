import { prisma } from "@/lib/prisma";
import ConfigForm from "./_components/ConfigForm";

export default async function ConfiguracoesPage() {
  const configs = await prisma.storeConfig.findMany();
  const configMap = Object.fromEntries(configs.map((c) => [c.key, c.value]));

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <h1 className="font-display text-2xl font-semibold text-[#3a2e22]">Configurações</h1>
      <ConfigForm configMap={configMap} />
    </div>
  );
}
