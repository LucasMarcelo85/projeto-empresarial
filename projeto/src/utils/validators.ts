// src/utils/validators.ts

/**
 * Valida um endereço de email usando expressão regular
 * @param email Email a ser validado
 * @returns true se o email for válido, false caso contrário
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida um nome de usuário
 * @param name Nome a ser validado
 * @returns true se o nome for válido, false caso contrário
 */
export const validateName = (name: string): boolean => {
  return name.trim().length >= 3;
};
