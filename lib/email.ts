import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = process.env.SMTP_FROM ?? "São Miguel <noreply@matratecnologia.com>";

const baseStyles = `
  font-family: 'Georgia', serif;
  margin: 0;
  padding: 0;
  background-color: #F6F1E9;
  color: #3a2e22;
`;

function emailWrapper(content: string): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="${baseStyles}">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F6F1E9; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px; background-color:#fff; border-radius:12px; overflow:hidden; box-shadow:0 2px 12px rgba(58,46,34,0.08);">

          <!-- Header -->
          <tr>
            <td style="background-color:#EFE3D0; padding:28px 32px; text-align:center; border-bottom:3px solid #D6A25F;">
              <span style="font-family:'Georgia',serif; font-size:26px; font-weight:700; color:#3a2e22; letter-spacing:1px;">
                São Miguel
              </span>
              <br/>
              <span style="font-family:'Helvetica Neue',sans-serif; font-size:11px; color:#8D7C69; letter-spacing:3px; text-transform:uppercase;">
                Estofados &amp; Decor
              </span>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:36px 32px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#F6F1E9; padding:20px 32px; text-align:center; border-top:1px solid #E6D7BE;">
              <p style="font-family:'Helvetica Neue',sans-serif; font-size:12px; color:#8D7C69; margin:0;">
                © São Miguel Estofados &amp; Decor · Londrina, PR
              </p>
              <p style="font-family:'Helvetica Neue',sans-serif; font-size:11px; color:#B9A58E; margin:6px 0 0;">
                Este e-mail foi enviado automaticamente. Não responda a esta mensagem.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendOTPEmail(email: string, otp: string, type: string) {
  const isSignIn = type === "sign-in";
  const subject = isSignIn ? "Seu código de acesso" : "Código de verificação";
  const heading = isSignIn ? "Código de acesso" : "Verificação de e-mail";
  const description = isSignIn
    ? "Use o código abaixo para entrar na sua conta:"
    : "Use o código abaixo para verificar seu e-mail:";

  const content = `
    <h2 style="font-family:'Georgia',serif; font-size:20px; font-weight:700; color:#3a2e22; margin:0 0 8px;">${heading}</h2>
    <p style="font-family:'Helvetica Neue',sans-serif; font-size:15px; color:#5a4a3a; margin:0 0 28px; line-height:1.6;">
      ${description}
    </p>

    <div style="background-color:#EFE3D0; border-radius:10px; padding:24px; text-align:center; margin-bottom:28px; border:1px solid #E6D7BE;">
      <span style="font-family:'Courier New',monospace; font-size:38px; font-weight:700; color:#D6A25F; letter-spacing:10px;">
        ${otp}
      </span>
    </div>

    <p style="font-family:'Helvetica Neue',sans-serif; font-size:13px; color:#8D7C69; margin:0; line-height:1.6;">
      Este código expira em <strong>5 minutos</strong>. Se você não solicitou este código, ignore este e-mail.
    </p>
  `;

  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: `São Miguel — ${subject}`,
    html: emailWrapper(content),
  });
}

export async function sendResetPasswordEmail(email: string, url: string) {
  const content = `
    <h2 style="font-family:'Georgia',serif; font-size:20px; font-weight:700; color:#3a2e22; margin:0 0 8px;">Redefinir senha</h2>
    <p style="font-family:'Helvetica Neue',sans-serif; font-size:15px; color:#5a4a3a; margin:0 0 28px; line-height:1.6;">
      Recebemos uma solicitação para redefinir a senha da sua conta. Clique no botão abaixo para criar uma nova senha:
    </p>

    <div style="text-align:center; margin-bottom:28px;">
      <a href="${url}"
         style="display:inline-block; background-color:#D6A25F; color:#fff; font-family:'Helvetica Neue',sans-serif; font-size:15px; font-weight:600; text-decoration:none; padding:14px 32px; border-radius:8px; letter-spacing:0.5px;">
        Redefinir minha senha
      </a>
    </div>

    <p style="font-family:'Helvetica Neue',sans-serif; font-size:13px; color:#8D7C69; margin:0 0 8px; line-height:1.6;">
      Ou copie e cole o link abaixo no seu navegador:
    </p>
    <p style="font-family:'Courier New',monospace; font-size:12px; color:#B9A58E; margin:0 0 24px; word-break:break-all;">
      ${url}
    </p>

    <p style="font-family:'Helvetica Neue',sans-serif; font-size:13px; color:#8D7C69; margin:0; line-height:1.6;">
      Este link expira em <strong>1 hora</strong>. Se você não solicitou a redefinição de senha, ignore este e-mail — sua conta está segura.
    </p>
  `;

  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: "São Miguel — Redefinir senha",
    html: emailWrapper(content),
  });
}
