// @/lib/api.ts
import { useAuthStore } from "@/store/useAuthStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function api(
    url: string,
    options: RequestInit = {},
    isPublic = false,
    isRetry = false
) {
    const isServer = typeof window === "undefined";
    const isFormData = options.body instanceof FormData;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    let serverHeaders: Record<string, string> = {};
    if (isServer) {
        try {
            const { cookies: nextCookies } = await import("next/headers");
            const cookieStore = await nextCookies();
            const allCookies = cookieStore.toString();
            if (allCookies) {
                serverHeaders = { Cookie: allCookies };
            }
        } catch (e) {
            console.error("Erro ao ler cookies no servidor:", e);
        }
    }

    const config: RequestInit = {
        credentials: "include", // ESSENCIAL para CORS + Cookies
        signal: controller.signal,
        ...options,
        headers: {
            // Se for FormData, o browser define o Content-Type com o boundary correto
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            ...serverHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(`${API_URL}${url}`, config);
        clearTimeout(timeoutId);

        // Sucesso
        if (response.ok) {
            if (response.status === 204) return { ok: true };
            const data = await response.json();

            // Sincroniza o Store se o backend retornar o objeto 'user'
            if (!isServer && data?.user) {
                useAuthStore.getState().setUser(data.user);
            }
            return { ok: true, ...data };
        }

        // Tratamento de 401 (Não autorizado)
        if (response.status === 401 && !isPublic) {
            // Se o erro for no próprio login, não tenta refresh, apenas sobe o erro
            if (url.includes("/auth/login/")) {
                const errorData = await response.json().catch(() => ({}));
                throw { status: 401, errors: errorData, message: errorData.detail || "Credenciais inválidas" };
            }

            // Se falhar no servidor ou for um re-tentativa, desloga
            if (isServer || isRetry || url.includes("/auth/refresh/")) {
                if (!isServer) handleGlobalLogout();
                throw { status: 401, message: "Sessão expirada" };
            }

            // Lógica de Refresh Token (Fila de espera para múltiplas requisições 401 simultâneas)
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

        // Outros erros (400, 403, 404, 500)
        const errorData = await response.json().catch(() => ({}));
        throw {
            status: response.status,
            message: errorData.detail || errorData.message || "Erro na requisição",
            errors: errorData,
        };

    } catch (error: any) {
        if (error.name === 'AbortError') {
            throw { status: 408, message: "Conexão lenta demais ou tempo esgotado." };
        }
        if (error.status) throw error; // Re-lança erro já formatado

        throw {
            status: 503,
            message: "Não foi possível conectar ao servidor.",
            errors: {}
        };
    }
}

// Gerenciador de estado do Refresh para evitar múltiplas chamadas ao mesmo tempo
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
        const res = await fetch(`${API_URL}/auth/refresh/`, { // Corrigida a barra dupla
            method: "POST",
            credentials: "include", 
        });
        return res.ok;
    } catch {
        return false;
    }
}

function handleGlobalLogout() {
    if (typeof window !== "undefined") {
        useAuthStore.getState().logout(); 
        if (!window.location.pathname.includes('/login')) {
            window.location.href = "/login?session=expired";
        }
    }
}