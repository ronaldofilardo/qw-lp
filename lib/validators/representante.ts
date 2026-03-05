/**
 * Validadores e schemas Zod para cadastro de representantes.
 */
import { z } from "zod";

// ── CPF ────────────────────────────────────────────────────────────────────

export function validateCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false; // todos iguais

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(digits[i]) * (10 - i);
  let rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  if (rest !== Number(digits[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(digits[i]) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  return rest === Number(digits[10]);
}

// ── CNPJ ───────────────────────────────────────────────────────────────────

export function validateCNPJ(cnpj: string): boolean {
  const digits = cnpj.replace(/\D/g, "");
  if (digits.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(digits)) return false;

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  let sum = 0;
  for (let i = 0; i < 12; i++) sum += Number(digits[i]) * weights1[i];
  let rest = sum % 11;
  const d1 = rest < 2 ? 0 : 11 - rest;
  if (d1 !== Number(digits[12])) return false;

  sum = 0;
  for (let i = 0; i < 13; i++) sum += Number(digits[i]) * weights2[i];
  rest = sum % 11;
  const d2 = rest < 2 ? 0 : 11 - rest;
  return d2 === Number(digits[13]);
}

// ── Helpers ────────────────────────────────────────────────────────────────

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3 MB
const ACCEPTED_MIMES = ["application/pdf", "image/jpeg", "image/png"] as const;

export function validateFile(
  file: File,
): { valid: true } | { valid: false; error: string } {
  if (!ACCEPTED_MIMES.includes(file.type as (typeof ACCEPTED_MIMES)[number])) {
    return {
      valid: false,
      error: "Formato inválido. Aceitos: PDF, JPG, PNG.",
    };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "Arquivo excede 3 MB." };
  }
  return { valid: true };
}

// ── Schemas Zod ────────────────────────────────────────────────────────────

const baseSchema = z.object({
  nome: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres.")
    .max(120, "Nome muito longo."),
  email: z.string().email("E-mail inválido."),
  telefone: z
    .string()
    .regex(
      /^\(\d{2}\)\s?\d{4,5}-\d{4}$/,
      "Telefone inválido. Use (99) 99999-9999.",
    ),
  website: z.string().max(0, "Campo inválido.").default(""),
});

export const pessoaFisicaSchema = baseSchema.extend({
  tipoPessoa: z.literal("PF"),
  cpf: z.string().refine((v) => validateCPF(v), { message: "CPF inválido." }),
});

export const pessoaJuridicaSchema = baseSchema.extend({
  tipoPessoa: z.literal("PJ"),
  razaoSocial: z
    .string()
    .min(3, "Razão social deve ter pelo menos 3 caracteres."),
  cnpj: z
    .string()
    .refine((v) => validateCNPJ(v), { message: "CNPJ inválido." }),
  cpfResponsavel: z.string().refine((v) => validateCPF(v), {
    message: "CPF do responsável inválido.",
  }),
});

export type PessoaFisicaData = z.infer<typeof pessoaFisicaSchema>;
export type PessoaJuridicaData = z.infer<typeof pessoaJuridicaSchema>;
export type RepresentanteData = PessoaFisicaData | PessoaJuridicaData;
