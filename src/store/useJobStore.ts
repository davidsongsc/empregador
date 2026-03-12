import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getAllJobs, getJobFeed } from "@/services/jobService";

// --- INTERFACES DO PROTOCOLO DELTA ---

interface JobResult {
  uid: string;
  cargo_exibicao: string;
  empresa_nome: string;
  tipo_vaga: string;
  salario?: string;
  local?: string;
  endereco?: any;
  role_details?: {
    name: string;
    category: string;
  };
}

interface JobPatch {
  uid: string;
  type: 'CREATED' | 'UPDATED' | 'DELETED';
  data: Partial<JobResult>;
}

interface JobCacheEntry {
  results: JobResult[];
  count: number;
  metadata: any;
  etag: string;
  updatedAt: number;
}

interface JobState {
  cache: Record<string, JobCacheEntry>;
  loading: boolean;
  error: string | null;

  // ACTIONS
  fetchJobs: (params: any, user: any, isSilent?: boolean) => Promise<void>;
  applyDeltaPatches: (patches: JobPatch[]) => void;
  clearCache: () => void;
}

// --- STORE CORE ---

export const useJobStore = create<JobState>()(
  persist(
    (set, get) => ({
      cache: {},
      loading: false,
      error: null,

      /**
       * FETCH_JOBS: Gerencia a sincronização Delta com o Backend
       */
      fetchJobs: async (params, user, isSilent = false) => {
        const { page, page_size, selectedCategory } = params;

        // Chave Única de Cache para garantir isolamento por Filtro/Página/Usuário
        const cacheKey = `jobs-p${page}-s${page_size}-c${selectedCategory || "all"}-u${user?.id || "guest"}`;
        const cachedEntry = get().cache[cacheKey];

        // Só mostra loading se não houver NADA no cache local
        if (!cachedEntry && !isSilent) set({ loading: true, error: null });

        try {
          const options = {
            headers: {
              "If-None-Match": cachedEntry?.etag || ""

            }
          };

          const response: any = user
            ? await getJobFeed(params, options)
            : await getAllJobs(params, options);
          console.log("response", response);
          // CENÁRIO A: Resposta Delta (Apenas as mudanças)
          if (response.isDelta) {
            get().applyDeltaPatches(response.patches);

            set((state) => ({
              cache: {
                ...state.cache,
                [cacheKey]: {
                  ...state.cache[cacheKey],
                  etag: response.newEtag,
                  updatedAt: Date.now()
                }
              },
              loading: false
            }));
          }

          // CENÁRIO B: Carga Full (Nova página ou Invalidação)
          else if (response.results) {
            const normalizedResults = response.results.map((item: any) => ({
              ...item,
              cargo_exibicao: item.cargo_exibicao || item.name || "Cargo Indefinido",
              empresa_nome: item.empresa_nome || "Delos_System",
            }));

            // FORÇAR NOVA REFERÊNCIA:
            const newCacheEntry: JobCacheEntry = {
              results: normalizedResults,
              count: response.count,
              metadata: response.metadata || {
                categorias: Array.from(new Set(normalizedResults.map((r: any) => r.category))),
                total_global: response.count
              },
              etag: response.etag || response.newEtag || "initial",
              updatedAt: Date.now()
            };

            set((state) => ({
              ...state, // Espalha o estado anterior
              cache: {
                ...state.cache, // Espalha o cache anterior
                [cacheKey]: newCacheEntry // Adiciona/Sobrescreve a entrada atual
              },
              loading: false,
              error: null
            }));
          }
        } catch (err: any) {
          // CENÁRIO C: 304 Not Modified (Integridade Confirmada)
          if (err.status === 304 || err.message?.includes("304")) {
            console.log(`[DELTA_SYNC] Matriz_${cacheKey}::Sincronizada`);
            set({ loading: false });
          } else {
            set({ error: "FALHA_NA_SINCRONIZACAO_DELTA", loading: false });
            console.error("Nexus_Hub::Sync_Error", err);
          }
        }
      },

      /**
       * APPLY_DELTA_PATCHES: O coração do Protocolo. 
       * Varre todas as chaves de cache e aplica mudanças apenas nos itens afetados.
       */
      applyDeltaPatches: (patches) => set((state) => {
        const newCache = { ...state.cache };

        Object.keys(newCache).forEach(key => {
          let results = [...newCache[key].results];
          let countAdjust = 0;

          patches.forEach(patch => {
            if (patch.type === 'UPDATED') {
              results = results.map(j => j.uid === patch.uid ? { ...j, ...patch.data } : j);
            }
            else if (patch.type === 'DELETED') {
              const initialLen = results.length;
              results = results.filter(j => j.uid !== patch.uid);
              if (results.length < initialLen) countAdjust--;
            }
            else if (patch.type === 'CREATED') {
              if (!results.find(j => j.uid === patch.uid)) {
                results = [patch.data as JobResult, ...results];
                countAdjust++;
              }
            }
          });

          newCache[key] = {
            ...newCache[key],
            results,
            count: newCache[key].count + countAdjust
          };
        });

        return { cache: newCache };
      }),

      clearCache: () => set({ cache: {}, error: null })
    }),
    {
      name: "delos-jobs-matrix",
      storage: createJSONStorage(() => localStorage), // Persistência no Navegador
    }
  )
);