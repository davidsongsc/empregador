import { api } from "@/lib/api";

export async function registerUser(
    whatsappNumber: string,
    password: string
) {
    try {
        return await api("/api/users/", {
            method: "POST",
            body: JSON.stringify({
                whatsapp_number: whatsappNumber,
                password,
            }),
        });
    } catch (err: any) {
        if (err?.errors?.whatsapp_number) {
            throw new Error(err.errors.whatsapp_number[0]);
        }

        throw new Error("Erro ao criar conta");
    }
}

export async function login(whatsappNumber: string, password: string) {
    return api("/auth/login/", {
        method: "POST",
        credentials: "include", // CORRETO: Permite receber os cookies
        body: JSON.stringify({
            whatsapp_number: whatsappNumber,
            password,
        }),
    });
}
export async function logout() {
    // O logout precisa limpar os cookies no servidor
    return api("/auth/logout/", {
        method: "POST",
        credentials: "include",
    });
}
export async function checkSession() {
    return api("/auth/me/", {
        method: "GET",
        credentials: "include", // OBRIGATÓRIO: Para enviar o cookie 'access'
    });
}