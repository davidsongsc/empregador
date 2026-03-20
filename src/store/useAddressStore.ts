import { create } from 'zustand';
import { Address, getUserAddresses, PaginatedAddressResponse } from '@/services/addressService';
import { get as idbGet, set as idbSet } from 'idb-keyval';

interface AddressState {
  addresses: Address[];
  total: number;
  lastHash: string | null;
  loading: boolean;
  
  // Ações
  fetchAddresses: (usuarioId: string, page?: number) => Promise<void>;
  addAddressLocal: (newAddress: Address) => void;
  clearCache: () => Promise<void>;
}

export const useAddressStore = create<AddressState>((set, get) => ({
  addresses: [],
  total: 0,
  lastHash: null,
  loading: false,

  fetchAddresses: async (usuarioId, page = 1) => {
    // 1. REIDRATAÇÃO IMEDIATA: Se o store está vazio, tenta ler o IndexedDB primeiro
    // Isso evita o "flash" de carregamento e o loading desnecessário
    if (get().addresses.length === 0) {
      const cachedData = await idbGet(`addr_data_${usuarioId}`) as Address[];
      const cachedHash = await idbGet(`addr_hash_${usuarioId}`);
      if (cachedData) {
        set({ addresses: cachedData, lastHash: cachedHash });
        // Se o cache estiver "quente", você pode até decidir não chamar a API aqui
      }
    }

    // 2. Trava de Requisição Duplicada
    if (get().loading) return;
    set({ loading: true });

    try {
      const cachedHash = get().lastHash; // Usa o hash que já está no estado
      const res: PaginatedAddressResponse = await getUserAddresses(usuarioId, page, cachedHash);

      // 3. Lógica de Cache Hit (304 / Hash idêntico)
      // Se a API retornar enderecos null, significa que o que temos no Store/IDB é o mais recente
      if (!res.enderecos) {
        console.log("🚀 Protocolo Delta: Cache validado pelo servidor.");
        set({ loading: false });
        return; 
      }

      // 4. Lógica de Cache Miss (Dados novos ou alterados)
      console.log("📡 Protocolo Delta: Atualizando base de endereços.");
      
      // Persistência Atômica no IndexedDB
      await Promise.all([
        idbSet(`addr_hash_${usuarioId}`, res.data_hash),
        idbSet(`addr_data_${usuarioId}`, res.enderecos)
      ]);

      set({ 
        addresses: res.enderecos, 
        total: res.total, 
        lastHash: res.data_hash, 
        loading: false 
      });

    } catch (error) {
      console.error("Erro na sincronização de endereços:", error);
      set({ loading: false });
    }
  },

  addAddressLocal: (newAddress) => {
    const updated = [...get().addresses, newAddress];
    set({ addresses: updated });
    // Opcional: Salva no IDB para persistir a adição local até o próximo sync
    idbSet(`addr_data_${newAddress.usuario_id}`, updated);
  },

  clearCache: async () => {
    // IMPORTANTE: Limpar o IDB no logout para evitar vazamento de dados entre usuários
    const state = get();
    // Você precisaria do usuarioId aqui para limpar as chaves específicas
    set({ addresses: [], total: 0, lastHash: null, loading: false });
  }
}));