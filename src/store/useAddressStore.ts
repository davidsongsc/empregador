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
    set({ loading: true });

    // 1. Tenta carregar o Hash e os dados do cache local (IndexedDB)
    const cachedHash = await idbGet(`addr_hash_${usuarioId}`);
    const cachedData = await idbGet(`addr_data_${usuarioId}`) as Address[];

    try {
      // 2. Chama a API passando o If-None-Match (Hash)
      const res: PaginatedAddressResponse = await getUserAddresses(usuarioId, page, cachedHash);

      // 3. Lógica de Delta Patching (Se enderecos vier null, o cache ainda é válido)
      if (res.enderecos === null && cachedData) {
        console.log("🚀 Cache Hit: Usando dados do IndexedDB (Hash idêntico)");
        set({ 
          addresses: cachedData, 
          total: res.total, 
          lastHash: cachedHash, 
          loading: false 
        });
        return;
      }

      // 4. Se os dados mudaram (ou não tinha cache)
      if (res.enderecos) {
        console.log("📡 Cache Miss: Atualizando IndexedDB com novos dados");
        
        // Salva no IndexedDB para a próxima vez
        await idbSet(`addr_hash_${usuarioId}`, res.data_hash);
        await idbSet(`addr_data_${usuarioId}`, res.enderecos);

        set({ 
          addresses: res.enderecos, 
          total: res.total, 
          lastHash: res.data_hash, 
          loading: false 
        });
      }
    } catch (error) {
      console.error("Erro ao sincronizar endereços:", error);
      set({ loading: false });
    }
  },

  addAddressLocal: (newAddress) => {
    set((state) => ({ addresses: [...state.addresses, newAddress] }));
  },

  clearCache: async () => {
    // Útil para Logout ou trocar de usuário
    set({ addresses: [], lastHash: null });
  }
}));