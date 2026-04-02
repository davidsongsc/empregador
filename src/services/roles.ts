// @/services/roles.ts
import { api } from "@/lib/api";

interface GetRolesParams {
  page?: number;
  limit?: number;
  busca?: string;
  category?: string;
}

export async function getRoles(params: GetRolesParams = {}) {
  const query = new URLSearchParams();

  if (params.page) query.append("page", String(params.page));
  if (params.limit) query.append("limit", String(params.limit));
  if (params.busca) query.append("busca", params.busca);
  if (params.category) query.append("category", params.category);

  const response = await api(`/api/v1/roles/roles/?${query.toString()}`);

  if (!response.ok) {
    throw new Error(response.message || "Erro ao buscar roles");
  }

  return response;
}

export async function createRole(data: { name: string; category: string }) {
  return await api("/api/v1/roles/roles/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}