"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { emailOtp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

function RedefinirSenhaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") ?? "";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("As senhas não conferem.");
      return;
    }
    if (newPassword.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    setLoading(true);
    const result = await emailOtp.resetPassword({ email: emailParam, otp, password: newPassword });
    if (result.error) {
      setError("Código inválido ou expirado. Tente novamente.");
    } else {
      router.push("/login?reset=1");
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
          <CardTitle className="text-lg">Nova senha</CardTitle>
          <CardDescription>
            {emailParam
              ? `Digite o código enviado para ${emailParam} e escolha uma nova senha.`
              : "Digite o código recebido por email e escolha uma nova senha."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-2">
              <Label>Código de verificação</Label>
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="new-password">Nova senha</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Mínimo 8 caracteres"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirm-password">Confirmar senha</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full bg-caramelo hover:bg-caramelo-dark text-white"
            >
              {loading ? "Salvando..." : "Redefinir senha"}
            </Button>

            <Link
              href="/login/esqueceu-senha"
              className="text-xs text-center text-muted-foreground hover:underline"
            >
              Reenviar código
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function RedefinirSenhaPage() {
  return (
    <Suspense>
      <RedefinirSenhaForm />
    </Suspense>
  );
}
