import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://qwork.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "QWork — Avaliação de Riscos Psicossociais para Empresas | COPSOQ III",
    template: "%s | QWork",
  },
  description:
    "QWork é a plataforma de avaliação de riscos psicossociais baseada no COPSOQ III para operadoras de medicina ocupacional e RHs de empresas. Cadastro gratuito, avaliações ilimitadas e Laudo com rastreabilidade SHA256, conformidade com NR-1 e LGPD. Pague só ao emitir o Laudo.",
  keywords: [
    "avaliação de riscos psicossociais",
    "COPSOQ III",
    "medicina ocupacional",
    "saúde mental no trabalho",
    "NR-1 psicossocial",
    "laudo psicossocial",
    "avaliação psicossocial online",
    "saúde ocupacional",
    "riscos psicossociais NR-1",
    "plataforma medicina ocupacional",
    "gestão saúde mental colaboradores",
    "LGPD saúde ocupacional",
    "QWork",
  ],
  authors: [{ name: "QWork", url: siteUrl }],
  creator: "QWork",
  publisher: "QWork",
  category: "health",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "QWork",
    title: "QWork — Avaliação de Riscos Psicossociais | COPSOQ III",
    description:
      "Plataforma completa para avaliação psicossocial baseada no COPSOQ III. Cadastro gratuito, avaliações ilimitadas. Pague só ao emitir o Laudo. Conformidade com NR-1 e LGPD.",
    images: [
      {
        url: "/logo-qwork.png",
        width: 1200,
        height: 630,
        alt: "QWork — Avaliando riscos psicossociais da sua empresa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QWork — Avaliação de Riscos Psicossociais | COPSOQ III",
    description:
      "Plataforma de avaliação psicossocial baseada no COPSOQ III. Cadastro gratuito, avaliações ilimitadas. Pague só ao emitir o Laudo.",
    images: ["/logo-qwork.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icon-192.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "QWork",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo-qwork.png`,
      },
      description:
        "QWork é uma plataforma de avaliação de riscos psicossociais para operadoras de medicina ocupacional e RHs de empresas, baseada no questionário COPSOQ III, com conformidade NR-1 e LGPD.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "São Paulo",
        addressRegion: "SP",
        addressCountry: "BR",
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "contato@qwork.com.br",
        availableLanguage: "Portuguese",
      },
      sameAs: [],
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${siteUrl}/#product`,
      name: "QWork — Plataforma de Avaliação Psicossocial",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: siteUrl,
      description:
        "QWork é a solução para avaliação de riscos psicossociais baseada no COPSOQ III. Permite que operadoras de medicina ocupacional e RHs de empresas realizem avaliações ilimitadas com pagamento apenas na emissão do Laudo de Identificação e Mapeamento de Riscos Psicossociais. Conformidade com NR-1 e LGPD. Rastreabilidade via hash SHA256.",
      offers: {
        "@type": "Offer",
        priceCurrency: "BRL",
        price: "0",
        description:
          "Cadastro gratuito e avaliações ilimitadas. Pagamento único por Laudo emitido, a partir de R$ 10 por colaborador para operadoras.",
        availability: "https://schema.org/InStock",
      },
      featureList: [
        "Avaliação psicossocial baseada no COPSOQ III",
        "Laudos com rastreabilidade SHA256",
        "Conformidade com NR-1",
        "Conformidade com LGPD",
        "Avaliações ilimitadas sem mensalidade",
        "Pagamento apenas na emissão do Laudo",
        "Importação de colaboradores via Excel",
        "Relatórios em PDF e Excel",
        "Gestão de múltiplos clientes para operadoras",
      ],
      provider: {
        "@id": `${siteUrl}/#organization`,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "QWork",
      description:
        "Plataforma de avaliação de riscos psicossociais para operadoras de medicina ocupacional e RHs de empresas.",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
      inLanguage: "pt-BR",
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "O que é a QWork?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "QWork é uma plataforma digital de avaliação de riscos psicossociais para operadoras de medicina ocupacional e RHs de empresas. Baseada no questionário COPSOQ III, permite realizar avaliações ilimitadas com pagamento apenas na emissão do Laudo de Identificação e Mapeamento de Riscos Psicossociais.",
          },
        },
        {
          "@type": "Question",
          name: "Como funciona a avaliação psicossocial no QWork?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Utilizamos o questionário COPSOQ III, com 37 questões para avaliar fatores de risco psicossocial. Os colaboradores respondem ao questionário online, a plataforma analisa os dados e gera relatórios completos identificando riscos que afetam a integridade e a qualidade de vida no trabalho.",
          },
        },
        {
          "@type": "Question",
          name: "Quanto custa usar a plataforma QWork?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "O cadastro e todas as avaliações psicossociais são completamente gratuitos. Você paga somente ao emitir o Laudo de Identificação e Mapeamento de Riscos Psicossociais. Operadoras de medicina ocupacional a partir de R$ 10 por colaborador, e empresas/entidades a partir de R$ 20 por colaborador, com desconto progressivo por volume.",
          },
        },
        {
          "@type": "Question",
          name: "O Laudo do QWork é compatível com a NR-1?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sim. Todos os laudos são compatíveis com a NR-1 e contêm as informações necessárias sobre identificação e mapeamento de riscos psicossociais. O Laudo registra hash SHA256 em toda a cadeia de custódia, garantindo rastreabilidade e validade jurídica.",
          },
        },
        {
          "@type": "Question",
          name: "O QWork é adequado para operadoras de medicina ocupacional?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sim. Operadoras de medicina ocupacional são o público principal. Com uma única conta, é possível gerenciar múltiplos clientes (empresas e entidades) de forma independente, com avaliações e laudos rastreados por instituição. A precificação especial começa a partir de R$ 10 por colaborador com descontos progressivos por volume.",
          },
        },
        {
          "@type": "Question",
          name: "O QWork está em conformidade com a LGPD?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sim. A plataforma QWork possui conformidade total com a LGPD (Lei Geral de Proteção de Dados). Os dados dos colaboradores são armazenados com segurança e utilizados exclusivamente para fins de avaliação psicossocial.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
