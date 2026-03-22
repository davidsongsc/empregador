import { CepResponse } from "@/interfaces/iCep";

export const cepService = {
    /**
     * Consulta um endereço através do CEP.
     * @param cep String com o CEP (com ou sem máscara)
     */
    getAddressByCep: async (cep: string): Promise<CepResponse> => {
        // Remove caracteres não numéricos
        const cleanCep = cep.replace(/\D/g, "");

        // Validação básica de formato
        if (cleanCep.length !== 8) {
            throw new Error("Formato de CEP inválido. Deve conter 8 dígitos.");
        }

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
            
            if (!response.ok) {
                throw new Error("Erro na comunicação com o serviço de CEP.");
            }

            const data: CepResponse = await response.json();

            // O ViaCEP retorna erro: true em vez de status 404 para CEPs não encontrados
            if (data.erro) {
                throw new Error("CEP não encontrado na base de dados.");
            }

            return data;
        } catch (error) {
            throw error;
        }
    }
};