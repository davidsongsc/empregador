import { api } from "@/lib/api";

export async function login(whatsappNumber: string, password: string, remember: boolean = false) {
    const data = await api("/auth/login/", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
            
            whatsapp_number: whatsappNumber,
            password,
            remember,
        }),
    });

    // Se o login foi ok, mas não veio o objeto 'user' como no /me/,
    // você precisa formatar aqui ou no componente:
    return data;
}