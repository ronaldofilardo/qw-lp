/**
 * Máscaras de formatação para inputs — regex puro, sem dependências externas.
 */

/** Remove tudo que não é dígito */
export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/** CPF: 000.000.000-00 */
export function maskCPF(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

/** CNPJ: 00.000.000/0001-00 */
export function maskCNPJ(value: string): string {
  const digits = onlyDigits(value).slice(0, 14);
  return digits
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

/** Telefone: (99) 99999-9999 */
export function maskTelefone(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 2) return digits.replace(/(\d{1,2})/, "($1");
  if (digits.length <= 7) return digits.replace(/(\d{2})(\d{1,5})/, "($1) $2");
  return digits.replace(/(\d{2})(\d{5})(\d{1,4})/, "($1) $2-$3");
}
