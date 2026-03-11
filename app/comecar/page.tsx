"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  Check,
  ChevronRight,
  Copy,
  ExternalLink,
  Loader2,
  MessageCircle,
  Send,
  UserCheck,
  UserCog,
} from "lucide-react";

const LP_URL = "https://qwork-psi.vercel.app";
const APP_LOGIN_URL = "https://qwork-psi.vercel.app/login";

const WHATSAPP_MESSAGE = encodeURIComponent(
  `Olá! Gostaria de sugerir a QWork para avaliações psicossociais da nossa equipe. É uma plataforma baseada no COPSOQ III para identificação e mapeamento de riscos psicossociais no trabalho. Saiba mais: ${LP_URL}`,
);

type Path = "funcionario" | "empresa" | "individual" | null;

interface LeadForm {
  nome: string;
  emailPessoal: string;
  empresa: string;
  emailRH: string;
}

export default function ComecarPage() {
  const [selectedPath, setSelectedPath] = useState<Path>(null);
  const [form, setForm] = useState<LeadForm>({
    nome: "",
    emailPessoal: "",
    empresa: "",
    emailRH: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [copied, setCopied] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(LP_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#1a1a1a]/95 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-[#9ccc65] transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <Image
            src="/logo-qwork.png"
            alt="QWork Logo"
            width={110}
            height={37}
            className="object-contain"
            priority
          />
          <div className="w-16" />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-3xl"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#9ccc65]/10 border border-[#9ccc65]/30 rounded-full px-5 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#9ccc65] animate-pulse" />
              <span className="text-[#9ccc65] text-sm font-semibold tracking-widest uppercase">
                Próximos Passos
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Como você deseja continuar?
            </h1>
            <p className="text-gray-400 text-lg max-w-lg mx-auto">
              Selecione o perfil que melhor descreve você para seguirmos juntos.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {/* Card 1 — Funcionário ou Gestor */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className={`rounded-2xl border p-6 cursor-pointer transition-all ${
                selectedPath === "funcionario"
                  ? "border-[#9ccc65] bg-[#9ccc65]/10"
                  : "border-gray-700 bg-[#2d2d2d] hover:border-[#9ccc65]/50"
              }`}
              onClick={() => setSelectedPath("funcionario")}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#9ccc65]/20 border border-[#9ccc65]/30 flex items-center justify-center">
                  <UserCheck className="w-7 h-7 text-[#9ccc65]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white mb-1">
                    Sou Funcionário ou Gestor
                  </h2>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Minha empresa já está cadastrada e quero acessar minha
                    avaliação ou painel.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Card 2 — Empresa */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className={`rounded-2xl border p-6 cursor-pointer transition-all ${
                selectedPath === "empresa"
                  ? "border-[#9ccc65] bg-[#9ccc65]/10"
                  : "border-gray-700 bg-[#2d2d2d] hover:border-[#9ccc65]/50"
              }`}
              onClick={() => setSelectedPath("empresa")}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#9ccc65]/20 border border-[#9ccc65]/30 flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-[#9ccc65]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white mb-1">
                    Represento uma Empresa
                  </h2>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Quero cadastrar minha empresa ou clínica e iniciar
                    avaliações psicossociais.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Card 3 — Avaliação Individual */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className={`rounded-2xl border p-6 cursor-pointer transition-all ${
                selectedPath === "individual"
                  ? "border-[#9ccc65] bg-[#9ccc65]/10"
                  : "border-gray-700 bg-[#2d2d2d] hover:border-[#9ccc65]/50"
              }`}
              onClick={() => setSelectedPath("individual")}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#9ccc65]/20 border border-[#9ccc65]/30 flex items-center justify-center">
                  <UserCog className="w-7 h-7 text-[#9ccc65]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white mb-1">
                    Avaliação Individual
                  </h2>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Sou profissional interessado em fazer minha própria
                    avaliação psicossocial.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Action Panels */}
          <AnimatePresence mode="wait">
            {/* Funcionário / Gestor */}
            {selectedPath === "funcionario" && (
              <motion.div
                key="funcionario"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl border border-[#9ccc65]/40 bg-[#9ccc65]/5 p-7"
              >
                <h3 className="text-lg font-bold text-white mb-2">
                  Acesse com suas credenciais
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-5">
                  Se você{" "}
                  <strong className="text-gray-200">recebeu um convite</strong>{" "}
                  ou foi cadastrado pela sua empresa, basta acessar com seu{" "}
                  <strong className="text-gray-200">
                    CPF e data de nascimento
                  </strong>{" "}
                  (ou senha, se tiver criado uma). Gestores e RHs acessam o
                  painel completo com as mesmas credenciais.
                </p>
                <a
                  href={APP_LOGIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#9ccc65] hover:bg-[#7cb342] text-[#1a1a1a] px-6 py-3 rounded-full font-semibold transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Acessar Login
                </a>
              </motion.div>
            )}

            {/* Empresa */}
            {selectedPath === "empresa" && (
              <motion.div
                key="empresa"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl border border-[#9ccc65]/40 bg-[#9ccc65]/5 p-7"
              >
                <h3 className="text-lg font-bold text-white mb-2">
                  Cadastre sua empresa em minutos
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-2">
                  O cadastro é{" "}
                  <strong className="text-gray-200">gratuito e imediato</strong>
                  . Na tela de acesso, clique em{" "}
                  <strong className="text-[#9ccc65]">Cadastrar Empresa</strong>{" "}
                  — o botão fica logo abaixo do formulário de login.
                </p>
                <p className="text-gray-400 text-sm leading-relaxed mb-5">
                  Após o cadastro você poderá importar funcionários, liberar
                  avaliações e, quando precisar, emitir o{" "}
                  <strong className="text-gray-200">
                    Laudo de Identificação e Mapeamento de Riscos Psicossociais
                  </strong>{" "}
                  com validade jurídica (SHA256, NR-1).
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={APP_LOGIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#9ccc65] hover:bg-[#7cb342] text-[#1a1a1a] px-6 py-3 rounded-full font-semibold transition-colors"
                  >
                    <Building2 className="w-4 h-4" />
                    Cadastrar Empresa
                  </a>
                  <Link
                    href="/#modelo"
                    className="inline-flex items-center gap-2 bg-[#2d2d2d] hover:bg-[#3d3d3d] text-white border border-gray-700 px-6 py-3 rounded-full font-semibold transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                    Entender o Modelo
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Avaliação Individual */}
            {selectedPath === "individual" && (
              <motion.div
                key="individual"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl border border-gray-700 bg-[#2d2d2d] p-7 space-y-6"
              >
                {/* Aviso */}
                <div className="flex gap-3 bg-[#1a1a1a] border border-gray-700 rounded-xl p-4">
                  <span className="text-2xl mt-0.5">💡</span>
                  <div>
                    <p className="text-white font-semibold text-sm mb-1">
                      Avaliação individual em breve!
                    </p>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      No momento, a QWork atende{" "}
                      <strong className="text-gray-200">
                        empresas, clínicas de medicina ocupacional e seus
                        respectivos funcionários
                      </strong>
                      . A modalidade de avaliação individual, sem vínculo
                      empresarial, está em nosso roadmap.
                    </p>
                    <p className="text-gray-400 text-sm leading-relaxed mt-2">
                      Enquanto isso, a melhor forma de ter acesso é{" "}
                      <strong className="text-[#9ccc65]">
                        sugerir a QWork para o seu RH ou gestor
                      </strong>
                      .
                    </p>
                  </div>
                </div>

                {/* Formulário de sugestão para o RH */}
                <div>
                  <h3 className="text-white font-bold mb-1 flex items-center gap-2">
                    <Send className="w-4 h-4 text-[#9ccc65]" />
                    Enviar sugestão para o seu RH
                  </h3>
                  <p className="text-gray-400 text-xs mb-4">
                    Preencha abaixo e enviaremos uma indicação em seu nome para
                    o RH da sua empresa.
                  </p>

                  {status === "success" ? (
                    <div className="flex items-center gap-3 bg-[#9ccc65]/10 border border-[#9ccc65]/40 rounded-xl p-4 text-[#9ccc65]">
                      <Check className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm font-semibold">
                        Sugestão enviada! Obrigado por indicar a QWork para sua
                        empresa.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Seu nome *
                          </label>
                          <input
                            name="nome"
                            value={form.nome}
                            onChange={handleFormChange}
                            required
                            placeholder="João Silva"
                            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#9ccc65] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Seu e-mail *
                          </label>
                          <input
                            name="emailPessoal"
                            type="email"
                            value={form.emailPessoal}
                            onChange={handleFormChange}
                            required
                            placeholder="voce@email.com"
                            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#9ccc65] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Sua empresa *
                          </label>
                          <input
                            name="empresa"
                            value={form.empresa}
                            onChange={handleFormChange}
                            required
                            placeholder="Nome da empresa"
                            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#9ccc65] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            E-mail do RH (se souber)
                          </label>
                          <input
                            name="emailRH"
                            type="email"
                            value={form.emailRH}
                            onChange={handleFormChange}
                            placeholder="rh@empresa.com"
                            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#9ccc65] transition-colors"
                          />
                        </div>
                      </div>
                      {status === "error" && (
                        <p className="text-red-400 text-xs">
                          Ocorreu um erro ao enviar. Tente novamente.
                        </p>
                      )}
                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="inline-flex items-center gap-2 bg-[#9ccc65] hover:bg-[#7cb342] disabled:opacity-60 text-[#1a1a1a] px-6 py-2.5 rounded-full font-semibold text-sm transition-colors"
                      >
                        {status === "loading" ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        Enviar Sugestão
                      </button>
                    </form>
                  )}
                </div>

                {/* Link direto de email */}
                <div className="text-center">
                  <p className="text-gray-500 text-xs mb-2">ou envie diretamente</p>
                  <a
                    href="mailto:contato@qwork.app.br?subject=Sugest%C3%A3o%20para%20meu%20RH&body=Ol%C3%A1%2C%0A%0AGostaria%20de%20sugerir%20a%20QWork%20para%20meu%20RH.%0A%0AAtenciosamente"
                    className="inline-flex items-center gap-2 text-[#9ccc65] hover:text-[#7cb342] font-semibold text-sm transition-colors"
                  >
                    <span>✉</span>
                    contato@qwork.app.br
                  </a>
                </div>

                {/* Divisor */}
                <div className="flex items-center gap-3 text-gray-600 text-xs">
                  <div className="flex-1 border-t border-gray-700" />
                  ou compartilhe diretamente
                  <div className="flex-1 border-t border-gray-700" />
                </div>

                {/* WhatsApp + Copiar */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={`https://wa.me/?text=${WHATSAPP_MESSAGE}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#25d366] hover:bg-[#1ebe57] text-white px-6 py-3 rounded-full font-semibold text-sm transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Compartilhar no WhatsApp
                  </a>
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#3d3d3d] text-white border border-gray-700 px-6 py-3 rounded-full font-semibold text-sm transition-colors"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-[#9ccc65]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {copied ? "Link copiado!" : "Copiar Link"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Footer mínimo */}
      <footer className="border-t border-gray-800 py-6 text-center text-gray-600 text-xs">
        © {new Date().getFullYear()} QWork — Avaliação Psicossocial baseada no
        COPSOQ III
      </footer>
    </div>
  );
}
