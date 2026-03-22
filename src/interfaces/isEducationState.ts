import { Education } from "./iEducation";

export interface EducationState {
    educations: Education[];
    totalCount: number;
    dataHash: string | null;
    loading: boolean;

    // Ações Principais
    fetchEducations: (force?: boolean) => Promise<void>;
    addEducation: (data: Partial<Education>) => Promise<void>;
    updateEducation: (id: string, data: Partial<Education>) => Promise<void>;
    deleteEducation: (id: string) => Promise<void>;
    clearEducationCache: () => Promise<void>;
}