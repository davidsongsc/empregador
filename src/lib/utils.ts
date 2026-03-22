import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utilitário para fundir classes Tailwind de forma inteligente,
 * resolvendo conflitos e permitindo lógica condicional.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}