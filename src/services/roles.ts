import { api } from "@/lib/api";

export type Role = {
  uid: string;
  name: string;
  category: string;
};

export async function getRoles() {
  return await api("/vagas/roles/", { method: "GET" }, true);
}

// Função para criar um novo cargo padronizado "on-the-fly"
export async function createRole(name: string) {
  return await api("/vagas/roles/", {
    method: "POST",
    body: JSON.stringify({ name, category: "Geral" }), // Categoria padrão
  });
}