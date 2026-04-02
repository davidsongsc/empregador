
import { useEffect, useState } from "react";
import { getRoles } from "@/services/roles";

export function useRoleSearch(search: string) {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!search || search.length < 3) {
            setResults([]);
            return;
        }

        const delayDebounce = setTimeout(async () => {
            try {
                setLoading(true);

                const data = await getRoles({
                    busca: search,
                    limit: 5,
                });

                setResults(data.items || []);
            } catch (err) {
                console.error("Erro ao buscar roles:", err);
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [search]);

    return { results, loading };
}