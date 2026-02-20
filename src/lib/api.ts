const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Interface simples para erros da API
interface ApiError {
    detail?: string;
    [key: string]: any;
}

/**
 * Função principal de fetch
 * @param url - Caminho relativo (ex: '/vagas/')
 * @param options - Opções do fetch (method, body, headers...)
 * @param isPublic - Se true, não tentará refresh de token em caso de 401
 */
export async function api(
    url: string,
    options: RequestInit = {},
    isPublic = false
) {
    // Configuração padrão de headers
    const defaultHeaders: HeadersInit = {
        "Content-Type": "application/json",
    };

    const config: RequestInit = {
        credentials: "include", // Importante para cookies (session/refresh token)
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    const response = await fetch(`${API_URL}${url}`, config);

    // Tenta extrair o JSON da resposta
    let data = null;
    try {
        data = await response.json();
    } catch (e) {
        data = null;
    }

    // --- LÓGICA DE AUTH/REFRESH ---

    // Se for 401 (Não autorizado)
    if (response.status === 401) {
        // Se o erro for token inválido e a rota for pública, não tente refresh.
        // Apenas lance o erro para o hook tratar ou ignore.
        if (isPublic) {
            throw data ?? { detail: "Acesso público com token inválido" };
        }

        const isAuthRoute = url.includes("/auth/refresh/") || url.includes("/auth/login/");
        if (!isAuthRoute) {
            const refreshed = await refreshToken();
            if (refreshed) return api(url, options, isPublic);
        }
    }
    // --- TRATAMENTO DE ERRO FINAL ---
    if (!response.ok) {
        // Lança o objeto de erro para ser capturado pelo catch do seu Hook
        const errorPayload: ApiError = data ?? { detail: "Erro inesperado no servidor" };
        throw errorPayload;
    }

    return data;
}

/**
 * Função interna para renovar o token via Cookie HttpOnly
 */
async function refreshToken(): Promise<boolean> {
    try {
        const res = await fetch(`${API_URL}/auth/refresh/`, {
            method: "POST",
            credentials: "include",
        });

        return res.ok;
    } catch (error) {
        console.error("Erro crítico ao tentar refresh token:", error);
        return false;
    }
}