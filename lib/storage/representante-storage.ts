/**
 * Armazenamento de documentos de representantes no Backblaze B2
 *
 * Bucket: rep-qwork
 *
 * Estrutura de paths:
 *   Cadastro PF: PF/{CPF}/CAD/{tipo}_{ts}-{rnd}.{ext}
 *   Cadastro PJ: PJ/{CNPJ}/CAD/{tipo}_{ts}-{rnd}.{ext}
 *   RPA (PF):    PF/{CPF}/RPA/{tipo}_{ts}-{rnd}.{ext}
 *   NF (PJ):     PJ/{CNPJ}/NF/{tipo}_{ts}-{rnd}.{ext}
 *   Comprovante: {PF|PJ}/{id}/COMP/{tipo}_{ts}-{rnd}.{ext}
 *
 * Utilizado pela landing page no staging/prod (VERCEL=1).
 * Em DEV, o upload é delegado ao backend QWork via QWORK_API_URL.
 */

import { uploadToBackblaze } from "./backblaze";
import type { BackblazeUploadResult } from "./backblaze";

// ── Constantes ─────────────────────────────────────────────────────────────

const REP_BUCKET = "rep-qwork";

export type TipoPessoa = "PF" | "PJ";

/** Subpastas do bucket utilizadas pela landing page */
export type SubpastaRep = "CAD" | "RPA" | "NF" | "COMP";

/** Tipos de documento enviados no cadastro */
export type TipoDocRepresentante =
  | "cpf" // PF: documento de identidade/CPF
  | "cnpj" // PJ: cartão CNPJ
  | "cpf_responsavel"; // PJ: CPF do responsável

export interface DocUploadResult {
  key: string;
  url: string;
  bucket: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function mimeToExt(mime: string): string {
  switch (mime) {
    case "application/pdf":
      return "pdf";
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    default:
      return "pdf";
  }
}

/** Valida os magic bytes do buffer para confirmar o conteúdo real */
function validarMagicBytes(buffer: Buffer, mime: string): boolean {
  if (buffer.length < 4) return false;
  switch (mime) {
    case "application/pdf":
      return (
        buffer[0] === 0x25 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x44 &&
        buffer[3] === 0x46
      );
    case "image/jpeg":
      return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    case "image/png":
      return (
        buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4e &&
        buffer[3] === 0x47
      );
    default:
      return false;
  }
}

// ── Upload principal ───────────────────────────────────────────────────────

/**
 * Faz upload de um documento de representante para o bucket rep-qwork.
 *
 * @param file           - Objeto File recebido via FormData
 * @param tipo           - Tipo do documento ("cpf" | "cnpj" | "cpf_responsavel")
 * @param identificador  - CPF ou CNPJ sem formatação (somente dígitos)
 * @param tipoPessoa     - "PF" ou "PJ"
 * @param subpasta       - Subpasta de destino (default: "CAD" para cadastros)
 */
export async function uploadDocumentoRepresentante(
  file: File,
  tipo: TipoDocRepresentante,
  identificador: string,
  tipoPessoa: TipoPessoa,
  subpasta: SubpastaRep = "CAD",
): Promise<DocUploadResult> {
  const buffer = Buffer.from(await file.arrayBuffer());

  // Validação de conteúdo via magic bytes (evita upload de arquivos adulterados)
  if (!validarMagicBytes(buffer, file.type)) {
    throw new Error(
      `Conteúdo do arquivo "${tipo}" não corresponde ao tipo declarado (${file.type})`,
    );
  }

  const ext = mimeToExt(file.type);
  const ts = Date.now();
  const rnd = Math.random().toString(36).slice(2, 8);

  // Exemplo: PF/12345678901/CAD/cpf_1709123456789-abc123.pdf
  const key = `${tipoPessoa}/${identificador}/${subpasta}/${tipo}_${ts}-${rnd}.${ext}`;

  // Usa credenciais dedicadas ao bucket rep-qwork quando disponíveis
  const repKeyId = process.env.BACKBLAZE_REP_KEY_ID?.trim();
  const repAppKey = process.env.BACKBLAZE_REP_APPLICATION_KEY?.trim();
  const credentials =
    repKeyId && repAppKey ? { keyId: repKeyId, applicationKey: repAppKey } : undefined;

  if (!credentials) {
    console.warn(
      "[REP-STORAGE] BACKBLAZE_REP_KEY_ID não definido — usando credenciais padrão",
    );
  }

  const result: BackblazeUploadResult = await uploadToBackblaze(
    buffer,
    key,
    file.type,
    REP_BUCKET,
    credentials,
  );

  console.log(
    `[REP-STORAGE] ${tipo} (${tipoPessoa}/${identificador}) → ${REP_BUCKET}/${key}`,
  );

  return { key: result.key, url: result.url, bucket: result.bucket };
}
