import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Categorias padrão
  const cats = [
    { name: "Sofás", slug: "sofas", order: 1 },
    { name: "Poltronas", slug: "poltronas", order: 2 },
    { name: "Cadeiras", slug: "cadeiras", order: 3 },
    { name: "Decoração", slug: "decoracao", order: 4 },
  ];

  for (const cat of cats) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  // Configurações padrão da loja
  const configs = [
    { key: "whatsapp", value: "5543999999999" },
    { key: "instagram", value: "saomiguelestofadosdecor" },
    { key: "address", value: "Norte Shopping, Londrina – PR" },
    { key: "hours", value: "Seg a Sáb: 10h–22h | Dom e Feriados: 13h–21h" },
    { key: "whatsapp_message", value: "Olá! Vi o site e gostaria de saber mais sobre os produtos." },
  ];

  for (const config of configs) {
    await prisma.storeConfig.upsert({
      where: { key: config.key },
      update: {},
      create: config,
    });
  }

  console.log("Seed concluído.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
