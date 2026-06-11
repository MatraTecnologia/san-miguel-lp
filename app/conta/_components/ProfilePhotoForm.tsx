"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateProfilePhoto } from "../actions";

interface Props {
  userId: string;
  currentImage: string;
  name: string;
}

export default function ProfilePhotoForm({ userId, currentImage, name }: Props) {
  const [image, setImage] = useState(currentImage);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`/api/upload?folder=san-miguel-lp/avatars`, { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro no upload");
      setImage(data.url);
      await updateProfilePhoto(userId, data.url);
      toast.success("Foto atualizada!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro no upload");
    } finally {
      setUploading(false);
    }
  }

  return (
    <label className="relative cursor-pointer group">
      <div className="w-20 h-20 rounded-full overflow-hidden bg-caramelo/20 border-2 border-white shadow-md flex items-center justify-center">
        {image ? (
          <Image src={image} alt={name} fill className="object-cover" />
        ) : (
          <span className="font-display text-2xl font-bold text-caramelo">{name?.[0]?.toUpperCase()}</span>
        )}
      </div>
      <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        {uploading ? (
          <Loader2 className="w-5 h-5 text-white animate-spin" />
        ) : (
          <Camera className="w-5 h-5 text-white" />
        )}
      </div>
      <input
        type="file"
        className="hidden"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
      />
    </label>
  );
}
