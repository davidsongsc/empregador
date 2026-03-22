import { SyncResponse } from "@/interfaces/iSyncResponse";
import { api } from "@/lib/api";


/**
 * ROTA DE SINCRONISMO DELTA:
 * Compara o hash local com o servidor e traz apenas mutações.
 */
export async function getJobDeltaSync(currentSequenceId: string): Promise<SyncResponse | null> {
  try {
    const response = await api(`/sincronismo/vagas/`, {
      method: "GET",
      headers: {
        // O servidor usa esse header para saber de qual ponto da história você parou
        "If-None-Match": currentSequenceId || "0",
      },
      credentials: "include",
    });

    // Se a sua função 'api' não lançar erro no 304, tratamos aqui:
    if (response.status === 304) return { action: "NOP", new_hash: currentSequenceId, patches: [] };

    return response;
  } catch (error: any) {
    // Caso o helper 'api' trate 304 como erro:
    if (error.status === 304) return { action: "NOP", new_hash: currentSequenceId, patches: [] };
    throw error;
  }
}