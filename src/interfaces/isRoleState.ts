import { Role } from "@/interfaces/iRoles";
interface RolePatch {
    id: number;
    type: "CREATED" | "UPDATED" | "DELETED";
    data?: Partial<Role>;
}
export interface RoleState {
    roles: Role[];
    lastHash: string;
    loading: boolean;
    lastUpdated: number; // Timestamp para controle de TTL (ex: 10 dias)

    // Actions de Sincronização
    setInitialRoles: (roles: Role[], hash: string) => void;
    setLoading: (status: boolean) => void;

    // Action de Criação Otimista (Uso imediato no Modal)
    addRoleLocal: (role: Role) => void;
    applyDelta: (patches: RolePatch[], newHash: string) => void;
    // Helpers de Cache
    isCacheStale: () => boolean;
    resetStore: () => void;
}