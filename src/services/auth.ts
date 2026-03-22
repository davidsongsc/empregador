import { api } from "@/lib/api";
import { get as idbGet, set as idbSet, del as idbDel, keys as idbKeys } from "idb-keyval";

/**
 * PROTOCOLO_DELTA_AUTH_CONFIG
 * TTL: 24 Horas (86.400.000 ms)
 */
const AUTH_STALE_TIME = 24 * 60 * 60 * 1000;
const DELTA_HEADERS = {
    "X-Protocol-Mode": "DELTA_SYNC",
    "X-Sync-Policy": "LONG_TERM_CACHE",
};

/**
 * Verifica a sessão atual com suporte ao Protocolo Delta.
 * @param lastUpdated Timestamp da última atualização local.
 */
export async function checkSession() {
    // Se houver timestamp, enviamos como query param
    const url = '/api/v1/auth/me';

    // O wrapper 'api' deve usar credentials: "include" para enviar o cookie 'access'
    return await api(url, { method: "GET" });
}

export async function getMyProfile(forceRefresh = false) {
    const now = Date.now();
    const cachedProfile = await idbGet("auth_profile_data");
    const lastSync = await idbGet("auth_profile_ts");

    if (cachedProfile && lastSync && (now - lastSync < AUTH_STALE_TIME) && !forceRefresh) {
        return cachedProfile;
    }

    const profileData = await api("/api/v1/perfis/me", {
        method: "GET",
        headers: { ...DELTA_HEADERS },
        credentials: "include",
    });

    await Promise.all([
        idbSet("auth_profile_data", profileData),
        idbSet("auth_profile_ts", now)
    ]);

    return profileData;
}

export async function updateMyProfile(profileData: any) {
    // PATCH sempre usa Protocolo Delta para informar mudança imediata
    const res = await api("/api/v1/perfis/me", {
        method: "PATCH",
        headers: {
            ...DELTA_HEADERS,
            "X-Delta-Target": "PROFILE_UPDATE"
        },
        credentials: "include",
        body: JSON.stringify(profileData),
    });

    // Invalidação imediata do cache para forçar refresh no próximo check
    await idbDel("auth_profile_ts");
    await idbDel("auth_user_ts");

    return res;
}

export async function logout() {
    try {
        await api("/api/v1/auth/logout", {
            method: "POST",
            credentials: "include",
        });
    } finally {
        // LIMPEZA_TOTAL_DELTA: Remove todos os rastros de cache
        await Promise.all([
            idbDel("auth_user_data"),
            idbDel("auth_user_ts"),
            idbDel("auth_profile_data"),
            idbDel("auth_profile_ts"),
            idbDel("cached_members"), // Limpa membros também por segurança
            idbDel("active_company")
        ]);
    }
}

// ROTA PÚBLICA: Não precisa de Delta Sync (sempre fresh)
export async function registerUser(email: string, whatsappNumber: string, password: string) {
    return await api("/api/v1/usuarios/register", {
        method: "POST",
        body: JSON.stringify({
            email: email,
            whatsapp_number: whatsappNumber,
            password

        }),
    });
}

/**
 * ROTA PÚBLICA: Solicita o link de recuperação de senha via Email/WhatsApp.
 * Não utiliza Protocolo Delta pois exige dados 100% fresh do servidor.
 */
export async function forgotPassword(email: string) {
    return await api("/api/v1/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
        // Não enviamos credentials: "include" aqui pois é uma rota de pré-auth
    });
}

/**
 * ROTA PÚBLICA: Define a nova senha utilizando o token recebido.
 */
export async function resetPassword(token: string, newPassword: string) {
    return await api("/api/v1/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
            token,
            new_password: newPassword
        }),
    });
}