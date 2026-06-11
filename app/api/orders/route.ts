import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { items, whatsappMsg } = body as {
    items: { id: string; name: string; price: number | null; quantity: number; imageUrl: string }[];
    whatsappMsg: string;
  };

  if (!items?.length) return NextResponse.json({ error: "No items" }, { status: 400 });

  const total = items.reduce((sum, i) => sum + (i.price ?? 0) * i.quantity, 0);

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      whatsappMsg,
      totalPrice: total > 0 ? total : null,
      items: {
        create: items.map((i) => ({
          productId: i.id,
          name: i.name,
          price: i.price ?? null,
          quantity: i.quantity,
          imageUrl: i.imageUrl || null,
        })),
      },
    },
  });

  // Track lead
  await prisma.lead.create({ data: { source: "cart_checkout" } });

  return NextResponse.json({ orderId: order.id });
}
