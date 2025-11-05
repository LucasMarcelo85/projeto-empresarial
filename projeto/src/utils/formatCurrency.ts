// src/utils/formatCurrency.ts

/**
 * Formata um valor numérico para o formato de moeda brasileiro (BRL)
 * @param value Valor a ser formatado
 * @returns String formatada como moeda
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
