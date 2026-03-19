import { api } from "@/lib/api";

export async function login(email: string, password: string, remember: boolean = false) {
    const data = await api("/api/v1/auth/login/", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
            
            user: email,
            password,
            remember,
        }),
    });

    // Se o login foi ok, mas não veio o objeto 'user' como no /me/,
    // você precisa formatar aqui ou no componente:api/v1/auth/login
    return data;
}