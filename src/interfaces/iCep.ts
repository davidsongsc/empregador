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
    ibge: string;
    ddd: string;
    erro?: boolean; // Propriedade retornada pelo ViaCEP quando o CEP não existe
}