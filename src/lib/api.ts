const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiError {
    detail?: string;
    code?: string;
    [key: string]: any;
}

// --- ESTADO GLOBAL PARA CONTROLE DE FILA E REFRESH ---
let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

// Adiciona requisições à fila enquanto o refresh acontece
function subscribeTokenRefresh(cb: () => void) {
    refreshSubscribers.push(cb);
}

// Avisa as requisições na fila que podem tentar novamente
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
    isRetry = false // Trava de segurança para evitar loops infinitos
) {
    const config: RequestInit = {
        credentials: "include", // Essencial para lidar com Cookies HttpOnly
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    };

    try {
        const response = await fetch(`${API_URL}${url}`, config);

        // 1. Caso de sucesso ou erros que não sejam 401
        if (response.ok) {
            if (response.status === 204) return null;
            return await response.json();
        }

        // 2. Tratamento de erro 401 (Unauthorized/Expired)
        if (response.status === 401 && !isPublic) {
            
            // Se o erro vier da própria rota de LOGIN, não tenta refresh
            if (url.includes("/auth/login/")) {
                const errorData = await response.json().catch(() => ({}));
                throw errorData;
            }

            // SEGUNDA TENTATIVA FALHOU? (Proteção contra loop infinito)
            if (isRetry) {
                console.error("Loop detectado: O token continua inválido após refresh.");
                handleLogoutRedirect();
                throw new Error("Infinite loop blocked");
            }

            // Se o erro vier da rota de REFRESH, significa que o refresh token morreu
            if (url.includes("/auth/refresh/")) {
                handleLogoutRedirect();
                throw new Error("Refresh token expired");
            }

            // Se já existir um processo de renovação em curso, entra na fila
            if (isRefreshing) {
                return new Promise((resolve) => {
                    subscribeTokenRefresh(() => {
                        resolve(api(url, options, isPublic, true));
                    });
                });
            }

            // --- INÍCIO DO PROCESSO DE REFRESH ---
            isRefreshing = true;

            const refreshed = await refreshToken();
            
            isRefreshing = false;

            if (refreshed) {
                onRefreshed(); // Libera quem estava na fila
                return api(url, options, isPublic, true); // Tenta de novo com a trava isRetry=true
            } else {
                handleLogoutRedirect();
                throw new Error("Refresh failed");
            }
        }

        // 3. Outros erros (400, 403, 404, 500...)
        const errorData = await response.json().catch(() => ({}));
        throw errorData;

    } catch (error) {
        // Se for um erro de rede ou o erro lançado acima
        throw error;
    }
}

/**
 * Chama o endpoint do Django para renovar o cookie de acesso
 */
async function refreshToken(): Promise<boolean> {
    try {
        const res = await fetch(`${API_URL}/auth/refresh/`, {
            method: "POST",
            credentials: "include",
        });

        // O Django deve responder 200 OK e enviar o Set-Cookie: access
        return res.ok;
    } catch (error) {
        console.error("Erro crítico no fetch de refresh:", error);
        return false;
    }
}

/**
 * Redireciona para o login e limpa estados se necessário
 */
function handleLogoutRedirect() {
    if (typeof window !== "undefined") {
        // Evita redirecionar se já estiver na página de login
        if (!window.location.pathname.includes('/login')) {
            window.location.href = "/login?session=expired";
        }
    }
}