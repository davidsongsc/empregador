import { useState, useEffect } from "react";
import { getRoles, Role } from "@/services/roles";

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getRoles();
        
        // AJUSTE AQUI: 
        // Como o objeto chega com "results", precisamos extrair o array.
        // O fallback "|| []" evita erros caso o backend venha vazio.
        setRoles(data.results || []); 
        
      } catch (err: any) {
        setError("Não foi possível carregar a lista de cargos.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  return { roles, loading, error };
}