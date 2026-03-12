/**
 * Cliente Backblaze B2 (S3-compatible) para a landing page QWork
 *
 * Usado apenas no servidor (API routes) para upload direto no staging/prod (Vercel).
 * Em DEV, os uploads são delegados ao backend QWork via QWORK_API_URL.
 */

import crypto from "crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// ── Tipos ──────────────────────────────────────────────────────────────────

export interface BackblazeCredentials {
  keyId: string;
  applicationKey: string;
}

export interface BackblazeUploadResult {
  provider: "backblaze";
  bucket: string;
  key: string;
  url: string;
}

// ── Endpoints permitidos — previne SSRF ────────────────────────────────────

const ALLOWED_ENDPOINT_PATTERN =
  /^https:\/\/s3\.[a-z0-9-]+\.backblazeb2\.com$/i;

function resolveEndpoint(): string {
  let ep =
    process.env.BACKBLAZE_ENDPOINT ||
    "https://s3.us-east-005.backblazeb2.com";

  // Normalizar: adicionar https:// se ausente (compatibilidade com envs sem protocolo)
  if (!/^[a-z]+:\/\//i.test(ep)) {
    ep = `https://${ep}`;
  }

  // Remover barra final
  ep = ep.replace(/\/$/, "");

  if (!ALLOWED_ENDPOINT_PATTERN.test(ep)) {
    throw new Error(
      `[BACKBLAZE] Endpoint inválido: "${ep}". Deve ser https://*.backblazeb2.com`,
    );
  }

  return ep;
}

// ── Factory do cliente S3 ──────────────────────────────────────────────────

function createClient(credentials?: BackblazeCredentials): S3Client | null {
  const endpoint = resolveEndpoint();
  const region =
    process.env.BACKBLAZE_REGION ||
    endpoint.match(/s3\.([a-z0-9-]+)\.backblazeb2\.com/)?.[1] ||
    "us-east-005";

  const keyId = (
    credentials?.keyId ||
    process.env.BACKBLAZE_KEY_ID ||
    process.env.BACKBLAZE_ACCESS_KEY_ID ||
    ""
  ).trim();

  const appKey = (
    credentials?.applicationKey ||
    process.env.BACKBLAZE_APPLICATION_KEY ||
    process.env.BACKBLAZE_SECRET_ACCESS_KEY ||
    ""
  ).trim();

  // Se credenciais não existem, retornar null (fallback ao QWork)
  if (!keyId || !appKey) {
    return null;
  }

  return new S3Client({
    endpoint,
    region,
    credentials: { accessKeyId: keyId, secretAccessKey: appKey },
    forcePathStyle: true,
  });
}

// ── Upload ─────────────────────────────────────────────────────────────────

/**
 * Faz upload de um buffer para o Backblaze B2.
 *
 * @param buffer      - Conteúdo do arquivo
 * @param key         - Caminho/chave dentro do bucket
 * @param contentType - MIME type do arquivo
 * @param bucket      - Nome do bucket de destino
 * @param credentials - Credenciais específicas (opcional; usa env vars como fallback)
 *
 * @throws Error com código "BACKBLAZE_CREDENTIALS_MISSING" se credenciais não configuradas
 */
export async function uploadToBackblaze(
  buffer: Buffer,
  key: string,
  contentType: string,
  bucket: string,
  credentials?: BackblazeCredentials,
): Promise<BackblazeUploadResult> {
  const endpoint = resolveEndpoint();

  // Validação do buffer
  if (!buffer || buffer.length === 0) {
    throw new Error(
      `[BACKBLAZE] Buffer vazio: não é possível fazer upload de arquivo com 0 bytes para ${key}`,
    );
  }

  console.log(
    `[BACKBLAZE] Iniciando upload: ${key} (${buffer.length} bytes, ${contentType})`,
  );

  // Calcular MD5 para verificação de integridade (como no QWork)
  const md5Hash = crypto.createHash("md5").update(buffer).digest("base64");

  const client = createClient(credentials);

  // Credenciais não configuradas — lançar erro específico para fallback
  if (!client) {
    const err = new Error(
      "[BACKBLAZE] Credenciais não configuradas: defina BACKBLAZE_KEY_ID e BACKBLAZE_APPLICATION_KEY",
    );
    (err as any).code = "BACKBLAZE_CREDENTIALS_MISSING";
    throw err;
  }

  try {
    // Uint8Array garante que o SDK v3 não re-processa o Buffer como stream,
    // evitando o erro IncompleteBody em ambientes serverless (Vercel)
    const body = new Uint8Array(buffer);

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        ContentLength: buffer.length,
        ContentMD5: md5Hash,
        Metadata: {
          "uploaded-at": new Date().toISOString(),
          "file-size": buffer.length.toString(),
        },
      }),
    );

    const url = `${endpoint}/${bucket}/${key}`;

    console.log(
      `[BACKBLAZE] Upload bem-sucedido: ${key} (${buffer.length} bytes) → ${bucket}`,
    );

    return { provider: "backblaze", bucket, key, url };
  } catch (error: any) {
    console.error(
      `[BACKBLAZE] Erro no upload de ${key}:`,
      error?.message || error,
    );

    if (
      error?.Code === "InvalidAccessKeyId" ||
      /InvalidAccessKeyId|Malformed Access Key/i.test(String(error?.message || ""))
    ) {
      throw new Error(
        "[BACKBLAZE] Credenciais inválidas (InvalidAccessKeyId). Verifique BACKBLAZE_KEY_ID e BACKBLAZE_APPLICATION_KEY.",
      );
    }

    throw error;
  }
}
