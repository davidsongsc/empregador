import { api } from "@/lib/api";
import { get as idbGet, set as idbSet, del as idbDel } from "idb-keyval";

export interface Application {
  id: string;
  job_id: string;
  candidate_id: string;
  status: 'applied' | 'reviewing' | 'interview' | 'hired' | 'rejected';
  created_at: string;
  updated_at: string;
  cargo_nome: string;
  empresa_nome: string;
}

export interface ApplicationsResponse {
  total: number;
  pagina: number;
  tamanho: number;
  paginas_totais: number;
  data_hash: string;
  items: Application[];
}

const APPS_CACHE_KEY = "candidate_applications_data";
const APPS_TS_KEY = "candidate_applications_sync_ts";
const CACHE_STALE_TIME = 10 * 60 * 1000; // 10 minutos

export const myApplicationService = {
  getMyApplications: async (forceRefresh = false): Promise<ApplicationsResponse> => {
    const now = Date.now();

    // 1. Recuperação do Estado Persistente
    const [cachedData, lastSync] = await Promise.all([
      idbGet(APPS_CACHE_KEY) as Promise<ApplicationsResponse | undefined>,
      idbGet(APPS_TS_KEY) as Promise<number | undefined>
    ]);

    // 2. Short-circuit: Cache Quente (Evita qualquer chamada de rede)
    if (!forceRefresh && cachedData && lastSync && (now - lastSync < CACHE_STALE_TIME)) {
      return cachedData;
    }

    try {
      // 3. Request com Protocolo Delta (If-None-Match)
      const response = await api("/api/v1/applications/", {
        method: "GET",
        headers: {
          "If-None-Match": cachedData?.data_hash || "",
          "X-Protocol-Mode": "DELTA_SYNC"
        },
        credentials: "include"
      });

      // 4. Lógica de Sincronização
      // Se a sua lib 'api' retornar null ou lançar 304, usamos o cache e apenas renovamos o TS
      if (!response || (response as any).status === 304) {
        if (cachedData) {
          await idbSet(APPS_TS_KEY, now);
          return cachedData;
        }
      }

      // 5. Persistência de Novos Dados (Cache Miss)
      const sanitizedResponse = {
        ...response,
        items: Array.isArray(response.items) ? response.items : []
      };

      await Promise.all([
        idbSet(APPS_CACHE_KEY, sanitizedResponse),
        idbSet(APPS_TS_KEY, now)
      ]);

      return sanitizedResponse;

    } catch (error: any) {
      // 6. Resiliência: Em caso de falha de rede, o cache é o salva-vidas
      if (cachedData) {
        console.warn("⚠️ Sync_Error: Usando cache offline.");
        return cachedData;
      }
      throw error;
    }
  },

  applyToJob: async (jobId: string, answers: any[]) => {
    const cleanJobId = jobId.toString().replace(/["'“”]/g, '').trim();

    const res = await api("/api/v1/applications/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        job_id: cleanJobId,
        respostas: answers
      }),
      credentials: "include"
    });

    // 7. Invalidação de Cache (Crucial para o Dashboard atualizar)
    await Promise.all([
      idbDel(APPS_TS_KEY),
      idbDel("enrolled_jobs_ts")
    ]);

    return res;
  },
  withdrawApplication: async (applicationId: string) => {
    await api(`/api/v1/applications/${applicationId}/withdraw`, {
      method: "POST", 
      credentials: "include"
    });

    // Invalida o cache para refletir o novo status no dashboard
    await Promise.all([
      idbDel("candidate_applications_sync_ts"),
      idbDel("enrolled_jobs_ts")
    ]);
  }

};

