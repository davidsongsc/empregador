export interface Plan {
    id: string;
    name: string;
    description: string;
    price: number;
    days_duration: number;
    max_collaborators: number;
    max_active_jobs: number;
    is_active: boolean;
}
