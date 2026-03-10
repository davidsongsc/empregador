import { useState } from "react";
import { updateApplicationStatus } from "@/services/jobService";
import { toast } from "@/components/Notification";
import { STATUS_CONFIG, FLOW_SEQUENCE } from "@/data/statusLabels";

export function useCandidateActions(updateStatusInHook: Function) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (appId: string, newStatus: string, onUpdateSuccess?: (updatedApp: any) => void) => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await updateApplicationStatus(appId, newStatus);
      updateStatusInHook(appId, newStatus);
      toast.success(`Protocolo: ${STATUS_CONFIG[newStatus].label}`);
      if (onUpdateSuccess) onUpdateSuccess({ id: appId, status: newStatus });
    } catch (err) {
      toast.error("Erro na reescrita de dados");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNextStep = async (app: any, onUpdateSuccess?: (updatedApp: any) => void) => {
    const currentIndex = FLOW_SEQUENCE.indexOf(app.status);
    if (currentIndex !== -1 && currentIndex < FLOW_SEQUENCE.length - 1) {
      const nextStatus = FLOW_SEQUENCE[currentIndex + 1];
      await handleStatusChange(app.id, nextStatus, onUpdateSuccess);
    }
  };

  return { isUpdating, handleNextStep, handleStatusChange };
}