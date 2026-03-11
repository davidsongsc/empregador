import { getActiveMembership } from "./userHelpers";

export const checkLevel = (requirement: "low" | "mid" | "high"): boolean => {
  const activeMembership = getActiveMembership();
  const role = activeMembership?.role;

  if (!role) return false;
  if (role === "SUPER_ADMIN") return true;

  const level = role.split('_').pop() || "";

  const weights: Record<string, number> = {
    'INTERN': 1, 'JR': 2, 'PL': 3, 'SR': 4, 
    'LEAD': 5, 'ADMIN': 6, 'DIRECTOR': 7
  };

  const minRequired: Record<string, number> = {
    'low': 1,  // Qualquer um (Interno para cima)
    'mid': 3,  // Pleno (PL) para cima
    'high': 4  // Sênior (SR) para cima
  };

  const userWeight = weights[level] ?? 0;
  return userWeight >= minRequired[requirement];
};