import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getAllJobs, getJobFeed, getJobCategories, getMyJobs, getJobById } from "@/services/jobService";

// --- INTERFACES ---

interface JobResult {
  uid: string;
  cargo_exibicao: string;
  empresa_nome: string;
  tipo_vaga: string;
  salario?: string;
  local?: string;
  category?: string;
  [key: string]: any;
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

interface Category {
  name: string;
  total_vagas: number;
}

interface JobState {
  cache: Record<string, JobCacheEntry>;
  globalTotal: number;
  loading: boolean;
  error: string | null;
  currentRequest: string | null;

  // Discovery & Stats
  categories: Category[];
  categoriesLoading: boolean;
  categoriesUpdatedAt: number;
  total_vagas: number;
  total_vagas_freela: number;
  total_vagas_efetivo: number;

  // ACTIONS
  fetchJobsDelta: (companyId: string) => Promise<void>;
  fetchJobs: (params: any, user: any, isSilent?: boolean) => Promise<void>;
  fetchCategories: (page?: number, force?: boolean) => Promise<void>;
  applyDeltaPatches: (patches: JobPatch[]) => void;
  fetchJobById: (uid: string, companyId: string) => Promise<JobResult>;
  clearCache: () => void;
}

// --- STORE CORE ---

export const useJobStore = create<JobState>()(
  persist(
    (set, get) => ({
      cache: {},
      globalTotal: 0,
      loading: false,
      error: null,
      currentRequest: null,
      categories: [],
      categoriesLoading: false,
      categoriesUpdatedAt: 0,
      total_vagas: 0,
      total_vagas_freela: 0,
      total_vagas_efetivo: 0,

      /**
       * FETCH_JOBS: Agora também atualiza os metadados globais se retornados
       */
      fetchJobs: async (params, user, isSilent = false) => {
        const { page, page_size, selectedCategory, fields } = params;

        const fieldsHash = fields ? `f-${fields.join('-')}` : 'f-all';
        const cacheKey = `jobs-p${page}-s${page_size}-c${selectedCategory || "all"}-u${user?.id || "guest"}-${fieldsHash}`;

        const cachedEntry = get().cache[cacheKey];
        const now = Date.now();
        const CACHE_THRESHOLD = 60 * 1000;

        if (cachedEntry && (now - cachedEntry.updatedAt < CACHE_THRESHOLD) && !isSilent) return;
        if (get().loading && get().currentRequest === cacheKey) return;

        if (!cachedEntry && !isSilent) set({ loading: true, error: null });
        set({ currentRequest: cacheKey });

        try {
          const options = { headers: { "If-None-Match": cachedEntry?.etag || "" } };
          const response: any = user ? await getJobFeed(params, options) : await getAllJobs(params, options);

          if (response.isDelta) {
            get().applyDeltaPatches(response.patches);
            set((state) => ({
              cache: {
                ...state.cache,
                [cacheKey]: { ...state.cache[cacheKey], etag: response.newEtag, updatedAt: Date.now() }
              },
              loading: false, currentRequest: null
            }));
          }
          else if (response.results) {
            const normalized = response.results.map((item: any) => ({
              ...item,
              cargo_exibicao: item.cargo_exibicao || item.name || "Cargo Indefinido",
              empresa_nome: item.empresa_nome || "Delos_System",
            }));

            const newCacheEntry: JobCacheEntry = {
              results: normalized,
              count: response.count,
              metadata: response.metadata || { total_global: response.count },
              etag: response.etag || "initial",
              updatedAt: Date.now()
            };

            const currentCache = { ...get().cache, [cacheKey]: newCacheEntry };
            const keys = Object.keys(currentCache);
            if (keys.length > 15) {
              const oldestKey = keys.sort((a, b) => currentCache[a].updatedAt - currentCache[b].updatedAt)[0];
              delete currentCache[oldestKey];
            }

            set({
              cache: currentCache,
              globalTotal: response.count,
              // Atualizamos as estatísticas se o backend enviá-las junto com a listagem
              total_vagas: response.total_vagas ?? get().total_vagas,
              total_vagas_freela: response.total_vagas_freela ?? get().total_vagas_freela,
              total_vagas_efetivo: response.total_vagas_efetivo ?? get().total_vagas_efetivo,
              loading: false,
              currentRequest: null
            });
          }
        } catch (err: any) {
          if (err.status === 304) {
            set((state) => ({
              cache: { ...state.cache, [cacheKey]: { ...state.cache[cacheKey], updatedAt: Date.now() } },
              loading: false, currentRequest: null
            }));
          } else {
            set({ error: "FALHA_NA_SINCRONIZACAO", loading: false, currentRequest: null });
          }
        }
      },

      /**
       * FETCH_CATEGORIES: Agora extrai todos os campos da sua nova Response
       */
      fetchCategories: async (page = 1, force = false) => {
        const now = Date.now();
        const cache = get().categoriesCache || {};
        const cachedPage = cache[page];

        // --- POLÍTICA DE LIFETIME (DELTA X PROTOCOL) ---
        // Página 1: 60s | Demais páginas: 30s
        const LIFETIME = page === 1 ? 60000 : 30000;

        // Validação de Cache
        if (!force && cachedPage && (now - cachedPage.updatedAt < LIFETIME)) {
          // Sincroniza o display atual com o cache sem novo request
          set({ categories: cachedPage.results });
          return;
        }

        set({ categoriesLoading: true });

        try {
          const response = await getJobCategories(page);
          const discoveryData = response.results;
          const newResults = discoveryData.results;

          set((state) => ({
            // Atualiza o Display atual
            categories: newResults,

            // Atualiza a Matrix de Cache (Imutabilidade)
            categoriesCache: {
              ...state.categoriesCache,
              [page]: {
                results: newResults,
                updatedAt: Date.now()
              }
            },

            // Stats Globais e Contadores
            total_vagas: discoveryData.total_vagas,
            total_vagas_freela: discoveryData.total_vagas_freela,
            total_vagas_efetivo: discoveryData.total_vagas_efetivo,
            categoriesCount: response.count,

            categoriesLoading: false,
            categoriesUpdatedAt: Date.now()
          }));
        } catch (err) {
          set({ categoriesLoading: false, error: "ERRO_CATEGORIAS" });
        }
      },

      /**
       * APPLY_DELTA_PATCHES: Sincroniza Listas, Clusters e Estatísticas Globais
       */
      applyDeltaPatches: (patches) => set((state) => {
        const newCache = { ...state.cache };
        let newGlobalTotal = state.globalTotal;
        let newCategories = [...state.categories];
        let newTotalFreela = state.total_vagas_freela;
        let newTotalEfetivo = state.total_vagas_efetivo;

        Object.keys(newCache).forEach(key => {
          let results = [...newCache[key].results];
          let countAdjust = 0;
          const isFirstPage = key.includes("-p1-");

          patches.forEach(patch => {
            const patchCategory = patch.data.category || "Geral";
            const patchTipo = patch.data.tipo_vaga;

            if (patch.type === 'UPDATED') {
              results = results.map(j => j.uid === patch.uid ? { ...j, ...patch.data } : j);
            }
            else if (patch.type === 'DELETED') {
              const initialLen = results.length;
              results = results.filter(j => j.uid !== patch.uid);
              if (results.length < initialLen) {
                countAdjust--;
                newGlobalTotal--;
                // Atualiza contagem por tipo de vaga
                if (patchTipo === 'FREELANCER') newTotalFreela--;
                if (patchTipo === 'EFETIVO') newTotalEfetivo--;

                newCategories = newCategories.map(c =>
                  c.name === patchCategory ? { ...c, total_vagas: Math.max(0, c.total_vagas - 1) } : c
                );
              }
            }
            else if (patch.type === 'CREATED') {
              newGlobalTotal++;
              if (patchTipo === 'FREELANCER') newTotalFreela++;
              if (patchTipo === 'EFETIVO') newTotalEfetivo++;

              newCategories = newCategories.map(c =>
                c.name === patchCategory ? { ...c, total_vagas: c.total_vagas + 1 } : c
              );

              if (isFirstPage && !results.find(j => j.uid === patch.uid)) {
                results = [patch.data as JobResult, ...results];
                if (results.length > 20) results.pop();
                countAdjust++;
              }
            }
          });

          newCache[key] = { ...newCache[key], results, count: newCache[key].count + countAdjust };
        });

        return {
          cache: newCache,
          globalTotal: newGlobalTotal,
          categories: newCategories,
          total_vagas: newGlobalTotal,
          total_vagas_freela: newTotalFreela,
          total_vagas_efetivo: newTotalEfetivo
        };
      }),
      fetchJobById: async (uid: string, companyId: string) => {
        set({ loading: true });
        try {
          const fullJob = await getJobById(uid, companyId);

          set((state) => {
            const newCache = { ...state.cache };

            // Itera por todas as entradas do cache (p1, p2, delta-cache) 
            // e atualiza o objeto onde ele for encontrado.
            Object.keys(newCache).forEach((key) => {
              newCache[key].results = newCache[key].results.map((job) =>
                job.uid === uid ? { ...job, ...fullJob } : job
              );
            });

            return {
              cache: newCache,
              loading: false,
            };
          });

          return fullJob;
        } catch (err) {
          set({ loading: false, error: "FALHA_AO_OBTER_DETALHE" });
          throw err;
        }
      },
      fetchJobsDelta: async (companyId) => {
        const cacheKey = `jobs-delta-${companyId}`;

        // Evita requests duplicados
        if (get().loading && get().currentRequest === cacheKey) return;

        set({ loading: true, currentRequest: cacheKey });

        try {
          // Chamada ao service usando a interface correta
          const response = await getMyJobs({
            company: companyId,
            // Passamos fields explicitamente para garantir que o TS veja os campos
            fields: ['uid', 'tipo', 'candidatos_count', 'cargo_exibicao', 'is_active']
          });

          set((state) => {
            // Normalização para garantir que nenhum campo obrigatório falte
            const normalizedResults: JobResult[] = response.results.map((item: any) => ({
              uid: item.uid,
              cargo_exibicao: item.cargo_exibicao || "Cargo Indefinido",
              empresa_nome: item.empresa_nome || "Empresa",
              // Sincronize o nome do campo com o que o Serializer envia (tipo)
              tipo_vaga: item.tipo || item.tipo_vaga || "Não Especificado",
              candidatos_count: item.candidatos_count || 0,
              is_active: item.is_active ?? false, // ADICIONE ISSO
              updatedAt: Date.now()
            }));

            const newEntry: JobCacheEntry = {
              results: normalizedResults,
              count: response.count,
              updatedAt: Date.now(),
              etag: response.etag || "delta-initial",
              metadata: { isDelta: true }
            };

            return {
              cache: {
                ...state.cache,
                [cacheKey]: newEntry
              },
              globalTotal: response.count,
              loading: false,
              currentRequest: null
            };
          });
        } catch (err) {
          set({ loading: false, currentRequest: null, error: "FALHA_DELTA" });
        }
      },
      clearCache: () => set({
        cache: {},
        globalTotal: 0,
        categories: [],
        total_vagas: 0,
        total_vagas_freela: 0,
        total_vagas_efetivo: 0,
        error: null
      })
    }),
    {
      name: "delos-jobs-matrix",
      storage: createJSONStorage(() => localStorage),
    }
  )
);