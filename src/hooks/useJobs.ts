"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { getAllJobs, getJobFeed } from "@/services/jobService";
import { useAuthStore } from "@/store/useAuthStore";
import { useJobStore } from "@/store/useJobStore";

export function useJobs(page: number, pageSize: number = 12, selectedCategory?: string | null) {
  const { user } = useAuthStore();
  const { cache, setCache, applyDeltaPatches } = useJobStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cacheKey = useMemo(() => {
    return `jobs-p${page}-s${pageSize}-c${selectedCategory || "all"}-u${user?.id || "guest"}`;
  }, [page, pageSize, selectedCategory, user?.id]);

  const cachedData = cache[cacheKey];

  const loadJobs = useCallback(async (isSilent = false) => {
    if (!cachedData && !isSilent) setLoading(true);

    const params = {
      page,
      page_size: Math.min(pageSize, 100),
      ...(selectedCategory && { role__name: selectedCategory })
    };

    try {
      const options = {
        headers: { "If-None-Match": cachedData?.etag || "" }
      };

      // Agora o Service aceita os dois argumentos
      const response: any = user
        ? await getJobFeed(params, options)
        : await getAllJobs(params, options);

      if (response.isDelta) {
        applyDeltaPatches(response.patches);
        setCache(cacheKey, {
          ...cachedData,
          etag: response.newEtag,
          updatedAt: Date.now()
        });
      } else if (response.results) {
        setCache(cacheKey, {
          results: response.results,
          count: response.count,
          metadata: response.metadata,
          etag: response.etag,
          updatedAt: Date.now()
        });
      }
    } catch (err: any) {
      // IMPORTANTE: O erro 304 (Not Modified) confirma que o cache é válido
      if (err.status === 304 || err.message?.includes("304")) {
        console.log("Nexus_Hub::Integridade_Confirmada");
      } else {
        setError("FALHA_NA_SINCRONIZACAO_DELTA");
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  }, [cacheKey, cachedData, page, pageSize, selectedCategory, user, setCache, applyDeltaPatches]);
  useEffect(() => {
    loadJobs();
  }, [cacheKey]);

  return {
    jobs: cachedData?.results || [],
    count: cachedData?.count || 0,
    metadata: cachedData?.metadata || { categorias: [], total_global: 0 },
    loading,
    error,
    refresh: () => loadJobs(true),
  };
}