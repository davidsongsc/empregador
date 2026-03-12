import { create } from "zustand";
import { companyService } from "@/services/companies-service";
import { memberService } from "@/services/members-service";
import { toast } from "@/components/Notification";
// Renomeamos os imports para evitar conflito com o 'get' e 'set' do Zustand
import { get as idbGet, set as idbSet, del as idbDel } from "idb-keyval";

interface CompanyState {
  companies: any[];
  activeCompany: any | null;
  members: any[];
  loading: boolean;
  error: string | null;

  fetchCompanies: (page?: number, search?: string) => Promise<void>;
  fetchCompanyDetails: (id: string) => Promise<void>;
  updateCompanyStatus: (id: string, isActive: boolean) => Promise<void>;
  updateMemberRole: (memberId: number, role: string) => Promise<void>;
  saveCompany: (id: string, data: any) => Promise<void>;
  loadFromStorage: () => Promise<boolean>;
  clearStorage: () => void;
}

export const useCompanyStore = create<CompanyState>((set, get) => ({
  companies: [],
  activeCompany: null,
  members: [],
  loading: false,
  error: null,

  loadFromStorage: async () => {
    set({ loading: true }); // Indica que está lendo do banco local
    try {
      const cachedCompanies = await idbGet<any[]>("cached_companies");
      const cachedActive = await idbGet<any>("active_company");
      const cachedMembers = await idbGet<any[]>("cached_members");

      // Atualiza o estado atômico do Zustand
      set({
        companies: cachedCompanies || [],
        activeCompany: cachedActive || null,
        members: cachedMembers || [],
        loading: false
      });

      return !!cachedCompanies; // Retorna se tinha algo no cache
    } catch (err) {
      console.error("Erro ao carregar do InnerDB", err);
      set({ loading: false });
      return false;
    }
  },
  fetchCompanies: async (page = 1, search = "") => {
    if (get().loading) return; // Aqui o get() é do Zustand (sem argumentos)
    set({ loading: true, error: null });
    try {
      const data = await companyService.getCompanies(page, search);
      const companies = data.results || [];

      set({ companies, loading: false });
      await idbSet("cached_companies", companies);
    } catch (err) {
      set({ error: "Erro ao carregar empresas", loading: false });
      toast.error("Erro ao carregar lista de empresas");
    }
  },

  fetchCompanyDetails: async (id: string) => {
    set({ loading: true });
    try {
      const [company, membersRes] = await Promise.all([
        companyService.getCompanyById(id),
        memberService.getMembers(id)
      ]);

      // O PULO DO GATO: Garante que 'members' seja sempre um Array.
      // Se o Django retorna paginação, pegamos o .results. 
      // Se retornar direto, usamos o que veio.
      const membersArray = Array.isArray(membersRes)
        ? membersRes
        : (membersRes?.results || []);

      set({
        activeCompany: company,
        members: membersArray, // Agora o .filter() nunca vai falhar
        loading: false
      });

      await idbSet("active_company", company);
      await idbSet("cached_members", membersArray);
    } catch (err) {
      set({ loading: false, members: [] }); // Fallback para array vazio
      toast.error("Erro ao carregar detalhes");
    }
  },

  updateMemberRole: async (memberId: number, role: string) => {
    const active = get().activeCompany;
    if (!active) return;

    try {
      await memberService.updateMemberRole(active.id, memberId, role);

      const updatedMembers = get().members.map((m) =>
        m.id === memberId ? { ...m, role } : m
      );

      set({ members: updatedMembers });
      await idbSet("cached_members", updatedMembers);

      toast.success("Cargo atualizado!");
    } catch (err) {
      toast.error("Erro ao sincronizar cargo.");
    }
  },

  updateCompanyStatus: async (id: string, isActive: boolean) => {
    try {
      await companyService.updateCompany(id, { is_active: isActive });

      const updatedCompanies = get().companies.map((c) =>
        c.id === id ? { ...c, is_active: isActive } : c
      );

      const active = get().activeCompany;
      const updatedActive = active?.id === id ? { ...active, is_active: isActive } : active;

      set({ companies: updatedCompanies, activeCompany: updatedActive });

      await idbSet("cached_companies", updatedCompanies);
      await idbSet("active_company", updatedActive);

      toast.success(`Status atualizado.`);
    } catch (err) {
      toast.error("Falha no reporte ao servidor.");
    }
  },

  saveCompany: async (id: string, data: any) => {
    set({ loading: true });
    try {
      const updated = await companyService.updateCompany(id, data);
      set({ activeCompany: updated, loading: false });

      await idbSet("active_company", updated);
      toast.success("Unidade sincronizada.");
    } catch (err) {
      set({ loading: false });
      toast.error("Erro na persistência.");
      throw err;
    }
  },

  clearStorage: async () => {
    await Promise.all([
      idbDel("cached_companies"),
      idbDel("active_company"),
      idbDel("cached_members")
    ]);
    set({ companies: [], activeCompany: null, members: [] });
  }
}));