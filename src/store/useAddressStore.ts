import { create } from 'zustand';
import { createAddress, getUserAddresses, updateAddress } from '@/services/addressService';
import { get as idbGet, set as idbSet } from 'idb-keyval';
import { toast } from '@/components/Notification';
import { Address, PaginatedAddressResponse } from '@/interfaces/iAddress';
import { AddressState } from '@/interfaces/isAddressState';

export const useAddressStore = create<AddressState>((set, get) => ({
  addresses: [],
  total: 0,
  lastHash: null,
  loading: false,

  fetchAddresses: async (usuarioId, page = 1) => {
    if (!usuarioId) {
      return;
    }

    if (get().addresses.length === 0) {
      const cachedData = await idbGet(`addr_data_${usuarioId}`) as Address[];
      const cachedHash = await idbGet(`addr_hash_${usuarioId}`);
      if (cachedData) {
        set({ addresses: cachedData, lastHash: cachedHash });
      }
    }

    if (get().loading) return;
    set({ loading: true });

    try {
      const cachedHash = get().lastHash ?? undefined;
      const res: PaginatedAddressResponse = await getUserAddresses(usuarioId, page, cachedHash);


      if (!res.enderecos) {

        set({ loading: false });
        return;
      }

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
      set({ loading: false });
    }
  },
  addAddress: async (newAddressData: Address) => {
    set({ loading: true });
    try {
      const created = await createAddress(newAddressData);

      const updatedList = [...get().addresses, created];

      set({
        addresses: updatedList,
        total: get().total + 1,
        loading: false
      });

      // Sincroniza Cache Local
      await idbSet(`addr_data_${created.usuario_id}`, updatedList);
      return created;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  // MÉTODO: EDITAR (PATCH)
  editAddress: async (id: string, updateData: Partial<Address>) => {
    set({ loading: true });
    try {
      const updated = await updateAddress(id, updateData);

      const updatedList = get().addresses.map(addr =>
        addr.id === id ? { ...addr, ...updated } : addr
      );

      set({
        addresses: updatedList,
        loading: false
      });

      // Sincroniza Cache Local
      if (updatedList.length > 0) {
        await idbSet(`addr_data_${updatedList[0].usuario_id}`, updatedList);
      }

      return updated;
    } catch (error) {
      set({ loading: false });
      throw error;
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