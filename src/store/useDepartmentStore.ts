import { create } from "zustand";
// Certifique-se de que o import aponta para onde o departmentService está definido
import { departmentService, Department } from "@/services/companies-service";
import { toast } from "@/components/Notification";

interface DepartmentState {
  departments: Department[];
  loading: boolean;
  fetchDepartments: () => Promise<void>;
  addDepartment: (data: Partial<Department>) => Promise<void>;
  updateDepartment: (id: string, data: Partial<Department>) => Promise<void>;
  removeDepartment: (id: string) => Promise<void>;
}

export const useDepartmentStore = create<DepartmentState>((set, get) => ({
  departments: [],
  loading: false,

  fetchDepartments: async () => {
    set({ loading: true });
    try {
      const response = await departmentService.getDepartments();

      // NEXUS_DATA_RECOVERY: Se o dado chegar como objeto indexado { "0": {}, "ok": true }
      let cleanList: Department[] = [];

      if (Array.isArray(response)) {
        cleanList = response;
      } else if (response && typeof response === "object") {
        // Removemos a chave 'ok' para sobrar apenas os índices
        const { ok, ...indexedItems } = response;

        // Transformamos { "0": {id: 1}, "1": {id: 2} } em [ {id: 1}, {id: 2} ]
        cleanList = Object.values(indexedItems).filter(
          (item: any) => item && typeof item === "object" && item.id
        ) as Department[];
      }

      console.log("Departments_Clean_Length:", cleanList.length);
      set({ departments: cleanList, loading: false });
    } catch (err) {
      set({ loading: false, departments: [] });
      console.error("FAIL: Erro na reconstrução da estrutura operacional.");
    }
  },

  addDepartment: async (data) => {
    try {
      const res = await departmentService.createDepartment(data);
      // Sua API injeta 'ok: true' no retorno
      if (res.ok) {
        toast.success("NEW_SECTOR: Protocolo inicializado.");
        await get().fetchDepartments();
      }
    } catch (err) {
      toast.error("DENIED: Falha ao criar setor.");
    }
  },

  updateDepartment: async (id, data) => {
    // Update Otimista para performance Delos
    const previous = get().departments;
    set({
      departments: previous.map((d) => (d.id === id ? { ...d, ...data } : d)),
    });

    try {
      const res = await departmentService.updateDepartment(id, data);
      if (!res.ok) throw new Error();
      // Opcional: toast.success("SYNC_COMPLETE");
    } catch (err) {
      // Rollback se falhar
      set({ departments: previous });
      toast.error("SYNC_ERROR: Parâmetros rejeitados.");
    }
  },

  removeDepartment: async (id) => {
    if (!confirm("CONFIRM_TERMINATION: Deseja remover este setor?")) return;

    try {
      const res = await departmentService.deleteDepartment(id);
      if (res.ok) {
        set({ departments: get().departments.filter((d) => d.id !== id) });
        toast.success("SECTOR_TERMINATED.");
      }
    } catch (err) {
      toast.error("FAIL: Erro ao remover setor.");
    }
  },
}));