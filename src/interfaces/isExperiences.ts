import { Experience } from "./iExperience";

export interface ExperienceCache {
    [profileId: string]: {
        data: Experience[];
        hash: string;
        updatedAt: number;
    };
}

export interface ExperienceState {
    experiences: Experience[];
    total: number;
    loading: boolean;
    error: string | null;
    cache: ExperienceCache; // Adicionado à interface para o TS reconhecer o get()

    // Actions
    fetchExperiences: (profileId: string, force?: boolean) => Promise<void>;
    addExperience: (data: any) => Promise<void>;
    updateExperience: (id: string, data: any) => Promise<void>;
    deleteExperience: (id: string) => Promise<void>;
    clearExperienceCache: () => void;
}
