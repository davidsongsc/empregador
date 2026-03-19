import { api } from "@/lib/api";
interface FetchOptions {
    headers?: Record<string, string>;
}

/**
 * ROTA PRIVADA: Busca o histórico de experiências de um perfil específico.
 * @param profileId UUID do perfil (id)
 * @param options Opções de fetch para incluir Headers de cache (ETag)
 */
export async function getProfileExperiences(
    profileId: string,
    options: FetchOptions = {}
): Promise<any> {
    // 1. Limpeza de segurança: remove aspas residuais e espaços
    const cleanProfileId = profileId.toString().replace(/["'“”]/g, '').trim();

    // 2. Montagem da URL conforme sua estrutura: /api/v1/experiences/experiences/profile/{id}
    const url = `/api/v1/experiences/experiences/profile/${cleanProfileId}`;

    return api(url, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}), // Permite passar o "If-None-Match" do Store
        },
    });
}