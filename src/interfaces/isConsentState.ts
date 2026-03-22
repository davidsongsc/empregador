export interface ConsentState {
  hasAccepted: boolean | null; // null = não decidiu, true = aceitou, false = recusou
  setConsent: (accepted: boolean) => void;
}
