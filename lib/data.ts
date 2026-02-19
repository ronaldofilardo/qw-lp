export interface Feature {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export const features: Feature[] = [
  {
    id: 1,
    icon: "graduation-cap",
    title: "Metodologia Científica Validada",
    description:
      "Baseado no COPSOQ III, questionário validado internacionalmente para avaliação de riscos psicossociais. Não é achismo, é ciência.",
  },
  {
    id: 2,
    icon: "users",
    title: "Gestão Simplificada",
    description:
      "Importação rápida via Excel, configuração personalizada e interface intuitiva. Tudo pensado para otimizar seu tempo.",
  },
  {
    id: 3,
    icon: "download",
    title: "Relatórios Profissionais",
    description:
      "Laudos técnicos em PDF e Excel com insights detalhados e conformidade com NR-1. Informações claras para tomada de decisão.",
  },
  {
    id: 4,
    icon: "shield",
    title: "Segurança e Conformidade",
    description:
      "Armazenamento seguro de dados e conformidade total com a LGPD. Levamos a segurança da informação a sério.",
  },
  {
    id: 5,
    icon: "heart-with-pulse",
    title: "Bem-Estar como Prioridade",
    description:
      "A avaliação psicossocial vai além da conformidade: ela identifica riscos que afetam diretamente a integridade física, mental e a qualidade de vida dos colaboradores, promovendo um ambiente de trabalho genuinamente mais saudável.",
  },
  {
    id: 6,
    icon: "eye",
    title: "Transparência e Responsabilidade",
    description:
      "Resultados documentados e rastreáveis criam um histórico auditável, promovendo responsabilidade organizacional junto aos colaboradores, sindicatos e órgãos fiscalizadores.",
  },
];

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export const faqItems: FAQItem[] = [
  {
    id: 1,
    question: "Como funciona a avaliação psicossocial?",
    answer:
      "Utilizamos o questionário COPSOQ III, com 37 questões para avaliar fatores de risco psicossocial. Os colaboradores respondem ao questionário, a plataforma analisa os dados e gera relatórios completos, identificando riscos que afetam a integridade e a qualidade de vida no trabalho.",
  },
  {
    id: 2,
    question: "Quanto tempo leva para completar a avaliação?",
    answer:
      "A avaliação é rápida e objetiva. Os colaboradores levam aproximadamente 10 a 15 minutos para responder todas as questões. A plataforma acompanha o progresso em tempo real.",
  },
  {
    id: 3,
    question: "Como importar os dados dos colaboradores?",
    answer:
      "Você pode importar os dados via arquivo Excel. Disponibilizamos um template padronizado para facilitar o processo. Também é possível cadastrar manualmente, um a um.",
  },
  {
    id: 4,
    question: "Os relatórios são compatíveis com a NR-1?",
    answer:
      "Sim. Todos os relatórios são compatíveis com a NR-1 e contêm as informações necessárias sobre identificação e mapeamento de riscos psicossociais. O Laudo ainda registra hash SHA256 em toda a cadeia de custódia, garantindo rastreabilidade e validade jurídica.",
  },
  {
    id: 5,
    question: "Qual o custo para usar a plataforma?",
    answer:
      "O cadastro e todas as avaliações psicossociais são completamente gratuitos. Você paga somente ao emitir o Laudo de Identificação e Mapeamento de Riscos Psicossociais, com valor por colaborador avaliado. A precificação é flexível: operadoras de medicina ocupacional a partir de R$ 10/colaborador e empresas e entidades a partir de R$ 20/colaborador, com desconto progressivo conforme o volume de avaliações. Solicite um orçamento customizado.",
  },
  {
    id: 6,
    question: "Posso fazer quantas avaliações quiser sem custo?",
    answer:
      "Sim. Clínicas e entidades de medicina ocupacional podem realizar avaliações ilimitadas na plataforma sem qualquer cobrança. O pagamento ocorre exclusivamente na emissão do Laudo, quando você decidir que os dados estão prontos para formalização.",
  },
  {
    id: 7,
    question: "O que garante a validade jurídica do Laudo emitido?",
    answer:
      "Cada emissão do Laudo de Identificação e Mapeamento de Riscos Psicossociais é registrada com hash SHA256 em todo o ciclo de emissão, formando uma cadeia de custódia auditável e inviolável. Isso assegura autenticidade, rastreabilidade e conformidade com as exigências legais da NR-1 e da LGPD.",
  },
  {
    id: 8,
    question: "Como funciona para operadoras de medicina ocupacional?",
    answer:
      "Operadoras de medicina ocupacional são nosso público principal. Com uma única conta, você gerencia múltiplos clientes (empresas e entidades) de forma independente, com avaliações e laudos rastreados por instituição. A precificação especial para operadoras parte de R$ 10 por colaborador avaliado, com descontos progressivos conforme o volume total das instituições atendidas. Solicite um orçamento customizado para sua operação.",
  },
  {
    id: 9,
    question: "Posso contratar como empresa ou RH diretamente?",
    answer:
      "Sim. Empresas e departamentos de RH também podem usar a plataforma diretamente, sem precisar de uma operadora intermediária. A precificação para empresas e entidades parte de R$ 20 por colaborador avaliado, com possibilidade de desconto para grandes volumes. O processo é o mesmo: cadastro gratuito, avaliações ilimitadas e pagamento somente na emissão do Laudo.",
  },
];
