import { useState, useEffect } from 'react';
import { getCategoriesForSelect } from '@/services/categoriesService';

export function useCategoryOptions(companyId?: string, isOpen: boolean = false) {
    const [options, setOptions] = useState<{ id: string, name: string }[]>([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const load = async () => {
            setLoading(true);
            try {
                const data = await getCategoriesForSelect(companyId);
                console.log('DADA',data);
                setOptions(data);
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [isOpen, companyId]);

    return { options, loading };
}