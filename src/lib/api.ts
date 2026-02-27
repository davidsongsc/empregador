import { useAuthStore } from "@/store/useAuthStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Função principal de API sincronizada com Zustand
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
        credentials: "include", // Importante para Cookies HttpOnly
        signal: controller.signal,
        ...options,
        headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            ...options.headers,
        },
    };

    try {
        const response = await fetch(`${API_URL}${url}`, config);
        clearTimeout(timeoutId);

        // --- 1. SUCESSO ---
        if (response.ok) {
            if (response.status === 204) return null;
            const data = await response.json();

            /**
             * SINCRONIZAÇÃO AUTOMÁTICA COM O STORE
             * Se qualquer requisição retornar o objeto 'user', atualizamos o Store.
             * Isso mantém o nome/foto sempre frescos sem esforço extra.
             */
            if (data?.user) {
                useAuthStore.getState().setUser(data.user);
            }

            return data;
        }

        // --- 2. TRATAMENTO DE ERRO 401 (SESSÃO) ---
        if (response.status === 401 && !isPublic) {

            // Caso seja erro no login, não tentamos refresh
            if (url.includes("/auth/login/")) {
                const errorData = await response.json().catch(() => ({}));
                throw { status: 401, errors: errorData, message: "Credenciais inválidas" };
            }

            // Se for re-tentativa ou erro no próprio refresh, desloga geral
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
            message: errorData.detail || "Erro na requisição",
            errors: errorData,
        };

    } catch (error: any) {
        if (error.name === 'AbortError') {
            throw { status: 408, message: "Conexão lenta demais. Verifique seu sinal de internet." };
        }
        if (error.status) throw error;

        throw {
            status: 503,
            message: "Não foi possível conectar ao servidor.",
            errors: {}
        };
    }
}

/**
 * Gerenciador de fila de refresh para evitar múltiplas chamadas simultâneas
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

async function refreshToken(): Promise<boolean> {
    try {
        const res = await fetch(`${API_URL}/auth/refresh/`, {
            method: "POST",
            credentials: "include",
        });
        return res.ok;
    } catch {
        return false;
    }
}

/**
 * Limpa o estado em todos os lugares e redireciona
 */
function handleGlobalLogout() {
    if (typeof window !== "undefined") {
        // Limpa Zustand (que por consequência limpa localStorage)
        useAuthStore.getState().logout(); 
        
        if (!window.location.pathname.includes('/login')) {
            window.location.href = "/login?session=expired";
        }
    }
}