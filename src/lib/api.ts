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

    let serverHeaders = {};
    if (isServer) {
        try {
            const { cookies: nextCookies } = await import("next/headers");
            const cookieStore = await nextCookies();
            serverHeaders = {
                Cookie: cookieStore.toString(),
            };
        } catch (e) {}
    }

    const config: RequestInit = {
        credentials: "include", 
        signal: controller.signal,
        ...options,
        headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            ...serverHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(`${API_URL}${url}`, config);
        clearTimeout(timeoutId);

        if (response.ok) {
            if (response.status === 204) return { ok: true };
            
            const data = await response.json();

            if (!isServer && data?.user) {
                useAuthStore.getState().setUser(data.user);
            }

            return { ok: true, ...data };
        }

        if (response.status === 401 && !isPublic) {
            if (url.includes("/auth/login/")) {
                const errorData = await response.json().catch(() => ({}));
                throw { status: 401, errors: errorData, message: errorData.message || "Credenciais inválidas" };
            }

            if (isServer || isRetry || url.includes("/auth/refresh/")) {
                if (!isServer) handleGlobalLogout();
                throw { status: 401, message: "Sessão expirada" };
            }

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

        const errorData = await response.json().catch(() => ({}));
        throw {
            status: response.status,
            message: errorData.detail || errorData.message || "Erro na requisição",
            errors: errorData,
        };

    } catch (error: any) {
        if (error.name === 'AbortError') {
            throw { status: 408, message: "Conexão lenta demais." };
        }
        if (error.status) throw error;

        throw {
            status: 503,
            message: "Não foi possível conectar ao servidor.",
            errors: {}
        };
    }
}

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
        const res = await fetch(`${API_URL}/auth/refresh//`, {
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