"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, emailOtp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

type Tab = "senha" | "otp";
type OtpStep = "email" | "codigo";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("senha");

  // --- aba senha ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // --- aba OTP ---
  const [otpEmail, setOtpEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpStep, setOtpStep] = useState<OtpStep>("email");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn.email({ email, password });
    if (result.error) {
      setError("Email ou senha incorretos.");
    } else {
      router.push("/admin");
    }
    setLoading(false);
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");
    const result = await emailOtp.sendVerificationOtp({ email: otpEmail, type: "sign-in" });
    if (result.error) {
      setError("Não foi possível enviar o código. Verifique o email.");
    } else {
      setInfo("Código enviado! Verifique seu email.");
      setOtpStep("codigo");
    }
    setLoading(false);
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await emailOtp.signIn({ email: otpEmail, otp: otpCode });
    if (result.error) {
      setError("Código inválido ou expirado.");
    } else {
      router.push("/admin");
    }
    setLoading(false);
  }

  function switchTab(next: Tab) {
    setTab(next);
    setError("");
    setInfo("");
    setOtpStep("email");
    setOtpCode("");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-champanhe px-4">
      <Card className="w-full max-w-sm shadow-md">
        <CardHeader className="text-center">
          <div className="flex flex-col items-center gap-1 mb-2">
            <span className="font-display text-2xl font-semibold text-[#3a2e22]">São Miguel</span>
            <span className="text-xs text-muted-foreground tracking-widest uppercase">Admin</span>
          </div>
          <CardTitle className="text-lg">Entrar</CardTitle>
          <CardDescription>Acesse o painel de administração</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {/* tabs */}
          <div className="flex rounded-lg border border-border overflow-hidden text-sm">
            <button
              type="button"
              onClick={() => switchTab("senha")}
              className={`flex-1 py-2 transition-colors ${tab === "senha" ? "bg-caramelo text-white font-medium" : "bg-transparent text-muted-foreground hover:bg-muted"}`}
            >
              Senha
            </button>
            <button
              type="button"
              onClick={() => switchTab("otp")}
              className={`flex-1 py-2 transition-colors ${tab === "otp" ? "bg-caramelo text-white font-medium" : "bg-transparent text-muted-foreground hover:bg-muted"}`}
            >
              Código OTP
            </button>
          </div>

          {/* aba senha */}
          {tab === "senha" && (
            <form onSubmit={handlePasswordLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Link
                    href="/login/esqueceu-senha"
                    className="text-xs text-caramelo hover:underline"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full bg-caramelo hover:bg-caramelo-dark text-white">
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          )}

          {/* aba OTP */}
          {tab === "otp" && (
            <>
              {otpStep === "email" && (
                <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="otp-email">Email</Label>
                    <Input
                      id="otp-email"
                      type="email"
                      value={otpEmail}
                      onChange={(e) => setOtpEmail(e.target.value)}
                      required
                      autoFocus
                      placeholder="seu@email.com"
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" disabled={loading} className="w-full bg-caramelo hover:bg-caramelo-dark text-white">
                    {loading ? "Enviando..." : "Enviar código"}
                  </Button>
                </form>
              )}

              {otpStep === "codigo" && (
                <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                  {info && <p className="text-sm text-center text-muted-foreground">{info}</p>}
                  <div className="flex flex-col items-center gap-3">
                    <Label>Digite o código de 6 dígitos</Label>
                    <InputOTP
                      maxLength={6}
                      value={otpCode}
                      onChange={setOtpCode}
                    >
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
                  {error && <p className="text-sm text-destructive text-center">{error}</p>}
                  <Button
                    type="submit"
                    disabled={loading || otpCode.length < 6}
                    className="w-full bg-caramelo hover:bg-caramelo-dark text-white"
                  >
                    {loading ? "Verificando..." : "Entrar"}
                  </Button>
                  <button
                    type="button"
                    onClick={() => { setOtpStep("email"); setError(""); setInfo(""); setOtpCode(""); }}
                    className="text-xs text-center text-muted-foreground hover:underline"
                  >
                    Usar outro email
                  </button>
                </form>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
