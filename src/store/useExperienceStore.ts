import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getProfileExperiences } from '@/services/profileExperienceService';

interface Experience {
    id: string;
    cargo: string;
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
    cache: ExperienceCache;
    loading: boolean;
    error: string | null;

    // Actions
    fetchExperiences: (profileId: string, forceRefresh?: boolean) => Promise<void>;
    clearExperienceCache: () => void;
}

const CACHE_THRESHOLD = 1000 * 60 * 10; // 10 minutos de validade

export const useExperienceStore = create<ExperienceState>()(
    persist(
        (set, get) => ({
            experiences: [],
            cache: {},
            loading: false,
            error: null,

            fetchExperiences: async (profileId: string, forceRefresh = false) => {
                const { cache } = get();
                const cachedEntry = cache[profileId];
                const now = Date.now();

                if (!forceRefresh && cachedEntry && (now - cachedEntry.updatedAt < CACHE_THRESHOLD)) {
                    set({ experiences: cachedEntry.data, loading: false });
                    return;
                }

                set({ loading: true, error: null });

                try {
                    const options = {
                        headers: (!forceRefresh && cachedEntry?.hash) ? { "If-None-Match": cachedEntry.hash } : {},
                    };

                    const response = await getProfileExperiences(profileId, options);

                    // 1. Verificação de Cache do Servidor (304)
                    if (response === null || (response as any).status === 304) {
                        set({
                            experiences: cachedEntry ? cachedEntry.data : [],
                            loading: false
                        });
                        return;
                    }

                    /**
                     * 2. Lógica de Extração de Dados:
                     * Agora priorizamos 'items' (Paginação), depois 'experiences' (Legacy), 
                     * e por fim checamos se é um array direto.
                     */
                    const newExperiences = response.items || response.experiences || (Array.isArray(response) ? response : []);

                    // 3. Extração do Hash
                    const newHash = response.data_hash || response.etag || "";

                    set((state) => ({
                        experiences: newExperiences,
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
                    if (err.status === 304 && cachedEntry) {
                        set({ experiences: cachedEntry.data, loading: false });
                    } else {
                        set({
                            error: err.message || "DNA_SYNC_FAILURE",
                            loading: false
                        });
                    }
                }
            },

            clearExperienceCache: () => set({ cache: {}, experiences: [] }),
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