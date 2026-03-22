import { useRoleStore } from "@/store/useRoleStore";
import { api } from "@/lib/api";

export const syncRolesData = async () => {
  // Pegamos as funções e o estado atual
  const state = useRoleStore.getState();

  // Se estiver carregando, evita chamadas duplicadas
  if (state.loading) return;

  const isExpired = state.isCacheStale();
  const effectiveHash = isExpired ? "0" : state.lastHash;

  try {
    state.setLoading(true);

    // Chamada à API enviando o hash atual do LocalStorage
    const response = await api(`/roles/sync/?last_hash=${effectiveHash}`);

    // 1. Sem mudanças (304 Not Modified manual)
    if (response.no_changes || response.status === 304) return;

    // 2. Carga Total (Hash "0" ou Cache expirado no server)
    if (response.type === 'FULL_LOAD') {
      state.setInitialRoles(response.roles, response.new_hash);
    }

    // 3. Carga Incremental (Apenas o que mudou)
    else if (response.type === 'DELTA') {
      state.applyDelta(response.patches, response.new_hash);
    }

  } catch (err) {
    console.error("Delta_Sync_Error:", err);
  } finally {
    state.setLoading(false);
  }
};