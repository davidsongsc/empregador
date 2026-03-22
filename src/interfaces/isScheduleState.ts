export interface ScheduleState {
    schedules: any[];
    count: number;
    activeSchedule: any | null;
    loading: boolean;
    error: string | null;

    // Ações
    fetchSchedules: (page?: number, search?: string) => Promise<void>;
    fetchScheduleDetails: (uid: string) => Promise<void>;
    updateSchedule: (uid: string, data: any) => Promise<boolean>;
    createSchedule: (data: any) => Promise<any>;
    deleteSchedule: (uid: string) => Promise<void>;
    clearActiveSchedule: () => void;
}
