import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { experienceService } from '@/services/experienceService';
import { toast } from '@/components/Notification';
import { ExperienceState } from '@/interfaces/isExperiences';


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
                const CACHE_THRESHOLD = 90 * 1000; // 90 segundos para considerar estável

                // 1. Lógica de Cache Local (Pessimista/Instantânea)
                if (!forceRefresh && cachedEntry && (now - cachedEntry.updatedAt < CACHE_THRESHOLD)) {
                    console.log("[DELTA_SYSTEM] Memória estável. Pulando rede.");
                    set({
                        experiences: cachedEntry.data,
                        total: cachedEntry.total || cachedEntry.data.length,
                        loading: false
                    });
                    return;
                }

                set({ loading: true, error: null });

                try {
                    // 2. Chamada ao serviço passando o hash anterior para o If-None-Match
                    const response = await experienceService.listByProfile(
                        profileId,
                        1, 50,
                        cachedEntry?.hash || null // Passa o hash se existir
                    );

                    // 3. MAPEAMENTO CRÍTICO (De acordo com o seu JSON)
                    // O backend manda 'items', não 'experiences'
                    const newExperiences = response.items || [];
                    const newHash = response.data_hash || response.etag || "";
                    const totalCount = response.total || newExperiences.length;

                    set((state) => ({
                        experiences: newExperiences,
                        total: totalCount,
                        loading: false,
                        cache: {
                            ...state.cache,
                            [profileId]: {
                                data: newExperiences,
                                hash: newHash,
                                total: totalCount, // Salva o total no cache também
                                updatedAt: now,
                            },
                        },
                    }));

                    console.log("[DELTA_SYNC] Dataframe de experiências atualizado.");

                } catch (err: any) {
                    // 4. Tratamento de 304 (Not Modified)
                    // Se o servidor retornar 304, mantemos o que já temos e renovamos o timestamp
                    if (err.status === 304 && cachedEntry) {
                        console.log("[DELTA_STABLE] 304 Detectado. Mantendo cache.");
                        set((state) => ({
                            experiences: cachedEntry.data,
                            loading: false,
                            cache: {
                                ...state.cache,
                                [profileId]: { ...cachedEntry, updatedAt: now }
                            }
                        }));
                    } else {
                        console.error("ERRO_DNA_SYNC:", err);
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