export type Address = {
  id: string;
  usuario_id: string;
  empresa_id: string | null;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  cidade: string;
  estado: string;
  is_default: boolean;
  latitude: number | null;
  longitude: number | null;
};

export type PaginatedAddressResponse = {
  total: number;
  pagina: number;
  tamanho: number;
  paginas_totais: number;
  data_hash: string;
  enderecos: Address[] | null; // Pode vir null se o hash bater (304/Delta)
};
