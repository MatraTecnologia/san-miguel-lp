"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateOrder({
  id,
  status,
  notes,
  deliveryAt,
  warrantyAt,
}: {
  id: string;
  status: string;
  notes: string;
  deliveryAt: string | null;
  warrantyAt: string | null;
}) {
  await prisma.order.update({
    where: { id },
    data: {
      status,
      notes: notes || null,
      deliveryAt: deliveryAt ? new Date(deliveryAt) : null,
      warrantyAt: warrantyAt ? new Date(warrantyAt) : null,
    },
  });
  revalidatePath(`/admin/pedidos/${id}`);
  revalidatePath("/admin/pedidos");
}
