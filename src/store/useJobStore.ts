import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getAllJobs, getJobFeed, getJobCategories, getMyJobs, getJobById } from "@/services/jobService";
import { JobState } from "@/interfaces/isJobState";
import { JobResult } from "@/interfaces/jobResult";
import { JobCacheEntry } from "@/interfaces/iJob";

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
      total_vagas_prestador: 0,
      categoriesCache: {},           // Faltava este
      categoriesCount: 0,            // Provavelmente faltava este também
      totalPages: 0,                 // E este
      currentPage: 1,                // E este
      categoriesHash: null,          // E este
      /**
       * FETCH_JOBS: Agora também atualiza os metadados globais se retornados
       */
      fetchJobs: async (params, user, selectedCategory, isSilent = false) => {
        const { page, page_size, fields } = params;

        // 1. Definição de Chave de Cache e Verificações Iniciais
        const fieldsHash = fields ? `f-${fields.join('-')}` : 'f-all';
        const cacheKey = `jobs-p${page}-s${page_size}-c${selectedCategory || "all"}-u${user?.id || "guest"}-${fieldsHash}`;

        const cachedEntry = get().cache[cacheKey];
        const now = Date.now();
        const CACHE_THRESHOLD = 60 * 1000; // 1 minuto

        if (cachedEntry && (now - cachedEntry.updatedAt < CACHE_THRESHOLD) && !isSilent) return;
        if (get().loading && get().currentRequest === cacheKey) return;

        // 2. Início do Loading
        if (!cachedEntry && !isSilent) set({ loading: true, error: null });
        set({ currentRequest: cacheKey });

        try {
          const options = { headers: { "If-None-Match": cachedEntry?.etag || "" } };
          const params2 = `${selectedCategory}?page=${page}&limit=${page_size}`;

          // Chamada da API
          const response: any = user ? await getJobFeed(params2, options) : await getAllJobs(params2, options);
          console.log('API Response:', response);

          // 3. Tratamento de Delta Patches (Otimização de banda)
          if (response.isDelta) {
            get().applyDeltaPatches(response.patches);
            set((state) => ({
              cache: {
                ...state.cache,
                [cacheKey]: { ...state.cache[cacheKey], etag: response.newEtag, updatedAt: Date.now() }
              },
              loading: false,
              currentRequest: null
            }));
          }
          // 4. Tratamento de Resposta Completa (Mesmo se results for [])
          else if (response && Array.isArray(response.results)) {
            const normalized = response.results.map((item: any) => ({
              ...item,
              cargo_exibicao: item.cargo_exibicao || item.name || "Cargo Indefinido",
              empresa_nome: item.empresa_nome || "Delos_System",
            }));

            // Captura o total_count da sua API (evita undefined)
            const totalFromApi = response.total_count ?? response.count ?? 0;

            const newCacheEntry = {
              results: normalized,
              count: totalFromApi,
              metadata: response.metadata || { total_global: totalFromApi },
              etag: response.etag || "initial",
              updatedAt: Date.now()
            };

            const currentCache = { ...get().cache, [cacheKey]: newCacheEntry };

            // Lógica de Expurgo de Cache (Limite de 15 entradas)
            const keys = Object.keys(currentCache);
            if (keys.length > 15) {
              const oldestKey = keys.sort((a, b) => currentCache[a].updatedAt - currentCache[b].updatedAt)[0];
              delete currentCache[oldestKey];
            }

            set({
              cache: currentCache,
              globalTotal: totalFromApi,
              // Atualiza contadores específicos se existirem, senão mantém o estado atual
              total_vagas: response.total_count ?? get().total_vagas,
              total_vagas_freela: response.total_vagas_freela ?? get().total_vagas_freela,
              total_vagas_efetivo: response.total_vagas_efetivo ?? get().total_vagas_efetivo,
              loading: false,
              currentRequest: null,
              error: null // Limpa erros se a requisição deu certo
            });
          } else {
            // Caso a resposta não tenha o formato esperado
            set({ loading: false, currentRequest: null });
          }

        } catch (err: any) {
          // 5. Tratamento de Cache Não Modificado (304) ou Erros
          if (err.status === 304) {
            set((state) => ({
              cache: {
                ...state.cache,
                [cacheKey]: { ...state.cache[cacheKey], updatedAt: Date.now() }
              },
              loading: false,
              currentRequest: null
            }));
          } else {
            console.error("Erro ao buscar vagas:", err);
            set({
              error: "FALHA_NA_SINCRONIZACAO",
              loading: false,
              currentRequest: null
            });
          }
        }
      },
      removeJobFromCache: (jobId: string) => {
        set((state) => {
          const newCache = { ...state.cache };

          // Varre todas as entradas de cache (paginação, categorias, etc)
          Object.keys(newCache).forEach((key) => {
            newCache[key] = {
              ...newCache[key],
              results: newCache[key].results.filter((j: any) => j.id !== jobId),
              count: newCache[key].count - 1 // Opcional: ajusta o contador visual
            };
          });

          return {
            cache: newCache,
            // Se você tiver um contador global fora do cache, diminua aqui também
            total_vagas: state.total_vagas - 1
          };
        });
      },
      /**
       * FETCH_CATEGORIES: Agora extrai todos os campos da sua nova Response
       */
      fetchCategories: async (page = 1, force = false) => {
        const now = Date.now();
        const cache = get().categoriesCache || {};
        const cachedPage = cache[page];

        // --- POLÍTICA DE LIFETIME ---
        const LIFETIME = page === 1 ? 60000 : 30000;

        // Validação de Cache
        if (!force && cachedPage && (now - cachedPage.updatedAt < LIFETIME)) {
          set({ categories: cachedPage.results });
          return;
        }

        set({ categoriesLoading: true });

        try {
          // Chamada para a API (certifique-se de passar a página)
          const response = await getJobCategories(page);

          // Agora mapeamos direto do topo da resposta
          const {
            items,
            total_vagas_geral,
            total_vagas_efetivo,
            total_vagas_freela,
            total_vagas_prestador,
            total_count,
            total_pages,
            data_hash
          } = response;

          set((state) => ({
            // 1. Atualiza a lista principal (Display)
            categories: items,

            // 2. Atualiza a Matrix de Cache por página
            categoriesCache: {
              ...state.categoriesCache,
              [page]: {
                results: items,
                updatedAt: Date.now()
              }
            },

            // 3. Stats Globais vindos do cabeçalho da API
            total_vagas: total_vagas_geral,
            total_vagas_efetivo: total_vagas_efetivo,
            total_vagas_freela: total_vagas_freela,
            total_vagas_prestador: total_vagas_prestador,

            // 4. Contadores de Paginação
            categoriesCount: total_count,
            totalPages: total_pages,
            currentPage: page,
            categoriesHash: data_hash,

            categoriesLoading: false,
            categoriesUpdatedAt: Date.now()
          }));
        } catch (err) {
          console.error("Erro ao buscar categorias:", err);
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
            const patchCategory = patch.data.categoria_nome || "Geral";
            const patchTipo = patch.data.tipo_vaga || "FREELANCER";

            if (patch.type === 'UPDATED') {
              results = results.map(j => j.id === patch.uid ? { ...j, ...patch.data } : j);
            }
            else if (patch.type === 'DELETED') {
              const initialLen = results.length;
              results = results.filter(j => j.id !== patch.uid);
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

              if (isFirstPage && !results.find(j => j.id === patch.uid)) {
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
      fetchJobById: async (uid: string, companyId: string): Promise<JobResult> => {
        set({ loading: true });

        try {
          // 1. Fazemos o cast 'as JobResult' para garantir que os dados da API 
          // se alinhem ao contrato da Store (resolvendo o erro de tipo_vaga missing)
          const fullJob = await getJobById(uid, companyId) as JobResult;

          set((state) => {
            // 2. Clonagem profunda do cache para manter a imutabilidade
            const newCache = { ...state.cache };

            // 3. Atualização do cache em todas as chaves (paginação/deltas)
            Object.keys(newCache).forEach((key) => {
              if (newCache[key]?.results) {
                newCache[key].results = newCache[key].results.map((job) =>
                  // Fazemos o merge: mantemos o que já existia no cache (ex: tipo_vaga)
                  // e sobrescrevemos com os detalhes novos vindos da API
                  job.id === uid ? { ...job, ...fullJob } : job
                );
              }
            });

            return {
              cache: newCache,
              loading: false,
            };
          });

          // 4. Retorna o objeto já tipado corretamente
          return fullJob;

        } catch (err) {
          set({ loading: false, error: "FALHA_AO_OBTER_DETALHE" });
          console.error("Erro ao buscar detalhe do job:", err);
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