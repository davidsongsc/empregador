/**
 * Interface para a resposta da API ViaCEP
 */
export interface CepResponse {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    estado: string;
    regiao: string;
    ibge: string;
    ddd: string;
    erro?: boolean; 
    unidade?: string;
    gia?: string;
    siafi?: string;
}