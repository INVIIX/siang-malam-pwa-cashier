"use client"

import { Row } from "@tanstack/react-table"
import { Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ConfirmDeleteDialog } from "./confirm-delete"
import { ReactNode } from "react"

interface RowActionsProps<TData> {
    children?: ReactNode,
    row: Row<TData>,
    onRowDelete: (id: number | string | null) => void,
    primaryKeyName?: string
}

export function RowActions<TData>({ 
    children,
    row,
    onRowDelete,
    primaryKeyName = 'id'
}: RowActionsProps<TData>) {
    const rowData = row.original as { [key: string]: any };
    const primaryKey = rowData[primaryKeyName];
    return (
        <div className="flex justify-end gap-2">
            {children}
            <ConfirmDeleteDialog onConfirm={() => onRowDelete(primaryKey)}>
                <Button variant="outline">
                    <Trash2Icon />
                </Button>
            </ConfirmDeleteDialog>
        </div>
    )
}