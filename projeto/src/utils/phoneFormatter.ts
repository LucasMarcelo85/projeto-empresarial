/**
 * Utilitário para formatação e padronização de números de telefone
 * no formato brasileiro (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 */

/**
 * Formata um número de telefone para o padrão brasileiro
 * @param value Número de telefone (pode incluir caracteres não numéricos)
 * @returns Número formatado como (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 */
export function formatPhoneNumber(value: string): string {
  if (!value) return "";

  // Remove todos os caracteres não numéricos
  const phoneNumber = value.replace(/\D/g, "");
  let formattedNumber = "";

  if (phoneNumber.length > 0) {
    formattedNumber = `(${phoneNumber.substring(0, 2)}`;
  }

  if (phoneNumber.length > 2) {
    // Diferencia celular (com 9 dígitos) de telefone fixo (com 8 dígitos)
    if (phoneNumber.length <= 10) {
      // Telefone fixo ou celular sem o 9 na frente
      formattedNumber += `) ${phoneNumber.substring(2, 6)}`;

      if (phoneNumber.length > 6) {
        formattedNumber += `-${phoneNumber.substring(6, 10)}`;
      }
    } else {
      // Celular com 9 na frente (formato mais comum atualmente)
      formattedNumber += `) ${phoneNumber.substring(2, 7)}`;

      if (phoneNumber.length > 7) {
        formattedNumber += `-${phoneNumber.substring(7, 11)}`;
      }
    }
  }

  return formattedNumber;
}

/**
 * Retorna apenas os dígitos do número de telefone
 * @param value Número de telefone em qualquer formato
 * @returns Apenas os dígitos do número
 */
export function cleanPhoneNumber(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Formata um número limpo (somente dígitos) para apresentação
 * @param cleanNumber Número limpo (somente dígitos)
 * @returns Número formatado para exibição
 */
export function formatCleanPhoneNumber(cleanNumber: string): string {
  return formatPhoneNumber(cleanNumber);
}

/**
 * Verifica se o número de telefone é válido (tem pelo menos 10 dígitos - DDD + 8 dígitos)
 * @param value Número de telefone em qualquer formato
 * @returns true se o número for válido
 */
export function isValidPhoneNumber(value: string): boolean {
  const cleaned = cleanPhoneNumber(value);
  return cleaned.length >= 10 && cleaned.length <= 11;
}
