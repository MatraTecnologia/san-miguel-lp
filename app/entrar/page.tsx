"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

export default function ContaEntrarPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await signIn.email({ email, password });
    if (result.error) {
      toast.error("Email ou senha incorretos.");
    } else {
      toast.success("Bem-vindo(a) de volta!");
      router.push("/");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-marfim flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-2xl font-semibold text-[#3a2e22]">São Miguel</Link>
          <p className="text-xs text-taupe tracking-widest uppercase mt-1">Estofados & Decor</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#e8ddd0] shadow-sm p-7">
          <h1 className="font-display text-xl font-semibold text-[#2a1f14] mb-1">Entrar na sua conta</h1>
          <p className="text-sm text-taupe mb-6">Acesse para gerenciar seu carrinho.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-[#5a4a3a]">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                placeholder="seu@email.com"
                className="border-[#ddd4c5] focus:border-caramelo"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-medium text-[#5a4a3a]">Senha</Label>
                <Link href="/login/esqueceu-senha" className="text-xs text-caramelo hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-[#ddd4c5] focus:border-caramelo pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-taupe hover:text-[#2a1f14]"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-caramelo hover:bg-caramelo-dark text-white font-sans font-semibold text-sm py-3 rounded-full transition-colors mt-1 disabled:opacity-60"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-taupe mt-6">
          Não tem conta?{" "}
          <Link href="/criar-conta" className="text-caramelo font-medium hover:underline">
            Criar conta
          </Link>
        </p>
        <p className="text-center mt-3">
          <Link href="/" className="text-xs text-taupe hover:text-caramelo">
            ← Voltar para a loja
          </Link>
        </p>
      </div>
    </div>
  );
}
