import { api } from "@/lib/api";

export async function login(
  whatsappNumber: string,
  password: string
) {
  try {
    return await api("/auth/login/", {
      method: "POST",
      body: JSON.stringify({
        whatsapp_number: whatsappNumber,
        password,
      }),
    });
  } catch (err: any) {
    if (err?.errors?.whatsapp_number) {
      throw new Error(err.errors.whatsapp_number[0]);
    }

    if (err?.errors?.password) {
      throw new Error(err.errors.password[0]);
    }

    if (err?.detail) {
      throw new Error(err.detail);
    }

    throw new Error("WhatsApp ou senha inválidos");
  }
}