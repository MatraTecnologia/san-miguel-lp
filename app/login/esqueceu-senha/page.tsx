"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { emailOtp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function EsqueceuSenhaPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await emailOtp.requestPasswordReset({ email });
    if (result.error) {
      setError("Não foi possível enviar o código. Verifique o email informado.");
    } else {
      setSent(true);
      // passa o email via query para a próxima página
      router.push(`/login/redefinir-senha?email=${encodeURIComponent(email)}`);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-champanhe px-4">
      <Card className="w-full max-w-sm shadow-md">
        <CardHeader className="text-center">
          <div className="flex flex-col items-center gap-1 mb-2">
            <span className="font-display text-2xl font-semibold text-[#3a2e22]">São Miguel</span>
            <span className="text-xs text-muted-foreground tracking-widest uppercase">Admin</span>
          </div>
          <CardTitle className="text-lg">Recuperar senha</CardTitle>
          <CardDescription>
            Informe seu email para receber um código de redefinição.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <p className="text-sm text-center text-muted-foreground">Redirecionando...</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  placeholder="seu@email.com"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full bg-caramelo hover:bg-caramelo-dark text-white">
                {loading ? "Enviando..." : "Enviar código"}
              </Button>
              <Link
                href="/login"
                className="text-xs text-center text-muted-foreground hover:underline"
              >
                Voltar ao login
              </Link>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
