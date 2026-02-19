import { features, faqItems } from "@/lib/data";

// ─── Modelo de negócio: sem planos mensais ──────────────────────────────────
describe("Modelo pay-per-laudo: sem planos de assinatura", () => {
  it("não exporta 'plans' do módulo data", async () => {
    const dataModule = await import("@/lib/data");
    expect((dataModule as Record<string, unknown>).plans).toBeUndefined();
  });
});

// ─── Features ───────────────────────────────────────────────────────────────
describe("features", () => {
  it("exporta exatamente 6 funcionalidades", () => {
    expect(features).toHaveLength(6);
  });

  it("inclui card de Bem-Estar como Prioridade", () => {
    const card = features.find((f) => f.title === "Bem-Estar como Prioridade");
    expect(card).toBeDefined();
    expect(card?.description).toMatch(/integridade/i);
    expect(card?.description).toMatch(/qualidade de vida/i);
  });

  it("inclui card de Transparência e Responsabilidade", () => {
    const card = features.find(
      (f) => f.title === "Transparência e Responsabilidade",
    );
    expect(card).toBeDefined();
    expect(card?.description).toMatch(/responsabilidade/i);
    expect(card?.description).toMatch(/rastreável|auditável/i);
  });

  it("cada feature tem id, icon, title e description preenchidos", () => {
    features.forEach((f) => {
      expect(f.id).toBeGreaterThan(0);
      expect(f.icon).toBeTruthy();
      expect(f.title).toBeTruthy();
      expect(f.description).toBeTruthy();
    });
  });
});

// ─── FAQ ────────────────────────────────────────────────────────────────────
describe("faqItems", () => {
  it("exporta 9 perguntas frequentes", () => {
    expect(faqItems).toHaveLength(9);
  });

  it("não menciona cancelamento de assinatura em nenhuma resposta", () => {
    faqItems.forEach((item) => {
      // "sem mensalidade" é válido; bloqueamos apenas menção positiva a plano/assinatura
      expect(item.answer.toLowerCase()).not.toMatch(
        /cancelar assinatura|assinar um plano|plano mensal/,
      );
      expect(item.question.toLowerCase()).not.toMatch(/cancelar|assinatura/);
    });
  });

  it("contém pergunta sobre custo da plataforma com resposta gratuita", () => {
    const item = faqItems.find((f) =>
      f.question.toLowerCase().includes("custo"),
    );
    expect(item).toBeDefined();
    expect(item?.answer.toLowerCase()).toMatch(/gratuito|gratuitas/);
    expect(item?.answer.toLowerCase()).toMatch(/laudo/);
  });

  it("contém pergunta sobre avaliações ilimitadas ou sem custo", () => {
    const item = faqItems.find(
      (f) =>
        f.question.toLowerCase().includes("quantas") ||
        f.question.toLowerCase().includes("ilimitad") ||
        f.question.toLowerCase().includes("sem custo"),
    );
    expect(item).toBeDefined();
    expect(item?.answer.toLowerCase()).toMatch(/ilimitad/);
  });

  it("contém pergunta sobre validade jurídica com SHA256", () => {
    const item = faqItems.find(
      (f) =>
        f.question.toLowerCase().includes("validade") ||
        f.question.toLowerCase().includes("jur"),
    );
    expect(item).toBeDefined();
    expect(item?.answer).toMatch(/SHA256/i);
    expect(item?.answer.toLowerCase()).toMatch(/cadeia de cust/i);
  });

  it("menciona NR-1 em pelo menos uma resposta", () => {
    const hasNR1 = faqItems.some((f) => f.answer.includes("NR-1"));
    expect(hasNR1).toBe(true);
  });

  it("contém pergunta específica para operadoras de medicina ocupacional", () => {
    const item = faqItems.find((f) =>
      f.question.toLowerCase().includes("operadora"),
    );
    expect(item).toBeDefined();
    expect(item?.answer.toLowerCase()).toMatch(
      /multi-cliente|múltiplos clientes/i,
    );
    expect(item?.answer).toMatch(/R\$ 10/i);
  });

  it("contém pergunta para empresas e RH direto", () => {
    const item = faqItems.find(
      (f) =>
        f.question.toLowerCase().includes("empresa") ||
        f.question.toLowerCase().includes("rh"),
    );
    expect(item).toBeDefined();
    expect(item?.answer).toMatch(/R\$ 20/i);
  });

  it("precificação menciona desconto progressivo", () => {
    const item = faqItems.find((f) =>
      f.question.toLowerCase().includes("custo"),
    );
    expect(item?.answer.toLowerCase()).toMatch(/desconto progressivo/i);
    expect(item?.answer).toMatch(/R\$ 10/);
    expect(item?.answer).toMatch(/R\$ 20/);
  });

  it("cada item tem id único, question e answer não-vazios", () => {
    const ids = faqItems.map((f) => f.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(faqItems.length);

    faqItems.forEach((f) => {
      expect(f.question.trim()).not.toBe("");
      expect(f.answer.trim()).not.toBe("");
    });
  });
});

// ─── Layout / Metadata ──────────────────────────────────────────────────────────────────────────────
describe("layout metadata", () => {
  it("título contém QWork", async () => {
    const { metadata } = await import("@/app/layout");
    expect(String(metadata.title)).toContain("QWork");
  });

  it("descrição menciona COPSOQ III e NR-1", async () => {
    const { metadata } = await import("@/app/layout");
    expect(String(metadata.description)).toMatch(/COPSOQ III/i);
    expect(String(metadata.description)).toMatch(/NR-1/i);
  });

  it("descrição menciona rastreabilidade SHA256", async () => {
    const { metadata } = await import("@/app/layout");
    expect(String(metadata.description)).toMatch(/SHA256/i);
  });

  it("ícones apontam para arquivos locais /icon-*.png", async () => {
    const { metadata } = await import("@/app/layout");
    const icons = (metadata.icons as { icon: { url: string }[] }).icon;
    expect(icons.some((i) => i.url === "/icon-192.png")).toBe(true);
    expect(icons.some((i) => i.url === "/icon-512.png")).toBe(true);
  });

  it("não usa título padrão do Next.js", async () => {
    const { metadata } = await import("@/app/layout");
    expect(String(metadata.title)).not.toContain("Create Next App");
    expect(String(metadata.description)).not.toContain(
      "Generated by create next app",
    );
  });
});
