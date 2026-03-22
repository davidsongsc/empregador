export interface SyncResponse {
    action: "APPLY_PATCHES" | "FULL_RELOAD" | "NOP";
    new_hash: string;
    patches: Array<{
        uid: string;
        type: 'CREATED' | 'UPDATED' | 'DELETED';
        data: any;
    }>;
}
