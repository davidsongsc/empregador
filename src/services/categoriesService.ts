import { api } from '@/lib/api';

let categoriesCache: Record<string, any[]> = {};

export async function getCategoriesForSelect(companyId?: string) {
    const cacheKey = companyId || 'global';

    if (categoriesCache[cacheKey]) {
        return categoriesCache[cacheKey];
    }

    // Verifique se seu lib/api já não adiciona o /api/v1 automaticamente!
    const query = companyId ? `?company_id=${companyId}` : '';
    const response = await api(`/api/v1/categories/categories/select/options${query}`);
    console.log('dede', response);
    // LOG DE SEGURANÇA: Abra o console e veja o que aparece aqui
    console.log("Raw Response from API:", response);

    // Lógica de Extração:
    // 1. Se response for um array, usa ele.
    // 2. Se for um objeto com .data (padrão Axios), usa .data.
    // 3. Se tiver .results (padrão Paginated), usa .results.
    let data = [];

    // 1. Se for um Array nativo (como vimos no CURL anterior)
    if (Array.isArray(response)) {
        data = response;
    }
    // 2. Se for esse objeto indexado ("0", "1", etc.)
    else if (response && typeof response === 'object') {
        // Pegamos apenas os valores que possuem um ID (ignorando a chave "ok")
        data = Object.values(response).filter((item: any) => item && item.id);
    }

    if (data.length > 0) {
        categoriesCache[cacheKey] = data;
        return data;
    }

    return [];
}

export const clearCategoriesCache = () => { categoriesCache = {}; };