import { Address } from "./iAddress";

export interface AddressState {
    addresses: Address[];
    total: number;
    lastHash: string | null;
    loading: boolean;

    // Ações
    fetchAddresses: (usuarioId: string, page?: number) => Promise<void>;
    addAddressLocal: (newAddress: Address) => void;
    clearCache: () => Promise<void>;
    addAddress: (newAddress: Address) => Promise<void>;
    editAddress: (id: string, updateData: Partial<Address>) => Promise<void>;
}
