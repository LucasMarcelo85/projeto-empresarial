/**
 * Utilidades para verificar o status do servidor
 */

/**
 * Verifica se o servidor backend está online
 * @param url URL do servidor para verificar
 * @returns Promise resolvida com true se o servidor estiver online, false caso contrário
 */
export const checkServerStatus = async (url?: string): Promise<boolean> => {
  try {
    // Se não foi fornecida uma URL, usa a URL padrão do backend
    const serverUrl = url || process.env.NEXT_PUBLIC_API_URL || "https://barber-server.dgohio.easypanel.host";

    // Adiciona um timestamp para evitar cache
    const healthEndpoint = `${serverUrl}/health?_t=${Date.now()}`;

    // Faz uma requisição com timeout curto
    const response = await fetch(healthEndpoint, {
      method: "GET",
      cache: "no-cache",
      headers: {
        Accept: "application/json",
      },
      // Curto timeout para não bloquear a UI
      signal: AbortSignal.timeout(2000),
    });

    if (response.ok) {
      console.log("Servidor backend está online");
      return true;
    }

    console.warn(`Servidor respondeu com status ${response.status}`);
    return false;
  } catch (error) {
    console.error("Erro ao verificar status do servidor:", error);
    return false;
  }
};

/**
 * Detecta a melhor URL do servidor para usar
 * Tenta várias opções e retorna a primeira que responde
 * @returns Promise resolvida com a URL do servidor ou undefined se nenhum servidor estiver online
 */
export const detectBestServerUrl = async (): Promise<string | undefined> => {
  // Lista de possíveis URLs para o backend, em ordem de preferência
  const possibleUrls = [
    process.env.NEXT_PUBLIC_API_URL,
    "https://barber-server.dgohio.easypanel.host",
  ].filter(Boolean) as string[];

  for (const url of possibleUrls) {
    try {
      const isOnline = await checkServerStatus(url);
      if (isOnline) {
        // Salva a URL para uso futuro
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("@barber.api_url", url);
        }

        return url;
      }
    } catch (e) {
      // Ignora erros e continua tentando outros URLs
      console.warn(`Falha ao verificar ${url}:`, e);
    }
  }

  return undefined;
};
