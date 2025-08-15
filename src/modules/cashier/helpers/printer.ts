import { IInvoice, IInvoicePayments } from "@/modules/invoice/types/invoice"
import { encodeRestoReceipt, encodeRetailReceipt } from "./receipt-printer-encoder"
import { printRaw } from "@/lib/apiClientAndroid"
import { TSale } from "../components/ui/pos-retail"

export function printRestoReceipt(invoicePayments: IInvoicePayments, invoice: IInvoice, printerDeviceId: string = "") {
    const encodedRestoReceipt = encodeRestoReceipt(invoicePayments, invoice)
    return printRaw(encodedRestoReceipt, printerDeviceId)
}

export function printRetailReceipt(sale: TSale, printerDeviceId: string = "") {
    const encodedRetailReceipt = encodeRetailReceipt(sale)
    return printRaw(encodedRetailReceipt, printerDeviceId)
}
