// src/services/api.ts
import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { parseCookies, destroyCookie } from "nookies";

import { AuthTokenError } from "./errors/AuthTokenError";
import { signOut } from "../context/AuthContext";

interface ErrorResponse {
  error?: string;
  message?: string;
  statusCode?: number;
}

export function setupAPIClient(ctx = undefined) {
  // Buscar token de múltiplas fontes para maior robustez
  const cookies = parseCookies(ctx);
  let token = cookies["@barber.token"];

  // Se estamos no cliente e não temos token no cookie, tentar outras fontes
  if (typeof window !== "undefined" && !token) {
    token =
      localStorage.getItem("@barber.token") ||
      sessionStorage.getItem("@barber.token") ||
      undefined;
  }

  // Detectar ambiente
  const isBrowser = typeof window !== "undefined";
  const isLocalhost = isBrowser
    ? window.location.hostname === "localhost"
    : process.env.NODE_ENV !== "production";

  // Define URL da API conforme o ambiente
  let baseURL = "https://barber-server.dgohio.easypanel.host";

  if (isLocalhost) {
    baseURL = process.env.NEXT_PUBLIC_API_URL_LOCAL || "http://localhost:3333";
  } else if (process.env.NEXT_PUBLIC_API_URL) {
    baseURL = process.env.NEXT_PUBLIC_API_URL;
  }

  // Verifica se a URL armazenada em localStorage deve ser usada (para desenvolvimento)
  if (isBrowser && localStorage.getItem("@barber.api_url")) {
    const savedUrl = localStorage.getItem("@barber.api_url");
    console.log("Usando URL de API personalizada:", savedUrl);
    baseURL = savedUrl;
  }

  console.log("API configurada para:", {
    baseURL,
    ambiente: isLocalhost ? "desenvolvimento" : "produção",
    token: token ? "presente" : "ausente",
  });

  // Configurações para lidar com CORS e outros problemas comuns
  const api = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    // Permitir credenciais para CORS
    withCredentials: !isLocalhost,
  });

  // Handler de requisição
  const requestHandler = (config: InternalAxiosRequestConfig) => {
    try {
      const currentToken = parseCookies(ctx)["@barber.token"];

      if (currentToken && !config.headers.Authorization) {
        config.headers.set("Authorization", `Bearer ${currentToken}`);
      }

      if (!config.headers.Authorization && token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }

      // Adicionar timezone do cliente a todas as requisições que envolvem agendamentos
      if (typeof window !== "undefined") {
        const clientTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (!config.headers.has("X-Client-Timezone")) {
          config.headers.set("X-Client-Timezone", clientTimezone);
        }

        // Adicionar timezone em endpoints relacionados a agendamento
        if (
          config.url?.includes("schedule") ||
          config.url?.includes("available-times")
        ) {
          if (
            config.method === "post" &&
            config.data &&
            typeof config.data === "object"
          ) {
            config.data = {
              ...config.data,
              timezone: clientTimezone,
            };
          } else if (config.method?.toLowerCase() === "get") {
            config.params = {
              ...config.params,
              timezone: clientTimezone,
            };
          }
        }
      }

      // Adicionar timestamp para evitar cache
      if (config.method?.toLowerCase() === "get") {
        config.params = {
          ...config.params,
          _t: new Date().getTime(),
        };
      }

      return config;
    } catch (error) {
      console.error("[Request Handler Error]", error);
      return config;
    }
  };

  // Handler de erro de requisição
  const requestErrorHandler = (error: unknown) => {
    console.error("[Request Error]", error);
    return Promise.reject(error);
  };

  // Handler de resposta
  const responseHandler = (response: AxiosResponse) => {
    return response;
  };

  // Handler de erro de resposta
  const responseErrorHandler = async (error: unknown) => {
    console.log("[Response Error Handler] Starting error handling");

    try {
      if (!axios.isAxiosError(error)) {
        console.error("[Unknown Error Type]", error);
        throw new Error("Erro desconhecido");
      }

      const axiosError = error as AxiosError<ErrorResponse>;

      // Log detalhado do erro
      console.log("[Axios Error Details]", {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        url: axiosError.config?.url,
        method: axiosError.config?.method,
      });

      // Tratamento especial para o erro 429 (Too Many Requests)
      if (axiosError.response?.status === 429) {
        console.warn("[Rate Limit Exceeded] Detectado erro 429");

        // Se for um erro na rota de login, adicionar informação útil
        if (axiosError.config?.url?.includes("/session")) {
          const error = new Error(
            "Muitas tentativas de login. Aguarde um minuto antes de tentar novamente."
          );
          (error as any).rateLimitExceeded = true;
          throw error;
        }
      }

      // Verificar se há erros no corpo da resposta
      const responseData = axiosError.response?.data;
      if (
        typeof responseData === "string" &&
        (responseData as string).indexOf("BigInt") >= 0
      ) {
        console.error("[BigInt Serialization Error]", responseData);
        throw new Error("Erro no processamento de dados. Tente novamente.");
      }

      // Erro de timeout
      if (axiosError.code === "ECONNABORTED") {
        throw new Error("Tempo limite excedido. Tente novamente.");
      }

      // Erro de rede
      if (axiosError.message === "Network Error") {
        console.error("[Network Error] Falha na comunicação com o servidor");

        // Verificar se o erro é especificamente para o backend local
        const isLocalBackend =
          axiosError.config?.url?.includes("localhost:3333") ||
          axiosError.config?.baseURL?.includes("localhost:3333");

        if (isLocalBackend) {
          throw new Error(
            "Servidor não está respondendo. Verifique se o backend está rodando."
          );
        } else {
          throw new Error("Erro de conexão. Verifique sua internet.");
        }
      }

      // Erro de autenticação
      if (axiosError.response?.status === 401) {
        console.log("[Auth Error] Status 401 detected");

        if (!isBrowser) {
          console.log("[Auth Error] Server-side, throwing AuthTokenError");
          throw new AuthTokenError();
        }

        const currentPath = window.location.pathname;
        console.log("[Auth Error] Current path:", currentPath);

        const publicRoutes = [
          "/login",
          "/",
          "/register",
          "/recuperar-senha",
          "/redefinir-senha",
        ];
        if (publicRoutes.indexOf(currentPath) === -1) {
          console.log("[Auth Error] Private route, redirecting to login");
          try {
            destroyCookie(undefined, "@barber.token", { path: "/" });
            delete api.defaults.headers.common["Authorization"];
            signOut();
          } catch (cleanupError) {
            console.error("[Auth Error] Cleanup failed:", cleanupError);
          }
          throw new Error("Sessão expirada. Por favor, faça login novamente.");
        }
      }

      // Erro de validação (400)
      if (axiosError.response?.status === 400) {
        const errorMessage =
          axiosError.response.data?.error ||
          axiosError.response.data?.message ||
          "Dados inválidos";

        // Erros específicos para exclusão de clientes
        if (errorMessage.includes("agendamentos pendentes")) {
          console.warn(
            "[Customer Delete Error] Cliente tem agendamentos pendentes"
          );
        }

        throw new Error(errorMessage);
      }

      // Erro de permissão (403)
      if (axiosError.response?.status === 403) {
        throw new Error("Você não tem permissão para realizar esta ação");
      }

      // Erro de recurso não encontrado (404)
      if (axiosError.response?.status === 404) {
        throw new Error("Recurso não encontrado");
      }

      // Erro de servidor (500)
      if (axiosError.response?.status === 500) {
        // Verificar se é um erro de BigInt no backend
        if (
          axiosError.response?.data?.error &&
          (String(axiosError.response.data.error).indexOf("BigInt") >= 0 ||
            String(axiosError.response.data.error).indexOf("serialize") >= 0)
        ) {
          console.error("[BigInt Error]", axiosError.response.data);
          throw new Error(
            "Erro na formatação de dados. Carregando dados simplificados."
          );
        }
        throw new Error(
          "Erro interno do servidor. Tente novamente mais tarde."
        );
      }

      // Outros erros
      const errorMessage =
        axiosError.response?.data?.error ||
        axiosError.response?.data?.message ||
        "Ocorreu um erro inesperado";
      throw new Error(errorMessage);
    } catch (handlerError) {
      if (handlerError instanceof Error) {
        return Promise.reject(handlerError);
      }
      console.error("[Error Handler Failed]", handlerError);
      return Promise.reject(new Error("Erro ao processar a resposta"));
    }
  };

  // Adiciona os interceptadores
  api.interceptors.request.use(requestHandler, requestErrorHandler);
  api.interceptors.response.use(responseHandler, responseErrorHandler);

  return api;
}
