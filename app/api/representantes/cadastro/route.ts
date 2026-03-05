/**
 * POST /api/representantes/cadastro
 *
 * Recebe FormData do formulário de cadastro de representantes.
 * Valida campos, gera token de confirmação, dispara e-mails via Resend
 * e encaminha os dados ao backend QWork para persistência.
 */
import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import {
  pessoaFisicaSchema,
  pessoaJuridicaSchema,
  validateFile,
} from "@/lib/validators/representante";
import { sendConfirmationEmail, sendAdminNotification } from "@/lib/email";
import type { AdminNotificationPayload } from "@/lib/email";

// ── Helpers ────────────────────────────────────────────────────────────────

function fieldErrors(
  issues: { path: PropertyKey[]; message: string }[],
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "form");
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

// ── Handler ────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // ── Honeypot ──────────────────────────────────────────────────────────
    const honeypot = formData.get("website") as string | null;
    if (honeypot) {
      // Bot detected — retorna 200 silencioso
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // ── Extrair campos de texto ───────────────────────────────────────────
    const tipoPessoa = formData.get("tipoPessoa") as string;
    const nome = formData.get("nome") as string;
    const email = formData.get("email") as string;
    const telefone = formData.get("telefone") as string;

    const raw: Record<string, string> = {
      tipoPessoa,
      nome: nome ?? "",
      email: email ?? "",
      telefone: telefone ?? "",
      website: "",
    };

    if (tipoPessoa === "PF") {
      raw.cpf = (formData.get("cpf") as string) ?? "";
    } else if (tipoPessoa === "PJ") {
      raw.razaoSocial = (formData.get("razaoSocial") as string) ?? "";
      raw.cnpj = (formData.get("cnpj") as string) ?? "";
      raw.cpfResponsavel = (formData.get("cpfResponsavel") as string) ?? "";
    } else {
      return NextResponse.json(
        { errors: { tipoPessoa: "Tipo de pessoa inválido." } },
        { status: 400 },
      );
    }

    // ── Validação Zod ─────────────────────────────────────────────────────
    const schema =
      tipoPessoa === "PF" ? pessoaFisicaSchema : pessoaJuridicaSchema;
    const result = schema.safeParse(raw);

    if (!result.success) {
      return NextResponse.json(
        { errors: fieldErrors(result.error.issues) },
        { status: 400 },
      );
    }

    // ── Validar arquivos ──────────────────────────────────────────────────
    const fileErrors: Record<string, string> = {};
    let hasFiles = false;

    if (tipoPessoa === "PF") {
      const docCpf = formData.get("documentoCpf") as File | null;
      if (docCpf && docCpf.size > 0) {
        const v = validateFile(docCpf);
        if (!v.valid) fileErrors.documentoCpf = v.error;
        else hasFiles = true;
      }
    } else {
      const docCnpj = formData.get("documentoCnpj") as File | null;
      const docCpfResp = formData.get("documentoCpfResponsavel") as File | null;

      if (docCnpj && docCnpj.size > 0) {
        const v = validateFile(docCnpj);
        if (!v.valid) fileErrors.documentoCnpj = v.error;
        else hasFiles = true;
      }
      if (docCpfResp && docCpfResp.size > 0) {
        const v = validateFile(docCpfResp);
        if (!v.valid) fileErrors.documentoCpfResponsavel = v.error;
        else hasFiles = true;
      }
    }

    if (Object.keys(fileErrors).length > 0) {
      return NextResponse.json({ errors: fileErrors }, { status: 400 });
    }

    // ── Gerar token ───────────────────────────────────────────────────────
    const token = crypto.randomUUID();

    // ── Encaminhar ao backend QWork ───────────────────────────────────────
    // QWORK_API_SKIP=true permite testar a LP localmente sem o backend QWork.
    // Em produção, mantenha QWORK_API_SKIP indefinido ou false.
    const skipQWork = process.env.QWORK_API_SKIP === "true";
    const qworkUrl = process.env.QWORK_API_URL || "http://localhost:3001";

    if (skipQWork) {
      console.log(
        "[REPRESENTANTE][DEV] QWORK_API_SKIP=true — encaminhamento ao QWork ignorado.",
        {
          tipoPessoa: raw.tipoPessoa,
          nome: raw.nome,
          email: raw.email,
          token,
          hasFiles,
        },
      );
    } else {
      const forwardData = new FormData();
      for (const [key, value] of formData.entries()) {
        forwardData.append(key, value as string | Blob);
      }
      forwardData.append("token", token);

      try {
        const qworkRes = await fetch(
          `${qworkUrl}/api/public/representantes/cadastro`,
          { method: "POST", body: forwardData },
        );

        if (!qworkRes.ok) {
          const errBody = await qworkRes.text();
          console.error("[REPRESENTANTE] QWork API error:", errBody);
          return NextResponse.json(
            {
              errors: { form: "Erro ao processar cadastro. Tente novamente." },
            },
            { status: 502 },
          );
        }
      } catch (fetchErr) {
        console.error("[REPRESENTANTE] QWork API unreachable:", fetchErr);
        return NextResponse.json(
          { errors: { form: "Serviço temporariamente indisponível." } },
          { status: 503 },
        );
      }
    }

    // ── Disparar e-mails (aguardados — erros aparecem no terminal) ────────
    const adminPayload: AdminNotificationPayload = {
      tipoPessoa: tipoPessoa as "PF" | "PJ",
      nome: raw.nome,
      email: raw.email,
      telefone: raw.telefone,
      cpf: raw.cpf,
      cnpj: raw.cnpj,
      razaoSocial: raw.razaoSocial,
      cpfResponsavel: raw.cpfResponsavel,
      temDocumentos: hasFiles,
    };

    const emailResults = await Promise.allSettled([
      sendConfirmationEmail(raw.email, raw.nome, token),
      sendAdminNotification(adminPayload),
    ]);

    emailResults.forEach((result, i) => {
      const label =
        i === 0 ? "confirmação (representante)" : "notificação (admin)";
      if (result.status === "rejected") {
        console.error(
          `[REPRESENTANTE] Falha no email de ${label}:`,
          result.reason,
        );
      }
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("[REPRESENTANTE] Unexpected error:", err);
    return NextResponse.json(
      { errors: { form: "Erro interno." } },
      { status: 500 },
    );
  }
}
