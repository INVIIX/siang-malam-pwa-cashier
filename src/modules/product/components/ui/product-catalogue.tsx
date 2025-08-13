import { ImageWithFallback } from "@/components/commons/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { cn, money } from "@/lib/utils";
import { PlusIcon, SearchIcon } from "lucide-react";
import { IProduct } from "../../types/product";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

export function ProductCatalogueListItem({
    product,
    handleAction,
    className,
    ...props
}: {
    product: IProduct,
    handleAction?: (data: IProduct) => void
} & React.ComponentProps<"div">
) {
    const handleClick = () => {
        if (handleAction) {
            handleAction(product)
        }
    }
    return <>
        <div className={cn("w-full flex gap-2 bg-white shadow-md rounded-md p-2", className)} {...props}>
            <div className="">
                <AspectRatio ratio={1}>
                    <ImageWithFallback className="rounded-md object-cover" />
                </AspectRatio>
            </div>
            <div className="w-full flex-1 leading-none">
                <p className="font-semibold">{product.name}</p>
                <span className="text-sm">{money(product.default_price)}</span>
            </div>
            <div>
                <Button className="shadow-sm" variant="outline" size="lg" onClick={handleClick}>
                    <PlusIcon /> Tambahkan
                </Button>
            </div>
        </div>
    </>
}

interface TApiResponse {
    data: IProduct[];
    links: Record<string, string | null>;
}

export function ProductCatalogueList({
    search,
    filter,
    handleAction,
    className,
    ...props
}: {
    filter?: {
        category_id: number | null
    },
    search?: string,
    handleAction?: (data: IProduct) => void
} & React.ComponentProps<"div">) {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<TApiResponse, Error>({
        queryKey: ['products', search, filter],
        queryFn: async ({ pageParam }) => {
            const response = await apiClient.get<TApiResponse>('datasheets/products', {
                params: {
                    page: pageParam,
                    search: search,
                    order: "name",
                    sort: "asc",
                    filters: filter
                }
            });
            const result = response.data
            return result;
        },
        getNextPageParam: (response: any) => {
            const nextUrl: string | null = response?.links?.next ?? null;
            if (!nextUrl) return undefined;
            return new URL(nextUrl).searchParams.get('page');
        },
        initialPageParam: 1,
        staleTime: 0,
        gcTime: 0,
        maxPages: 19
    });
    const bottomRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 1 }
        );

        const current = bottomRef.current;
        if (current) observer.observe(current);
        return () => {
            if (current) observer.unobserve(current);
        };
    }, [bottomRef.current, hasNextPage]);

    return <>
        <div className={cn("size-full flex flex-col gap-2", className)} {...props}>
            {
                data && data.pages.map((page) => {
                    const currentPage = page as TApiResponse;
                    return currentPage.data.map((product, key) => {
                        return <ProductCatalogueListItem key={key} product={product} handleAction={handleAction} />
                    })
                })
            }
            <div ref={bottomRef} className="h-10" />
            {isFetchingNextPage && <p>Loading more...</p>}
        </div>
    </>
}

export function ProductCatalogueSearch({ className, value, onChangeValue }: { value: string, onChangeValue: (value: string) => void } & React.ComponentProps<"div">) {
    return <>
        <div className={cn("w-full h-auto relative", className)}>
            <SearchIcon className="absolute top-1/2 -translate-y-1/2 ms-3 text-gray-500" />
            <Input type="search" className="ps-11 bg-white w-full" placeholder="Cari menu atau produk"
                value={value}
                onChange={(e) => { onChangeValue(e.target.value) }}
            />
        </div>
    </>
}

export function ProductCatalogueCategory({ className, value, onSelectedValue }: { value: number | null, onSelectedValue: (value: number | null) => void } & React.ComponentProps<"div">) {
    const { data } = useQuery({
        queryKey: ['category'],
        queryFn: async (): Promise<{ id: number | null; name: string }[]> => {
            const response = await apiClient.get('datasheets/categories');
            return response.data.data;
        }
    })
    return <>
        {
            data && <div className={cn(["w-full flex gap-2 overflow-visible overflow-x-auto", className])}>
                <Button className="shadow-sm" variant={value == null ? 'default' : 'outline'} onClick={() => onSelectedValue(null)}>Semua</Button>
                {data.map((category, key) => <Button className="shadow-sm" variant={value == category.id ? 'default' : 'outline'} key={key} onClick={() => onSelectedValue(category.id)}>{category.name}</Button>)}
            </div>
        }
    </>
}

export function ProductCatalogue({ className, handleAction, ...props }: { handleAction?: (data: IProduct) => void } & React.ComponentProps<"div">) {
    const [search, setSearch] = useState<string>('');
    const [filter, setFilter] = useState<{ category_id: number | null }>({ category_id: null });
    const debouncedSearch = useDebounce(search, 300);
    return <>
        <div className={cn("flex flex-col gap-2", className)} {...props}>
            <div className="h-auto flex flex-col gap-2 overflow-visible">
                <ProductCatalogueSearch value={search} onChangeValue={(val) => setSearch(val)} />
                <ProductCatalogueCategory value={filter.category_id} onSelectedValue={(val) => setFilter({ ...filter, ...{ category_id: val } })} />
            </div>
            <ProductCatalogueList className="flex-1 h-full overflow-y-auto" search={debouncedSearch} filter={filter} handleAction={handleAction} />
        </div>
    </>
}