export interface CachedLayer {
    data: any[];
    timestamp: number;
}

export interface CompanyState {
    companies: any[];
    activeCompany: any | null;
    members: any[];
    membersCount: number;
    membersCache: Record<number, any[]>;
    loading: boolean;
    error: string | null;

    // Ações
    fetchCompanies: (page?: number, search?: string, pageSize?: number) => Promise<void>;
    fetchCompanyDetails: (id: string) => Promise<void>;
    fetchMembers: ( page?: number, pageSize?: number, forceRefresh?: boolean) => Promise<void>;
    updateCompanyStatus: (id: string, isActive: boolean) => Promise<void>;
    updateMemberRole: (profileId: string, role: string) => Promise<void>;
    addMember: (companyId: string, profileId: string, role: string) => Promise<void>;
    removeMember: (memberId: string) => Promise<void>;
    saveCompany: (id: string, data: any) => Promise<void>;

    // Persistência e Cache
    loadFromStorage: () => Promise<boolean>;
    clearStorage: () => Promise<void>;
    vacuumCache: () => Promise<void>;
    clearCacheLayers: () => Promise<void>;
}