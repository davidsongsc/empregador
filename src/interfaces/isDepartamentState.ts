import { Department } from "./iDepartament";

export interface DepartmentState {
  departments: Department[];
  loading: boolean;

  fetchDepartments: (companyId: string) => Promise<void>;
  addDepartment: (companyId: string, data: Partial<Department>) => Promise<void>;
  updateDepartment: (companyId: string, deptId: string, data: Partial<Department>) => Promise<void>;
  removeDepartment: (companyId: string, deptId: string) => Promise<void>;
}
