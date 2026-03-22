import { useEffect, useState } from 'react';

/**
 * Hook para atrasar a atualização de um valor.
 * Útil para evitar múltiplas chamadas à API (Protocolo Delta) durante a digitação.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Define um timer para atualizar o valor após o delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpa o timer se o valor mudar antes do tempo (limpeza do efeito)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}