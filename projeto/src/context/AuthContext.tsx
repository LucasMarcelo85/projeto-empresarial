import {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useContext,
} from "react";

import { destroyCookie, setCookie, parseCookies } from "nookies";
import Router from "next/router";
import { api } from "../services/apiClient";

type NewType = boolean;

// Tipagens
interface AuthContextData {
  user: UserProps | undefined;
  isAuthenticated: boolean;
  premium: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signUp: (credentials: SignUpProps) => Promise<void>;
  logoutUser: () => Promise<void>;
  getSavedEmail: () => string | null;
  clearSavedEmail: () => void;
}

interface UserProps {
  id: string;
  name: string;
  email: string;
  endereco: string | null;
  subscriptions?: SubscriptionProps | null;
}

interface SubscriptionProps {
  id: string;
  status: string;
}

type AuthProviderProps = {
  children: ReactNode;
};

interface SignInProps {
  email: string;
  password: string;
  remember?: boolean;
}

interface SignUpProps {
  name: string;
  email: string;
  password: string;
}

// Criação do contexto
export const AuthContext = createContext({} as AuthContextData);

// Função de logout
export function signOut() {
  try {
    // Log para debug
    console.log("Iniciando logout global");

    // Definir flag para indicar logout recente
    if (typeof window !== "undefined") {
      localStorage.setItem("just_logged_out", "true");
    }

    // Limpar o cookie de várias maneiras para garantir
    destroyCookie(undefined, "@barber.token", { path: "/" });
    destroyCookie(undefined, "@barber.token");

    // Remover de todas as fontes de armazenamento
    if (typeof window !== "undefined") {
      localStorage.removeItem("@barber.token");
      sessionStorage.removeItem("@barber.token");

      // Remover também o email salvo em caso de logout
      localStorage.removeItem("@barber.userEmail");
    }

    // Em produção, usar abordagem adicional direto no document.cookie
    if (typeof window !== "undefined") {
      // Expirar o cookie independente do domínio
      document.cookie = "@barber.token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Método extra para garantir remoção do cookie
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        if (name === "@barber.token") {
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;";
        }
      }

      // Tentar remover em todos os possíveis domínios
      const hostname = window.location.hostname;
      if (hostname !== "localhost") {
        document.cookie = `@barber.token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${hostname};`;

        // Para domínios de nível superior
        const parts = hostname.split('.');
        if (parts.length > 1) {
          const domain = parts.slice(-2).join('.');
          document.cookie = `@barber.token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain};`;
        }
      }

      console.log("Cookies após limpeza:", document.cookie);
    }

    // Usar window.location para garantir a recarga completa da página
    if (typeof window !== "undefined") {
      console.log("Redirecionando para login com parâmetro de logout");
      window.location.href = "/login?logout=true";
    }
  } catch (err) {
    console.error("Erro ao deslogar:", err);
    // Em caso de erro, tentar o redirecionamento de qualquer forma
    if (typeof window !== "undefined") {
      window.location.href = "/login?logout=true&error=true";
    }
  }
}

// Provider do contexto
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps | undefined>(undefined);
  const isAuthenticated = !!user;

  // Função para recuperar o email salvo
  function getSavedEmail() {
    if (typeof window !== "undefined") {
      return localStorage.getItem("@barber.userEmail");
    }
    return null;
  }

  // Função para limpar o email salvo
  function clearSavedEmail() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("@barber.userEmail");
    }
  }

  useEffect(() => {
    // Verificar se o usuário acabou de fazer logout
    const isJustLoggedOut = typeof window !== "undefined" &&
      (window.location.search.includes('logout=true') ||
        localStorage.getItem('just_logged_out') === 'true');

    if (isJustLoggedOut) {
      console.log("Detectado logout recente, não tentando reautenticar");

      // Limpar a flag de logout recente se não estamos na página de login
      if (typeof window !== "undefined" && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('just_logged_out');
      }

      // Não continuar com a autenticação após logout
      return;
    }

    // Tentar obter o token de várias fontes
    const { "@barber.token": cookieToken } = parseCookies();
    const localStorageToken = typeof window !== "undefined"
      ? localStorage.getItem("@barber.token")
      : null;

    const sessionStorageToken = typeof window !== "undefined"
      ? sessionStorage.getItem("@barber.token")
      : null;

    // Usar qualquer token disponível
    const token = cookieToken || localStorageToken || sessionStorageToken;

    console.log("Verificação de tokens:", {
      cookieToken: cookieToken ? "presente" : "ausente",
      localStorageToken: localStorageToken ? "presente" : "ausente",
      sessionStorageToken: sessionStorageToken ? "presente" : "ausente",
      tokenFinal: token ? "presente" : "ausente"
    });

    if (token) {
      // Garantir que o token esteja configurado no Axios
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Garantir que o token esteja disponível em todos os lugares
      if (typeof window !== "undefined") {
        // Atualizar cookie se não existir
        if (!cookieToken) {
          setCookie(undefined, "@barber.token", token, {
            path: "/",
            maxAge: 60 * 60 * 24, // 1 dia
            sameSite: "lax",
          });
        }

        // Backup em localStorage e sessionStorage também
        localStorage.setItem("@barber.token", token);
        sessionStorage.setItem("@barber.token", token);
      }

      // Verificar o usuário com o token
      api
        .get("/me")
        .then((response) => {
          console.log("Dados do usuário recuperados com sucesso");
          const { id, name, endereco, email, subscriptions } = response.data;

          setUser({
            id,
            name,
            email,
            endereco,
            subscriptions,
          });
        })
        .catch((error) => {
          console.error("Erro ao verificar sessão:", error?.response?.status, error?.response?.data);
          // Se o token existir mas for inválido, limpar todos os tokens
          if (typeof window !== "undefined") {
            localStorage.removeItem("@barber.token");
            sessionStorage.removeItem("@barber.token");
          }
          signOut();
        });
    }
  }, []);

  async function signIn({ email, password, remember = false }: SignInProps) {
    try {
      console.log("Iniciando tentativa de login para:", email);

      // Verificar se a API está configurada corretamente
      console.log("URL da API:", api.defaults.baseURL);

      const response = await api.post("/session", {
        email,
        password,
      });

      console.log("Login bem-sucedido, processando dados da resposta");
      const { id, name, token, subscriptions, endereco } = response.data;

      // Detectar ambiente de produção e domínio customizado
      const isProd = process.env.NODE_ENV === "production";
      const isBrowser = typeof window !== "undefined";

      // Opções de cookie mais flexíveis para ambiente de produção
      const cookieOptions: any = {
        maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24, // 30 dias se remember, senão 1 dia
        path: "/",
        // Em produção, vamos permitir cookies mesmo sem HTTPS para compatibilidade
        // secure: isProd, // Comentado para resolver problemas em hosts sem HTTPS
        // Em produção, vamos usar 'lax' para compatibilidade com todos os browsers
        sameSite: "lax",
      };

      // Log para debug
      console.log("Ambiente:", { isProd, hostname: isBrowser ? window.location.hostname : null });

      // Configurar domínio do cookie em produção para subdomínios
      if (isProd && isBrowser) {
        const hostname = window.location.hostname;
        console.log("Hostname detectado:", hostname);

        // Para IPs ou localhost, não configuramos domínio
        if (!/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(hostname) && hostname !== 'localhost') {
          // Não manipular o domínio, usar o próprio hostname
          // cookieOptions.domain = hostname; // Comentado para resolução de problemas
        }
      }

      // Limpar qualquer cookie antigo primeiro
      console.log("Limpando cookies antigos");
      destroyCookie(undefined, "@barber.token", { path: "/" });

      // Verificar se há domínio definido
      if (cookieOptions.domain) {
        console.log("Limpando cookie com domínio específico:", cookieOptions.domain);
        destroyCookie(undefined, "@barber.token", {
          path: "/",
          domain: cookieOptions.domain,
        });
      }      // Setar o novo cookie com as opções configuradas
      console.log("Configurando novo cookie com opções:", cookieOptions);
      setCookie(undefined, "@barber.token", token, cookieOptions);

      // Implementar abordagem multi-storage para maior robustez
      if (typeof window !== "undefined") {
        // Armazenar em localStorage (persiste após fechar o navegador)
        localStorage.setItem("@barber.token", token);

        // Armazenar em sessionStorage (persiste durante a sessão)
        sessionStorage.setItem("@barber.token", token);

        // Método direto como fallback
        document.cookie = `@barber.token=${token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
      }

      // Configurar o token no Axios para futuras requisições
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      console.log("Token configurado no Axios");

      // Salvar email para autopreenchimento se remember estiver ativo
      if (remember && typeof window !== "undefined") {
        localStorage.setItem("@barber.userEmail", email);
      } else {
        clearSavedEmail();
      }

      // Atualizar o estado do usuário
      setUser({
        id,
        name,
        email,
        endereco,
        subscriptions,
      });
      console.log("Usuário logado com sucesso:", name);

      // Verificar se os cookies foram realmente configurados
      if (typeof window !== "undefined") {
        console.log("Cookies após login:", document.cookie);
      }

      // Redirecionar após configurar tudo
      console.log("Redirecionando para dashboard");

      // Usar método mais robusto para redirecionamento em produção
      if (isProd) {
        window.location.href = "/dashboard";
      } else {
        // Em desenvolvimento, usar o Router do Next.js
        Router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Erro no login:", err?.response?.status, err?.response?.data);

      // Incluir informações mais detalhadas no erro para facilitar o tratamento
      if (err?.response?.status === 429) {
        err.rateLimitExceeded = true;
      }

      throw err;
    }
  }

  async function signUp({ name, email, password }: SignUpProps) {
    try {
      await api.post("/users", {
        name,
        email,
        password,
      });

      Router.push("/login");
    } catch (err) {
      throw err;
    }
  }

  async function logoutUser() {
    try {
      // Log de debug
      console.log("Iniciando processo de logout completo");

      // Limpar todos os cookies de autenticação de todas as formas possíveis
      destroyCookie(undefined, "@barber.token", { path: "/" });
      destroyCookie(undefined, "@barber.token");

      // Garantir limpeza dos storages
      if (typeof window !== "undefined") {
        // Remover de localStorage
        localStorage.removeItem("@barber.token");
        localStorage.removeItem("@barber.userEmail");

        // Remover de sessionStorage
        sessionStorage.removeItem("@barber.token");

        // Limpar todos os cookies relacionados
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.startsWith("@barber")) {
            const name = cookie.split("=")[0];
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
          }
        }

        // Tentativa adicional para limpeza de cookie em subdomínios
        if (window.location.hostname !== "localhost") {
          const domain = window.location.hostname.replace(/^www\./, "");
          document.cookie = `@barber.token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain};`;

          // Para domínios de vários níveis
          if (domain.split(".").length > 1) {
            const rootDomain = domain.split(".").slice(-2).join(".");
            document.cookie = `@barber.token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${rootDomain};`;
          }
        }
      }

      // Limpar email salvo
      clearSavedEmail();

      // Limpar headers da API
      delete api.defaults.headers.common["Authorization"];

      // Resetar estado do usuário
      setUser(undefined);

      console.log("Logout concluído, redirecionando para login");

      // Forçar o redirecionamento para a página de login usando window.location
      // com um parâmetro de query para evitar relogin automático
      window.location.href = "/login?logout=true";
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
      window.location.href = "/login?logout=true&error=true";
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        signIn,
        signUp,
        premium: user?.subscriptions?.status === "active" || false,
        logoutUser,
        getSavedEmail,
        clearSavedEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook para facilitar o uso do contexto
export function useAuth() {
  return useContext(AuthContext);
}
