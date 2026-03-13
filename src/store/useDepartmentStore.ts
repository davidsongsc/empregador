import { create } from "zustand";
import { departmentService, Department } from "@/services/companies-service";
import { toast } from "@/components/Notification";

interface DepartmentState {
  departments: Department[];
  loading: boolean;
  // Agora as ações aceitam ou dependem do companyId
  fetchDepartments: (companyId: string) => Promise<void>;
  addDepartment: (companyId: string, data: Partial<Department>) => Promise<void>;
  updateDepartment: (companyId: string, deptId: string, data: Partial<Department>) => Promise<void>;
  removeDepartment: (companyId: string, deptId: string) => Promise<void>;
}

export const useDepartmentStore = create<DepartmentState>((set, get) => ({
  departments: [],
  loading: false,

  fetchDepartments: async (companyId: string) => {
    if (!companyId) return;
    set({ loading: true });
    try {
      // Injeção do ID obrigatório na rota aninhada
      const response = await departmentService.getDepartments(companyId);

      let cleanList: Department[] = [];
      if (Array.isArray(response)) {
        cleanList = response;
      } else if (response && typeof response === "object") {
        const { ok, ...indexedItems } = response;
        cleanList = Object.values(indexedItems).filter(
          (item: any) => item && typeof item === "object" && item.id
        ) as Department[];
      }

      set({ departments: cleanList, loading: false });
    } catch (err) {
      set({ loading: false, departments: [] });
      console.error("FAIL: Erro na reconstrução da estrutura operacional.");
    }
  },

  addDepartment: async (companyId, data) => {
    try {
      const res = await departmentService.createDepartment(companyId, data);
      if (res.ok || res.id) {
        toast.success("NEW_SECTOR: Protocolo inicializado.");
        await get().fetchDepartments(companyId);
      }
    } catch (err) {
      toast.error("DENIED: Falha ao criar setor.");
    }
  },

  updateDepartment: async (companyId, deptId, data) => {
    const previous = get().departments;
    // Update Otimista (Visual instantâneo)
    set({
      departments: previous.map((d) => (d.id === deptId ? { ...d, ...data } : d)),
    });

    try {
      const res = await departmentService.updateDepartment(companyId, deptId, data);
      // Sua API retorna .ok ou o próprio objeto atualizado
      if (!res.ok && !res.id) throw new Error();
    } catch (err) {
      set({ departments: previous });
      toast.error("SYNC_ERROR: Parâmetros rejeitados.");
    }
  },

  removeDepartment: async (companyId, deptId) => {
    if (!confirm("CONFIRM_TERMINATION: Deseja remover este setor?")) return;

    try {
      const res = await departmentService.deleteDepartment(companyId, deptId);
      if (res.ok || res.status === 204) {
        set({ departments: get().departments.filter((d) => d.id !== deptId) });
        toast.success("SECTOR_TERMINATED.");
      }
    } catch (err) {
      toast.error("FAIL: Erro ao remover setor.");
    }
  },
}));