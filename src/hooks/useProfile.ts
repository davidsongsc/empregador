"use client";

import { useState, useEffect } from "react";
import { getMyProfile, updateMyProfile } from "@/services/auth";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfile } from "@/interfaces/userProfile";

export function useProfile() {
  const { refreshSession } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Busca os dados do perfil ao carregar
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getMyProfile();
      setProfile(data);
    } catch (err: any) {
      setError("Não foi possível carregar os dados do perfil.");
    } finally {
      setLoading(false);
    }
  };

  // Função para salvar alterações (incluindo o endereço aninhado)
  const saveProfile = async (data: any) => {
    try {
      setIsSaving(true);
      setError(null);
      const updatedData = await updateMyProfile(data);

      setProfile(updatedData);

      // Atualiza o contexto global (nome do user no header, etc)
      await refreshSession();

      return updatedData;
    } catch (err: any) {
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