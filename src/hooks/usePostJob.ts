import { useState } from "react";
import { createJob } from "@/services/jobs";
import { useRouter } from "next/navigation";

export function usePostJob() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const postJob = async (formData: any) => {
    setLoading(true);
    setError(null);
    try {
      await createJob(formData);
      // Redireciona para o home ou dashboard após sucesso
      router.push("/"); 
    } catch (err: any) {
      setError(err?.detail || "Erro ao publicar a vaga. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  };

  return { postJob, loading, error };
}