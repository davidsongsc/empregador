import { create } from 'zustand';
import { educationService} from '@/services/educationService';
import { get as idbGet, set as idbSet, del as idbDel } from 'idb-keyval';
import { toast } from '@/components/Notification';
import { EducationState } from '@/interfaces/isEducationState';
import { Education } from '@/interfaces/iEducation';

// Chaves únicas para o IndexedDB baseadas no contexto acadêmico
const IDB_DATA_KEY = 'delos_edu_data';
const IDB_HASH_KEY = 'delos_edu_hash';

export const useEducationStore = create<EducationState>((set, get) => ({
  educations: [],
  totalCount: 0,
  dataHash: null,
  loading: false,

  fetchEducations: async (force = false) => {
    const { educations, loading } = get();

    // 1. REIDRATAÇÃO FLASH (IndexedDB)
    // Se a RAM estiver vazia, carrega do disco instantaneamente
    if (educations.length === 0) {
      const [cachedData, cachedHash] = await Promise.all([
        idbGet(IDB_DATA_KEY),
        idbGet(IDB_HASH_KEY)
      ]);

      if (cachedData) {
        set({ 
          educations: cachedData as Education[], 
          dataHash: cachedHash as string,
          totalCount: (cachedData as Education[]).length 
        });
        if (!force) return; // Se o cache existe e não é force, evita o request
      }
    }

    if (loading) return;
    set({ loading: true });

    try {
      const currentHash = force ? undefined : get().dataHash;
      
      // 2. Chamada ao Service com suporte a 304 (Not Modified)
      const response = await educationService.list(1, 50, currentHash || undefined);

      // 3. CENÁRIO 304: Cache Validado pelo Terminal
      if (!response) {
        console.log("💾 Academic_Logs: Cache local validado via ETag.");
        set({ loading: false });
        return;
      }

      // 4. CENÁRIO UPDATE: Novos dados ou Hash expirado
      const newEducations = response.results || [];
      const newHash = response.data_hash;

      // Persistência em disco (Background)
      await Promise.all([
        idbSet(IDB_DATA_KEY, newEducations),
        idbSet(IDB_HASH_KEY, newHash)
      ]);

      set({ 
        educations: newEducations,
        totalCount: response.total_count,
        dataHash: newHash,
        loading: false 
      });

    } catch (error: any) {
      set({ loading: false });
      if (error.status !== 304) {
        toast.error("Erro ao sincronizar histórico acadêmico.");
      }
    }
  },

  addEducation: async (data) => {
    set({ loading: true });
    try {
      const newEdu = await educationService.create(data);
      
      // Atualização Otimista no Store e Disco
      const updated = [newEdu, ...get().educations];
      set({ 
        educations: updated, 
        totalCount: get().totalCount + 1,
        dataHash: null, // Invalida o hash para forçar sync real no próximo fetch
        loading: false 
      });

      await idbSet(IDB_DATA_KEY, updated);
      await idbDel(IDB_HASH_KEY);
      
      toast.success("Formação injetada no DNA_Career.");
    } catch (error) {
      set({ loading: false });
      toast.error("Falha ao registrar formação.");
    }
  },

  updateEducation: async (id, data) => {
    set({ loading: true });
    try {
      const updatedObj = await educationService.update(id, data);
      
      const updatedList = get().educations.map(e => e.id === id ? updatedObj : e);
      set({ educations: updatedList, loading: false, dataHash: null });

      await idbSet(IDB_DATA_KEY, updatedList);
      await idbDel(IDB_HASH_KEY);
      
      toast.success("Registro acadêmico atualizado.");
    } catch (error) {
      set({ loading: false });
      toast.error("Erro na atualização do registro.");
    }
  },

  deleteEducation: async (id) => {
    try {
      await educationService.delete(id);
      
      const updatedList = get().educations.filter(e => e.id !== id);
      set({ 
        educations: updatedList, 
        totalCount: Math.max(0, get().totalCount - 1),
        dataHash: null 
      });

      await idbSet(IDB_DATA_KEY, updatedList);
      await idbDel(IDB_HASH_KEY);
      
      toast.success("Registro removido permanentemente.");
    } catch (error) {
      toast.error("Falha ao remover registro.");
    }
  },

  clearEducationCache: async () => {
    await Promise.all([idbDel(IDB_DATA_KEY), idbDel(IDB_HASH_KEY)]);
    set({ educations: [], totalCount: 0, dataHash: null });
  }
}));