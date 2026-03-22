import { Experience, ExperiencePagination } from "@/interfaces/iExperience";
import { api } from "@/lib/api";
import { get as idbGet, set as idbSet, del as idbDel } from "idb-keyval";


const CACHE_KEY_PREFIX = "exp_profile_";

export const experienceService = {
  /**
   * Sincroniza experiências do perfil com suporte a Cache local e ETag
   */
  async listByProfile(profileId: string, page = 1, size = 10, force = false): Promise<ExperiencePagination> {
    const cacheKey = `${CACHE_KEY_PREFIX}${profileId}_p${page}`;
    
    // 1. Tenta recuperar do cache (se não for forçado)
    if (!force) {
      const cached = await idbGet(cacheKey);
      if (cached) return cached;
    }

    // 2. Chamada à API (O back-end retornará 304 se o ETag bater, tratado no seu lib/api)
    const data = await api(`/api/v1/experiences/experiences/profile/${profileId}?page=${page}&size=${size}`, {
      method: "GET",
      credentials: "include",
    });

    // 3. Persiste no IndexedDB para acesso offline/rápido
    await idbSet(cacheKey, data);
    return data;
  },

  /**
   * Cria nova experiência e invalida o cache do perfil
   */
  async create(data: Partial<Experience>): Promise<Experience> {
    const res = await api("/api/v1/experiences/experiences/", {
      method: "POST",
      body: JSON.stringify(data),
      credentials: "include",
    });

    // Invalidação do DNA_Career: Remove caches antigos para forçar refresh
    await this.clearProfileCache();
    return res;
  },

  /**
   * Atualiza registro existente (PATCH Protocol)
   */
  async update(expId: string, data: Partial<Experience>): Promise<Experience> {
    const res = await api(`/api/v1/experiences/experiences/${expId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      credentials: "include",
    });

    await this.clearProfileCache();
    return res;
  },

  /**
   * Remove registro permanentemente (Purge Protocol)
   */
  async delete(expId: string): Promise<void> {
    await api(`/api/v1/experiences/experiences/${expId}`, {
      method: "DELETE",
      credentials: "include",
    });

    await this.clearProfileCache();
  },

  /**
   * Helper para limpar todos os caches de experiência do usuário atual
   */
  async clearProfileCache() {
    // Busca todas as chaves que começam com o prefixo e as remove
    // Isso garante que a próxima listagem venha direto do banco
    const keys = await window.indexedDB.databases(); // Ou uma lógica de loop no seu idb.ts
    // Se o seu idb.ts for simples, você pode apenas deletar a chave principal
    await idbDel("experience_store_ts"); // Força o useExperienceStore a dar fetch
  }
};