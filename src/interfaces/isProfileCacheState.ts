import { UserProfile } from "./userProfile";

export interface ProfileCacheState {
    cachedProfile: UserProfile | null;
    lastFetched: number;
    setCachedProfile: (profile: UserProfile | null) => void;
    clearCache: () => void;
}
