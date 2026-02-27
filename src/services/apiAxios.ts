import axios, { AxiosError } from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Criamos uma instância separada para não interferir na sua função api atual
export const apiAxios = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para formatar os erros do Django e facilitar o seu Toast
apiAxios.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError | any) => {
    const data = error.response?.data;
    
    // Formatamos o erro exatamente como o seu handleSubmit espera
    const formattedError = {
      status: error.response?.status || 500,
      message: data?.detail || data?.message || "Erro na requisição",
      errors: data?.errors || data || {}, // Aqui entra o {'whatsapp_number': [...]}
    };

    return Promise.reject(formattedError);
  }
);