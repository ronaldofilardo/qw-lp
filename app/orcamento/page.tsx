"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  CheckCircle,
  Loader2,
  Send,
  Stethoscope,
} from "lucide-react";
import type { OrcamentoPayload } from "@/app/api/orcamento/route";

type TipoOrganizacao = "empresa_privada" | "medicina_ocupacional" | null;
type Status = "idle" | "loading" | "success" | "error";

function maskTelefone(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10)
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export default function OrcamentoPage() {
  const [tipoOrganizacao, setTipoOrganizacao] = useState<TipoOrganizacao>(null);
  const [fields, setFields] = useState({
    numeroFuncionarios: "",
    numeroEmpresas: "",
    totalFuncionarios: "",
    nome: "",
    email: "",
    telefone: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [erroMsg, setErroMsg] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFields((prev) => ({
      ...prev,
      [name]: name === "telefone" ? maskTelefone(value) : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErroMsg("");

    const payload: Partial<OrcamentoPayload> = {
      tipoOrganizacao: tipoOrganizacao as OrcamentoPayload["tipoOrganizacao"],
      nome: fields.nome,
      email: fields.email,
      telefone: fields.telefone,
    };

    if (tipoOrganizacao === "empresa_privada") {
      payload.numeroFuncionarios = Number(fields.numeroFuncionarios);
    } else {
      payload.numeroEmpresas = Number(fields.numeroEmpresas);
      payload.totalFuncionarios = Number(fields.totalFuncionarios);
    }

    try {
      const res = await fetch("/api/orcamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json();
        setErroMsg(data.error ?? "Erro ao enviar.");
        setStatus("error");
      }
    } catch {
      setErroMsg("Erro de conexão. Tente novamente.");
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col">
      {/* Header mínimo */}
      <header className="border-b border-gray-800 py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/">
            <Image
              src="/logo-qwork.png"
              alt="QWork Logo"
              width={110}
              height={37}
              className="object-contain"
              priority
            />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-[#9ccc65] transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          {status === "success" ? (
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-[#9ccc65] mx-auto" />
              <h2 className="text-2xl font-bold text-white">
                Solicitação enviada!
              </h2>
              <p className="text-gray-400">
                Recebi suas informações e entro em contato em breve.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-[#9ccc65] hover:bg-[#7cb342] text-[#1a1a1a] px-6 py-3 rounded-full font-semibold transition-colors mt-4"
              >
                Voltar ao início
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  Solicitar Orçamento Customizado
                </h1>
                <p className="text-gray-400 text-sm">
                  Preencha rapidamente e entraremos em contato.
                </p>
              </div>

              {/* Tipo de organização */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300">
                  Tipo de organização *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTipoOrganizacao("empresa_privada")}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-colors ${
                      tipoOrganizacao === "empresa_privada"
                        ? "border-[#9ccc65] bg-[#9ccc65]/10"
                        : "border-gray-700 bg-[#2d2d2d] hover:border-gray-500"
                    }`}
                  >
                    <Building2
                      className={`w-5 h-5 flex-shrink-0 ${
                        tipoOrganizacao === "empresa_privada"
                          ? "text-[#9ccc65]"
                          : "text-gray-500"
                      }`}
                    />
                    <div>
                      <p className="font-semibold text-sm text-white">
                        Empresa Privada
                      </p>
                      <p className="text-gray-400 text-xs">RH interno</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipoOrganizacao("medicina_ocupacional")}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-colors ${
                      tipoOrganizacao === "medicina_ocupacional"
                        ? "border-[#9ccc65] bg-[#9ccc65]/10"
                        : "border-gray-700 bg-[#2d2d2d] hover:border-gray-500"
                    }`}
                  >
                    <Stethoscope
                      className={`w-5 h-5 flex-shrink-0 ${
                        tipoOrganizacao === "medicina_ocupacional"
                          ? "text-[#9ccc65]"
                          : "text-gray-500"
                      }`}
                    />
                    <div>
                      <p className="font-semibold text-sm text-white">
                        Medicina Ocupacional
                      </p>
                      <p className="text-gray-400 text-xs">
                        Operadora / clínica
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Campos de dimensionamento — condicionais */}
              {tipoOrganizacao === "empresa_privada" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-semibold text-gray-300">
                    Número de funcionários *
                  </label>
                  <input
                    type="number"
                    name="numeroFuncionarios"
                    value={fields.numeroFuncionarios}
                    onChange={handleChange}
                    required
                    min={1}
                    placeholder="Ex: 150"
                    className="w-full bg-[#2d2d2d] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#9ccc65] transition-colors"
                  />
                </motion.div>
              )}

              {tipoOrganizacao === "medicina_ocupacional" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-300">
                      Empresas atendidas *
                    </label>
                    <input
                      type="number"
                      name="numeroEmpresas"
                      value={fields.numeroEmpresas}
                      onChange={handleChange}
                      required
                      min={1}
                      placeholder="Ex: 25"
                      className="w-full bg-[#2d2d2d] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#9ccc65] transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-300">
                      Total de funcionários *
                    </label>
                    <input
                      type="number"
                      name="totalFuncionarios"
                      value={fields.totalFuncionarios}
                      onChange={handleChange}
                      required
                      min={1}
                      placeholder="Ex: 5.000"
                      className="w-full bg-[#2d2d2d] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#9ccc65] transition-colors"
                    />
                  </div>
                </motion.div>
              )}

              {/* Dados de contato */}
              {tipoOrganizacao && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-3"
                >
                  <p className="text-sm font-semibold text-gray-300 border-t border-gray-800 pt-4">
                    Dados para contato
                  </p>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      Nome completo *
                    </label>
                    <input
                      type="text"
                      name="nome"
                      value={fields.nome}
                      onChange={handleChange}
                      required
                      minLength={3}
                      placeholder="João Silva"
                      className="w-full bg-[#2d2d2d] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#9ccc65] transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">
                        E-mail *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={fields.email}
                        onChange={handleChange}
                        required
                        placeholder="voce@empresa.com"
                        className="w-full bg-[#2d2d2d] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#9ccc65] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">
                        Telefone *
                      </label>
                      <input
                        type="tel"
                        name="telefone"
                        value={fields.telefone}
                        onChange={handleChange}
                        required
                        placeholder="(11) 98765-4321"
                        className="w-full bg-[#2d2d2d] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#9ccc65] transition-colors"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {status === "error" && (
                <p className="text-red-400 text-sm">{erroMsg}</p>
              )}

              <button
                type="submit"
                disabled={!tipoOrganizacao || status === "loading"}
                className="w-full flex items-center justify-center gap-2 bg-[#9ccc65] hover:bg-[#7cb342] disabled:opacity-50 disabled:cursor-not-allowed text-[#1a1a1a] py-4 rounded-xl font-bold text-base transition-colors"
              >
                {status === "loading" ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                Enviar Solicitação
              </button>
            </form>
          )}
        </motion.div>
      </main>

      <footer className="border-t border-gray-800 py-4 text-center text-gray-600 text-xs">
        © {new Date().getFullYear()} QWork — Avaliação Psicossocial baseada no
        COPSOQ III
      </footer>
    </div>
  );
}
