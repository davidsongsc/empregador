import { useAuthStore } from "@/store/useAuthStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Função principal de API sincronizada com Zustand e Cookies HttpOnly
 */
export async function api(
    url: string,
    options: RequestInit = {},
    isPublic = false,
    isRetry = false
) {
    const isFormData = options.body instanceof FormData;

    // Timeout de 15s para redes instáveis (3G/4G)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const config: RequestInit = {
        // ESSENCIAL: Permite receber e enviar cookies HttpOnly entre domínios
        credentials: "include", 
        signal: controller.signal,
        ...options,
        headers: {
            // Se for FormData, o navegador define o Boundary automaticamente. 
            // Se for JSON, definimos manualmente.
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            ...options.headers,
        },
    };

    try {
        const response = await fetch(`${API_URL}${url}`, config);
        clearTimeout(timeoutId);

        // --- 1. SUCESSO ---
        if (response.ok) {
            if (response.status === 204) return { ok: true };
            
            const data = await response.json();

            /**
             * SINCRONIZAÇÃO AUTOMÁTICA COM O STORE
             * Quando o Django retorna o objeto 'user' (ex: no checkSession),
             * atualizamos o estado global instantaneamente.
             */
            if (data?.user) {
                useAuthStore.getState().setUser(data.user);
            }

            // Retornamos 'ok: true' para facilitar a lógica do componente de Login
            return { ok: true, ...data };
        }

        // --- 2. TRATAMENTO DE ERRO 401 (SESSÃO) ---
        if (response.status === 401 && !isPublic) {

            // Caso seja erro no login, não tentamos refresh (credenciais erradas)
            if (url.includes("/auth/login/")) {
                const errorData = await response.json().catch(() => ({}));
                throw { status: 401, errors: errorData, message: errorData.message || "Credenciais inválidas" };
            }

            // Se for re-tentativa ou erro no próprio refresh, desloga
            if (isRetry || url.includes("/auth/refresh/")) {
                handleGlobalLogout();
                throw { status: 401, message: "Sessão expirada" };
            }

            /**
             * LÓGICA DE REFRESH TOKEN (CONTROLE DE FLUXO)
             */
            const { isRefreshing, startRefresh, stopRefresh, subscribe } = useRefreshManager();

            if (isRefreshing()) {
                return new Promise((resolve) => {
                    subscribe(() => resolve(api(url, options, isPublic, true)));
                });
            }

            startRefresh();
            const refreshed = await refreshToken();
            stopRefresh();

            if (refreshed) {
                // Tenta novamente a requisição original agora que o cookie foi renovado
                return api(url, options, isPublic, true);
            } else {
                handleGlobalLogout();
                throw { status: 401, message: "Sessão encerrada" };
            }
        }

        // --- 3. OUTROS ERROS (400, 403, 500) ---
        const errorData = await response.json().catch(() => ({}));
        throw {
            status: response.status,
            message: errorData.detail || errorData.message || "Erro na requisição",
            errors: errorData,
        };

    } catch (error: any) {
        if (error.name === 'AbortError') {
            throw { status: 408, message: "Conexão lenta demais. Verifique seu sinal de internet." };
        }
        // Se já for um erro formatado por nós, repassa
        if (error.status) throw error;

        // Erro genérico de rede
        throw {
            status: 503,
            message: "Não foi possível conectar ao servidor.",
            errors: {}
        };
    }
}

/**
 * Gerenciador de fila de refresh
 */
let refreshing = false;
let subscribers: (() => void)[] = [];
const useRefreshManager = () => ({
    isRefreshing: () => refreshing,
    startRefresh: () => { refreshing = true; },
    stopRefresh: () => { 
        refreshing = false; 
        subscribers.forEach(cb => cb());
        subscribers = [];
    },
    subscribe: (cb: () => void) => subscribers.push(cb)
});

/**
 * Chama o endpoint de refresh do Django.
 * O Django deve responder com um novo 'Set-Cookie' de acesso.
 */
async function refreshToken(): Promise<boolean> {
    try {
        const res = await fetch(`${API_URL}/auth/refresh/`, {
            method: "POST",
            // IMPORTANTE: Necessário para enviar o cookie 'refresh' e receber o novo 'access'
            credentials: "include", 
        });
        return res.ok;
    } catch {
        return false;
    }
}

/**
 * Limpa o estado e redireciona.
 * O logout do Zustand deve limpar o localStorage.
 */
function handleGlobalLogout() {
    if (typeof window !== "undefined") {
        useAuthStore.getState().logout(); 
        
        if (!window.location.pathname.includes('/login')) {
            window.location.href = "/login?session=expired";
        }
    }
}