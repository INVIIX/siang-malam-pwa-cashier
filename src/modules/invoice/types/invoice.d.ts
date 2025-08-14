import { TPayment } from "@/modules/payment/types/payment";
import { ITransaction } from "@/modules/invoice/types/transaction";

export type TInvoice = {
    id?: number;
    code: string;
    amount: number;
    grand_total: number;
    status: 'paid' | 'unpaid' | 'canceled';
}

export interface IInvoice extends TInvoice {
    transaction: ITransaction;
}

export interface IInvoicePayments {
    invoice_code: string;
    methods: TPayment[]
}