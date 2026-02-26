import { useState } from "react";
import { createJob } from "@/services/jobs";
import { useRouter } from "next/navigation";

// Interface de Erros atualizada para bater com o Serializer novo
export interface DjangoJobErrors {
  role?: string[];               // Novo campo obrigatório
  titulo_personalizado?: string[];
  descricao?: string[];
  company?: string[];            // Alterado de 'empresa' para 'company'
  endereco?: string[];           // Pode conter erros do objeto aninhado
  salario?: string[];
  turno?: string[];
  requisitos?: string[];         // Erros em itens da lista
  beneficios?: string[];
  perguntas?: string[];
  non_field_errors?: string[];   // Erros gerais do Django
  [key: string]: any; 
}

export function usePostJob() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<DjangoJobErrors | string | null>(null);
  const router = useRouter();

  const postJob = async (formData: any) => {
    setLoading(true);
    setError(null);
    try {
      // O formData agora deve seguir a estrutura:
      // { role: "uuid", requisitos: [{description: ""}], ... }
      await createJob(formData);
      router.push("/vagas"); // Redireciona para a listagem
    } catch (err: any) {
      console.error("Erro no postJob:", err);

      if (err.response?.data) {
        // O DRF retorna um objeto com os nomes dos campos como chaves
        setError(err.response.data);
      } else {
        setError(err.message || "Erro de conexão com o servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { postJob, loading, error };
}