import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ConsentState {
  hasAccepted: boolean | null; // null = não decidiu, true = aceitou, false = recusou
  setConsent: (accepted: boolean) => void;
}

export const useConsentStore = create<ConsentState>()(
  persist(
    (set) => ({
      hasAccepted: null,
      setConsent: (accepted) => set({ hasAccepted: accepted }),
    }),
    { name: "cookie-consent-storage" }
  )
);