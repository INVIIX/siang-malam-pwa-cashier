import { Button } from "@/components/ui/button";
import apiClient from "@/lib/apiClient";
import { InvoiceOrder, InvoiceOrderTableInfo } from "@/modules/invoice/components/ui/invoice-order";
import { IInvoice, IInvoicePayments } from "@/modules/invoice/types/invoice";
import { IPaymentHandle, Payments } from "@/modules/payment/components/ui/payments";
import { TPayment } from "@/modules/payment/types/payment";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function PosResto() {
    const [invoice, setInvoice] = useState<IInvoice>();
    const queryClient = useQueryClient();
    const paymentRef = useRef<IPaymentHandle>(null);

    const submitInvoicePayment = async (formData: IInvoicePayments) => {
        try {
            const response = await apiClient.post('payments', formData);
            if (response.status == 200 || response.status == 201) {
                setInvoice(undefined);
                paymentRef.current?.clearPayments();
                queryClient.invalidateQueries({ queryKey: ['invoice-orders'], exact: false });
                queryClient.invalidateQueries({ queryKey: ['unpaid-sales-orders-count'], exact: false });
                toast.success('Pembayaran telah diterima');
            }
        } catch (err) {
            const error = err as AxiosError;
            const responseData: { message?: string } | any = error?.response?.data;
            const errorMessage = responseData?.message ?? error?.message ?? 'Failed process';
            toast.error(errorMessage)
        }
    }

    const handlePayments = (payments: TPayment[]) => {
        if (invoice) {
            const formData: IInvoicePayments = {
                invoice_code: invoice.code,
                methods: payments
            }
            const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0)
            if (invoice.grand_total <= 0) {
                toast.error('Tidak ada tagihan untuk dibayarkan');
            }
            else if (invoice.grand_total > totalPayments) {
                toast.error('Nilai pembayaran kurang');
            } else {
                submitInvoicePayment(formData);
            }
        }
    }

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: ['unpaid-sales-orders-count'], exact: false });
    }, [])

    return <>
        <div className="grid lg:grid-cols-3 gap-4">
            <InvoiceOrder className="w-full h-[calc(100dvh-1rem)]" handleAction={setInvoice} />
            <div className="size-full flex flex-col gap-2 bg-white">
                <div className="h-auto p-2 flex flex-col">
                    <Button variant="outline" onClick={() => { setInvoice(undefined); paymentRef.current?.clearPayments() }}>Close</Button>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-2">{invoice && <InvoiceOrderTableInfo invoice={invoice} />}</div>
            </div>
            <Payments ref={paymentRef} billAmount={invoice?.grand_total ?? 0} handlePayments={handlePayments} />
        </div>
    </>
}