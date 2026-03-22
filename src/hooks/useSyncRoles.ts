import { useEffect } from 'react';
import { useRoleStore } from '@/store/useRoleStore';
import { api } from '@/lib/api';

export const useSyncRoles = () => {
    const { lastHash, setInitialRoles, applyDelta, setLoading } = useRoleStore();

    useEffect(() => {
        const sync = async () => {
            setLoading(true);
            try {
                // Enviamos o hash que temos no cache persistido
                const response = await api(`/roles/sync/?last_hash=${lastHash}`);
                
                if (response.ok) {
                    if (response.type === 'FULL_LOAD') {
                        // Se o cache é muito antigo ou inexistente
                        setInitialRoles(response.roles, response.new_hash);
                    } else if (response.type === 'DELTA') {
                        // Aplica apenas o que mudou desde o lastHash
                        applyDelta(response.patches, response.new_hash);
                    } else if (response.status === 304 || response.no_changes) {
                        // 304 Not Modified: Cache ainda é válido
                        console.log("Roles sincronizados via Cache (Delta 0)");
                    }
                }
            } catch (error) {
                console.error("Falha na sincronização de cargos:", error);
            } finally {
                setLoading(false);
            }
        };

        sync();
    }, []); // Roda apenas no mount do app
};