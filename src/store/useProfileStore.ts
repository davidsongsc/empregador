// @/store/useProfileStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProfileCacheState } from '@/interfaces/isProfileCacheState';

export const useProfileStore = create<ProfileCacheState>()(
  persist(
    (set) => ({
      cachedProfile: null,
      lastFetched: 0,
      setCachedProfile: (profile) => set({ 
        cachedProfile: profile, 
        lastFetched: Date.now() 
      }),
      clearCache: () => set({ cachedProfile: null, lastFetched: 0 }),
    }),
    { name: 'freelacerto_profile_cache' }
  )
);