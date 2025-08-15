"use client"

import { useParams } from "react-router"
import { Button } from "@/components/ui/button"
import { PrinterIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { encodeReceipt, previewReceipt } from "../../cashier/helpers/receipt-printer-encoder"
import { TInvoice } from "@/modules/cart/helpers/cart-utils"
import { useQuery } from "@tanstack/react-query"
import apiClient from "@/lib/apiClient"
import { useJSPM } from "@/modules/printer/components/context/jspm-context"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react"
import { useAuth } from "@/modules/auth/components/context/auth-context"

export default function dataDetailPage() {
    const { user } = useAuth()
    const { invoiceId } = useParams()
    const [printerCommands, setPrinterCommands] = useState<number[]>([])
    const { data, isLoading } = useQuery({
        queryKey: ["invoice-show", invoiceId],
        queryFn: async (): Promise<TInvoice | undefined> => {
            const response = await apiClient.get(`invoices/${invoiceId}`)
            const data = response.data.data
            return data ?? {}
        },
    })
    useEffect(() => {
        if (data) {
            setPrinterCommands(
                encodeReceipt(data, user?.department?.name ?? "RM. Siang Malam", user?.branch?.name ?? "-")
            )
        }
    }, [data])
    const { isReady, printers, selectedPrinter, changePrinter, printCommand } = useJSPM()
    const handlePrint = () => {
        printCommand(printerCommands)
    }
    return (
        <>
            <section className="size-full flex flex-col">
                <div className="p-4">
                    {!isLoading && data && (
                        <Card className="w-full">
                            <CardHeader className="text-center">
                                <CardTitle>Nota Penjualan</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="max-w-full mx-auto overflow-x-auto">
                                    <pre>
                                        {previewReceipt(
                                            data,
                                            user?.department?.name ?? "RM. Siang Malam",
                                            user?.branch?.name ?? "-"
                                        )}
                                    </pre>
                                </div>
                                <div className="grid gap-4">
                                    <Button className="w-full h-12" onClick={handlePrint} disabled={!isReady}>
                                        <div className="flex justify-between gap-4">
                                            <span>Cetak Ulang</span>
                                            <PrinterIcon className="size-6"></PrinterIcon>
                                        </div>
                                    </Button>
                                    <Select
                                        value={selectedPrinter}
                                        onValueChange={(value) => {
                                            changePrinter(value)
                                        }}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a fruit" />
                                        </SelectTrigger>
                                        <SelectContent className="w-full">
                                            <SelectGroup>
                                                <SelectLabel>Fruits</SelectLabel>
                                                {printers?.map((printer: any, key: number) => {
                                                    return (
                                                        <SelectItem key={key} value={printer.name}>
                                                            {printer.name}
                                                        </SelectItem>
                                                    )
                                                })}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </section>
        </>
    )
}
