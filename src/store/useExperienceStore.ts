import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { experienceService } from '@/services/experienceService';
import { toast } from '@/components/Notification';

// 1. Interfaces Refinadas
interface Experience {
    id: string;
    cargo: string;
    empresa: string;
    data_entrada: string;
    data_saida?: string | null;
    atualmente_trabalhando: boolean;
    descricao?: string;
}

interface ExperienceCache {
    [profileId: string]: {
        data: Experience[];
        hash: string;
        updatedAt: number;
    };
}

interface ExperienceState {
    experiences: Experience[];
    total: number;
    loading: boolean;
    error: string | null;
    cache: ExperienceCache; // Adicionado à interface para o TS reconhecer o get()

    // Actions
    fetchExperiences: (profileId: string, force?: boolean) => Promise<void>;
    addExperience: (data: any) => Promise<void>;
    updateExperience: (id: string, data: any) => Promise<void>;
    deleteExperience: (id: string) => Promise<void>;
    clearExperienceCache: () => void;
}

const CACHE_THRESHOLD = 1000 * 60 * 10; // 10 minutos

export const useExperienceStore = create<ExperienceState>()(
    persist(
        (set, get) => ({
            experiences: [],
            total: 0,
            cache: {},
            loading: false,
            error: null,

            fetchExperiences: async (profileId: string, forceRefresh = false) => {
                const { cache } = get();
                const cachedEntry = cache[profileId];
                const now = Date.now();

                // Lógica de Cache Local (Pessimista)
                if (!forceRefresh && cachedEntry && (now - cachedEntry.updatedAt < CACHE_THRESHOLD)) {
                    set({ experiences: cachedEntry.data, total: cachedEntry.data.length, loading: false });
                    return;
                }

                set({ loading: true, error: null });

                try {
                    // Passamos o hash para o ETag via options (If-None-Match)
                    const response = await experienceService.listByProfile(
                        profileId, 
                        1, 50, forceRefresh
                    );

                    // Extração robusta de dados
                    const newExperiences = response.items || response.experiences || (Array.isArray(response) ? response : []);
                    const newHash = response.data_hash || response.etag || "";

                    set((state) => ({
                        experiences: newExperiences,
                        total: response.total || newExperiences.length,
                        loading: false,
                        cache: {
                            ...state.cache,
                            [profileId]: {
                                data: newExperiences,
                                hash: newHash,
                                updatedAt: now,
                            },
                        },
                    }));
                } catch (err: any) {
                    // Tratamento de 304 (Not Modified) vindo do terminal
                    if (err.status === 304 && cachedEntry) {
                        set({ experiences: cachedEntry.data, loading: false });
                    } else {
                        set({ error: "DNA_SYNC_FAILURE", loading: false });
                    }
                }
            },

            addExperience: async (data) => {
                set({ loading: true });
                try {
                    const newExp = await experienceService.create(data);
                    set((state) => ({
                        experiences: [newExp, ...state.experiences],
                        total: state.total + 1,
                        loading: false,
                        // Resetamos o cache do profile para forçar sync na próxima navegação
                        cache: {} 
                    }));
                } catch (err) {
                    set({ loading: false });
                    throw err;
                }
            },

            updateExperience: async (id, data) => {
                set({ loading: true });
                try {
                    const updated = await experienceService.update(id, data);
                    set((state) => ({
                        experiences: state.experiences.map(e => e.id === id ? updated : e),
                        loading: false,
                        cache: {}
                    }));
                } catch (err) {
                    set({ loading: false });
                    throw err;
                }
            },

            deleteExperience: async (id) => {
                try {
                    await experienceService.delete(id);
                    set((state) => ({
                        experiences: state.experiences.filter(e => e.id !== id),
                        total: Math.max(0, state.total - 1),
                        cache: {}
                    }));
                } catch (err) {
                    toast.error("PURGE_FAILURE");
                }
            },

            clearExperienceCache: () => set({ cache: {}, experiences: [], total: 0 }),
        }),
        {
            name: 'delos-experience-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                cache: state.cache,
                experiences: state.experiences
            }),
        }
    )
);