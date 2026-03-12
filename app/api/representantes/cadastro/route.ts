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
import type { DocUploadResult } from "@/lib/storage/representante-storage";

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

    // ── Upload Backblaze (staging/prod — VERCEL=1) ────────────────────────
    // Em DEV o backend QWork faz o upload; no Vercel a LP sobe diretamente.
    const isVercel = process.env.VERCEL === "1";
    const backblazeUploads: Record<string, DocUploadResult> = {};

    if (isVercel) {
      const { uploadDocumentoRepresentante } = await import(
        "@/lib/storage/representante-storage"
      );

      // Identificador somente dígitos (CPF para PF, CNPJ para PJ)
      const identificador =
        tipoPessoa === "PF"
          ? (raw.cpf ?? "").replace(/\D/g, "")
          : (raw.cnpj ?? "").replace(/\D/g, "");

      try {
        if (tipoPessoa === "PF") {
          const docCpf = formData.get("documentoCpf") as File | null;
          if (docCpf && docCpf.size > 0) {
            console.log(
              `[REPRESENTANTE] Upload PF: documentoCpf (${docCpf.size} bytes, ${docCpf.type})`,
            );
            backblazeUploads.cpf = await uploadDocumentoRepresentante(
              docCpf,
              "cpf",
              identificador,
              "PF",
            );
          }
        } else {
          const docCnpj = formData.get("documentoCnpj") as File | null;
          const docCpfResp = formData.get(
            "documentoCpfResponsavel",
          ) as File | null;

          if (docCnpj && docCnpj.size > 0) {
            console.log(
              `[REPRESENTANTE] Upload PJ: documentoCnpj (${docCnpj.size} bytes, ${docCnpj.type})`,
            );
            backblazeUploads.cnpj = await uploadDocumentoRepresentante(
              docCnpj,
              "cnpj",
              identificador,
              "PJ",
            );
          }
          if (docCpfResp && docCpfResp.size > 0) {
            console.log(
              `[REPRESENTANTE] Upload PJ: documentoCpfResponsavel (${docCpfResp.size} bytes, ${docCpfResp.type})`,
            );
            backblazeUploads.cpf_responsavel =
              await uploadDocumentoRepresentante(
                docCpfResp,
                "cpf_responsavel",
                identificador,
                "PJ",
              );
          }
        }
      } catch (uploadErr) {
        console.error("[REPRESENTANTE] Falha no upload Backblaze:", uploadErr);
        return NextResponse.json(
          { errors: { form: "Erro ao enviar documentos. Tente novamente." } },
          { status: 503 },
        );
      }
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
      // Mapeia campos camelCase da LP para snake_case esperado pelo QWork
      const forwardData = new FormData();

      // Campos comuns
      forwardData.append("tipo_pessoa", (raw.tipoPessoa ?? "").toLowerCase());
      forwardData.append("nome", raw.nome ?? "");
      forwardData.append("email", raw.email ?? "");
      forwardData.append("telefone", raw.telefone ?? "");
      forwardData.append("website", ""); // honeypot vazio

      // Campos PF
      if (raw.tipoPessoa === "PF") {
        forwardData.append("cpf", raw.cpf ?? "");
        if (isVercel) {
          // Staging/prod: arquivos já foram enviados ao Backblaze; passa as chaves
          if (backblazeUploads.cpf) {
            forwardData.append("backblaze_key_cpf", backblazeUploads.cpf.key);
            forwardData.append("backblaze_url_cpf", backblazeUploads.cpf.url);
          }
        } else {
          // DEV: repassa o arquivo para o QWork fazer o upload
          const docCpf = formData.get("documentoCpf") as File | null;
          if (docCpf && docCpf.size > 0)
            forwardData.append("documento_cpf", docCpf);
        }
      }

      // Campos PJ
      if (raw.tipoPessoa === "PJ") {
        forwardData.append("cnpj", raw.cnpj ?? "");
        forwardData.append("razao_social", raw.razaoSocial ?? "");
        forwardData.append("cpf_responsavel", raw.cpfResponsavel ?? "");
        if (isVercel) {
          // Staging/prod: passa as chaves Backblaze
          if (backblazeUploads.cnpj) {
            forwardData.append("backblaze_key_cnpj", backblazeUploads.cnpj.key);
            forwardData.append("backblaze_url_cnpj", backblazeUploads.cnpj.url);
          }
          if (backblazeUploads.cpf_responsavel) {
            forwardData.append(
              "backblaze_key_cpf_responsavel",
              backblazeUploads.cpf_responsavel.key,
            );
            forwardData.append(
              "backblaze_url_cpf_responsavel",
              backblazeUploads.cpf_responsavel.url,
            );
          }
        } else {
          // DEV: repassa os arquivos para o QWork fazer o upload
          const docCnpj = formData.get("documentoCnpj") as File | null;
          const docCpfResp = formData.get(
            "documentoCpfResponsavel",
          ) as File | null;
          if (docCnpj && docCnpj.size > 0)
            forwardData.append("documento_cnpj", docCnpj);
          if (docCpfResp && docCpfResp.size > 0)
            forwardData.append("documento_cpf_responsavel", docCpfResp);
        }
      }

      forwardData.append("token", token);

      try {
        const qworkRes = await fetch(
          `${qworkUrl}/api/public/representantes/cadastro`,
          { method: "POST", body: forwardData },
        );

        if (!qworkRes.ok) {
          let errBody = await qworkRes.text();
          console.error("[REPRESENTANTE] QWork API error:", errBody);

          // Tentar parsear como JSON e extrair mensagem específica
          let qworkError: {
            message?: string;
            error?: string;
            details?: Record<string, string>;
          } = {};
          try {
            qworkError = JSON.parse(errBody);
          } catch {
            // Se não for JSON, continua com errBody como texto
          }

          const errorMsg =
            qworkError.message || qworkError.error || errBody.toLowerCase();

          // Mapear erros de duplicação para mensagens amigáveis
          let userMessage = "Erro ao processar cadastro. Tente novamente.";

          if (
            errorMsg.includes("cpf") &&
            (errorMsg.includes("já existe") ||
              errorMsg.includes("duplicat") ||
              errorMsg.includes("duplicate") ||
              errorMsg.includes("unique"))
          ) {
            userMessage = "Este CPF já foi registrado. Verifique seus dados.";
          } else if (
            errorMsg.includes("cnpj") &&
            (errorMsg.includes("já existe") ||
              errorMsg.includes("duplicat") ||
              errorMsg.includes("duplicate") ||
              errorMsg.includes("unique"))
          ) {
            userMessage = "Este CNPJ já foi registrado. Verifique seus dados.";
          } else if (
            errorMsg.includes("email") &&
            (errorMsg.includes("já existe") ||
              errorMsg.includes("duplicat") ||
              errorMsg.includes("duplicate") ||
              errorMsg.includes("unique"))
          ) {
            userMessage =
              "Este e-mail já foi registrado. Use outro ou faça login.";
          }

          return NextResponse.json(
            { errors: { form: userMessage } },
            { status: 400 },
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
