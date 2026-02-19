"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  CheckCircle,
  ChevronRight,
  Download,
  Eye,
  Facebook,
  GraduationCap,
  HeartPulse,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Phone,
  Shield,
  ShoppingCart,
  Twitter,
  Users,
  X,
} from "lucide-react";

import { faqItems, features } from "@/lib/data";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-[#1a1a1a]/95 backdrop-blur-md border-b border-gray-800 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image
                src="/logo-qwork.png"
                alt="QWork Logo"
                width={130}
                height={44}
                className="object-contain"
                priority
              />
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-gray-300 hover:text-[#9ccc65] transition-colors"
              >
                Funcionalidades
              </a>
              <a
                href="#modelo"
                className="text-gray-300 hover:text-[#9ccc65] transition-colors"
              >
                Modelo
              </a>
              <a
                href="#how-it-works"
                className="text-gray-300 hover:text-[#9ccc65] transition-colors"
              >
                Como Funciona
              </a>
              <a
                href="#faq"
                className="text-gray-300 hover:text-[#9ccc65] transition-colors"
              >
                FAQ
              </a>
            </nav>
            <div className="hidden md:flex items-center gap-4">
              <a
                href="https://qwork-psi.vercel.app/login"
                className="bg-[#9ccc65] hover:bg-[#7cb342] text-[#1a1a1a] px-5 py-2 rounded-full font-medium transition-colors"
              >
                Começar Agora
              </a>
            </div>
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-[#2d2d2d] border-t border-gray-800"
          >
            <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
              <a
                href="#features"
                className="text-gray-300 hover:text-[#9ccc65] transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Funcionalidades
              </a>
              <a
                href="#modelo"
                className="text-gray-300 hover:text-[#9ccc65] transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Modelo
              </a>
              <a
                href="#how-it-works"
                className="text-gray-300 hover:text-[#9ccc65] transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Como Funciona
              </a>
              <a
                href="#faq"
                className="text-gray-300 hover:text-[#9ccc65] transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </a>
              <a
                href="https://qwork-psi.vercel.app/login"
                className="bg-[#9ccc65] hover:bg-[#7cb342] text-[#1a1a1a] px-5 py-2 rounded-full font-medium transition-colors w-full text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Começar Agora
              </a>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a] relative overflow-hidden texture-paper">
        <div className="absolute top-20 right-10 w-32 h-32 bg-[#9ccc65] rounded-full blur-3xl opacity-10 animate-float-slow"></div>
        <div className="absolute bottom-32 left-10 w-40 h-40 bg-[#9ccc65] rounded-full blur-3xl opacity-10 animate-float-medium"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-[#9ccc65]/15 border border-[#9ccc65]/40 rounded-full px-5 py-2 mb-8">
                <span className="text-[#9ccc65] text-sm font-semibold">
                  Para Operadoras de Medicina Ocupacional
                </span>
                <span className="text-gray-500 text-sm">e</span>
                <span className="text-gray-300 text-sm font-medium">
                  RHs de Empresas
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Vamos ser diretos:
                <br />
                <span className="text-[#9ccc65] inline-block relative">
                  Cuidar da saúde mental da sua equipe{" "}
                  <span className="text-[#9ccc65] opacity-40 absolute -bottom-2 left-0 w-full h-3 -z-10">
                    ___________________
                  </span>
                </span>
                <br />
                <span className="text-gray-300">
                  não deveria ser tão complicado
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 mb-10 leading-relaxed">
                A avaliação psicossocial que sua empresa precisa — preservando a{" "}
                <span className="text-white font-medium">
                  integridade e qualidade de vida
                </span>{" "}
                dos colaboradores e gerando a{" "}
                <span className="text-white font-medium">transparência</span>{" "}
                que transforma responsabilidade em cultura organizacional.
                Baseada no COPSOQ III, sem complicação.{" "}
                <span className="text-[#9ccc65] font-semibold">
                  Avaliações ilimitadas, sem mensalidade. Pague só ao emitir o
                  Laudo.
                </span>
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <a
                href="https://qwork-psi.vercel.app/login"
                className="bg-[#9ccc65] hover:bg-[#7cb342] text-[#1a1a1a] px-8 py-4 rounded-full font-semibold text-lg btn-organic shadow-organic hover:shadow-organic-hover flex items-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Começar Agora
              </a>
              <a
                href="#modelo"
                className="bg-[#2d2d2d] hover:bg-[#3d3d3d] text-white px-8 py-4 rounded-full font-semibold text-lg border-2 border-gray-700 btn-organic shadow-organic hover:shadow-organic-hover flex items-center gap-2"
              >
                <ChevronRight className="w-5 h-5" />
                Entender o Modelo
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-[#2d2d2d]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-white">
              Recursos Completos para sua Empresa
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Ferramentas para proteger a saúde mental da sua equipe e garantir
              conformidade com as normas trabalhistas.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.15,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
                whileHover={{
                  y: -8,
                  rotate: index % 2 === 0 ? -1 : 1,
                  transition: { duration: 0.3 },
                }}
                className={`bg-[#1a1a1a] border border-gray-800 rounded-2xl shadow-organic hover:shadow-organic-hover transition-all p-8 ${
                  index % 3 === 0
                    ? "card-tilt-1"
                    : index % 3 === 1
                      ? "card-tilt-2"
                      : "card-tilt-3"
                }`}
                style={{
                  marginTop: index % 2 === 0 ? "0" : "1.5rem",
                }}
              >
                <div>
                  <div className="w-14 h-14 bg-[#9ccc65]/20 rounded-full flex items-center justify-center mb-6 border border-[#9ccc65]/30">
                    {feature.icon === "graduation-cap" && (
                      <GraduationCap className="w-7 h-7 text-[#9ccc65]" />
                    )}
                    {feature.icon === "users" && (
                      <Users className="w-7 h-7 text-[#9ccc65]" />
                    )}
                    {feature.icon === "download" && (
                      <Download className="w-7 h-7 text-[#9ccc65]" />
                    )}
                    {feature.icon === "shield" && (
                      <Shield className="w-7 h-7 text-[#9ccc65]" />
                    )}
                    {feature.icon === "heart-with-pulse" && (
                      <HeartPulse className="w-7 h-7 text-[#9ccc65]" />
                    )}
                    {feature.icon === "eye" && (
                      <Eye className="w-7 h-7 text-[#9ccc65]" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modelo Section */}
      <section
        id="modelo"
        className="py-20 bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d]/50 to-[#1a1a1a] relative texture-paper"
      >
        <div className="absolute top-10 left-1/4 w-24 h-24 bg-[#9ccc65] rounded-full blur-3xl opacity-10 animate-float-medium"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-white">
              Simples, Transparente e Justo
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Cadastre-se grátis. Faça quantas avaliações precisar. Pague
              somente ao emitir o Laudo.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                emoji: "🏥",
                tag: "Gratuito",
                tagColor:
                  "bg-[#9ccc65]/20 text-[#9ccc65] border border-[#9ccc65]/30",
                title: "Cadastro Gratuito",
                description:
                  "Clínicas e entidades de medicina ocupacional se cadastram sem nenhum custo ou burocracia. Acesso imediato à plataforma completa.",
                highlight: false,
                badge: null,
              },
              {
                emoji: "📊",
                tag: "Sem limite",
                tagColor:
                  "bg-[#9ccc65]/20 text-[#9ccc65] border border-[#9ccc65]/30",
                title: "Avaliações Ilimitadas",
                description:
                  "Realize quantas avaliações psicossociais precisar — para qualquer número de colaboradores — sem restrições e sem mensalidade.",
                highlight: false,
                badge: null,
              },
              {
                emoji: "🔒",
                tag: "Pague por laudo",
                tagColor:
                  "bg-[#9ccc65] text-[#1a1a1a] border border-transparent font-semibold",
                title: "Laudo com Rastreabilidade",
                description:
                  "Emita o Laudo de Identificação e Mapeamento de Riscos Psicossociais quando precisar. Cada emissão registra hash SHA256 em toda a cadeia de custódia, garantindo validade jurídica e conformidade com a NR-1.",
                highlight: true,
                badge: "precificacao",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.12,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                  transition: { duration: 0.3 },
                }}
                className={`rounded-2xl shadow-organic hover:shadow-organic-hover transition-all p-8 flex flex-col ${
                  item.highlight
                    ? "bg-[#2d2d2d] ring-2 ring-[#9ccc65] border border-[#9ccc65]"
                    : "bg-[#2d2d2d] border border-gray-700"
                }`}
              >
                <div className="text-5xl mb-4">{item.emoji}</div>
                <span
                  className={`inline-block self-start text-xs px-3 py-1 rounded-full mb-4 ${item.tagColor}`}
                >
                  {item.tag}
                </span>
                <h3 className="text-2xl font-bold mb-4 text-white">
                  {item.title}
                </h3>
                <p className="text-gray-400 leading-relaxed flex-1">
                  {item.description}
                </p>
                {item.badge && item.badge !== "precificacao" && (
                  <div className="mt-6 bg-[#9ccc65]/10 border border-[#9ccc65]/30 rounded-lg px-4 py-3 text-center">
                    <span className="text-[#9ccc65] font-semibold text-sm">
                      💰 {item.badge}
                    </span>
                  </div>
                )}
                {item.badge === "precificacao" && (
                  <div className="mt-6 space-y-2">
                    <div className="flex items-center justify-between bg-[#1a1a1a] border border-[#9ccc65]/30 rounded-lg px-4 py-3">
                      <span className="text-gray-300 text-sm">
                        🏥 Operadoras de Med. Ocupacional
                      </span>
                      <span className="text-[#9ccc65] font-bold text-sm">
                        a partir de R$ 10/colab.
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3">
                      <span className="text-gray-300 text-sm">
                        🏢 Empresas e Entidades
                      </span>
                      <span className="text-[#9ccc65] font-bold text-sm">
                        a partir de R$ 20/colab.
                      </span>
                    </div>
                    <div className="mt-3 rounded-lg border border-[#9ccc65]/40 bg-[#9ccc65]/10 px-4 py-2 text-center">
                      <p className="text-sm font-semibold text-[#9ccc65]">
                        Desconto progressivo por volume —{" "}
                        <a
                          href="#faq-5"
                          className="underline underline-offset-2 hover:text-white transition-colors"
                        >
                          saiba mais
                        </a>
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Purpose callout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-14 max-w-4xl mx-auto rounded-2xl border border-[#9ccc65]/30 bg-[#9ccc65]/10 shadow-organic p-8 text-center"
          >
            <div className="text-3xl mb-4">💚</div>
            <p className="text-lg md:text-xl text-[#9ccc65] leading-relaxed font-medium">
              Mais do que conformidade com a NR-1 — a avaliação psicossocial
              preserva a{" "}
              <strong className="text-white">
                integridade e a qualidade de vida
              </strong>{" "}
              dos colaboradores, e gera a{" "}
              <strong className="text-white">transparência</strong> que
              transforma responsabilidade em cultura organizacional.
            </p>
          </motion.div>

          {/* Para Quem é o QWork */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 max-w-4xl mx-auto"
          >
            <h3 className="text-center text-2xl font-bold text-white mb-8">
              Para quem é o QWork?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#2d2d2d] border-2 border-[#9ccc65] rounded-2xl p-7 shadow-organic">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🏥</span>
                  <div>
                    <span className="bg-[#9ccc65] text-[#1a1a1a] text-xs font-bold px-3 py-1 rounded-full">
                      Cliente Principal
                    </span>
                    <h4 className="text-xl font-bold text-white mt-1">
                      Operadoras de Medicina Ocupacional
                    </h4>
                  </div>
                </div>
                <p className="text-gray-400 leading-relaxed mb-5">
                  Gerencie múltiplos clientes em uma única plataforma. Cada
                  instituição com suas avaliações e laudos rastreados de forma
                  independente. Escale sua operação sem aumentar custos fixos.
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    "Gestão multi-cliente centralizada",
                    "Precificação especial por volume",
                    "Rastreabilidade total por instituição",
                    "Conformidade NR-1 para todos os clientes",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#9ccc65] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-[#9ccc65] hover:bg-[#7cb342] text-[#1a1a1a] py-3 rounded-lg font-semibold btn-organic transition-colors">
                  Solicitar Orçamento Customizado
                </button>
              </div>
              <div className="bg-[#2d2d2d] border border-gray-700 rounded-2xl p-7 shadow-organic">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🏢</span>
                  <div>
                    <span className="bg-gray-700 text-gray-300 text-xs font-semibold px-3 py-1 rounded-full">
                      Também atendemos
                    </span>
                    <h4 className="text-xl font-bold text-white mt-1">
                      Empresas e RHs
                    </h4>
                  </div>
                </div>
                <p className="text-gray-400 leading-relaxed mb-5">
                  Departamentos de RH e empresas que preferem conduzir as
                  avaliações internamente, sem intermediadores. Total controle e
                  visibilidade sobre os seus dados.
                </p>
                <ul className="space-y-2 mb-6">
                  {[
                    "Cadastro e uso imediato",
                    "Import. de colaboradores via Excel",
                    "Laudos com validade jurídica (SHA256)",
                    "Desconto para grandes volumes",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#9ccc65] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-[#1a1a1a] hover:bg-[#3d3d3d] text-white border border-gray-600 py-3 rounded-lg font-semibold btn-organic transition-colors">
                  Criar Conta Grátis
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-[#1a1a1a] relative">
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#9ccc65] rounded-full blur-3xl opacity-10 animate-float-slow"></div>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-white">
              Como Funciona na Prática
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Processo simples e direto para começar a cuidar da saúde mental da
              sua equipe.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {[
              {
                number: "01",
                title: "Cadastre sua Empresa",
                description:
                  "Crie uma conta gratuitamente e adicione as informações básicas.",
                emoji: "🏢",
              },
              {
                number: "02",
                title: "Importe Funcionários",
                description:
                  "Importe os dados via Excel ou cadastre manualmente.",
                emoji: "👥",
              },
              {
                number: "03",
                title: "Analise os Resultados",
                description:
                  "Acesse relatórios detalhados e tome decisões baseadas em dados reais sobre os riscos psicossociais identificados.",
                emoji: "📊",
              },
              {
                number: "04",
                title: "Emita o Laudo com Rastreabilidade",
                description:
                  "Solicite o Laudo de Identificação e Mapeamento de Riscos Psicossociais. Cada emissão registra hash SHA256 em toda a cadeia de custódia, garantindo validade jurídica e conformidade com a NR-1.",
                emoji: "🔒",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.12,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
                className="text-center"
                style={{
                  marginTop: index % 2 === 0 ? "0" : "2rem",
                }}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-[#9ccc65] to-[#7cb342] text-[#1a1a1a] rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-organic animate-wiggle">
                  {step.number}
                </div>
                <div className="text-4xl mb-3">{step.emoji}</div>
                <h3 className="text-xl font-bold mb-3 text-white">
                  {step.title}
                </h3>
                <p className="text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-[#2d2d2d]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-white">
              Perguntas Frequentes
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Respostas para as dúvidas mais comuns sobre a plataforma.
            </p>
          </motion.div>
          <div className="max-w-3xl mx-auto">
            {faqItems.map((item) => (
              <motion.div
                key={item.id}
                id={`faq-${item.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: item.id * 0.05 }}
                className="mb-4 scroll-mt-28"
              >
                <button
                  onClick={() =>
                    setActiveFaq(activeFaq === item.id ? null : item.id)
                  }
                  className="w-full flex items-center justify-between bg-[#1a1a1a] border border-gray-800 p-6 rounded-lg shadow-organic hover:shadow-organic-hover transition-all btn-organic"
                >
                  <span className="text-lg font-semibold text-left text-white">
                    {item.question}
                  </span>
                  <ChevronRight
                    className={`w-5 h-5 transition-transform duration-300 text-[#9ccc65] ${
                      activeFaq === item.id ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {activeFaq === item.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="bg-[#1a1a1a] border-x border-b border-gray-800 p-6 rounded-b-lg shadow-organic"
                  >
                    <p className="text-gray-300 leading-relaxed">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a] text-white relative overflow-hidden border-t border-gray-800">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-[#9ccc65] rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#9ccc65] rounded-full blur-3xl animate-float-medium"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Comece Agora, Sem Custo
              </h2>
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                Cadastre sua clínica ou entidade, conduza avaliações ilimitadas
                e emita o{" "}
                <span className="text-white font-semibold">
                  Laudo de Identificação e Mapeamento de Riscos Psicossociais
                </span>{" "}
                somente quando precisar — com rastreabilidade SHA256 e
                compromisso real com o{" "}
                <span className="text-[#9ccc65] font-semibold">
                  bem-estar dos seus colaboradores
                </span>
                .
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="bg-[#9ccc65] hover:bg-[#7cb342] text-[#1a1a1a] px-10 py-5 rounded-full font-bold text-lg btn-organic shadow-organic-hover flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6" />
                  Criar Conta Grátis
                </button>
                <a
                  href="#modelo"
                  className="bg-transparent hover:bg-[#2d2d2d] text-[#9ccc65] border-2 border-[#9ccc65]/50 px-10 py-5 rounded-full font-bold text-lg btn-organic flex items-center gap-3 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                  Entender o Modelo
                </a>
              </div>
              <p className="text-sm text-gray-500 mt-6">
                ✓ Cadastro gratuito  ·  ✓ Avaliações ilimitadas  ·  ✓ Pague só
                pelo Laudo
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0d0d0d] text-white py-16 border-t border-gray-900">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Image
                  src="/logo-qwork.png"
                  alt="QWork Logo"
                  width={130}
                  height={44}
                  className="object-contain"
                />
              </div>
              <p className="text-gray-500 mb-4">
                Cuidando da saúde mental no trabalho, um dia de cada vez. 💚
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  className="text-gray-500 hover:text-[#9ccc65] transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-[#9ccc65] transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-[#9ccc65] transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-[#9ccc65] transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Produto</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="text-gray-500 hover:text-[#9ccc65] transition-colors"
                  >
                    Funcionalidades
                  </a>
                </li>
                <li>
                  <a
                    href="#modelo"
                    className="text-gray-500 hover:text-[#9ccc65] transition-colors"
                  >
                    Modelo
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-gray-500 hover:text-[#9ccc65] transition-colors"
                  >
                    Como Funciona
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="text-gray-500 hover:text-[#9ccc65] transition-colors"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/termos-de-uso"
                    className="text-gray-500 hover:text-[#9ccc65] transition-colors"
                  >
                    Termos de Uso
                  </a>
                </li>
                <li>
                  <a
                    href="/politica-de-privacidade"
                    className="text-gray-500 hover:text-[#9ccc65] transition-colors"
                  >
                    Política de Privacidade
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contato</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-3 text-gray-500">
                  <Mail className="w-5 h-5" />
                  <span>contato@qwork.com.br</span>
                </li>
                <li className="flex items-center gap-3 text-gray-500">
                  <Phone className="w-5 h-5" />
                  <span>+55 (11) 99999-9999</span>
                </li>
                <li className="flex items-center gap-3 text-gray-500">
                  <MapPin className="w-5 h-5" />
                  <span>São Paulo, SP</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-900 mt-12 pt-8 text-center text-gray-600">
            <p>&copy; 2026 QWork. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
