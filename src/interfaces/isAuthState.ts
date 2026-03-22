import { UserData } from "./userData";

export interface AuthState {
    user: UserData | null;
    activeCompanyId: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    isHydrated: boolean;
    lastUpdated: number; // Essencial para o Protocolo Delta

    // Ações
    setUser: (user: UserData | null) => void;
    setActiveCompany: (id: string | null) => void;
    setLoading: (loading: boolean) => void;
    setHydrated: (state: boolean) => void;
    logout: () => Promise<void>;
    refresh: () => Promise<void>;
}