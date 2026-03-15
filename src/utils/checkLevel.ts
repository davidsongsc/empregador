import { getActiveMembership } from "./userHelpers";

export const checkLevel = (requirement: "low" | "mid" | "high"): boolean => {
  const activeMembership = getActiveMembership();
  const role = activeMembership?.role;

  if (!role) return false;
  
  // 1. ACESSO TOTAL (GOD MODE)
  if (role === "SUPER_ADMIN" || role === "ADMIN_SAAS_N2" || role === "DEV_SR") return true;

  // 2. MAPEAMENTO DE PESOS (Expandido para os novos cargos)
  const weights: Record<string, number> = {
    'INTERN': 1, 
    'JR': 2, 
    'PL': 3, 
    'SR': 4, 
    'LEAD': 5,
    'MANAGER': 6, // Gerente de Unidade / Cozinha
    'ADMIN': 6, 
    'DIRECTOR': 7,
    'CUISINE': 6, // Para CLIENT_CHEF_DE_CUISINE
    'VIP': 7      // CANDIDATE_VIP
  };

  const minRequired: Record<string, number> = {
    'low': 1,  
    'mid': 3,  
    'high': 4  
  };

  // 3. EXTRAÇÃO DE NÍVEL INTELIGENTE
  const parts = role.split('_');
  const level = parts[parts.length - 1]; // Pega a última parte

  // 4. VALIDAÇÃO DE PESO
  const userWeight = weights[level] ?? 0;
  
  // Caso especial para Cargos Únicos (Sem sufixo JR/SR)
  if (role === 'CLIENT_CHEF_DE_CUISINE') return weights['CUISINE'] >= minRequired[requirement];
  if (role === 'CLIENT_MANAGER') return weights['MANAGER'] >= minRequired[requirement];

  return userWeight >= minRequired[requirement];
};