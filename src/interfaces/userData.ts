import { UserProfile } from "./userProfile";

export type UserData = {
    id: string;
    whatsapp_number: string;
    is_active?: boolean;
    is_staff?: boolean;
    profile?: UserProfile;
    skills?: unknown[];
};

