import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table"
import { DownloadIcon, FileTextIcon, Trash2Icon } from "lucide-react";

interface SelectedActionsProps<TData> {
    table: Table<TData>
}

export function SelectedActions<TData>({ table }: SelectedActionsProps<TData>) {
    const selectedCount = table?.getFilteredSelectedRowModel()?.rows?.length ?? 0;
    return <>
        {
            selectedCount > 0 && <div className="flex items-center gap-2">
                <div className="flex-1 text-sm text-muted-foreground">
                    {selectedCount} row{selectedCount > 1 ? "'s" : ''} selected.
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm"><Trash2Icon /></Button>
                    <Button variant="outline" size="sm"><FileTextIcon /></Button>
                    <Button variant="outline" size="sm"><DownloadIcon /></Button>
                </div>
            </div>
        }
    </>
}