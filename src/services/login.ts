import { api } from "@/lib/api";

export async function login(email: string, password: string, remember: boolean = false) {
    // 1. REMOVA A BARRA FINAL: Use /login para evitar o 307 Redirect
    // 2. PREFIXO: Se o seu api_router já tem o prefixo /api/v1, verifique se não está duplicando
    const data = await api("/api/v1/auth/login", { 
        method: "POST",
        credentials: "include", // Mantém o HttpOnly Cookie (Session)
        body: JSON.stringify({
            // 3. MAPEAMENTO: O FastAPI geralmente espera 'username' ou 'email'
            // Se o seu Schema Pydantic no Back usa 'user', mantenha 'user'
            user: email, 
            password,
            remember,
        }),
    });

    return data;
}