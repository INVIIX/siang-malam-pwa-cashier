import { ColumnDef, ColumnFiltersState, getCoreRowModel, getSortedRowModel, GlobalFilterTableState, PaginationState, RowSelectionState, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table";
import BaseTable from "./base-table";
import * as React from "react"

import { Pagination } from "./pagination";
import { Toolbar } from "./toolbar";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";
import apiClient from "@/lib/apiClient";

export type FilterControlType<T extends Record<string, any>> = {
    keyValue: keyof T;
    keyLabel: keyof T;
};

export type FilterOptionItemType<T extends Record<string, any>> = {
    title: string;
    columnProp: string;
    control: FilterControlType<T>;
    data: T[];
};

// Array gabungan dengan berbagai tipe data
export type ColumnsFilterOptionsType = FilterOptionItemType<Record<string, any>>[];

interface DataTableProps<T extends { id: number | string }> {
    columns: ColumnDef<T>[];
    columnsFilterOptions?: ColumnsFilterOptionsType;
    source: string;
}

const fallbackData: [] = [];

export default function DataTable<T extends { id: number | string }>({ columns, source, columnsFilterOptions = undefined }: DataTableProps<T>) {
    const [pagination, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState<GlobalFilterTableState>();
    const search = useDebounce(globalFilter, 500);
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

    const [params, setParams] = React.useState<{ page?: number, search?: string } | {}>({});
    const { data } = useQuery({
        queryKey: [source, params],
        queryFn: async () => {
            const response = await apiClient.get(source, {
                params: params
            })
            return response.data;
        }
    })

    const table = useReactTable({
        data: data?.data ?? fallbackData,
        columns,
        state: {
            pagination,
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
        },
        getCoreRowModel: getCoreRowModel(),

        // Starting Pagination 
        manualPagination: true,
        onPaginationChange: setPagination,
        rowCount: data?.meta?.total,
        pageCount: data?.meta?.last_page ?? -1,

        // Sort Order
        onSortingChange: setSorting,

        // Search & Filter
        manualFiltering: true,
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters,

        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onColumnVisibilityChange: setColumnVisibility,
        getSortedRowModel: getSortedRowModel(),
    })

    React.useEffect(() => {
        const newParams = { ...params, ...{ page: pagination.pageIndex + 1, per_page: pagination.pageSize } };
        setParams(newParams)
    }, [pagination])

    React.useEffect(() => {
        if (sorting.length > 0) {
            const orderValue = sorting[0]?.id;
            const sortValue = sorting[0]?.desc === false ? 'asc' : 'desc';
            const newParams = { ...params, ...{ order: orderValue, sort: sortValue } };
            setParams(newParams)
        }
    }, [sorting])

    React.useEffect(() => {
        const newParams = { ...params, ...{ search: search, page: (search ? 1 : pagination.pageIndex + 1) } };
        setParams(newParams)
    }, [search])

    React.useEffect(() => {
        const paramColumnFilters: Record<string, any> = {};
        columnFilters.map((row) => {
            paramColumnFilters[row.id] = row.value;
        });
        const newParams = { ...params, ...{ filters: paramColumnFilters } };
        setParams(newParams)
    }, [columnFilters])

    return <>
        <div className="w-full grid gap-2">
            <Toolbar table={table} columnsFilterOptions={columnsFilterOptions} />
            <BaseTable table={table} />
            <Pagination table={table} />
        </div>
    </>
}