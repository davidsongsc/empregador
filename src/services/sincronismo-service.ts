import { api } from "@/lib/api";

interface SyncResponse {
  action: "APPLY_PATCHES" | "FULL_RELOAD" | "NOP";
  new_hash: string;
  patches: Array<{
    uid: string;
    type: 'CREATED' | 'UPDATED' | 'DELETED';
    data: any;
  }>;
}

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