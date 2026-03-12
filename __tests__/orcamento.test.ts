/**
 * @jest-environment node
 */

// ── Mock do Nodemailer ──────────────────────────────────────────────────────

const mockSendMail = jest.fn().mockResolvedValue({ messageId: "mock-id" });

jest.mock("nodemailer", () => ({
  createTransport: jest.fn(() => ({
    sendMail: (...args: unknown[]) => mockSendMail(...args),
  })),
}));

// ── Mock do Next.js para a API route ───────────────────────────────────────

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/orcamento", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// ── Testes da API route ────────────────────────────────────────────────────

describe("POST /api/orcamento", () => {
  let POST: (req: Request) => Promise<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  beforeAll(async () => {
    const mod = await import("@/app/api/orcamento/route");
    POST = mod.POST;
  });

  describe("empresa_privada — fluxos válidos", () => {
    it("retorna 200 com payload válido de empresa privada", async () => {
      const res = await POST(
        makeRequest({
          tipoOrganizacao: "empresa_privada",
          numeroFuncionarios: 150,
          nome: "João Silva",
          email: "joao@empresa.com",
          telefone: "(11) 98765-4321",
        }) as never,
      );
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.ok).toBe(true);
    });

    it("envia email com dados de empresa privada", async () => {
      await POST(
        makeRequest({
          tipoOrganizacao: "empresa_privada",
          numeroFuncionarios: 500,
          nome: "Ana Costa",
          email: "ana@empresa.com",
          telefone: "(41) 98516-1858",
        }) as never,
      );
      expect(mockSendMail).toHaveBeenCalledTimes(1);
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: expect.stringContaining("Ana Costa"),
          html: expect.stringContaining("Empresa Privada"),
        }),
      );
    });
  });

  describe("medicina_ocupacional — fluxos válidos", () => {
    it("retorna 200 com payload válido de medicina ocupacional", async () => {
      const res = await POST(
        makeRequest({
          tipoOrganizacao: "medicina_ocupacional",
          numeroEmpresas: 25,
          totalFuncionarios: 5000,
          nome: "Dra. Maria",
          email: "maria@clinica.com",
          telefone: "(21) 3333-4444",
        }) as never,
      );
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.ok).toBe(true);
    });

    it("envia email com dados de medicina ocupacional", async () => {
      await POST(
        makeRequest({
          tipoOrganizacao: "medicina_ocupacional",
          numeroEmpresas: 10,
          totalFuncionarios: 1200,
          nome: "Dr. Carlos",
          email: "carlos@med.com",
          telefone: "(11) 3000-1000",
        }) as never,
      );
      expect(mockSendMail).toHaveBeenCalledTimes(1);
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          html: expect.stringContaining("Medicina Ocupacional"),
        }),
      );
    });
  });

  describe("validações — retorna 400", () => {
    it("rejeita tipo de organização inválido", async () => {
      const res = await POST(
        makeRequest({
          tipoOrganizacao: "outro",
          nome: "Teste",
          email: "teste@test.com",
          telefone: "(11) 98765-4321",
        }) as never,
      );
      expect(res.status).toBe(400);
    });

    it("rejeita empresa_privada sem numeroFuncionarios", async () => {
      const res = await POST(
        makeRequest({
          tipoOrganizacao: "empresa_privada",
          nome: "Teste",
          email: "teste@test.com",
          telefone: "(11) 98765-4321",
        }) as never,
      );
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error).toContain("funcionários");
    });

    it("rejeita medicina_ocupacional sem numeroEmpresas", async () => {
      const res = await POST(
        makeRequest({
          tipoOrganizacao: "medicina_ocupacional",
          totalFuncionarios: 1000,
          nome: "Teste",
          email: "teste@test.com",
          telefone: "(11) 98765-4321",
        }) as never,
      );
      expect(res.status).toBe(400);
    });

    it("rejeita medicina_ocupacional sem totalFuncionarios", async () => {
      const res = await POST(
        makeRequest({
          tipoOrganizacao: "medicina_ocupacional",
          numeroEmpresas: 5,
          nome: "Teste",
          email: "teste@test.com",
          telefone: "(11) 98765-4321",
        }) as never,
      );
      expect(res.status).toBe(400);
    });

    it("rejeita nome muito curto", async () => {
      const res = await POST(
        makeRequest({
          tipoOrganizacao: "empresa_privada",
          numeroFuncionarios: 100,
          nome: "AB",
          email: "teste@test.com",
          telefone: "(11) 98765-4321",
        }) as never,
      );
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error).toContain("Nome");
    });

    it("rejeita email inválido", async () => {
      const res = await POST(
        makeRequest({
          tipoOrganizacao: "empresa_privada",
          numeroFuncionarios: 100,
          nome: "João Silva",
          email: "email-invalido",
          telefone: "(11) 98765-4321",
        }) as never,
      );
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error).toContain("E-mail");
    });

    it("rejeita telefone com menos de 10 dígitos", async () => {
      const res = await POST(
        makeRequest({
          tipoOrganizacao: "empresa_privada",
          numeroFuncionarios: 100,
          nome: "João Silva",
          email: "joao@empresa.com",
          telefone: "12345",
        }) as never,
      );
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error).toContain("Telefone");
    });
  });
});

// ── Testes do sendOrcamentoEmail ───────────────────────────────────────────

describe("sendOrcamentoEmail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("envia email de orçamento para empresa privada", async () => {
    const { sendOrcamentoEmail } = await import("@/lib/email");
    await sendOrcamentoEmail({
      tipoOrganizacao: "empresa_privada",
      numeroFuncionarios: 200,
      nome: "Carlos",
      email: "carlos@empresa.com",
      telefone: "(11) 99999-0000",
    });
    expect(mockSendMail).toHaveBeenCalledTimes(1);
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: expect.stringContaining("Carlos"),
        html: expect.stringContaining("Empresa Privada"),
      }),
    );
  });

  it("envia email de orçamento para medicina ocupacional", async () => {
    const { sendOrcamentoEmail } = await import("@/lib/email");
    await sendOrcamentoEmail({
      tipoOrganizacao: "medicina_ocupacional",
      numeroEmpresas: 30,
      totalFuncionarios: 8000,
      nome: "Dra. Lúcia",
      email: "lucia@clinica.com",
      telefone: "(41) 3333-0000",
    });
    expect(mockSendMail).toHaveBeenCalledTimes(1);
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.stringContaining("Medicina Ocupacional"),
      }),
    );
  });
});
