// @/hooks/useRoles.ts
import { useEffect } from "react";
import { useRoleStore } from "@/store/useRoleStore";
import { getRoles } from "@/services/roles";

export function useRoles() {
  const { roles, lastHash, setInitialRoles, setLoading, loading } = useRoleStore();

  useEffect(() => {
    const bootstrap = async () => {
      // Se já temos roles e o cache é recente, não fazemos nada (Zustand Persist já carregou)
      if (roles.length > 0 && loading === false) return;

      setLoading(true);
      try {
        const response = await getRoles(lastHash);
        
        // Se a API retornar dados novos (res.items), atualizamos a store
        // Se retornar vazio (cache hit), a store continua como está
        if (response?.items) {
          setInitialRoles(response.items, response.hash || "0");
        }
      } catch (err) {
        console.error("Erro ao sincronizar Roles:", err);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []); // Executa ao montar o componente

  return { roles, loading };
}