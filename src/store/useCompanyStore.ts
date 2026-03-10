import { create } from "zustand";
import { companyService } from "@/services/companies-service";
import { toast } from "@/components/Notification";

interface CompanyState {
  companies: any[];
  activeCompany: any | null;
  loading: boolean;
  error: string | null;
  fetchCompanies: (page?: number, search?: string) => Promise<void>;
  fetchCompanyDetails: (id: string) => Promise<void>;
  updateCompanyStatus: (id: string, isActive: boolean) => Promise<void>;
  rateCompany: (id: string, rate: number) => Promise<void>;
}

export const useCompanyStore = create<CompanyState>((set, get) => ({
  companies: [],
  activeCompany: null,
  loading: false,
  error: null,

  fetchCompanies: async (page = 1, search = "") => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const data = await companyService.getCompanies(page, search);
      set({ companies: data.results || [], loading: false });
    } catch (err) {
      set({ error: "Erro ao carregar empresas", loading: false });
      toast.error("Erro ao carregar lista de empresas");
    }
  },

  fetchCompanyDetails: async (id: string) => {
    set({ loading: true });
    try {
      const data = await companyService.getCompanyById(id);
      set({ activeCompany: data, loading: false });
    } catch (err) {
      set({ loading: false });
      toast.error("Erro ao carregar detalhes da empresa");
    }
  },

  updateCompanyStatus: async (id: string, isActive: boolean) => {
    try {
      await companyService.updateCompany(id, { is_active: isActive });
      toast.success(`Empresa ${isActive ? "ativada" : "desativada"}!`);

      // Atualização otimista na lista global
      const updatedCompanies = get().companies.map((c) =>
        c.id === id ? { ...c, is_active: isActive } : c
      );
      
      // Atualiza também a empresa ativa se for a mesma
      const active = get().activeCompany;
      const updatedActive = active?.id === id ? { ...active, is_active: isActive } : active;

      set({ companies: updatedCompanies, activeCompany: updatedActive });
    } catch (err) {
      toast.error("Erro ao atualizar status da empresa.");
    }
  },

  rateCompany: async (id: string, rate: number) => {
    try {
      const response = await companyService.rateCompany(id, rate);
      toast.success("Avaliação enviada!");
      
      // Se a empresa estiver aberta, poderíamos atualizar a média localmente aqui
      // mas geralmente é melhor deixar o backend recalcular no próximo fetch.
    } catch (err) {
      toast.error("Erro ao enviar avaliação.");
    }
  }
}));