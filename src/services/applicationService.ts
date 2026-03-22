import { api } from "@/lib/api";
import { get as idbGet, set as idbSet, del as idbDel } from "idb-keyval";

/**
 * PROTOCOLO_DELTA_APP_CONFIG
 * TTL: 1 Hora (3.600.000 ms) para candidaturas
 */
const APP_STALE_TIME = 1 * 60 * 60 * 1000;
const DELTA_HEADERS = {
  "X-Protocol-Mode": "DELTA_SYNC",
  "X-Sync-Policy": "LONG_TERM_CACHE",
};

export const applicationService = {
  /**
   * Envia uma nova candidatura (Protocolo de Sincronização Cognitiva)
   */
  applyToJob: async (jobId: string, answers: any[]) => {
    const cleanJobId = jobId.toString().replace(/["'“”]/g, '').trim();

    // O Backend espera 'job_id' e 'respostas'
    const payload = {
      job_id: cleanJobId,
      respostas: answers
    };

    try {
      // Verifique se o seu wrapper 'api' aceita o objeto direto no body
      // Se ele for um fetch comum, precisa do JSON.stringify:
      const res = await api("/api/v1/applications/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
      });

      await Promise.all([
        idbDel("apps_list_ts"),
        idbDel("enrolled_jobs_ts")
      ]);

      return res;
    } catch (err: any) {
      // Tratamento para não vir objeto do Pydantic no Notification
      const detail = err.response?.data?.detail;
      const msg = Array.isArray(detail) ? detail[0]?.msg : (detail || err.message);
      throw new Error(msg);
    }
  },

  /**
   * Busca as candidaturas do usuário com cache persistente (IndexedDB)
   */
  getMyApplications: async (forceRefresh = false) => {
    const now = Date.now();
    const [cachedApps, lastSync] = await Promise.all([
      idbGet("apps_list_data"),
      idbGet("apps_list_ts")
    ]);

    if (!forceRefresh && cachedApps && lastSync && (now - lastSync < APP_STALE_TIME)) {
      return cachedApps;
    }

    const data = await api("/api/v1/applications/", {
      method: "GET",
      headers: { ...DELTA_HEADERS },
      credentials: "include",
    });

    await Promise.all([
      idbSet("apps_list_data", data),
      idbSet("apps_list_ts", now)
    ]);

    return data;
  },

  /**
   * Atualiza o status (Delta Update para Recrutadores)
   */
  updateApplicationStatus: async (applicationId: string, newStatus: string) => {
    const cleanAppId = applicationId.toString().replace(/["'“”]/g, '').trim();

    const res = await api(`/api/v1/applications/${cleanAppId}/`, {
      method: "PATCH",
      headers: {
        ...DELTA_HEADERS,
        "Content-Type": "application/json", // PATCH precisa de JSON explicito
        "X-Delta-Target": "APP_STATUS_UPDATE"
      },
      credentials: "include",
      body: JSON.stringify({ status: newStatus }),
    });

    await idbDel("apps_list_ts");
    return res;
  },
  /**
     * Busca todas as candidaturas de uma vaga específica (Visão Recrutador)
     * Inclui cache por JobID para evitar re-fetch constante ao alternar abas
     */
  getJobApplications: async (jobId: string, forceRefresh = false) => {
    const cleanId = jobId.toString().replace(/["'“”]/g, '').trim();
    const cacheKey = `job_apps_${cleanId}`;
    const tsKey = `${cacheKey}_ts`;

    const now = Date.now();
    const [cachedData, lastSync] = await Promise.all([
      idbGet(cacheKey),
      idbGet(tsKey)
    ]);

    // TTL de 5 minutos para candidaturas de uma vaga (mais curto que o global)
    const JOB_APP_STALE = 5 * 60 * 1000;

    if (!forceRefresh && cachedData && lastSync && (now - lastSync < JOB_APP_STALE)) {
      return cachedData;
    }

    const data = await api(`/api/v1/applications/job/${cleanId}/`, {
      method: "GET",
      headers: { ...DELTA_HEADERS },
      credentials: "include",
    });

    // Persistência no IndexedDB
    await Promise.all([
      idbSet(cacheKey, data),
      idbSet(tsKey, now)
    ]);

    return data;
  },
  /**
   * Busca as vagas onde o usuário está inscrito
   */
  getEnrolledJobs: async (forceRefresh = false) => {
    const now = Date.now();
    const [cachedJobs, lastSync] = await Promise.all([
      idbGet("enrolled_jobs_data"),
      idbGet("enrolled_jobs_ts")
    ]);

    if (!forceRefresh && cachedJobs && lastSync && (now - lastSync < APP_STALE_TIME)) {
      return cachedJobs;
    }

    const data = await api("/api/v1/applications/minhas-vagas/", {
      method: "GET",
      headers: { ...DELTA_HEADERS },
      credentials: "include",
    });

    await Promise.all([
      idbSet("enrolled_jobs_data", data),
      idbSet("enrolled_jobs_ts", now)
    ]);

    return data;
  }
};