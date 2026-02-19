import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ComecarPage from "@/app/comecar/page";

// ── Mocks ──────────────────────────────────────────────────────────────────

jest.mock("framer-motion", () => {
  const FRAMER_PROPS = new Set([
    "initial", "animate", "exit", "transition", "whileHover", "whileTap",
    "whileInView", "variants", "layout", "layoutId", "drag", "dragConstraints",
  ]);
  const HTML_TAGS = new Set(["div","span","section","header","footer","main","p","h1","h2","h3","ul","li","form","button","a","img"]);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require("react");
  return {
    motion: new Proxy(
      {},
      {
        get:
          (_target: unknown, key: string) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ({ children, ...props }: any) => {
            const safeProps = Object.fromEntries(
              Object.entries(props).filter(([k]) => !FRAMER_PROPS.has(k))
            );
            return React.createElement(HTML_TAGS.has(key) ? key : "div", safeProps, children);
          },
      }
    ),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt, priority: _priority, ...props }: { alt: string; priority?: boolean; [key: string]: unknown }) =>
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} {...(props as React.ImgHTMLAttributes<HTMLImageElement>)} />,
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// ── Testes: renderização inicial ───────────────────────────────────────────

describe("Página /comecar — renderização inicial", () => {
  beforeEach(() => render(<ComecarPage />));

  it("exibe o título principal", () => {
    expect(screen.getByText(/Como você deseja continuar\?/i)).toBeInTheDocument();
  });

  it("exibe os três perfis", () => {
    expect(screen.getByText(/Sou Funcionário ou Gestor/i)).toBeInTheDocument();
    expect(screen.getByText(/Represento uma Empresa/i)).toBeInTheDocument();
    expect(screen.getByText(/Avaliação Individual/i)).toBeInTheDocument();
  });

  it("exibe o link de voltar para a landing", () => {
    const link = screen.getByRole("link", { name: /Voltar/i });
    expect(link).toHaveAttribute("href", "/");
  });

  it("não exibe painéis de ação antes de selecionar um perfil", () => {
    expect(screen.queryByText(/Acesse com suas credenciais/i)).toBeNull();
    expect(screen.queryByText(/Cadastre sua empresa em minutos/i)).toBeNull();
    expect(screen.queryByText(/Avaliação individual em breve/i)).toBeNull();
  });
});

// ── Testes: painel Funcionário / Gestor ────────────────────────────────────

describe("Painel — Funcionário ou Gestor", () => {
  beforeEach(() => {
    render(<ComecarPage />);
    fireEvent.click(screen.getByText(/Sou Funcionário ou Gestor/i));
  });

  it("exibe explicação sobre acesso com CPF/data de nascimento", () => {
    expect(screen.getByText(/CPF e data de nascimento/i)).toBeInTheDocument();
  });

  it("exibe botão que aponta para o login do sistema", () => {
    const btn = screen.getByRole("link", { name: /Acessar Login/i });
    expect(btn).toHaveAttribute("href", "https://qwork-psi.vercel.app/login");
  });
});

// ── Testes: painel Empresa ─────────────────────────────────────────────────

describe("Painel — Represento uma Empresa", () => {
  beforeEach(() => {
    render(<ComecarPage />);
    fireEvent.click(screen.getByText(/Represento uma Empresa/i));
  });

  it("exibe instrução sobre o botão Cadastrar Empresa", () => {
    const matches = screen.getAllByText(/Cadastrar Empresa/i);
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it("exibe botão que aponta para o login do sistema", () => {
    const links = screen.getAllByRole("link", { name: /Cadastrar Empresa/i });
    expect(links.length).toBeGreaterThanOrEqual(1);
    expect(links[0]).toHaveAttribute("href", "https://qwork-psi.vercel.app/login");
  });

  it("exibe link para entender o modelo", () => {
    const link = screen.getByRole("link", { name: /Entender o Modelo/i });
    expect(link).toHaveAttribute("href", "/#modelo");
  });
});

// ── Testes: painel Avaliação Individual ───────────────────────────────────

describe("Painel — Avaliação Individual", () => {
  beforeEach(() => {
    render(<ComecarPage />);
    fireEvent.click(screen.getByText(/Avaliação Individual/i));
  });

  it("exibe aviso de que modalidade individual está em roadmap", () => {
    expect(screen.getByText(/Avaliação individual em breve/i)).toBeInTheDocument();
  });

  it("exibe sugestão de indicar o RH", () => {
    expect(screen.getByText(/sugerir a QWork para o seu RH/i)).toBeInTheDocument();
  });

  it("exibe os quatro campos do formulário de sugestão", () => {
    expect(screen.getByPlaceholderText(/João Silva/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/voce@email\.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Nome da empresa/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/rh@empresa\.com/i)).toBeInTheDocument();
  });

  it("exibe botão de compartilhar no WhatsApp com URL correta", () => {
    const link = screen.getByRole("link", { name: /Compartilhar no WhatsApp/i });
    expect(link).toHaveAttribute("href", expect.stringContaining("wa.me"));
    expect(link).toHaveAttribute("href", expect.stringContaining("COPSOQ"));
  });

  it("exibe botão de copiar link", () => {
    expect(screen.getByRole("button", { name: /Copiar Link/i })).toBeInTheDocument();
  });
});

// ── Testes: formulário de sugestão ─────────────────────────────────────────

describe("Formulário de sugestão para o RH", () => {
  beforeEach(() => {
    render(<ComecarPage />);
    fireEvent.click(screen.getByText(/Avaliação Individual/i));
  });

  it("exibe erro ao falhar o envio", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({ ok: false });

    fireEvent.change(screen.getByPlaceholderText(/João Silva/i), {
      target: { value: "Maria" },
    });
    fireEvent.change(screen.getByPlaceholderText(/voce@email\.com/i), {
      target: { value: "maria@email.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Nome da empresa/i), {
      target: { value: "Empresa ABC" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /Enviar Sugestão/i }).closest("form")!);

    await waitFor(() => {
      expect(screen.getByText(/Ocorreu um erro ao enviar/i)).toBeInTheDocument();
    });
  });

  it("exibe mensagem de sucesso após envio bem-sucedido", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({ ok: true });

    fireEvent.change(screen.getByPlaceholderText(/João Silva/i), {
      target: { value: "Carlos" },
    });
    fireEvent.change(screen.getByPlaceholderText(/voce@email\.com/i), {
      target: { value: "carlos@email.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Nome da empresa/i), {
      target: { value: "Empresa XYZ" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /Enviar Sugestão/i }).closest("form")!);

    await waitFor(() => {
      expect(screen.getByText(/Sugestão enviada/i)).toBeInTheDocument();
    });
  });

  it("envia para o endpoint /api/lead com os dados corretos", async () => {
    const fetchSpy = jest.fn().mockResolvedValueOnce({ ok: true });
    global.fetch = fetchSpy;

    fireEvent.change(screen.getByPlaceholderText(/João Silva/i), {
      target: { value: "Ana" },
    });
    fireEvent.change(screen.getByPlaceholderText(/voce@email\.com/i), {
      target: { value: "ana@email.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Nome da empresa/i), {
      target: { value: "Empresa Teste" },
    });
    fireEvent.change(screen.getByPlaceholderText(/rh@empresa\.com/i), {
      target: { value: "rh@teste.com" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /Enviar Sugestão/i }).closest("form")!);

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(
        "/api/lead",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            nome: "Ana",
            emailPessoal: "ana@email.com",
            empresa: "Empresa Teste",
            emailRH: "rh@teste.com",
          }),
        })
      );
    });
  });
});

// ── Testes: copiar link ────────────────────────────────────────────────────

describe("Botão Copiar Link", () => {
  beforeEach(() => {
    render(<ComecarPage />);
    fireEvent.click(screen.getByText(/Avaliação Individual/i));
  });

  it("altera texto para 'Link copiado!' ao clicar", async () => {
    Object.assign(navigator, {
      clipboard: { writeText: jest.fn().mockResolvedValue(undefined) },
    });

    fireEvent.click(screen.getByRole("button", { name: /Copiar Link/i }));

    await waitFor(() => {
      expect(screen.getByText(/Link copiado!/i)).toBeInTheDocument();
    });
  });
});
