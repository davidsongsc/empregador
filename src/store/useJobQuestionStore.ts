import { create } from 'zustand';
import { getJobQuestions } from '@/services/jobService';
import { JobQuestionState, QuestionCacheEntry } from '@/interfaces/isJobQuestionState';

export const useJobQuestionStore = create<JobQuestionState>((set, get) => ({
  questions: [],
  loadingQuestions: false,
  questionCache: {},

  fetchQuestions: async (jobId: string, force = false) => {
    if (!jobId) return;

    const cleanId = jobId.replace(/["'“”]/g, '').trim();
    const cached = get().questionCache[cleanId];
    const CACHE_EXPIRATION = 10 * 60 * 1000; // 10 minutos
    const now = Date.now();

    // 1. Verificação de Cache Local (Client-side)
    if (!force && cached && (now - cached.updatedAt < CACHE_EXPIRATION)) {
      set({ questions: cached.items });
      return;
    }

    // 2. Início do Fetch
    set({ loadingQuestions: true });

    try {
      // Passamos o hash atual para o server validar se algo mudou (Opcional se o server aceitar If-None-Match)
      const options = {
        pagina: 1,
        tamanho: 50,
        headers: { "If-None-Match": cached?.hash || "" }
      };

      const response = await getJobQuestions(cleanId, options);

      // 3. Validação de Hash/Etag
      // Se a API retornar 304 ou se o hash for idêntico ao do cache
      if (response.data_hash === cached?.hash && !force) {
        set({
          questions: cached.items,
          loadingQuestions: false,
          questionCache: {
            ...get().questionCache,
            [cleanId]: { ...cached, updatedAt: now }
          }
        });
        return;
      }

      // 4. Update com novos dados
      if (response && Array.isArray(response.items)) {
        const newEntry: QuestionCacheEntry = {
          items: response.items,
          hash: response.data_hash || "no-hash",
          updatedAt: now
        };

        set((state) => ({
          questions: response.items,
          loadingQuestions: false,
          questionCache: {
            ...state.questionCache,
            [cleanId]: newEntry
          }
        }));
      }
    } catch (error: any) {
      // Se cair no Catch mas for um 304 (Not Modified)
      if (error.status === 304 && cached) {
        set({ questions: cached.items, loadingQuestions: false });
      } else {
        console.error("Erro ao sincronizar questões:", error);
        set({ questions: [], loadingQuestions: false });
      }
    }
  },

  clearQuestionCache: (jobId?: string) => {
    if (jobId) {
      const newCache = { ...get().questionCache };
      delete newCache[jobId];
      set({ questionCache: newCache });
    } else {
      set({ questionCache: {} });
    }
  }
}));