"use client"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { money } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useCashier } from "@/modules/cashier/components/context/cashier-context"
import { FormCashierClose } from "@/modules/cashier/components/ui/form-close"
import { useEffect } from "react"

export default function DashboardPage() {
    const { summary, refetchCashier } = useCashier();
    useEffect(() => {
        refetchCashier()
    }, [])
    return <>
        <div className="grid gap-4">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">Ringkasan transaksi kasir anda saat ini.</p>
                </div>
                <div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>Tutup Kasir</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Tutup Sesi Cashier</DialogTitle>
                                <DialogDescription>Pastikan saldo kas anda telah sesuai dengan yang ada di laci.</DialogDescription>
                            </DialogHeader>
                            <FormCashierClose />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="text-end">
                        <CardDescription>Saldo Awal Kas</CardDescription>
                        <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl">
                            {money(summary.cash.initial)}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="text-end">
                        <CardDescription>Kas Masuk</CardDescription>
                        <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl">
                            {money(summary.cash.income)}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="text-end">
                        <CardDescription>Kas Keluar</CardDescription>
                        <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl">
                            {money(summary.cash.outcome)}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="text-end">
                        <CardDescription>Saldo Akhir Kas</CardDescription>
                        <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl">
                            {money(summary.cash.current)}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="text-end">
                        <CardDescription>Penjualan Tunai</CardDescription>
                        <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl">
                            {money(summary.sales.cash)}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="text-end">
                        <CardDescription>Penjualan Non Tunai</CardDescription>
                        <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl">
                            {money(summary.sales.non_cash)}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="text-end">
                        <CardDescription>Total Penjualan</CardDescription>
                        <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl">
                            {money(summary.sales.total)}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>
        </div>
    </>
}