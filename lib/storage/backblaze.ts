/**
 * Cliente Backblaze B2 (S3-compatible) para a landing page QWork
 *
 * Usado apenas no servidor (API routes) para upload direto no staging/prod (Vercel).
 * Em DEV, os uploads são delegados ao backend QWork via QWORK_API_URL.
 */

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
  const ep =
    process.env.BACKBLAZE_ENDPOINT ||
    "https://s3.us-east-005.backblazeb2.com";

  if (!ALLOWED_ENDPOINT_PATTERN.test(ep)) {
    throw new Error(
      `[BACKBLAZE] Endpoint inválido: "${ep}". Deve ser *.backblazeb2.com`,
    );
  }

  return ep;
}

// ── Factory do cliente S3 ──────────────────────────────────────────────────

function createClient(credentials?: BackblazeCredentials): S3Client {
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

  if (!keyId || !appKey) {
    throw new Error(
      "[BACKBLAZE] Credenciais não configuradas: defina BACKBLAZE_KEY_ID e BACKBLAZE_APPLICATION_KEY",
    );
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
 */
export async function uploadToBackblaze(
  buffer: Buffer,
  key: string,
  contentType: string,
  bucket: string,
  credentials?: BackblazeCredentials,
): Promise<BackblazeUploadResult> {
  const client = createClient(credentials);
  const endpoint = resolveEndpoint();

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }),
  );

  const url = `${endpoint}/${bucket}/${key}`;

  return { provider: "backblaze", bucket, key, url };
}
