import { Education, EducationPagination } from "@/interfaces/iEducation";
import { api } from "@/lib/api";


export const educationService = {
  /**
   * Sincroniza logs acadêmicos (Academic_Logs) com suporte a ETag
   */
  async list(page = 1, size = 10, hash?: string): Promise<EducationPagination | null> {
    const headers: Record<string, string> = {};
    
    if (hash && hash !== "empty") {
      headers["If-None-Match"] = hash;
    }

    try {
      const response = await api(`/api/v1/educacao/?page=${page}&size=${size}`, {
        method: "GET",
        headers,
      });

      return response;
    } catch (error: any) {
      // Se o backend retornar 304, a lib/api ou o service captura e retorna null
      // indicando que o cache local ainda é válido.
      if (error.status === 304) return null;
      throw error;
    }
  },

  /**
   * Injeta nova formação no DNA_Career
   */
  async create(data: Partial<Education>): Promise<Education> {
    return await api("/api/v1/educacao/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Atualização Delta (PATCH) de registro acadêmico
   */
  async update(id: string, data: Partial<Education>): Promise<Education> {
    return await api(`/api/v1/educacao/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * Purge: Remove registro permanentemente
   */
  async delete(id: string): Promise<void> {
    await api(`/api/v1/educacao/${id}`, {
      method: "DELETE",
    });
  },

  /**
   * Busca binária por ID único
   */
  async getById(id: string): Promise<Education> {
    return await api(`/api/v1/educacao/${id}`, {
      method: "GET",
    });
  }
};