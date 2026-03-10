"use client";

import { useState, useCallback } from "react";
import { cepService, CepResponse } from "@/services/buscaCepService";
import { toast } from "@/components/Notification";

/**
 * Hook para gerir a lógica de procura de CEP na interface
 */
export function useBuscaCep() {
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState<CepResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const lookup = useCallback(async (cep: string) => {
        if (!cep || cep.replace(/\D/g, "").length < 8) return null;

        setLoading(true);
        setError(null);

        try {
            const data = await cepService.getAddressByCep(cep);
            setAddress(data);
            return data;
        } catch (err: any) {
            const message = err.message || "Erro ao buscar CEP";
            setError(message);
            setAddress(null);
            toast.error(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const resetCep = useCallback(() => {
        setAddress(null);
        setError(null);
    }, []);

    return {
        lookup,
        address,
        loading,
        error,
        resetCep
    };
}