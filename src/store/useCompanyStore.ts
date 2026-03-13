import { create } from "zustand";
import { companyService } from "@/services/companies-service";
import { memberService } from "@/services/members-service";
import { toast } from "@/components/Notification";
import { get as idbGet, set as idbSet, del as idbDel } from "idb-keyval";

interface CompanyState {
  companies: any[];
  activeCompany: any | null;
  members: any[];
  loading: boolean;
  error: string | null;

  // Definições Obrigatórias
  fetchCompanies: (page?: number, search?: string) => Promise<void>;
  fetchCompanyDetails: (id: string) => Promise<void>;
  updateCompanyStatus: (id: string, isActive: boolean) => Promise<void>;
  updateMemberRole: (memberId: number, role: string) => Promise<void>;
  addMember: (companyId: string, profileId: string, role: string) => Promise<void>;
  removeMember: (memberId: number) => Promise<void>;
  saveCompany: (id: string, data: any) => Promise<void>;
  loadFromStorage: () => Promise<boolean>;
  clearStorage: () => Promise<void>;
}

export const useCompanyStore = create<CompanyState>((set, get) => ({
  companies: [],
  activeCompany: null,
  members: [],
  loading: false,
  error: null,

  loadFromStorage: async () => {
    try {
      const cachedCompanies = await idbGet<any[]>("cached_companies");
      const cachedActive = await idbGet<any>("active_company");
      const cachedMembers = await idbGet<any[]>("cached_members");

      set({
        companies: cachedCompanies || [],
        activeCompany: cachedActive || null,
        members: cachedMembers || [],
      });
      return !!cachedCompanies;
    } catch (err) {
      return false;
    }
  },

  fetchCompanies: async (page = 1, search = "") => {
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
    set({ loading: true });
    try {
      const [company, membersRes] = await Promise.all([
        companyService.getCompanyById(id),
        memberService.getMembers(id)
      ]);

      const membersArray = Array.isArray(membersRes) ? membersRes : (membersRes?.results || []);

      set({
        activeCompany: company,
        members: [...membersArray],
        loading: false
      });

      await idbSet("active_company", company);
      await idbSet("cached_members", membersArray);
    } catch (err) {
      set({ loading: false, members: [] });
    }
  },

  // FUNÇÃO QUE ESTAVA FALTANDO
  updateCompanyStatus: async (id: string, isActive: boolean) => {
    try {
      await companyService.updateCompany(id, { is_active: isActive });

      const updatedCompanies = get().companies.map((c) =>
        c.id === id ? { ...c, is_active: isActive } : c
      );

      const active = get().activeCompany;
      const updatedActive = active?.id === id ? { ...active, is_active: isActive } : active;

      set({ companies: [...updatedCompanies], activeCompany: updatedActive });

      await idbSet("cached_companies", updatedCompanies);
      await idbSet("active_company", updatedActive);

      toast.success("STATUS_ATUALIZADO: Unidade sincronizada.");
    } catch (err) {
      toast.error("FALHA_NO_REPORTE: Verifique a conexão.");
    }
  },

  updateMemberRole: async (memberId: number, role: string) => {
    const active = get().activeCompany;
    if (!active) return;

    // Limpeza de aspas para evitar erro de ChoiceField na API
    const cleanRole = role.replace(/['"]+/g, '').trim();

    try {
      await memberService.updateMemberRole(active.id, memberId, cleanRole);

      const updatedMembers = get().members.map((m) =>
        m.id === memberId ? { ...m, role: cleanRole } : m
      );

      set({ members: [...updatedMembers] });
      await idbSet("cached_members", updatedMembers);

      toast.success("PRIVILÉGIO_SINCRONIZADO.");
    } catch (err) {
      toast.error("ERRO_DE_OPÇÃO: Cargo inválido.");
    }
  },

  addMember: async (companyId: string, profileId: string, role: string) => {
    set({ loading: true });
    try {
      const cleanRole = role.replace(/['"]+/g, '').trim();
      const newMember = await memberService.addMember(companyId, { profile: profileId, role: cleanRole });

      const updatedMembers = [...get().members, newMember];
      set({ members: updatedMembers, loading: false });
      await idbSet("cached_members", updatedMembers);
      toast.success("SUJEITO_VINCULADO.");
    } catch (err) {
      set({ loading: false });
      toast.error("FALHA_NO_VÍNCULO.");
    }
  },

  removeMember: async (memberId: number) => {
    const active = get().activeCompany;
    if (!active) return;

    set({ loading: true });
    try {
      await memberService.removeMember(active.id, memberId);
      const updatedMembers = get().members.filter((m) => m.id !== memberId);
      set({ members: [...updatedMembers], loading: false });
      await idbSet("cached_members", updatedMembers);
      toast.success("PROTOCOLO_ENCERRADO.");
    } catch (err) {
      set({ loading: false });
    }
  },

  saveCompany: async (id: string, data: any) => {
    set({ loading: true });
    try {
      const updated = await companyService.updateCompany(id, data);
      set({ activeCompany: updated, loading: false });
      await idbSet("active_company", updated);
      toast.success("UNIDADE_PERSISTIDA.");
    } catch (err) {
      set({ loading: false });
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