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
  fetchCompanies: async (page = 1, search = "") => {
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

    // PROTOCOLO DELTA: Se já temos a empresa certa e a página 1 no cache de memória, 
    // não precisamos travar a UI com loading nem forçar fetch imediato.
    if (state.activeCompany?.id === id && state.membersCache[1]) {
      console.log("[DELTA_SYSTEM] Camada_1 já está aquecida. Ignorando fetch obrigatório.");
      set({ members: state.membersCache[1], loading: false });
      return; // <--- O SEGREDO ESTÁ AQUI: Aborta se já tem o dado
    }

    set({ loading: true });
    try {
      const [company, membersRes] = await Promise.all([
        companyService.getCompanyById(id),
        memberService.getMembers(id, 1)
      ]);

      const membersArray = membersRes?.results || [];
      const count = membersRes?.count || 0;

      set({
        activeCompany: company,
        members: membersArray,
        membersCount: count,
        membersCache: { ...state.membersCache, 1: membersArray }, // Preserva outras páginas e atualiza a 1
        loading: false
      });

      await Promise.all([
        idbSet("active_company", company),
        idbSet("members_count", count),
        idbSet("mem_layer_1", { data: membersArray, timestamp: Date.now() })
      ]);
    } catch (err) {
      set({ loading: false });
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
      const updatedActive = active?.id === id ? { ...active, is_active: isActive } : active;

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
  fetchMembers: async (companyId: string, page = 1, forceRefresh = false) => {
    const { membersCache } = get();
    const now = Date.now();

    // 1. DEFINIÇÃO DE POLÍTICA: 
    // Se os dados têm menos de 30 segundos, consideramos "Tempo Real" e damos RETURN.
    // Isso evita fetch ao navegar entre abas/páginas rapidamente.
    const STALE_TIME_MS = 90 * 1000;

    // Busca o timestamp da camada no disco para validar "frescor"
    const diskCached = await idbGet<CachedLayer>(`mem_layer_${page}`);
    const isDataFresh = diskCached && (now - diskCached.timestamp < STALE_TIME_MS);

    // 2. RESPOSTA INSTANTÂNEA (RAM ou DISCO)
    if (membersCache[page] && !forceRefresh && isDataFresh) {
      console.log(`[DELTA_STABLE] Camada_${page} está fresca. Abortando rede.`);
      set({ members: membersCache[page], loading: false });
      return; // <--- O retorno volta para economizar o servidor
    }

    // 3. REVALIDAÇÃO (Caso os dados sejam antigos ou forceRefresh seja true)
    // Se temos cache mas ele está "stale" (>30s), mostramos o cache e atualizamos em background
    if (membersCache[page] || (diskCached && !forceRefresh)) {
      const dataToDisplay = membersCache[page] || diskCached?.data;
      set({ members: dataToDisplay, loading: false });
      // Aqui NÃO damos return, o fetch corre no fundo para checar se o Junior virou Pleno
      console.log(`[DELTA_REVALIDATE] Camada_${page} obsoleta. Checando mainframe...`);
    } else {
      set({ loading: true });
    }

    try {
      const res = await memberService.getMembers(companyId, page);
      const membersArray = res?.results || [];

      // 4. ATUALIZAÇÃO SENSÍVEL: Só altera o estado se o servidor mandar algo diferente
      const hasChanged = JSON.stringify(get().membersCache[page]) !== JSON.stringify(membersArray);

      if (hasChanged || forceRefresh) {
        set((state) => ({
          members: membersArray,
          membersCount: res.count,
          membersCache: { ...state.membersCache, [page]: membersArray },
          loading: false
        }));

        await Promise.all([
          idbSet(`mem_layer_${page}`, { data: membersArray, timestamp: now }),
          idbSet("members_count", res.count)
        ]);
      } else {
        // Se for igual, apenas atualizamos o timestamp no disco para o dado ficar "fresco" +30s
        await idbSet(`mem_layer_${page}`, { data: membersArray, timestamp: now });
        set({ loading: false });
      }
    } catch (err) {
      set({ loading: false });
    }
  },

  updateMemberRole: async (memberId: number, role: string) => {
    const active = get().activeCompany;
    if (!active) return;
    const cleanRole = role.replace(/['"]+/g, '').trim();

    try {
      await memberService.updateMemberRole(active.id, memberId, cleanRole);
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
      await get().fetchMembers(active.id, 1, true);
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