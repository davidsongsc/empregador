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

// Adicionamos o parâmetro 'remember' (opcional, com padrão false)
export async function login(whatsappNumber: string, password: string, remember: boolean = false) {
    return api("/auth/login/", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
            whatsapp_number: whatsappNumber,
            password,
            remember, // Enviamos a flag para o Django
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

export async function forgotPassword(identifier: string) {
    // Ajuste o endpoint conforme sua URL no Django
    return await api("/auth/password-reset/", {
        method: "POST",
        body: JSON.stringify({ whatsapp_number: identifier }),
    }, true); // Rota pública
}

/**
 * Busca o perfil do usuário logado usando o endpoint customizado /me/
 */
export async function getMyProfile() {
    return api("/profiles/me/", {
        method: "GET",
        credentials: "include",
    });
}

/**
 * Atualiza os dados do perfil e endereço.
 * Aceita um objeto parcial (PATCH) contendo name, last_name, ocupation, bio, endereco, etc.
 */
export async function updateMyProfile(profileData: any) {
    return api("/profiles/me/", {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify(profileData),
    });
}

/**
 * Função específica para upload de foto (multipart/form-data)
 * Nota: Como é um FormData, a nossa função 'api' não deve dar stringify no body
 */
export async function uploadProfilePhoto(photoFile: File) {
    const formData = new FormData();
    formData.append("foto", photoFile);

    return api("/profiles/me/", {
        method: "PATCH",
        credentials: "include",
        body: formData, // Aqui passamos o FormData puro
        // Importante: Certifique-se que sua lib 'api' não force 
        // 'Content-Type: application/json' quando for FormData
    });
}