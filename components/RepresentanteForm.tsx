"use client";

import React, { useState, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader, Upload, CheckCircle, AlertCircle, X } from "lucide-react";

import { maskCPF, maskCNPJ, maskTelefone } from "@/lib/utils/masks";
import {
  pessoaFisicaSchema,
  pessoaJuridicaSchema,
  validateFile,
  type PessoaFisicaData,
  type PessoaJuridicaData,
} from "@/lib/validators/representante";

// ── Types ──────────────────────────────────────────────────────────────────

type TipoPessoa = "PF" | "PJ";

interface FileState {
  file: File;
  name: string;
  error?: string;
}

// ── Component ──────────────────────────────────────────────────────────────

export default function RepresentanteForm() {
  const [tipoPessoa, setTipoPessoa] = useState<TipoPessoa>("PF");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // File refs & state
  const fileDocCpfRef = useRef<HTMLInputElement>(null);
  const fileDocCnpjRef = useRef<HTMLInputElement>(null);
  const fileDocCpfRespRef = useRef<HTMLInputElement>(null);

  const [docCpf, setDocCpf] = useState<FileState | null>(null);
  const [docCnpj, setDocCnpj] = useState<FileState | null>(null);
  const [docCpfResp, setDocCpfResp] = useState<FileState | null>(null);

  // React Hook Form — troca de schema por tipoPessoa
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    trigger,
  } = useForm({
    resolver: zodResolver(
      tipoPessoa === "PF" ? pessoaFisicaSchema : pessoaJuridicaSchema,
    ),
    defaultValues: {
      tipoPessoa: "PF" as const,
      nome: "",
      email: "",
      telefone: "",
      website: "",
    },
  });

  // ── Trocar tipo pessoa ───────────────────────────────────────────────

  const handleTipoPessoaChange = useCallback(
    (tipo: TipoPessoa) => {
      setTipoPessoa(tipo);
      setServerError(null);
      setDocCpf(null);
      setDocCnpj(null);
      setDocCpfResp(null);
      reset({
        tipoPessoa: tipo,
        nome: "",
        email: "",
        telefone: "",
        website: "",
      } as PessoaFisicaData | PessoaJuridicaData);
    },
    [reset],
  );

  // ── Máscaras ─────────────────────────────────────────────────────────

  const handleMaskedInput = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      maskFn: (v: string) => string,
      field: keyof PessoaFisicaData | keyof PessoaJuridicaData,
    ) => {
      const masked = maskFn(e.target.value);
      setValue(field as never, masked as never);
      e.target.value = masked;
      trigger(field as never);
    },
    [setValue, trigger],
  );

  // ── File handler ─────────────────────────────────────────────────────

  const handleFileChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      setter: React.Dispatch<React.SetStateAction<FileState | null>>,
    ) => {
      const file = e.target.files?.[0];
      if (!file) {
        setter(null);
        return;
      }
      const validation = validateFile(file);
      if (!validation.valid) {
        setter({ file, name: file.name, error: validation.error });
      } else {
        setter({ file, name: file.name });
      }
    },
    [],
  );

  const removeFile = useCallback(
    (
      setter: React.Dispatch<React.SetStateAction<FileState | null>>,
      ref: React.RefObject<HTMLInputElement | null>,
    ) => {
      setter(null);
      if (ref.current) ref.current.value = "";
    },
    [],
  );

  // ── Submit ───────────────────────────────────────────────────────────

  const onSubmit = async (data: PessoaFisicaData | PessoaJuridicaData) => {
    // Verificar erros de arquivo
    if (tipoPessoa === "PF" && docCpf?.error) return;
    if (tipoPessoa === "PJ" && (docCnpj?.error || docCpfResp?.error)) return;

    setLoading(true);
    setServerError(null);

    const formData = new FormData();
    formData.append("tipoPessoa", data.tipoPessoa);
    formData.append("nome", data.nome);
    formData.append("email", data.email);
    formData.append("telefone", data.telefone);
    formData.append("website", data.website ?? "");

    if (data.tipoPessoa === "PF") {
      formData.append("cpf", (data as PessoaFisicaData).cpf);
      if (docCpf?.file) formData.append("documentoCpf", docCpf.file);
    } else {
      const pj = data as PessoaJuridicaData;
      formData.append("razaoSocial", pj.razaoSocial);
      formData.append("cnpj", pj.cnpj);
      formData.append("cpfResponsavel", pj.cpfResponsavel);
      if (docCnpj?.file) formData.append("documentoCnpj", docCnpj.file);
      if (docCpfResp?.file)
        formData.append("documentoCpfResponsavel", docCpfResp.file);
    }

    try {
      const res = await fetch("/api/representantes/cadastro", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setSuccess(true);
        reset();
        setDocCpf(null);
        setDocCnpj(null);
        setDocCpfResp(null);
        setTimeout(() => setSuccess(false), 5000);
      } else {
        const body = await res.json();
        setServerError(
          body.errors?.form ||
            Object.values(body.errors || {}).join(". ") ||
            "Erro ao enviar. Tente novamente.",
        );
      }
    } catch {
      setServerError("Erro de conexão. Verifique sua internet.");
    } finally {
      setLoading(false);
    }
  };

  // ── Render helpers ───────────────────────────────────────────────────

  const inputClass = (hasError: boolean) =>
    `w-full bg-[#1a1a1a] border ${
      hasError
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-700 focus:ring-[#9ccc65]"
    } rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors`;

  const labelClass = "block text-sm font-medium text-gray-300 mb-1.5";

  const errorMsg = (msg?: string) =>
    msg ? (
      <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" /> {msg}
      </p>
    ) : null;

  const fileUploadBlock = (
    label: string,
    state: FileState | null,
    setter: React.Dispatch<React.SetStateAction<FileState | null>>,
    ref: React.RefObject<HTMLInputElement | null>,
    fieldName: string,
  ) => (
    <div>
      <label className={labelClass}>{label}</label>
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          state?.error
            ? "border-red-500 bg-red-950/20"
            : state?.file
              ? "border-[#9ccc65]/50 bg-[#9ccc65]/5"
              : "border-gray-700 hover:border-gray-500"
        }`}
        onClick={() => ref.current?.click()}
      >
        <input
          ref={ref}
          type="file"
          name={fieldName}
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => handleFileChange(e, setter)}
        />
        {state?.file ? (
          <div className="flex items-center justify-center gap-2">
            {state.error ? (
              <AlertCircle className="w-4 h-4 text-red-400" />
            ) : (
              <CheckCircle className="w-4 h-4 text-[#9ccc65]" />
            )}
            <span
              className={`text-sm ${state.error ? "text-red-400" : "text-gray-300"}`}
            >
              {state.name}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeFile(setter, ref);
              }}
              className="ml-2 text-gray-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 text-gray-500">
            <Upload className="w-5 h-5" />
            <span className="text-xs">PDF, JPG ou PNG — máx. 3 MB</span>
          </div>
        )}
      </div>
      {state?.error && errorMsg(state.error)}
    </div>
  );

  // ── Render ───────────────────────────────────────────────────────────

  return (
    <div className="bg-[#2d2d2d] border border-gray-700 rounded-2xl p-6 md:p-8 shadow-organic">
      {/* Toggle PF / PJ */}
      <div className="flex rounded-lg overflow-hidden border border-gray-700 mb-6">
        {(["PF", "PJ"] as const).map((tipo) => (
          <button
            key={tipo}
            type="button"
            onClick={() => handleTipoPessoaChange(tipo)}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              tipoPessoa === tipo
                ? "bg-[#9ccc65] text-[#1a1a1a]"
                : "bg-[#1a1a1a] text-gray-400 hover:text-white"
            }`}
          >
            {tipo === "PF" ? "Pessoa Física" : "Pessoa Jurídica"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-12"
          >
            <CheckCircle className="w-16 h-16 text-[#9ccc65] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              Cadastro recebido!
            </h3>
            <p className="text-gray-400">
              Confira seu e-mail em breve para confirmar.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key={tipoPessoa}
            initial={{ opacity: 0, x: tipoPessoa === "PF" ? -10 : 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            {/* Honeypot */}
            <input
              {...register("website")}
              tabIndex={-1}
              aria-hidden="true"
              autoComplete="off"
              className="absolute opacity-0 h-0 w-0 overflow-hidden pointer-events-none"
            />

            {/* Hidden tipoPessoa */}
            <input type="hidden" {...register("tipoPessoa")} />

            {/* Nome / Razão Social */}
            <div>
              <label className={labelClass}>
                {tipoPessoa === "PJ" ? "Razão Social" : "Nome completo"}
              </label>
              {tipoPessoa === "PJ" && (
                <>
                  <input
                    {...register("razaoSocial" as never)}
                    placeholder="Razão Social da empresa"
                    className={inputClass(
                      !!(errors as Record<string, { message?: string }>)
                        .razaoSocial,
                    )}
                  />
                  {errorMsg(
                    (errors as Record<string, { message?: string }>).razaoSocial
                      ?.message,
                  )}
                  <label className={`${labelClass} mt-4`}>
                    Nome do responsável
                  </label>
                </>
              )}
              <input
                {...register("nome")}
                placeholder="Seu nome completo"
                className={inputClass(!!errors.nome)}
              />
              {errorMsg(errors.nome?.message)}
            </div>

            {/* Email + Telefone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>E-mail</label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="seu@email.com"
                  className={inputClass(!!errors.email)}
                />
                {errorMsg(errors.email?.message)}
              </div>
              <div>
                <label className={labelClass}>Telefone</label>
                <input
                  {...register("telefone")}
                  placeholder="(99) 99999-9999"
                  onChange={(e) =>
                    handleMaskedInput(e, maskTelefone, "telefone")
                  }
                  className={inputClass(!!errors.telefone)}
                />
                {errorMsg(errors.telefone?.message)}
              </div>
            </div>

            {/* Documento — PF */}
            {tipoPessoa === "PF" && (
              <>
                <div>
                  <label className={labelClass}>CPF</label>
                  <input
                    {...register("cpf" as never)}
                    placeholder="000.000.000-00"
                    onChange={(e) =>
                      handleMaskedInput(e, maskCPF, "cpf" as never)
                    }
                    className={inputClass(
                      !!(errors as Record<string, { message?: string }>).cpf,
                    )}
                  />
                  {errorMsg(
                    (errors as Record<string, { message?: string }>).cpf
                      ?.message,
                  )}
                </div>
                {fileUploadBlock(
                  "Documento (CPF)",
                  docCpf,
                  setDocCpf,
                  fileDocCpfRef,
                  "documentoCpf",
                )}
              </>
            )}

            {/* Documento — PJ */}
            {tipoPessoa === "PJ" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>CNPJ</label>
                    <input
                      {...register("cnpj" as never)}
                      placeholder="00.000.000/0001-00"
                      onChange={(e) =>
                        handleMaskedInput(e, maskCNPJ, "cnpj" as never)
                      }
                      className={inputClass(
                        !!(errors as Record<string, { message?: string }>).cnpj,
                      )}
                    />
                    {errorMsg(
                      (errors as Record<string, { message?: string }>).cnpj
                        ?.message,
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>CPF do Responsável</label>
                    <input
                      {...register("cpfResponsavel" as never)}
                      placeholder="000.000.000-00"
                      onChange={(e) =>
                        handleMaskedInput(e, maskCPF, "cpfResponsavel" as never)
                      }
                      className={inputClass(
                        !!(errors as Record<string, { message?: string }>)
                          .cpfResponsavel,
                      )}
                    />
                    {errorMsg(
                      (errors as Record<string, { message?: string }>)
                        .cpfResponsavel?.message,
                    )}
                  </div>
                </div>
                {fileUploadBlock(
                  "Cartão CNPJ",
                  docCnpj,
                  setDocCnpj,
                  fileDocCnpjRef,
                  "documentoCnpj",
                )}
                {fileUploadBlock(
                  "CPF do Responsável",
                  docCpfResp,
                  setDocCpfResp,
                  fileDocCpfRespRef,
                  "documentoCpfResponsavel",
                )}
              </>
            )}

            {/* Server error */}
            {serverError && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-950/30 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {serverError}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#9ccc65] hover:bg-[#7cb342] disabled:opacity-60 disabled:cursor-not-allowed text-[#1a1a1a] py-4 rounded-lg font-bold text-lg btn-organic transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar Cadastro"
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
