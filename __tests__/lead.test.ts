/**
 * @jest-environment node
 */
import { POST } from "@/app/api/lead/route";
import { NextRequest } from "next/server";

// ── Helpers ────────────────────────────────────────────────────────────────

function makeRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest("http://localhost/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// ── Testes ─────────────────────────────────────────────────────────────────

describe("POST /api/lead", () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("retorna 200 com campos obrigatórios preenchidos", async () => {
    const req = makeRequest({
      nome: "João Silva",
      emailPessoal: "joao@email.com",
      empresa: "Empresa ABC",
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.ok).toBe(true);
  });

  it("retorna 200 mesmo sem emailRH (campo opcional)", async () => {
    const req = makeRequest({
      nome: "Maria",
      emailPessoal: "maria@email.com",
      empresa: "Empresa XYZ",
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("retorna 200 com emailRH informado", async () => {
    const req = makeRequest({
      nome: "Carlos",
      emailPessoal: "carlos@email.com",
      empresa: "Tech Corp",
      emailRH: "rh@techcorp.com",
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("retorna 400 quando 'nome' está ausente", async () => {
    const req = makeRequest({
      emailPessoal: "sem@nome.com",
      empresa: "Empresa",
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.error).toBeTruthy();
  });

  it("retorna 400 quando 'emailPessoal' está ausente", async () => {
    const req = makeRequest({
      nome: "Alguém",
      empresa: "Empresa",
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("retorna 400 quando 'empresa' está ausente", async () => {
    const req = makeRequest({
      nome: "Alguém",
      emailPessoal: "alguem@email.com",
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("registra o lead no console com destinatário correto", async () => {
    const req = makeRequest({
      nome: "Teste",
      emailPessoal: "teste@email.com",
      empresa: "Empresa Teste",
      emailRH: "rh@teste.com",
    });

    await POST(req);

    expect(consoleSpy).toHaveBeenCalledWith(
      "[LEAD]",
      expect.objectContaining({
        nome: "Teste",
        emailPessoal: "teste@email.com",
        empresa: "Empresa Teste",
        emailRH: "rh@teste.com",
        destinatario: "ronaldofilardo@gmail.com",
      })
    );
  });

  it("o log inclui campo 'recebidoEm' com data ISO", async () => {
    const req = makeRequest({
      nome: "Data",
      emailPessoal: "data@email.com",
      empresa: "Empresa Data",
    });

    await POST(req);

    const loggedArg = consoleSpy.mock.calls[0][1] as Record<string, string>;
    expect(loggedArg.recebidoEm).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("registra emailRH como 'Não informado' quando não enviado", async () => {
    const req = makeRequest({
      nome: "Sem RH",
      emailPessoal: "semrh@email.com",
      empresa: "Empresa",
    });

    await POST(req);

    const loggedArg = consoleSpy.mock.calls[0][1] as Record<string, string>;
    expect(loggedArg.emailRH).toBe("Não informado");
  });
});
