import { useEffect, useMemo } from "react";
import { useAdminSubscriptionStore } from "@/store/useAdminSubscriptionStore";

export function useAdminSubscriptions() {
  const { subscriptions, loading, fetchSubscriptions, lastUpdate } = useAdminSubscriptionStore();

  useEffect(() => {
    // Busca inicial de dados
    fetchSubscriptions();
  }, [fetchSubscriptions]); // Adicionado fetchSubscriptions como dependência estável

  const stats = useMemo(() => {
    // 1. Garantia de Array: Evita falha se subscriptions for null/undefined
    const safeSubs = Array.isArray(subscriptions) ? subscriptions : [];

    // 2. Optional Chaining (s?.is_valid): Evita erro se um item da lista estiver malformado
    const active = safeSubs.filter(s => s?.is_valid).length;
    
    // 3. Verificação de Inverso: s && !s.is_valid garante que o objeto existe antes da negação
    const expired = safeSubs.filter(s => s && !s.is_valid).length;
    
    // 4. Nullish Coalescing (?? 0): Garante um número para comparação lógica
    const critical = safeSubs.filter(s => 
      s?.is_valid && (s?.days_until_expiration ?? 99) <= 7
    ).length;

    return { 
      active, 
      expired, 
      critical, 
      total: safeSubs.length 
    };
  }, [subscriptions]);

  return {
    subscriptions: Array.isArray(subscriptions) ? subscriptions : [],
    loading,
    stats,
    refresh: fetchSubscriptions,
    lastUpdate
  };
}