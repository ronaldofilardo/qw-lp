/**
 * Serviço de e-mail — Nodemailer + Microsoft 365 (Outlook).
 *
 * FROM + ADMIN: contato@qwork.app.br (gerenciado via Outlook)
 *
 * Vars: SMTP_PASS | ADMIN_EMAIL
 * SMTP_PASS: senha do M365 ou App Password (se MFA ativo em conta.microsoft.com)
 */
import nodemailer from "nodemailer";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "contato@qwork.app.br";

function createTransporter() {
  return nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: ADMIN_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  });
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export function generateConfirmationLink(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://qwork.app.br";
  return `${baseUrl}/confirmacao?token=${token}`;
}

// ── E-mail: confirmação ao representante ─────────────────────────────────────

export async function sendConfirmationEmail(
  to: string,
  nome: string,
  _token: string,
): Promise<void> {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `QWork <${ADMIN_EMAIL}>`,
    to,
    subject: `QWork — Recebemos seu cadastro de representante`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#1a1a1a;color:#fff;border-radius:12px;">
        <h2 style="color:#9ccc65;margin-bottom:8px;">Olá, ${nome}!</h2>
        <p style="color:#ccc;line-height:1.6;">
          Recebemos seu cadastro como representante QWork. Nossa equipe irá analisar
          suas informações e entrará em contato em breve.
        </p>
        <hr style="border:none;border-top:1px solid #333;margin:24px 0;" />
        <p style="color:#555;font-size:12px;text-align:center;">
          &copy; ${new Date().getFullYear()} QWork — Laudo de Identificação e Mapeamento de Riscos Psicossociais
        </p>
      </div>
    `,
  });

  console.log(`[EMAIL] Confirmação enviada para ${to}`);
}

export interface AdminNotificationPayload {
  tipoPessoa: "PF" | "PJ";
  nome: string;
  email: string;
  telefone: string;
  cpf?: string;
  cnpj?: string;
  razaoSocial?: string;
  cpfResponsavel?: string;
  temDocumentos: boolean;
}

export async function sendAdminNotification(
  data: AdminNotificationPayload,
): Promise<void> {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `QWork <${ADMIN_EMAIL}>`,
    to: ADMIN_EMAIL,
    subject: `🎯 Novo cadastro de representante — ${data.nome}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#1a1a1a;color:#fff;border-radius:12px;">
        <h2 style="color:#9ccc65;">Novo Representante</h2>
        <table style="width:100%;color:#ccc;font-size:14px;line-height:2;">
          <tr><td style="color:#888;">Tipo</td><td><strong>${data.tipoPessoa}</strong></td></tr>
          <tr><td style="color:#888;">Nome</td><td>${data.nome}</td></tr>
          <tr><td style="color:#888;">E-mail</td><td>${data.email}</td></tr>
          <tr><td style="color:#888;">Telefone</td><td>${data.telefone}</td></tr>
          ${data.cpf ? `<tr><td style="color:#888;">CPF</td><td>${data.cpf}</td></tr>` : ""}
          ${data.cnpj ? `<tr><td style="color:#888;">CNPJ</td><td>${data.cnpj}</td></tr>` : ""}
          ${data.razaoSocial ? `<tr><td style="color:#888;">Razão Social</td><td>${data.razaoSocial}</td></tr>` : ""}
          ${data.cpfResponsavel ? `<tr><td style="color:#888;">CPF Resp.</td><td>${data.cpfResponsavel}</td></tr>` : ""}
          <tr><td style="color:#888;">Documentos</td><td>${data.temDocumentos ? "✓ Enviados" : "✗ Não enviados"}</td></tr>
        </table>
        <hr style="border:none;border-top:1px solid #333;margin:24px 0;" />
        <p style="color:#555;font-size:12px;text-align:center;">
          &copy; ${new Date().getFullYear()} QWork
        </p>
      </div>
    `,
  });

  console.log(`[EMAIL] Notificação admin enviada`);
}
