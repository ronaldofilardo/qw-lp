import { NextRequest, NextResponse } from "next/server";

// Estrutura preparada para serviço de e-mail (Resend, Nodemailer, etc.)
// Quando embarcar o serviço, basta implementar a função sendEmail abaixo
// e descomentar a chamada no handler.

interface LeadPayload {
  nome: string;
  emailPessoal: string;
  empresa: string;
  emailRH?: string;
}

// TODO: implementar quando serviço de e-mail for configurado
// async function sendEmail(lead: LeadPayload) {
//   await resend.emails.send({
//     from: "noreply@qwork.com.br",
//     to: "ronaldofilardo@gmail.com",
//     subject: `Nova indicação QWork — ${lead.nome} (${lead.empresa})`,
//     html: `
//       <h2>Nova sugestão de indicação recebida</h2>
//       <p><strong>Nome:</strong> ${lead.nome}</p>
//       <p><strong>E-mail pessoal:</strong> ${lead.emailPessoal}</p>
//       <p><strong>Empresa:</strong> ${lead.empresa}</p>
//       <p><strong>E-mail do RH:</strong> ${lead.emailRH ?? "Não informado"}</p>
//     `,
//   });
// }

export async function POST(req: NextRequest) {
  try {
    const body: LeadPayload = await req.json();

    const { nome, emailPessoal, empresa, emailRH } = body;

    if (!nome || !emailPessoal || !empresa) {
      return NextResponse.json(
        { error: "Campos obrigatórios ausentes." },
        { status: 400 },
      );
    }

    // Log temporário — substituir por sendEmail(body) quando serviço de e-mail estiver pronto
    console.log("[LEAD]", {
      nome,
      emailPessoal,
      empresa,
      emailRH: emailRH ?? "Não informado",
      recebidoEm: new Date().toISOString(),
      destinatario: "ronaldofilardo@gmail.com",
    });

    // await sendEmail(body);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("[LEAD ERROR]", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
