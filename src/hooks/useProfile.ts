"use client";

import { useState, useEffect } from "react";
import { getMyProfile, updateMyProfile } from "@/services/auth";
import { UserProfile } from "@/interfaces/userProfile";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "@/components/Notification";

export function useProfile() {
  // Pegamos o refresh e o setUser do Store
  const { refresh, setUser, user } = useAuthStore();

  // Inicializamos o perfil com o que já temos no cache do Store (Instantâneo!)
  const [profile, setProfile] = useState<UserProfile | null>(user?.profile || null);
  const [loading, setLoading] = useState(!user?.profile); // Se já tem cache, não mostra loading inicial
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Busca os dados atualizados do servidor
  const fetchProfile = async () => {
    try {
      // Se não houver perfil no cache, ativamos o loading
      if (!profile) setLoading(true);

      const data = await getMyProfile();
      setProfile(data);

      // Sincroniza o Store caso os dados do servidor sejam diferentes do cache
      if (user) {
        setUser({ ...user, profile: data });
      }
    } catch (err: any) {
      setError("Não foi possível carregar os dados atualizados.");
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (data: any) => {
    try {
      setIsSaving(true);
      setError(null);

      // 1. Envia para o servidor
      const updatedProfile = await updateMyProfile(data);

      // 2. Atualiza o estado local do Hook
      setProfile(updatedProfile);

      // 3. ATUALIZAÇÃO ESTRATÉGICA: 
      // Em vez de dar um refreshSession() (outra chamada API),
      // atualizamos o Store manualmente com os dados que o servidor acabou de devolver.
      if (user) {
        setUser({
          ...user, profile: {
            name: updatedProfile.name,
            last_name: updatedProfile.last_name,
            ocupation: updatedProfile.ocupation,
            email_contato: updatedProfile.email_contato,
            bio: updatedProfile.bio,
            phone: updatedProfile.phone,
            data_nascimento: updatedProfile.data_nascimento
          }
        });
      }

      return updatedProfile;
    } catch (err: any) {
      // A nova api.ts já traz o erro estruturado
      const msg = err.message || "Erro ao salvar alterações.";
      setError(msg);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    isSaving,
    error,
    saveProfile,
    refresh: fetchProfile
  };
}