import { NextRequest, NextResponse } from "next/server";
import { sendOrcamentoEmail } from "@/lib/email";

export interface OrcamentoPayload {
  tipoOrganizacao: "empresa_privada" | "medicina_ocupacional";
  numeroFuncionarios?: number;
  numeroEmpresas?: number;
  totalFuncionarios?: number;
  nome: string;
  email: string;
  telefone: string;
}

function validarPayload(body: Partial<OrcamentoPayload>): string | null {
  if (
    body.tipoOrganizacao !== "empresa_privada" &&
    body.tipoOrganizacao !== "medicina_ocupacional"
  ) {
    return "Tipo de organização inválido.";
  }
  if (body.tipoOrganizacao === "empresa_privada") {
    if (!body.numeroFuncionarios || body.numeroFuncionarios < 1) {
      return "Número de funcionários é obrigatório.";
    }
  }
  if (body.tipoOrganizacao === "medicina_ocupacional") {
    if (!body.numeroEmpresas || body.numeroEmpresas < 1) {
      return "Número de empresas atendidas é obrigatório.";
    }
    if (!body.totalFuncionarios || body.totalFuncionarios < 1) {
      return "Total de funcionários atendidos é obrigatório.";
    }
  }
  if (!body.nome || body.nome.trim().length < 3) {
    return "Nome deve ter pelo menos 3 caracteres.";
  }
  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return "E-mail inválido.";
  }
  if (!body.telefone || body.telefone.replace(/\D/g, "").length < 10) {
    return "Telefone deve ter pelo menos 10 dígitos.";
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body: Partial<OrcamentoPayload> = await req.json();

    const erro = validarPayload(body);
    if (erro) {
      return NextResponse.json({ error: erro }, { status: 400 });
    }

    await sendOrcamentoEmail(body as OrcamentoPayload);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("[ORCAMENTO ERROR]", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
