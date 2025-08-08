import { ColumnDef } from "@tanstack/react-table";
import ColumnHeader from "@/components/commons/data-table/colum-header";
import DataTable from "@/components/commons/data-table/data-table";
import { TInvoice } from "@/modules/cart/helpers/cart-utils";
import moment from 'moment';
import { money } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { ChevronRightIcon } from "lucide-react";

export function InvoiceDataTable() {
    const apiEndpoint = "invoices";
    const navigate = useNavigate();

    const columns: ColumnDef<TInvoice>[] = [
        {
            accessorKey: "issued",
            header: ({ column }) => (
                <ColumnHeader column={column} title="Tanggal" />
            ),
            cell: ({ row }) => {
                const data = row.original;
                const date = moment(data.issued).format('DD MMM HH:mm')
                return <span>{date}</span>;
            }
        },
        {
            accessorKey: "code",
            header: ({ column }) => (
                <ColumnHeader column={column} title="Invoice Number" />
            ),
            cell: ({ row }) => {
                const data = row.original;
                return <span>{data.code}</span>;
            }
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <ColumnHeader column={column} title="Status" />
            ),
            cell: ({ row }) => {
                const data = row.original;
                return <span>{data.status}</span>;
            }
        },
        {
            accessorKey: "total",
            header: ({ column }) => (
                <ColumnHeader column={column} title="Total" />
            ),
            cell: ({ row }) => {
                const data: number = row.original.grand_total;
                return <div className="w-full flex flex-row justify-end">{money(data)}</div>
            }
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => {
                const data = row.original;
                return <div className="w-full flex flex-row justify-end">
                    <Button variant="outline" size="icon" onClick={() => navigate(`/invoices/${data.id}`)}>
                        <ChevronRightIcon />
                    </Button>
                </div>
            }
        }
    ]

    return <>
        <DataTable<TInvoice>
            source={apiEndpoint}
            columns={columns}
        />
    </>
}