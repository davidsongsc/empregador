const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiError {
    status: number;
    message: string;
    errors?: any;
}

// --- CONTROLE DE REFRESH DE TOKEN ---
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
 * Função principal de API
 */
export async function api(
    url: string,
    options: RequestInit = {},
    isPublic = false,
    isRetry = false 
) {
    // AJUSTE: Detecta se o corpo é FormData para não forçar Content-Type JSON
    const isFormData = options.body instanceof FormData;

    const config: RequestInit = {
        credentials: "include", // Vital para Cookies HttpOnly
        ...options,
        headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            ...options.headers,
        },
    };

    try {
        const response = await fetch(`${API_URL}${url}`, config);

        // 1. SUCESSO
        if (response.ok) {
            if (response.status === 204) return null;
            return await response.json();
        }

        // 2. TRATAMENTO DE ERRO 401 (TOKEN EXPIRADO)
        if (response.status === 401 && !isPublic) {
            
            // Se falhar no login direto, não tenta refresh
            if (url.includes("/auth/login/")) {
                const errorData = await response.json().catch(() => ({}));
                throw { status: 401, errors: errorData, message: "Credenciais inválidas" };
            }

            // Proteção contra loop
            if (isRetry) {
                handleLogoutRedirect();
                throw { status: 401, message: "Sessão expirada permanentemente" };
            }

            // Se falhar no próprio refresh, desloga
            if (url.includes("/auth/refresh/")) {
                handleLogoutRedirect();
                throw { status: 401, message: "Refresh token expirado" };
            }

            // Fila de espera durante o refresh
            if (isRefreshing) {
                return new Promise((resolve) => {
                    subscribeTokenRefresh(() => {
                        resolve(api(url, options, isPublic, true));
                    });
                });
            }

            isRefreshing = true;
            const refreshed = await refreshToken();
            isRefreshing = false;

            if (refreshed) {
                onRefreshed(); 
                return api(url, options, isPublic, true); 
            } else {
                handleLogoutRedirect();
                throw { status: 401, message: "Falha na renovação da sessão" };
            }
        }

        // 3. TRATAMENTO DE ERROS DE VALIDAÇÃO E SERVIDOR (400, 403, 500...)
        const errorData = await response.json().catch(() => ({}));
        
        // Repassa o erro estruturado para o catch do componente/hook
        throw {
            status: response.status,
            message: errorData.detail || "Erro na requisição",
            errors: errorData, // Aqui contém { endereco: { cep: [...] } }
        };

    } catch (error: any) {
        // Se o erro já foi estruturado por nós acima, apenas repassa
        if (error.status) throw error;
        
        // Erro físico de conexão (Servidor fora do ar / Sem internet)
        throw {
            status: 503,
            message: "Não foi possível conectar ao servidor local ou remoto.",
            errors: {}
        };
    }
}

/**
 * Chama o endpoint do Django para renovar o cookie de acesso
 */
async function refreshToken(): Promise<boolean> {
    try {
        const res = await fetch(`${API_URL}/auth/refresh//`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        });
        return res.ok;
    } catch (error) {
        console.error("Erro crítico no refresh:", error);
        return false;
    }
}

/**
 * Limpa a sessão e redireciona
 */
function handleLogoutRedirect() {
    if (typeof window !== "undefined") {
        if (!window.location.pathname.includes('/login')) {
            setTimeout(() => {
                window.location.href = "/login?session=expired";
            }, 100);
        }
    }
}