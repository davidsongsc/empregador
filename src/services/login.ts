import { api } from "@/lib/api";

/**
 * Realiza o login do usuário.
 *
 * @param {string} email - Email do usuário.
 * @param {string} password - Senha do usuário.
 * @param {boolean} [remember=false] - Se o usuário deseja manter a sessão ativa.
 * @returns {Promise} - Uma promessa com o resultado da API.
 */
export async function login(email: string, password: string, remember: boolean = false) {
    const data = await api("/api/v1/auth/login", { 
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
            user: email, 
            password,
            remember,
        }),
    });

    return data;
}