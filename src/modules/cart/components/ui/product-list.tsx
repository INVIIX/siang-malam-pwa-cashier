import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react"
import { cn, money } from "@/lib/utils";
import { TProduct } from "../../helpers/cart-utils";
import { useInfiniteProductQuery } from "../../helpers/use-infinite-product-query";
import { useEffect, useRef } from "react";

type TApiResponse = {
    message?: string;
    errors?: [];
    data: TProduct[];
    meta?: Record<string, string | number | null | boolean>;
    links?: Record<string, string | number | null | boolean>;
}

type ProductListProps = {
    search: string,
    onAddItem?: (data: TProduct) => void
} & React.ComponentProps<"form">

export function ProductList({ className, search, onAddItem }: ProductListProps) {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteProductQuery(search);
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
        <div className={cn("w-full h-full flex flex-col gap-4", className)}>
            {
                data && data.pages.map((page) => {
                    const currentPage = page as TApiResponse;
                    return currentPage.data.map((product, key) => {
                        return <div key={key} className="w-full bg-white rounded-lg p-3 flex justify-between gap-2 shadow-sm">
                            <div className="leading-none">
                                <p className="font-semibold">{product.name}</p>
                                <span className="text-sm">{money(product.default_price)}</span>
                            </div>
                            <Button onClick={() => onAddItem && onAddItem(product)}>
                                <PlusIcon />
                            </Button>
                        </div>
                    })
                })
            }
            <div ref={bottomRef} className="h-10" />
            {isFetchingNextPage && <p>Loading more...</p>}
        </div>
    </>
}