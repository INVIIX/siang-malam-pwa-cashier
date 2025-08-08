import apiClient from '@/lib/apiClient';
import { useQuery } from '@tanstack/react-query';

type PaginatedResponse<T> = {
    data: T[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
};

export function useDataTableQuery<T>(
    endpoint: string
) {
    return useQuery<PaginatedResponse<T>>({
        queryKey: [endpoint],
        queryFn: async () => {
            const res = await apiClient.get(endpoint);
            return res.data;
        },
        placeholderData: (prev) => prev,
    });
}

