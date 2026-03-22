import { ConsentState } from "@/interfaces/isConsentState";
import { create } from "zustand";
import { persist } from "zustand/middleware";


export const useConsentStore = create<ConsentState>()(
  persist(
    (set) => ({
      hasAccepted: null,
      setConsent: (accepted) => set({ hasAccepted: accepted }),
    }),
    { name: "cookie-consent-storage" }
  )
);