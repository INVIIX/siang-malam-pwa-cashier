import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import {
    Command,
    CommandInput,
    CommandList,
    CommandItem,
    CommandEmpty,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

export interface Option {
    value: string;
    label: string;
}

interface SelectPaginationProps {
    value: string | string[];
    onChange: (val: string | string[]) => void;
    placeholder?: string;
    multiple?: boolean;
    fetchOptions: (params: {
        search: string;
        page: number;
    }) => Promise<{ items: Option[]; hasMore: boolean }>;
    className?: string;
}

export const SelectPagination = ({
    value,
    onChange,
    placeholder = "Select...",
    multiple = false,
    fetchOptions,
    className,
}: SelectPaginationProps) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [, setPage] = useState(0);
    const listRef = useRef<HTMLDivElement>(null);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
    } = useInfiniteQuery({
        queryKey: ["infinite-select", search],
        queryFn: async ({ pageParam = 0 }) => await fetchOptions({ search, page: pageParam }),
        getNextPageParam: (lastPage, _, lastPageParam) =>
            lastPage.hasMore ? lastPageParam + 1 : undefined,
        initialPageParam: 0,
    });

    const options = data?.pages.flatMap((page) => page.items) || [];

    useEffect(() => {
        const debounce = setTimeout(() => {
            setPage(0);
            refetch();
        }, 300);
        return () => clearTimeout(debounce);
    }, [search]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (
            scrollTop + clientHeight >= scrollHeight - 10 &&
            hasNextPage &&
            !isFetchingNextPage
        ) {
            fetchNextPage();
        }
    };

    const isSelected = (val: string) =>
        multiple && Array.isArray(value)
            ? value.includes(val)
            : value === val;

    const toggleValue = (val: string) => {
        if (multiple) {
            if (!Array.isArray(value)) return;
            onChange(
                value.includes(val)
                    ? value.filter((v) => v !== val)
                    : [...value, val]
            );
        } else {
            onChange(val);
            setOpen(false);
        }
    };

    const displayLabel = () => {
        if (multiple && Array.isArray(value)) {
            if (value.length === 0) return placeholder;
            return `${value.length} selected`;
        } else {
            const selected = options.find((opt) => opt.value === value);
            return selected?.label ?? placeholder;
        }
    };

    const triggerRef = useRef<HTMLButtonElement>(null);
    const [triggerWidth, setTriggerWidth] = useState<number>(0);

    useEffect(() => {
        if (triggerRef.current) {
            setTriggerWidth(triggerRef.current.offsetWidth);
        }
    }, [open]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    ref={triggerRef}
                    variant="outline"
                    role="combobox"
                    className={`w-full justify-between ${className}`}
                >
                    <span>{displayLabel()}</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                sideOffset={4}
                style={{ width: triggerWidth }}
                className="p-0"
            >
                <Command>
                    <CommandInput
                        placeholder="Search..."
                        value={search}
                        onValueChange={setSearch}
                    />
                    <CommandList
                        ref={listRef}
                        onScroll={handleScroll}
                        className="max-h-60 overflow-auto"
                    >
                        {(multiple ? Array.isArray(value) && value.length > 0 : value) && (
                            <CommandItem
                                onSelect={() => {
                                    onChange(multiple ? [] : "");
                                    setOpen(false);
                                }}
                                className="text-red-500"
                            >
                                <Check className="mr-2 h-4 w-4 opacity-0" />
                                Clear selection
                            </CommandItem>
                        )}
                        {options.map((opt) => (
                            <CommandItem
                                key={opt.value}
                                onSelect={() => toggleValue(opt.value)}
                            >
                                <Check
                                    className={`mr-2 h-4 w-4 ${isSelected(opt.value) ? "opacity-100" : "opacity-0"
                                        }`}
                                />
                                {opt.label}
                            </CommandItem>
                        ))}
                        {isFetchingNextPage && (
                            <div className="p-2 text-center text-sm">Loading...</div>
                        )}
                        {!isFetchingNextPage && options.length === 0 && (
                            <CommandEmpty>No results found</CommandEmpty>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
