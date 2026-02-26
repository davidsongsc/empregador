const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiError {
    detail?: string;
    code?: string;
    [key: string]: any;
}

// --- ESTADO GLOBAL PARA CONTROLE DE FILA E REFRESH ---
let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

function subscribeTokenRefresh(cb: () => void) {
    refreshSubscribers.push(cb);
}

function onRefreshed() {
    refreshSubscribers.forEach((cb) => cb());
    refreshSubscribers = [];
}

/**
 * Função principal de API com Interceptor de 401 e proteção contra loop
 */
export async function api(
    url: string,
    options: RequestInit = {},
    isPublic = false,
    isRetry = false 
) {
    const config: RequestInit = {
        // "include" é vital para enviar os Cookies HttpOnly ao PythonAnywhere
        credentials: "include", 
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    };

    try {
        const response = await fetch(`${API_URL}${url}`, config);

        // 1. Caso de sucesso (200-299)
        if (response.ok) {
            if (response.status === 204) return null;
            return await response.json();
        }

        // 2. Tratamento de erro 401 (Unauthorized/Expired)
        // Se isPublic for true, não tentamos refresh (ex: carregar vagas da home)
        if (response.status === 401 && !isPublic) {
            
            // Se o erro vier da própria rota de LOGIN, lançamos o erro (usuário/senha errados)
            if (url.includes("/auth/login/")) {
                const errorData = await response.json().catch(() => ({}));
                throw errorData;
            }

            // Proteção contra Loop Infinito: se falhar no retry, desloga.
            if (isRetry) {
                console.error("Loop detectado: O token continua inválido após tentativa de renovação.");
                handleLogoutRedirect();
                throw new Error("Infinite loop blocked");
            }

            // Se o erro vier da própria rota de REFRESH, a sessão expirou de vez.
            if (url.includes("/auth/refresh/")) {
                handleLogoutRedirect();
                throw new Error("Refresh token expired");
            }

            // Se já houver um refresh acontecendo, colocamos esta requisição na fila (Promise)
            if (isRefreshing) {
                return new Promise((resolve) => {
                    subscribeTokenRefresh(() => {
                        resolve(api(url, options, isPublic, true));
                    });
                });
            }

            // --- INÍCIO DO PROCESSO DE RENOVAÇÃO (REFRESH) ---
            isRefreshing = true;

            const refreshed = await refreshToken();
            
            isRefreshing = false;

            if (refreshed) {
                // Notifica todos que estavam esperando na fila
                onRefreshed(); 
                // Tenta novamente a requisição original com a trava isRetry=true
                return api(url, options, isPublic, true); 
            } else {
                handleLogoutRedirect();
                throw new Error("Refresh failed");
            }
        }

        // 3. Tratamento de outros erros (400, 403, 404, 500...)
        // Lança o objeto de erro para ser capturado pelo catch do seu componente/hook
        const errorData = await response.json().catch(() => ({}));
        throw errorData;

    } catch (error) {
        throw error;
    }
}

/**
 * Chama o endpoint do Django para renovar o cookie de acesso (Set-Cookie)
 */
async function refreshToken(): Promise<boolean> {
    try {
        const res = await fetch(`${API_URL}/auth/refresh/`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        });

        // O Django deve responder 200 OK e enviar o cabeçalho Set-Cookie: access
        return res.ok;
    } catch (error) {
        console.error("Erro crítico no fetch de refresh:", error);
        return false;
    }
}

/**
 * Redireciona para o login e limpa a sessão
 */
function handleLogoutRedirect() {
    if (typeof window !== "undefined") {
        if (!window.location.pathname.includes('/login')) {
            // Pequeno delay para garantir que o redirecionamento não seja interrompido
            setTimeout(() => {
                window.location.href = "/login?session=expired";
            }, 100);
        }
    }
}