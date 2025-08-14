import { cn, money } from "@/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { IInvoice } from "../../types/invoice";

export function InvoiceOrderListItem({
    invoice,
    handleAction,
    className,
    ...props
}: {
    invoice: IInvoice,
    handleAction: (invoice: IInvoice) => void
} & React.ComponentProps<"button">) {
    return <>
        <Button
            variant="outline"
            className={cn("h-auto w-full flex-col text-left shadow", className)}
            {...props}
            onClick={() => { handleAction(invoice) }}
        >
            <div className="flex w-full justify-between items-center gap-2">
                <div className="grid">
                    <span>{invoice?.code}</span>
                    <span className="font-normal">Area {invoice.transaction?.table?.area?.name}</span>
                    <span>Meja {invoice.transaction?.table?.number}</span>
                </div>
                <div><span>{money(invoice.grand_total ?? 0)}</span></div>
            </div>
        </Button >
    </>
}

interface TApiResponse {
    data: IInvoice[];
    links: Record<string, string | null>;
}

export function InvoiceOrderList({
    search,
    className,
    handleAction,
    ...props
}: {
    search?: string,
    handleAction: (invoice: IInvoice) => void
} & React.ComponentProps<"div">) {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<TApiResponse, Error>({
        queryKey: ['invoice-orders', search],
        queryFn: async ({ pageParam }) => {
            const response = await apiClient.get<TApiResponse>('/invoices', {
                params: {
                    page: pageParam,
                    search: search,
                    order: "issued",
                    sort: "desc",
                    status: "unpaid"
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
                    return currentPage.data.map((invoice, key) => {
                        return <InvoiceOrderListItem key={key} invoice={invoice} handleAction={handleAction} />
                    })
                })
            }
            <div ref={bottomRef} className="h-10" />
            {isFetchingNextPage && <p>Loading more...</p>}
        </div>
    </>
}

export function InvoiceOrderSearch({ className, value, onChangeValue }: { value: string, onChangeValue: (value: string) => void } & React.ComponentProps<"div">) {
    return <>
        <div className={cn("w-full h-auto relative", className)}>
            <SearchIcon className="absolute top-1/2 -translate-y-1/2 ms-3 text-gray-500" />
            <Input type="search" className="ps-11 bg-white w-full" placeholder="Cari Invoice"
                value={value}
                onChange={(e) => { onChangeValue(e.target.value) }}
            />
        </div>
    </>
}

export function InvoiceOrder({ className, handleAction, ...props }: { handleAction: (invoice: IInvoice) => void } & React.ComponentProps<"div">) {
    const [search, setSearch] = useState<string>('');
    const debouncedSearch = useDebounce(search, 300);
    return <>
        <div className={cn("flex flex-col gap-2", className)} {...props}>
            <div className="h-auto flex flex-col gap-2 overflow-visible">
                <InvoiceOrderSearch value={search} onChangeValue={(value) => setSearch(value)} />
            </div>
            <InvoiceOrderList className="flex-1 h-full overflow-y-auto" search={debouncedSearch} handleAction={handleAction} />
        </div>
    </>
}

export function InvoiceOrderTableInfo({
    invoice,
    className,
    ...props
}: { invoice: IInvoice } & React.ComponentProps<"table">) {
    return <>
        <Table className={cn(["w-full border-separate border-spacing-0", className])} {...props}>
            <TableHeader className="sticky top-0 z-10">
                <TableRow>
                    <TableHead>Items</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    invoice.transaction.details.map((item, key) => <TableRow key={key}>
                        <TableCell className="">{item.product.name}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{money(item.price * item.quantity)}</TableCell>
                    </TableRow>)
                }
            </TableBody>
            <TableFooter className="sticky bottom-0 z-10">
                <TableRow>
                    <TableCell className="font-medium" colSpan={2}>Subtotal</TableCell>
                    <TableCell className="font-medium text-right">{money(invoice.amount)}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium" colSpan={2}>Total Tagihan</TableCell>
                    <TableCell className="font-medium text-right">{money(invoice.grand_total)}</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    </>
}