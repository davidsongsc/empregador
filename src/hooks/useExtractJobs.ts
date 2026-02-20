import { useState } from "react";
import { api } from "@/lib/api";

export function useExtractJobs() {
  const [extracting, setExtracting] = useState(false);

  const extract = async (rawText: string) => {
    setExtracting(true);
    try {
      // Aqui você chamaria uma rota sua que integra com IA (ex: /api/ai/extract)
      // Vou simular o formato de retorno esperado:
      const response = await api("/ia/extrair-vagas/", {
        method: "POST",
        body: JSON.stringify({ text: rawText }),
      });
      return response.jobs; // Array de objetos formatados para o seu Django
    } finally {
      setExtracting(false);
    }
  };

  return { extract, extracting };
}