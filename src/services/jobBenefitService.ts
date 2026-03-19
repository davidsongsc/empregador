import { api } from "@/lib/api";
import { get as idbGet, set as idbSet, del as idbDel } from "idb-keyval";

const BENEFIT_STALE_TIME = 2 * 60 * 60 * 1000; // 2 Horas de cache
const DELTA_HEADERS = {
  "X-Protocol-Mode": "DELTA_SYNC",
  "X-Sync-Policy": "LONG_TERM_CACHE",
};

export const benefitService = {
  /**
   * Lista benefícios de uma vaga com cache persistente
   */
  getJobBenefits: async (jobId: string, forceRefresh = false) => {
    const cleanId = jobId.toString().replace(/["'“”]/g, '').trim();
    const cacheKey = `benefits_job_${cleanId}`;
    const tsKey = `${cacheKey}_ts`;

    const now = Date.now();
    const [cachedData, lastSync] = await Promise.all([
      idbGet(cacheKey),
      idbGet(tsKey)
    ]);

    if (!forceRefresh && cachedData && lastSync && (now - lastSync < BENEFIT_STALE_TIME)) {
      return cachedData;
    }

    const data = await api(`/api/v1/jobs/benefits/?job_id=${cleanId}`, {
      method: "GET",
      headers: { ...DELTA_HEADERS },
      credentials: "include",
    });

    await Promise.all([
      idbSet(cacheKey, data),
      idbSet(tsKey, now)
    ]);

    return data;
  },

  createBenefit: async (payload: { job_id: string; description: string; icon?: string }) => {
    const res = await api("/api/v1/jobs/benefits/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });

    // Invalida o cache da vaga específica
    await idbDel(`benefits_job_${payload.job_id}_ts`);
    return res;
  },

  deleteBenefit: async (benefitId: string, jobId: string) => {
    await api(`/api/v1/jobs/benefits/${benefitId}`, {
      method: "DELETE",
      credentials: "include",
    });

    await idbDel(`benefits_job_${jobId}_ts`);
  }
};