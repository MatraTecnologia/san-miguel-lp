import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { uploadPublic } from "@/lib/r2";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const folder = req.nextUrl.searchParams.get("folder") ?? "san-miguel-lp/uploads";
  const safeFolder = folder.replace(/\.\./g, "").replace(/\/+/g, "/").replace(/^\/|\/$/g, "");

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type))
    return NextResponse.json({ error: "Tipo não permitido. Use JPG, PNG, WebP ou AVIF." }, { status: 400 });
  if (file.size > MAX_SIZE)
    return NextResponse.json({ error: "Arquivo muito grande. Máximo 5MB." }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const url = await uploadPublic(buffer, file.name, file.type, safeFolder);

  return NextResponse.json({ url });
}
