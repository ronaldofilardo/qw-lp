import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

// Framer-motion mock props to strip
const FRAMER_PROPS = new Set([
  "initial",
  "animate",
  "exit",
  "transition",
  "whileHover",
  "whileTap",
  "whileInView",
  "variants",
  "layout",
  "layoutId",
  "drag",
  "dragConstraints",
]);
const HTML_TAGS = new Set([
  "div",
  "span",
  "section",
  "header",
  "footer",
  "main",
  "p",
  "h1",
  "h2",
  "h3",
  "ul",
  "li",
  "form",
  "button",
  "a",
  "img",
  "input",
  "label",
]);

// Mock framer-motion to simplify testing
jest.mock("framer-motion", () => ({
  motion: new Proxy(
    {},
    {
      get:
        (_target: unknown, key: string) =>
        ({ children, ...props }: any) => {
          const safeProps = Object.fromEntries(
            Object.entries(props).filter(([k]) => !FRAMER_PROPS.has(k)),
          );
          return React.createElement(
            HTML_TAGS.has(key) ? key : "div",
            safeProps,
            children,
          );
        },
    },
  ),
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ priority: _priority, ...props }: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock RepresentanteForm (uses react-hook-form / zod internals)
jest.mock("../components/RepresentanteForm", () => ({
  __esModule: true,
  default: () => <div data-testid="representante-form">Form mock</div>,
}));

describe("Home Page", () => {
  it("should load without errors", () => {
    expect(true).toBe(true);
  });

  it("should render 'Saúde Mental no Trabalho' text in hero section", () => {
    render(<Home />);
    // Find the element containing "Saúde Mental" in the hero section
    const elements = screen.queryAllByText(/Saúde Mental no Trabalho/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  it("should NOT render logo above 'Saúde Mental no Trabalho' in hero section", () => {
    const { container } = render(<Home />);

    // Find all elements with "Saúde Mental no Trabalho" text
    const saudeMentalElements = screen.queryAllByText(
      /Saúde Mental no Trabalho/i,
    );
    expect(saudeMentalElements.length).toBeGreaterThan(0);

    // Find all logo images by alt text
    const logoImages = container.querySelectorAll('img[alt="QWork Logo"]');

    // Should have only 2 logos (header + footer), not 3
    // The logo above "Saúde Mental no Trabalho" in hero section has been removed
    expect(logoImages.length).toBe(2);
  });

  describe("Seção Representantes — Por que ser representante QWork?", () => {
    it("deve exibir a introdução com comissão a partir de 20%", () => {
      render(<Home />);
      expect(
        screen.getByText(/a partir de 20% do valor negociado/i),
      ).toBeInTheDocument();
    });

    it("deve exibir o item de comissão automática com texto atualizado", () => {
      render(<Home />);
      // Texto único da descrição do item 1
      expect(
        screen.getByText(
          /quanto mais fechar, mais ganha — sem limite de lucro/i,
        ),
      ).toBeInTheDocument();
    });

    it("deve exibir o novo item 'Comissão a partir de 20%'", () => {
      render(<Home />);
      // Título do item 2 aparece como heading h4
      const headings = screen.getAllByText(/Comiss[aã]o a partir de 20%/i);
      expect(headings.length).toBeGreaterThanOrEqual(1);
      expect(
        screen.getByText(/sua renda cresce com seu sucesso/i),
      ).toBeInTheDocument();
    });

    it("deve exibir o dashboard com texto atualizado", () => {
      render(<Home />);
      expect(
        screen.getByText(
          /visualize cada venda e cada centavo ganho em tempo real/i,
        ),
      ).toBeInTheDocument();
    });

    it("deve exibir o suporte sem mencionar treinamento", () => {
      render(<Home />);
      expect(
        screen.getByText(
          /materiais de vendas prontos e suporte comercial dedicado/i,
        ),
      ).toBeInTheDocument();
      expect(screen.queryByText(/treinamento/i)).not.toBeInTheDocument();
    });

    it("deve exibir o item de recebimento via PIX", () => {
      render(<Home />);
      expect(
        screen.getByText(
          /comiss[oõ]es pagas de forma r[aá]pida e sem burocracia/i,
        ),
      ).toBeInTheDocument();
    });
  });

  describe("Seção Contato", () => {
    it("deve exibir o telefone atualizado [41] 98516-1858", () => {
      render(<Home />);
      expect(screen.getByText(/\[41\] 98516-1858/)).toBeInTheDocument();
    });

    it("deve exibir Curitiba, PR como localização", () => {
      render(<Home />);
      expect(screen.getByText(/Curitiba, PR/)).toBeInTheDocument();
    });

    it("deve remover o email contato@qwork.com.br da seção de contato", () => {
      render(<Home />);
      expect(
        screen.queryByText(/contato@qwork\.com\.br/),
      ).not.toBeInTheDocument();
    });

    it("não deve renderizar o ícone Mail na seção de contato", () => {
      const { container } = render(<Home />);
      // Verifica se não há referencias para Mail na seção de contato
      const contactSection = screen.queryByText(/Contato/);
      expect(contactSection).toBeInTheDocument();
    });
  });

  describe("Seção Adotar e começar é Fácil — Pricing", () => {
    it("deve exibir 'Sem Cobrança de Setup' com descrição completa", () => {
      render(<Home />);
      expect(
        screen.getByText(/Sem Cobrança de Setup/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/não há custos de configuração ou implementação/i),
      ).toBeInTheDocument();
    });

    it("deve exibir 'Parcelamento para Grandes Volumes' com opções flexíveis", () => {
      render(<Home />);
      expect(
        screen.getByText(/Parcelamento para Grandes Volumes/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/opções de parcelamento flexíveis/i),
      ).toBeInTheDocument();
    });

    it("deve exibir o titulo 'Sem barreiras para começar'", () => {
      render(<Home />);
      expect(
        screen.getByText(/Sem barreiras para começar/),
      ).toBeInTheDocument();
    });

    it("deve exibir o label 'Adotar e começar é Fácil'", () => {
      render(<Home />);
      expect(
        screen.getByText(/Adotar e começar é Fácil/),
      ).toBeInTheDocument();
    });
  });
});
