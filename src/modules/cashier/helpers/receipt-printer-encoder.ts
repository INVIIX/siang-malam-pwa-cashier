import { IInvoice, IInvoicePayments } from "@/modules/invoice/types/invoice"
import { TSale } from "../components/ui/pos-retail"
import { money } from "@/lib/utils"
import ReceiptEncoder from "@point-of-sale/receipt-printer-encoder"
import moment from "moment"

type TAlign = "left" | "right" | "center"

const LINE_WIDTH = 48
const NEWLINE = "\n"

const textContent = (text: string | number, length: number, align: TAlign = "left") => {
    const str = String(text ?? "")
    let result = ""
    switch (align) {
        case "right":
            result = str.padStart(length, " ")
            break
        case "center": {
            const sisa = length - str.length
            result = " ".padStart(sisa / 2, " ") + str + " ".padEnd(sisa / 2)
            break
        }
        case "left":
        default:
            result = str.padEnd(length, " ")
            break
    }
    return result
}

export function encodeRestoReceipt(
    invoicePayment: IInvoicePayments,
    invoice: IInvoice,
    storeName: string = "RM. Siang Malam",
    branchName: string = "-"
): number[] {
    // Header section
    const header = [
        [textContent(`${storeName}`, LINE_WIDTH, "center")],
        [textContent(`${branchName}`, LINE_WIDTH, "center")],
        [" ".padStart(LINE_WIDTH, " ")],
        [textContent("No", 8), textContent(":", 1), textContent(`${invoice.code}`, 37)],
        [
            textContent("Meja", 8),
            textContent(":", 1),
            textContent(`${invoice.transaction?.table?.number ?? "Bawa Pulang"}`, 37),
        ],
        [textContent("Tanggal", 8), textContent(":", 1), textContent(`${moment().format("YYYY-MM-DD HH:mm")}`, 37)],
    ].map((tr) => tr.join(" "))

    // Items table header
    const tHead = [[textContent("Items", 35), textContent("Total", 12, "right")]].map((tr) => tr.join(" "))

    // Items table body
    const tBody = invoice.transaction?.details
        ? invoice.transaction?.details
              .map((item) => {
                  return [
                      textContent(item.quantity, 5, "right"),
                      textContent(item.product.name, 29, "left"),
                      textContent(`${money(item.sub_total).replace("Rp", " ")}`, 12, "right"),
                  ]
              })
              .map((tr: string[]) => tr.join(" "))
        : []

    // Payment methods section
    const paymentMethods = invoicePayment.methods
        .map((payment) => {
            const method = payment.method === "cash" && payment.amount < 0 ? "kembalian" : payment.method
            const amount = payment.method === "cash" && payment.amount < 0 ? Math.abs(payment.amount) : payment.amount

            return [
                textContent(`${method} :`, 35, "right"),
                textContent(`${money(amount).replace("Rp", " ")}`, 12, "right"),
            ]
        })
        .map((tr: string[]) => tr.join(" "))

    // Footer calculations
    const tFoot = [
        [
            textContent("Subtotal :", 35, "right"),
            textContent(`${money(invoice.amount).replace("Rp", " ")}`, 12, "right"),
        ],
        [textContent(` `, 20), "-".padStart(27, "-")],
        [
            textContent("Total :", 35, "right"),
            textContent(`${money(invoice.grand_total).replace("Rp", " ")}`, 12, "right"),
        ],
        [" ".padStart(LINE_WIDTH, " ")],
        [textContent("PEMBAYARAN", LINE_WIDTH, "center")],
        ["-".padStart(LINE_WIDTH, "-")],
        ...paymentMethods,
    ].map((tr: string[] | string) => (Array.isArray(tr) ? tr.join(" ") : tr))

    // Footer message
    const footer = [[" ".padStart(LINE_WIDTH, " ")], [textContent("Terima Kasih", LINE_WIDTH, "center")]].map((tr) =>
        tr.join(" ")
    )

    // Combine all sections
    const receiptContent = [
        ...header,
        ...["=".padStart(LINE_WIDTH, "=")],
        ...tHead,
        ...["-".padStart(LINE_WIDTH, "-")],
        ...tBody,
        ...["=".padStart(LINE_WIDTH, "=")],
        ...tFoot,
        ...[" ".padStart(LINE_WIDTH, " ")],
        ...footer,
    ].join(NEWLINE)

    // Encode for printer
    const encoder = new ReceiptEncoder({
        columns: LINE_WIDTH,
        feedBeforeCut: 4,
    })

    receiptContent.split(NEWLINE).forEach((row) => {
        encoder.line(row)
    })

    const encoded = encoder.cut().encode()
    const encodedValues: number[] = Object.values(encoded)
    return encodedValues
}

export function encodeRetailReceipt(
    sale: TSale,
    storeName: string = "RM. Siang Malam",
    branchName: string = "-"
): number[] {
    // Calculate totals
    const subtotal = sale.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    // Header section
    const header = [
        [textContent(`${storeName}`, LINE_WIDTH, "center")],
        [textContent(`${branchName}`, LINE_WIDTH, "center")],
        [" ".padStart(LINE_WIDTH, " ")],
        [textContent("No", 8), textContent(":", 1), textContent(`RETAIL-${moment().format("YYYYMMDD-HHmmss")}`, 37)],
        [textContent("Meja", 8), textContent(":", 1), textContent("Bawa Pulang", 37)],
        [textContent("Tanggal", 8), textContent(":", 1), textContent(`${moment().format("YYYY-MM-DD HH:mm")}`, 37)],
    ].map((tr) => tr.join(" "))

    // Items table header
    const tHead = [[textContent("Items", 35), textContent("Total", 12, "right")]].map((tr) => tr.join(" "))

    // Items table body
    const tBody = sale.items
        .map((item) => {
            const itemTotal = item.price * item.quantity
            return [
                textContent(item.quantity, 5, "right"),
                textContent(`Product ${item.product_id}`, 29, "left"), // Using product_id as name since product info not available
                textContent(`${money(itemTotal).replace("Rp", " ")}`, 12, "right"),
            ]
        })
        .map((tr: string[]) => tr.join(" "))

    // Payment methods section
    const paymentMethods = sale.methods
        .map((payment) => {
            const method = payment.method === "cash" && payment.amount < 0 ? "kembalian" : payment.method
            const amount = payment.method === "cash" && payment.amount < 0 ? Math.abs(payment.amount) : payment.amount

            return [
                textContent(`${method} :`, 35, "right"),
                textContent(`${money(amount).replace("Rp", " ")}`, 12, "right"),
            ]
        })
        .map((tr: string[]) => tr.join(" "))

    // Footer calculations
    const tFoot = [
        [textContent("Subtotal :", 35, "right"), textContent(`${money(subtotal).replace("Rp", " ")}`, 12, "right")],
        [textContent(` `, 20), "-".padStart(27, "-")],
        [textContent("Total :", 35, "right"), textContent(`${money(subtotal).replace("Rp", " ")}`, 12, "right")],
        [" ".padStart(LINE_WIDTH, " ")],
        [textContent("PEMBAYARAN", LINE_WIDTH, "center")],
        ["-".padStart(LINE_WIDTH, "-")],
        ...paymentMethods,
    ].map((tr: string[] | string) => (Array.isArray(tr) ? tr.join(" ") : tr))

    // Footer message
    const footer = [[" ".padStart(LINE_WIDTH, " ")], [textContent("Terima Kasih", LINE_WIDTH, "center")]].map((tr) =>
        tr.join(" ")
    )

    // Combine all sections
    const receiptContent = [
        ...header,
        ...["=".padStart(LINE_WIDTH, "=")],
        ...tHead,
        ...["-".padStart(LINE_WIDTH, "-")],
        ...tBody,
        ...["=".padStart(LINE_WIDTH, "=")],
        ...tFoot,
        ...[" ".padStart(LINE_WIDTH, " ")],
        ...footer,
    ].join(NEWLINE)

    // Encode for printer
    const encoder = new ReceiptEncoder({
        columns: LINE_WIDTH,
        feedBeforeCut: 4,
    })

    receiptContent.split(NEWLINE).forEach((row) => {
        encoder.line(row)
    })

    const encoded = encoder.cut().encode()
    const encodedValues: number[] = Object.values(encoded)
    return encodedValues
}
