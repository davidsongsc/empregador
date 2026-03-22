import { useAuthStore } from "@/store/useAuthStore";

export const getActiveMembership = () => {
  // Acessamos o estado ATUAL da store sem usar hooks
  const { user, activeCompanyId } = useAuthStore.getState();

  if (!user?.profile?.empresas || !activeCompanyId) return null;

  return user.profile.empresas.find(
    (empresa: any) => empresa.id === activeCompanyId
  ) || null;
};