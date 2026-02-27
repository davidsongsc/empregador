import { apiAxios } from "@/services/apiAxios";
export const applicationService = {
  /**
   * Envia uma nova candidatura
   * @param jobUid UID da vaga
   * @param answers Array de objetos { question_uid, answer }
   * @param resume Arquivo PDF do currículo
   */
  applyToJob: async (jobUid: string, answers: any[], resume?: File) => {
    const formData = new FormData();
    
    // 1. Dados obrigatórios
    formData.append("job", jobUid);
    
    // 2. Currículo (se houver)
    if (resume) {
      formData.append("resume", resume);
    }

    // 3. Respostas
    // O Serializer espera uma lista de objetos. Enviamos como string JSON 
    // para que o multipart/form-data aceite a estrutura aninhada.
    formData.append("respostas", JSON.stringify(answers));

    try {
      // Usamos a rota padrão do ViewSet: /api/vagas/applications/
      return await apiAxios.post("/vagas/candidaturas/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (err: any) {
      throw err;
    }
  },

  /**
   * Busca candidatos de uma vaga específica (Visão do Recrutador)
   */
  getJobApplications: async (jobId: string) => {
    // Usamos o filtro que você definiu no filterset_fields da ViewSet
    return await apiAxios.get(`/vagas/candidaturas/?job=${jobId}`);
  },

  /**
   * Atualiza o status de uma candidatura (Mudar fase do funil)
   */
  updateApplicationStatus: async (applicationId: string, status: string) => {
    return await apiAxios.patch(`/vagas/candidaturas/${applicationId}/`, {
      status
    });
  }
};