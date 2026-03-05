/**
 * @jest-environment node
 */

import { generateConfirmationLink } from "@/lib/email";

// ── Mock do Resend (ambos os emails usam Resend) ────────────────────────────

const mockResendSend = jest
  .fn()
  .mockResolvedValue({ data: { id: "mock-email-id" }, error: null });

jest.mock("resend", () => ({
  Resend: jest.fn(() => ({
    emails: { send: (...args: unknown[]) => mockResendSend(...args) },
  })),
}));

// ── Testes ─────────────────────────────────────────────────────────────────

describe("Email — confirmação de representante", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_APP_URL: "https://qwork.app.br",
      RESEND_API_KEY: "re_test_key",
      ADMIN_EMAIL: "ronaldofilardo@gmail.com",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("deve enviar email de confirmação", async () => {
    const { sendConfirmationEmail } = await import("@/lib/email");

    await sendConfirmationEmail(
      "representante@email.com",
      "João Silva",
      "abc-token-123",
    );

    expect(mockResendSend).toHaveBeenCalledTimes(1);
    expect(mockResendSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "representante@email.com",
        subject: expect.stringContaining("Recebemos seu cadastro"),
        html: expect.stringContaining("João Silva"),
      }),
    );
  });

  it("deve gerar link de confirmação correto", () => {
    const link = generateConfirmationLink("abc-token-123");

    expect(link).toBe("https://qwork.app.br/confirmacao?token=abc-token-123");
  });

  it("deve incluir token no query parameter", () => {
    const token = "meu-token-uuid-aqui";
    const link = generateConfirmationLink(token);

    expect(link).toContain("?token=");
    expect(link).toContain(token);

    const url = new URL(link);
    expect(url.searchParams.get("token")).toBe(token);
  });

  it("deve usar APP_URL do environment", () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://custom-domain.com.br";

    // Reimportar para recalcular — usar path relativo pois resetModules limpa aliases
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { generateConfirmationLink: freshGenerate } = require("../lib/email");

    const link = freshGenerate("token-123");

    expect(link).toMatch(/^https:\/\/custom-domain\.com\.br\//);
    expect(link).toBe(
      "https://custom-domain.com.br/confirmacao?token=token-123",
    );
  });

  it("deve enviar notificação ao admin", async () => {
    const { sendAdminNotification } = await import("@/lib/email");

    await sendAdminNotification({
      tipoPessoa: "PF",
      nome: "Maria Souza",
      email: "maria@email.com",
      telefone: "(11) 99999-0000",
      cpf: "123.456.789-00",
      temDocumentos: true,
    });

    expect(mockResendSend).toHaveBeenCalledTimes(1);
    expect(mockResendSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "ronaldofilardo@gmail.com",
        subject: expect.stringContaining("Maria Souza"),
        html: expect.stringContaining("PF"),
      }),
    );
  });
});

// ── Testes de validadores ──────────────────────────────────────────────────

describe("Validadores CPF/CNPJ", () => {
  let validateCPF: (cpf: string) => boolean;
  let validateCNPJ: (cnpj: string) => boolean;

  beforeAll(async () => {
    const validators = await import("@/lib/validators/representante");
    validateCPF = validators.validateCPF;
    validateCNPJ = validators.validateCNPJ;
  });

  it("valida CPF correto", () => {
    expect(validateCPF("529.982.247-25")).toBe(true);
    expect(validateCPF("52998224725")).toBe(true);
  });

  it("rejeita CPF inválido", () => {
    expect(validateCPF("111.111.111-11")).toBe(false);
    expect(validateCPF("123.456.789-00")).toBe(false);
    expect(validateCPF("000.000.000-00")).toBe(false);
    expect(validateCPF("123")).toBe(false);
  });

  it("valida CNPJ correto", () => {
    expect(validateCNPJ("11.222.333/0001-81")).toBe(true);
    expect(validateCNPJ("11222333000181")).toBe(true);
  });

  it("rejeita CNPJ inválido", () => {
    expect(validateCNPJ("11.111.111/1111-11")).toBe(false);
    expect(validateCNPJ("00.000.000/0000-00")).toBe(false);
    expect(validateCNPJ("123")).toBe(false);
  });
});

// ── Testes de máscaras ─────────────────────────────────────────────────────

describe("Máscaras de input", () => {
  let maskCPF: (v: string) => string;
  let maskCNPJ: (v: string) => string;
  let maskTelefone: (v: string) => string;

  beforeAll(async () => {
    const masks = await import("@/lib/utils/masks");
    maskCPF = masks.maskCPF;
    maskCNPJ = masks.maskCNPJ;
    maskTelefone = masks.maskTelefone;
  });

  it("formata CPF corretamente", () => {
    expect(maskCPF("52998224725")).toBe("529.982.247-25");
    expect(maskCPF("529")).toBe("529");
    expect(maskCPF("5299822")).toBe("529.982.2");
  });

  it("formata CNPJ corretamente", () => {
    expect(maskCNPJ("11222333000181")).toBe("11.222.333/0001-81");
    expect(maskCNPJ("112")).toBe("11.2");
  });

  it("formata telefone corretamente", () => {
    expect(maskTelefone("11999990000")).toBe("(11) 99999-0000");
    expect(maskTelefone("11")).toBe("(11");
    expect(maskTelefone("119999")).toBe("(11) 9999");
  });
});
