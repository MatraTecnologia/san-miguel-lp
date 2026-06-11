import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { productId, source } = await req.json();

  await prisma.lead.create({
    data: {
      productId: productId ?? null,
      source: source ?? null,
    },
  });

  return NextResponse.json({ ok: true });
}
