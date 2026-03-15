import { useRoleStore } from "@/store/useRoleStore";
import { api } from "@/lib/api";

export const syncRolesData = async () => {
  const { lastHash, lastUpdated, setInitialRoles, applyDelta, setLoading } = useRoleStore.getState();
  
  const TEN_DAYS_IN_MS = 10 * 24 * 60 * 60 * 1000;
  const isCacheExpired = Date.now() - lastUpdated > TEN_DAYS_IN_MS;

  // Se o cache expirou ou não temos hash, resetamos para carga total
  const effectiveHash = isCacheExpired ? "0" : lastHash;

  try {
    setLoading(true);
    const response = await api(`/roles/sync/?last_hash=${effectiveHash}`);

    if (response.no_changes) return; // Cache ainda é válido no servidor

    if (response.type === 'FULL_LOAD') {
      setInitialRoles(response.roles, response.new_hash);
    } else if (response.type === 'DELTA') {
      applyDelta(response.patches, response.new_hash);
    }
  } catch (err) {
    console.error("Delta_Sync_Error: Falha na matriz de cargos", err);
  } finally {
    setLoading(false);
  }
};