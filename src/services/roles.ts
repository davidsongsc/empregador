// @/services/roles.ts
import { api } from "@/lib/api";


/**
 * Consulta a API enviando o hash atual para o Protocolo Delta
 */
export async function getRoles(currentHash?: string) {
  const headers: Record<string, string> = {
    "X-Protocol-Mode": "DELTA_SYNC",
  };
  
  if (currentHash) {
    headers["If-None-Match"] = currentHash;
  }

  return await api("/vagas/roles/", { 
    method: "GET",
    headers 
  });
}

export async function createRole(data: { name: string; category: string }) {
  return await api("/vagas/roles/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}