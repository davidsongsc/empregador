const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiError {
    detail?: string;
    [key: string]: any;
}

export async function api(
    url: string,
    options: RequestInit = {},
    isPublic = false
) {
    const defaultHeaders: HeadersInit = {
        "Content-Type": "application/json",
    };

    const config: RequestInit = {
        credentials: "include",
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    const response = await fetch(`${API_URL}${url}`, config);

    let data = null;
    try {
        data = await response.json();
    } catch (e) {
        data = null;
    }

    // --- LÓGICA ANTI-LOOP DE REFRESH ---

    if (response.status === 401) {
        // 1. Se for pública, não tentamos nada, apenas lançamos o erro
        if (isPublic) {
            throw data ?? { detail: "Acesso público não autorizado" };
        }

        const isAuthRoute = url.includes("/auth/refresh/") || url.includes("/auth/login/");
        
        // 2. Verificamos se esta já é uma tentativa de repetição (retry)
        // Se já tentamos dar refresh e falhou de novo, paramos aqui
        const isRetry = options.headers && (options.headers as any)["X-Retry"];

        if (!isAuthRoute && !isRetry) {
            const refreshed = await refreshToken();

            if (refreshed) {
                // 3. Repetimos a chamada original adicionando a flag X-Retry
                return api(url, {
                    ...options,
                    headers: {
                        ...options.headers,
                        "X-Retry": "true", // Trava para não entrar em loop
                    },
                }, isPublic);
            } else {
                // Se o refresh falhou (ex: refresh token expirado), 
                // aqui você poderia limpar o estado de login ou redirecionar
                console.warn("Refresh token inválido. O usuário precisa logar novamente.");
            }
        }
    }

    // --- TRATAMENTO DE ERRO FINAL ---
    if (!response.ok) {
        const errorPayload: ApiError = data ?? { detail: "Erro inesperado no servidor" };
        throw errorPayload;
    }

    return data;
}

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