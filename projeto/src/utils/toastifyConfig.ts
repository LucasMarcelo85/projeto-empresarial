// src/utils/toastifyConfig.ts
import { toast, ToastOptions, ToastPosition, Theme } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Cores dos toasts para uso em outros componentes
export const toastSuccessBg = "#00C853";
export const toastSuccessColor = "#FFFFFF";

export const toastErrorBg = "#D50000";
export const toastErrorColor = "#FFFFFF";

export const toastWarningBg = "#FF6D00";
export const toastWarningColor = "#FFFFFF";

export const toastInfoBg = "#0091EA";
export const toastInfoColor = "#FFFFFF";

// Configurações padrão para todos os toasts
const defaultOptions: ToastOptions = {
  position: "top-right" as ToastPosition,
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored" as Theme,
};

// Função para exibir um toast de sucesso
export const showSuccessToast = (message: string, title?: string) => {
  return toast.success(title ? `${title}: ${message}` : message, {
    ...defaultOptions,
    style: {
      background: toastSuccessBg,
      color: toastSuccessColor,
      fontWeight: "bold",
      fontSize: "16px",
      border: "2px solid #00E676",
      boxShadow: "0 6px 16px rgba(0, 200, 83, 0.6)",
    },
  });
};

// Função para exibir um toast de erro
export const showErrorToast = (message: string, title?: string) => {
  return toast.error(title ? `${title}: ${message}` : message, {
    ...defaultOptions,
    style: {
      background: toastErrorBg,
      color: toastErrorColor,
      fontWeight: "bold",
      fontSize: "16px",
      border: "2px solid #FF1744",
      boxShadow: "0 6px 16px rgba(213, 0, 0, 0.6)",
    },
  });
};

// Função para exibir um toast de aviso
export const showWarningToast = (message: string, title?: string) => {
  return toast.warning(title ? `${title}: ${message}` : message, {
    ...defaultOptions,
    style: {
      background: toastWarningBg,
      color: toastWarningColor,
      fontWeight: "bold",
      fontSize: "16px",
      border: "2px solid #FFB300",
      boxShadow: "0 6px 16px rgba(255, 109, 0, 0.6)",
    },
  });
};

// Função para exibir um toast informativo
export const showInfoToast = (message: string, title?: string) => {
  return toast.info(title ? `${title}: ${message}` : message, {
    ...defaultOptions,
    style: {
      background: toastInfoBg,
      color: toastInfoColor,
      fontWeight: "bold",
      fontSize: "16px",
      border: "2px solid #00B0FF",
      boxShadow: "0 6px 16px rgba(0, 145, 234, 0.6)",
    },
  });
};

// Função genérica para exibir toasts com mais controle
export const showToast = (
  message: string,
  type: "success" | "error" | "warning" | "info",
  options?: ToastOptions,
  title?: string
) => {
  const messageWithTitle = title ? `${title}: ${message}` : message;

  switch (type) {
    case "success":
      return toast.success(messageWithTitle, { ...defaultOptions, ...options });
    case "error":
      return toast.error(messageWithTitle, { ...defaultOptions, ...options });
    case "warning":
      return toast.warning(messageWithTitle, { ...defaultOptions, ...options });
    case "info":
      return toast.info(messageWithTitle, { ...defaultOptions, ...options });
    default:
      return toast(messageWithTitle, { ...defaultOptions, ...options });
  }
};
