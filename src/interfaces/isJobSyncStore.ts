export interface JobSyncStore {
    lastSequenceId: string;
    isSyncing: boolean;
    setSyncing: (status: boolean) => void;
    syncData: (patches: any[], newHash: string) => void;
}