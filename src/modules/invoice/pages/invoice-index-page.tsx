"use client"

import { InvoiceDataTable } from "../ui/invoice-data-table";

export default function InvoiceIndexPage() {
    return (
        <>
            <section className="size-full flex flex-col gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Tagihan Penjualan</h2>
                    <p className="text-muted-foreground">Daftar riwayat tagihan penjualan dan transaksi kasir anda saat ini.</p>
                </div>
                <div className="bg-white p-4 rounded-md shadow-sm">
                    <InvoiceDataTable />
                </div>
            </section>
        </>
    );
}