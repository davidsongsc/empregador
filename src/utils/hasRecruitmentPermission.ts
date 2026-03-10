import { MODULE_PERMISSIONS } from "@/constants/permissions";

/**
 * Verifica se o usuário tem acesso a um módulo específico 
 * baseado na lista de empresas vinculadas ao seu perfil.
 */
export const checkModuleAccess = (
  empresas: any[] | undefined, 
  module: keyof typeof MODULE_PERMISSIONS
): boolean => {
  // 1. Defesa: Se não houver empresas ou o módulo não existir, nega o acesso
  if (!empresas || !Array.isArray(empresas) || !MODULE_PERMISSIONS[module]) {
    return false;
  }

  // 2. Método Imperativo (Loop com interrupção precoce)
  for (let i = 0; i < empresas.length; i++) {
    const empresa = empresas[i];
    
    const isAllowedRole = MODULE_PERMISSIONS[module].includes(empresa.role);
    const isEmpresaActive = empresa.is_active === true;

    if (isAllowedRole && isEmpresaActive) {
      return true; // Encontrou uma permissão válida, para a execução aqui.
    }
  }

  return false;
};