import orderListHTML from "@/templates/orderlist.html?raw"
import { setCustomerDisplay } from "@/lib/apiClientAndroid"
import { IInvoice } from "../types/invoice"
import { replaceAll } from "@/lib/utils"

type DisplayOrderItem = {
    item: string
    quantity: number
    total: number
}

type DisplayBankAccountItem = {
    bank: string
    number: string
    name: string
}

const QRISPlaceholder =
    "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"

const transfersPlaceholder: DisplayBankAccountItem[] = [
    {
        bank: "Bank Mandiri",
        number: "1234567890",
        name: "John Doe",
    },
    {
        bank: "Bank BCA",
        number: "0987654321",
        name: "Jane Doe",
    },
]

/**
 * Function to display order items in a customer-friendly format.
 * @param invoice - The invoice object containing transaction details.
 * @param qrisBase64String - Base64 encoded QRIS image string. Ex: data:image/png;base64,...
 * @param transfers - Array of bank account items for transfers.
 * @returns HTML string formatted for customer display.
 */
export function displayOrderItems(
    invoice: IInvoice,
    qrisBase64String: string = QRISPlaceholder,
    transfers: DisplayBankAccountItem[] = transfersPlaceholder
) {
    const items: DisplayOrderItem[] = invoice.transaction.details.map((item) => ({
        item: item.product.name,
        quantity: item.quantity,
        total: item.price * item.quantity,
    }))

    const total = items.reduce((sum, item) => sum + item.total, 0)

    let htmlBody = replaceAll(orderListHTML, "\\[\\[items\\]\\]", JSON.stringify(items))
    htmlBody = replaceAll(htmlBody, "\\[\\[total\\]\\]", total?.toString() || " - ")
    htmlBody = replaceAll(htmlBody, "\\[\\[grand\\]\\]", invoice.grand_total?.toString() || " - ")
    htmlBody = replaceAll(htmlBody, "\\[\\[transfers\\]\\]", JSON.stringify(transfers))
    htmlBody = replaceAll(htmlBody, "\\[\\[qris_base64\\]\\]", qrisBase64String)
    htmlBody = replaceAll(htmlBody, "\\[\\[invoice\\]\\]", invoice.code)
    htmlBody = replaceAll(htmlBody, "\\[\\[area\\]\\]", invoice.transaction.table?.area?.name ?? "-")
    htmlBody = replaceAll(htmlBody, "\\[\\[meja\\]\\]", invoice.transaction.table?.number?.toString() ?? "-")
    htmlBody = replaceAll(htmlBody, "\\[\\[datetime\\]\\]", new Date().toLocaleString("id-ID"))

    return setCustomerDisplay(htmlBody)
}
