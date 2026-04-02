import { Address } from "@/interfaces/iAddress";
import { api } from "@/lib/api";

export async function getUserAddresses(usuarioId: string, page: number = 1, currentHash?: string) {
  const headers: Record<string, string> = {};

  if (currentHash) {
    headers["If-None-Match"] = currentHash;
  }

  return await api(`/api/v1/enderecos/usuario/${usuarioId}?pagina=${page}`, {
    method: "GET",
    headers,
    credentials: "include",
  });
}

/**
 * Obtém um único endereço pelo ID.
 */
export async function getAddressById(id: string, currentHash?: string) {
  const headers: Record<string, string> = {};

  if (currentHash) {
    headers["If-None-Match"] = currentHash;
  }

  return await api(`/api/v1/enderecos/${id}`, {
    method: "GET",
    headers,
    credentials: "include",
  });
}

/**
 * Cria um novo endereço para o usuário logado.
 * O backend vincula automaticamente ao ID do token.
 */
export async function createAddress(addressData: Partial<Address>) {
  return await api("/api/v1/enderecos/", {
    method: "POST",
    body: JSON.stringify(addressData),
    credentials: "include",
    headers: { "Content-Type": "application/json" }
  });
}

/**
 * Atualiza campos específicos de um endereço (Delta Patching).
 */
export async function updateAddress(id: string, addressData: Partial<Address>) {
  return await api(`/api/v1/enderecos/${id}`, {
    method: "PATCH",
    body: JSON.stringify(addressData),
    credentials: "include",
    headers: { "Content-Type": "application/json" }
  });
}

/**
 * Remove um endereço permanentemente.
 */
export async function deleteAddress(id: string) {
  return await api(`/api/v1/enderecos/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
}

/**
 * Cria um endereço vinculado a uma Vaga (Job) específica.
 * O backend associa o endereço ao job_id e atualiza o local_amigavel da vaga.
 */
export async function createJobAddress(jobId: string, addressData: Partial<Address>) {
  return await api(`/api/v1/enderecos/job/${jobId}`, {
    method: "POST",
    body: JSON.stringify(addressData),
    credentials: "include",
    headers: { 
        "Content-Type": "application/json" 
    }
  });
}