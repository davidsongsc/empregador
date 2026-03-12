"use client";

import { useEffect, useMemo, useCallback } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useJobStore } from "@/store/useJobStore";

/**
 * HOOK: useJobs
 * Orquestra a sincronização Delta entre o componente e a Store persistente.
 */
export function useJobs(page: number, pageSize: number = 12, selectedCategory?: string | null) {
  // 1. Seletores de Estado (Zustand)
  // Usamos seletores específicos para evitar re-renders desnecessários
  const user = useAuthStore((state) => state.user);
  const fetchJobs = useJobStore((state) => state.fetchJobs);
  const loading = useJobStore((state) => state.loading);
  const error = useJobStore((state) => state.error);

  // 2. Geração da Chave Única de Cache (DNA do Protocolo Delta)
  const cacheKey = useMemo(() => {
    return `jobs-p${page}-s${pageSize}-c${selectedCategory || "all"}-u${user?.id || "guest"}`;
  }, [page, pageSize, selectedCategory, user?.id]);

  // 3. Seleção Reativa dos Dados
  // Se a chave no cache mudar, o Zustand notifica o componente automaticamente
  const cachedEntry = useJobStore(
    useCallback((state) => state.cache[cacheKey], [cacheKey])
  );

  // 4. Efeito de Sincronização
  useEffect(() => {
    const params = {
      page,
      page_size: Math.min(pageSize, 100), // Proteção contra payloads gigantes
      selectedCategory,
    };

    // Dispara a busca/sincronismo delta
    fetchJobs(params, user);
    
  }, [cacheKey, fetchJobs, user]); 

  // 5. Interface de Retorno (API do Hook)
  return {
    // Retorna os resultados do cache ou um array vazio enquanto carrega
    jobs: cachedEntry?.results || [],
    
    // Metadados para paginação e filtros
    count: cachedEntry?.count || 0,
    metadata: cachedEntry?.metadata || { categorias: [], total_global: 0 },
    
    // Estados de controle
    loading,
    error,
    
    // Função para forçar atualização manual (Pull to Refresh)
    refresh: () => {
      const params = { page, page_size: pageSize, selectedCategory };
      fetchJobs(params, user, true); // isSilent = true para não piscar loading
    },
  };
}