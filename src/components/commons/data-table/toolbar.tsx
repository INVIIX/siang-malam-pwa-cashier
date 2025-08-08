"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FacetedFilter } from "./faceted-filter"
import { ViewOptions } from "./view-options"
import { SelectedActions } from "./selected-actions"
import { ColumnsFilterOptionsType } from "./data-table"



interface ToolbarProps<TData> {
    table: Table<TData>
    columnsFilterOptions?: ColumnsFilterOptionsType
}

export function Toolbar<TData>({
    table,
    columnsFilterOptions = undefined
}: ToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0

    return (
        <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Search..."
                    onChange={(event) =>
                        table.setGlobalFilter(String(event.target.value))
                    }
                    className="h-8 w-[150px] lg:w-[250px]"
                />
                {
                    columnsFilterOptions?.map((resource, key) => {
                        return <FacetedFilter
                            key={key}
                            column={table.getColumn(resource.columnProp)}
                            title={resource.title}
                            options={resource.data}
                            control={resource.control}
                        />
                    })
                }
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <X />
                    </Button>
                )}
            </div>
            <div className="flex flex-end items-center gap-2">
                <SelectedActions table={table} />
                <ViewOptions table={table} />
            </div>
        </div>
    )
}