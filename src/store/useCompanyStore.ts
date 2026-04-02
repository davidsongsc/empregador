import { create } from "zustand";
import { companyService } from "@/services/companies-service";
import { memberService } from "@/services/members-service";
import { toast } from "@/components/Notification";
import { get as idbGet, set as idbSet, del as idbDel, keys as idbKeys } from "idb-keyval";
import { CachedLayer, CompanyState } from "@/interfaces/isCompanyState";

const CACHE_EXPIRATION_MS = 30 * 60 * 1000; // 30 Minutos

export const useCompanyStore = create<CompanyState>((set, get) => ({
  companies: [],
  activeCompany: null,
  members: [],
  membersCount: 0,
  membersCache: {},
  loading: false,
  error: null,

  // --- GERENCIAMENTO DE CACHE ---
  vacuumCache: async () => {
    const allKeys = await idbKeys();
    const now = Date.now();
    const layerKeys = allKeys.filter(k => k.toString().startsWith("mem_layer_"));

    for (const key of layerKeys) {
      const cached = await idbGet<CachedLayer>(key);
      if (cached && (now - cached.timestamp > CACHE_EXPIRATION_MS)) {
        await idbDel(key);
      }
    }
  },

  clearCacheLayers: async () => {
    const allKeys = await idbKeys();
    const layerKeys = allKeys.filter(k => k.toString().startsWith("mem_layer_"));
    await Promise.all(layerKeys.map(k => idbDel(k)));
    set({ membersCache: {} });
  },

  loadFromStorage: async () => {
    try {
      await get().vacuumCache();
      const cachedCompanies = await idbGet<any[]>("cached_companies");
      const cachedActive = await idbGet<any>("active_company");
      const cachedCount = await idbGet<number>("members_count");
      const layer1 = await idbGet<CachedLayer>("mem_layer_1");

      set({
        companies: cachedCompanies || [],
        activeCompany: cachedActive || null,
        members: layer1?.data || [],
        membersCount: cachedCount || 0,
        membersCache: layer1 ? { 1: layer1.data } : {},
      });
      return !!cachedCompanies;
    } catch (err) {
      return false;
    }
  },

  // --- AÇÕES DE UNIDADE (COMPANY) ---
  fetchCompanies: async (page = 1, search = "", pageSize = 10) => {
    if (page === 1 && !search) {
      const cached = await idbGet<any[]>("cached_companies");
      if (cached) set({ companies: cached });
    }
    set({ loading: true, error: null });
    try {
      const data = await companyService.getCompanies(page, search);
      const companies = data.results || [];
      set({ companies, loading: false });
      await idbSet("cached_companies", companies);
    } catch (err) {
      set({ error: "Erro ao carregar empresas", loading: false });
    }
  },

  fetchCompanyDetails: async (id: string) => {
    const state = get();

    // AJUSTE: Se trocamos de empresa, precisamos limpar o cache de membros da anterior
    if (state.activeCompany?.company_id !== id) {
      console.log("[SYSTEM] Troca de contexto detectada. Resetando cache de membros.");
      set({ members: [], membersCache: {}, membersCount: 0 });
      // Não damos 'return' aqui, precisamos buscar os dados da nova empresa
    } else if (state.membersCache[1]) {
      // Se for a mesma empresa e já temos o dado, aí sim aplicamos o Delta
      console.log("[DELTA_SYSTEM] Camada_1 já está aquecida.");
      set({ members: state.membersCache[1], loading: false });
      return;
    }

    set({ loading: true });
    try {
      // Passamos o ID para o getMembers para garantir que o backend filtre a empresa correta
      const [company, membersRes] = await Promise.all([
        companyService.getCompanyById(id),
        memberService.getMembers(1, 10)
      ]);

      const membersArray = membersRes?.membros || []; // Alinhado com o seu JSON
      const count = membersRes?.total || 0;

      set({
        activeCompany: company,
        members: membersArray,
        membersCount: count,
        membersCache: { 1: membersArray }, // Resetamos o cache para a nova empresa
        loading: false
      });

      // Persistência atômica
      await Promise.all([
        idbSet("active_company", company),
        idbSet("members_count", count),
        idbSet("mem_layer_1", { data: membersArray, timestamp: Date.now() })
      ]);
    } catch (err) {
      set({ loading: false, error: "FALHA_AO_SINCRONIZAR_UNIDADE" });
    }
  },

  // --- MELHORIA NA REMOÇÃO ---
  removeMember: async (memberId: number) => {
    const active = get().activeCompany;
    if (!active) return;

    set({ loading: true });
    try {
      // Usamos o ID da empresa vindo do objeto ativo
      await memberService.removeMember(active.company_id, memberId);

      // Otimização: Em vez de invalidar tudo, removemos localmente para feedback instantâneo
      const updatedMembers = get().members.filter(m => m.id !== memberId);
      set(state => ({
        members: updatedMembers,
        membersCount: state.membersCount - 1,
        loading: false
      }));

      // Invalida cache de disco para forçar novo fetch na próxima carga
      await get().clearCacheLayers();
      toast.success("MEMBRO_REMOVIDO.");
    } catch (err) {
      set({ loading: false });
      toast.error("FALHA_AO_REMOVER.");
    }
  },

  // FUNÇÃO QUE ESTAVA FALTANDO (IMPLEMENTADA)
  updateCompanyStatus: async (id: string, isActive: boolean) => {
    try {
      await companyService.updateCompany(id, { is_active: isActive });

      const updatedCompanies = get().companies.map((c) =>
        c.id === id ? { ...c, is_active: isActive } : c
      );

      const active = get().activeCompany;
      const updatedActive = active?.company_id === id ? { ...active, is_active: isActive } : active;

      set({ companies: updatedCompanies, activeCompany: updatedActive });

      await Promise.all([
        idbSet("cached_companies", updatedCompanies),
        idbSet("active_company", updatedActive)
      ]);

      toast.success("STATUS_SINCRONIZADO.");
    } catch (err) {
      toast.error("FALHA_NA_ATUALIZACAO.");
    }
  },

  saveCompany: async (id: string, data: any) => {
    set({ loading: true });
    try {
      const updated = await companyService.updateCompany(id, data);
      set({ activeCompany: updated, loading: false });
      await idbSet("active_company", updated);
      toast.success("DADOS_PERSISTIDOS.");
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  // --- AÇÕES DE MEMBROS (PROTOCOLO DELTA) ---
  fetchMembers: async (page = 1, pageSize = 10, forceRefresh = false) => {
    const { membersCache, membersCount } = get();
    const now = Date.now();
    const STALE_TIME_MS = 90 * 1000;

    // Busca cache no IndexedDB
    const diskCached = await idbGet<any>(`mem_layer_${page}`);
    const isDataFresh = diskCached && (now - diskCached.timestamp < STALE_TIME_MS);

    // 1. RESPOSTA INSTANTÂNEA (RAM ou DISCO FRESCO)
    if (membersCache[page] && !forceRefresh && isDataFresh) {
      console.log(`[DELTA_STABLE] Membros_Camada_${page} está fresca.`);
      set({ members: membersCache[page], loading: false });
      return;
    }

    // 2. BACKGROUND REVALIDATION (SWR)
    // Se temos dado antigo, mostra ele primeiro mas continua o fetch no fundo
    if (membersCache[page] || (diskCached && !forceRefresh)) {
      const dataToDisplay = membersCache[page] || diskCached?.data;
      set({ members: dataToDisplay, loading: false });
      console.log(`[DELTA_REVALIDATE] Membros_Camada_${page} obsoleta. Sincronizando...`);
    } else {
      set({ loading: true });
    }

    try {
      // Chamada ao Service
      const res = await memberService.getMembers(page, pageSize);

      // AJUSTE CRÍTICO: Mapeamento dos campos do seu JSON
      const membersArray = res?.membros || []; // Antes estava res.results
      const serverTotal = res?.total || 0;     // Antes estava res.count

      // 3. CHECAGEM DE MUTAÇÃO (Comparação profunda via Hash ou JSON)
      // Comparamos o que temos no cache de RAM com o que veio do servidor
      const hasChanged = JSON.stringify(membersCache[page]) !== JSON.stringify(membersArray) || serverTotal !== membersCount;

      if (hasChanged || forceRefresh) {
        console.log(`[DELTA_UPDATE] Dados alterados na rede. Atualizando UI.`);
        set((state) => ({
          members: membersArray,
          membersCount: serverTotal,
          membersCache: { ...state.membersCache, [page]: membersArray },
          loading: false
        }));

        // Persistência no Disco (IDB)
        await Promise.all([
          idbSet(`mem_layer_${page}`, { data: membersArray, timestamp: now }),
          idbSet("members_count", serverTotal)
        ]);
      } else {
        // Se os dados são idênticos, apenas "empurramos" o timestamp para frente
        console.log(`[DELTA_SYNC] Servidor e Cache idênticos. Renovando TTL.`);
        await idbSet(`mem_layer_${page}`, { data: membersArray, timestamp: now });
        set({ loading: false });
      }
    } catch (err) {
      console.error("[DELTA_ERROR] Falha na sincronização de membros:", err);
      set({ loading: false });
    }
  },

  updateMemberRole: async (memberId: string, role: string) => {
    const active = get().activeCompany.id;
    console.log('activeCompany in updateMemberRole:', active);
    if (!active) return;
    const cleanRole = role.replace(/['"]+/g, '').trim();

    try {
      await memberService.updateMemberRole(active, memberId, cleanRole);
      const updatedMembers = get().members.map((m) =>
        m.id === memberId ? { ...m, role: cleanRole } : m
      );
      set({ members: updatedMembers });
      await get().clearCacheLayers(); // Invalida cache para evitar dados antigos
      toast.success("ROLE_ATUALIZADA.");
    } catch (err) {
      toast.error("ERRO_AO_ATUALIZAR.");
    }
  },

  addMember: async (companyId: string, profileId: string, role: string) => {
    set({ loading: true });
    try {
      await memberService.addMember(companyId, { profile: profileId, role });
      await get().clearCacheLayers();
      await get().fetchCompanyDetails(companyId);
      toast.success("MEMBRO_ADICIONADO.");
    } catch (err) {
      set({ loading: false });
    }
  },

  removeMember: async (memberId: number) => {
    const active = get().activeCompany;
    if (!active) return;
    set({ loading: true });
    try {
      await memberService.removeMember(active.id, memberId);
      await get().clearCacheLayers();
      await get().fetchMembers(1, 10, true);
      toast.success("MEMBRO_REMOVIDO.");
    } catch (err) {
      set({ loading: false });
    }
  },

  clearStorage: async () => {
    const allKeys = await idbKeys();
    await Promise.all(allKeys.map(k => idbDel(k)));
    set({ companies: [], activeCompany: null, members: [], membersCount: 0, membersCache: {} });
  }
}));