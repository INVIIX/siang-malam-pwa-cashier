import apiClient from '@/lib/apiClient';
import { useInfiniteQuery } from '@tanstack/react-query';
import { TProduct } from './cart-utils';

type TApiResponse = {
    data: TProduct[];
    links: Record<string, string | null>;
}

export const useInfiniteProductQuery = (search: string) => {
    return useInfiniteQuery<TApiResponse, Error>({
        queryKey: ['products', search],
        queryFn: async ({ pageParam }) => {
            const res = await apiClient.get<TApiResponse>('datasheets/products', {
                params: {
                    page: pageParam,
                    search: search,
                    order: "name",
                    sort: "asc"
                }
            });
            return res.data;
        },
        getNextPageParam: (lastPage) => {
            const nextUrl: string | null = lastPage?.links?.next ?? null;
            if (!nextUrl) return undefined;
            return new URL(nextUrl).searchParams.get('page');
        },
        initialPageParam: 1,
        staleTime: 0,
        gcTime: 0,
        maxPages: 19
    });
};
