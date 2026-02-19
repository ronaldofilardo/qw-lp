# QWork Landing Page

Landing page para o QWork, um sistema de avaliação psicossocial para gestão de risco ocupacional.

## Tech Stack

- **Next.js 16** - Framework React para produção
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Framer Motion** - Animações
- **Lucide React** - Ícones

## Pré-requisitos

- Node.js 18 ou superior
- npm, yarn ou pnpm (recomendado)

## Instalação

```bash
# Navegue até o diretório do projeto
cd C:\apps\qwork-lp

# Instale as dependências
pnpm install
```

## Desenvolvimento

```bash
# Inicie o servidor de desenvolvimento na porta 3001
pnpm dev --port 3001
```

A página estará disponível em `http://localhost:3001`.

## Build de Produção

```bash
# Crie o build de produção
pnpm build

# Inicie o servidor de produção
pnpm start --port 3001
```

## Estrutura do Projeto

```
qwork-lp/
├── app/
│   ├── page.tsx          # Página principal da landing page
│   └── layout.tsx        # Layout da aplicação
├── lib/
│   └── data.ts           # Dados de planos e funcionalidades
├── public/               # Arquivos estáticos
├── next.config.ts        # Configuração do Next.js
├── postcss.config.mjs    # Configuração do PostCSS
├── tailwind.config.ts    # Configuração do Tailwind CSS
├── tsconfig.json         # Configuração do TypeScript
└── package.json          # Dependências e scripts
```

## Funcionalidades

1. **Hero Section**: Apresentação do produto e chamada à ação
2. **Features Section**: Descrição das funcionalidades do QWork
3. **Plans Section**: Planos e preços
4. **How It Works Section**: Passo a passo do funcionamento
5. **FAQ Section**: Perguntas frequentes
6. **CTA Section**: Chamada final à ação
7. **Footer**: Informações de contato e links importantes

## Design

O design é baseado em:

- Cor principal: Verde (#10b981)
- Cores neutras: Cinzas e brancos
- Tipografia: Inter (padrão do Next.js)
- Layout responsive com grid e flexbox

## Imagens

As imagens são carregadas de:

- Cloudinary (logos e imagens do produto)
- Icons8 (ícones de funcionalidades)

## SEO

A página inclui:

- Meta tags básicas (title, description)
- Open Graph tags
- Favicon
- Schema markup

## Licença

MIT
