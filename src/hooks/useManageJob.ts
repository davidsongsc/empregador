// hooks/useManageJob.ts
import { deleteJob } from "@/services/jobs";
import { toast } from "@/components/Notification";
import { useState } from "react";

export function useManageJob() {
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);

  // 1. Prepara a exclusão (Abre o Modal Delos)
  const openDeleteConfirmation = (uid: string) => {
    setJobToDelete(uid);
    setIsDeleteModalOpen(true);
  };

  // 2. Executa a exclusão (Confirmar no Modal)
  const confirmRemoval = async (jobToDelete: string) => {
    if (!jobToDelete) return false;

    setLoading(true);
    try {
      // Chama o service com a URL /vagas/UID/editar/
      await deleteJob(jobToDelete);
      toast.success("Instance_Terminated");
      setIsDeleteModalOpen(false);
      return true;
    } catch (err: any) {
      toast.error("Deletion_Failed: Falha no Protocolo.");
      return false;
    } finally {
      setLoading(false);
      setJobToDelete(null);
    }
  };

  return { 
    openDeleteConfirmation, 
    confirmRemoval, 
    isDeleteModalOpen, 
    setIsDeleteModalOpen, 
    loading 
  };
}