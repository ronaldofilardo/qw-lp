/**
 * Serviço de e-mail para cadastro de representantes — Resend.
 *
 * Confirmação ao representante → Resend (onboarding@resend.dev)
 * Notificação ao admin         → Resend (onboarding@resend.dev)
 *
 * Vars: RESEND_API_KEY | DE_EMAIL | ADMIN_EMAIL
 * DE_EMAIL: após verificar qwork.app.br em https://resend.com/domains, troque para:
 *   DE_EMAIL=QWork <nao-responda@qwork.app.br>
 */
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "ronaldofilardo@gmail.com";
const DE_EMAIL = process.env.DE_EMAIL || "QWork <onboarding@resend.dev>";

// ── Helpers ──────────────────────────────────────────────────────────────────

export function generateConfirmationLink(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://qwork.app.br";
  return `${baseUrl}/confirmacao?token=${token}`;
}

// ── E-mail: confirmação ao representante (Resend) ────────────────────────────

export async function sendConfirmationEmail(
  to: string,
  nome: string,
  _token: string,
): Promise<void> {
  // Em dev (QWORK_API_SKIP=true), o sandbox do Resend só permite enviar para
  // o e-mail do dono da conta. Redirecionamos para ADMIN_EMAIL para que o teste
  // seja possível sem domínio verificado.
  const isDev = process.env.QWORK_API_SKIP === "true";
  const actualTo = isDev ? ADMIN_EMAIL : to;
  const subjectPrefix = isDev ? `[DEV → ${to}] ` : "";

  const result = await resend.emails.send({
    from: DE_EMAIL,
    to: actualTo,
    subject: `${subjectPrefix}QWork — Recebemos seu cadastro de representante`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#1a1a1a;color:#fff;border-radius:12px;">
        ${isDev ? `<p style="background:#333;color:#f0c040;padding:8px 12px;border-radius:6px;font-size:12px;margin-bottom:16px;">⚠️ DEV — Este e-mail seria enviado para <strong>${to}</strong> em produção.</p>` : ""}
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

  if (result.error) {
    console.error(
      `[EMAIL] Falha ao enviar confirmação para ${actualTo}:`,
      result.error,
    );
    throw new Error(`Resend error: ${result.error.message}`);
  }

  console.log(
    `[EMAIL] Confirmação enviada para ${actualTo}${isDev ? ` (dev redirect de ${to})` : ""} | id: ${result.data?.id}`,
  );
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
  const result = await resend.emails.send({
    from: DE_EMAIL,
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

  if (result.error) {
    console.error(
      `[EMAIL] Falha ao enviar notificação ao admin:`,
      result.error,
    );
    throw new Error(`Resend error: ${result.error.message}`);
  }

  console.log(`[EMAIL] Notificação admin enviada | id: ${result.data?.id}`);
}
