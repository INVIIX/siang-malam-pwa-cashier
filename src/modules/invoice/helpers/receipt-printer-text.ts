import { money } from "@/lib/utils"
import { TInvoice } from "@/modules/cart/helpers/cart-utils"
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

export const previewReceipt = (invoice: TInvoice, storeName: string = "RM. Siang Malam", branchName: string = "-") => {
    const tHead = [[textContent("Items", 35), textContent("Total", 12, "right")]].map((tr) => tr.join(" "))

    const tBody = invoice.transaction?.details
        ? invoice.transaction?.details
              .map((item) => {
                  return [
                      textContent(item.quantity, 5, "right"),
                      textContent(item.product.name, 29, "left"),
                      textContent(`${money(item.sub_total).replace("Rp", " ")}`, 12, "right"),
                  ]
              })
              .map((tr) => tr.join(" "))
        : []

    const taxes = invoice?.transaction?.taxes
        ? invoice?.transaction?.taxes
              .map((tax) => {
                  return [
                      textContent(`${tax.name} :`, 35, "right"),
                      textContent(`${money(tax.amount).replace("Rp", " ")}`, 12, "right"),
                  ]
              })
              .map((tr) => tr.join(" "))
        : []

    const tFoot = [
        [
            textContent("Subtotal :", 35, "right"),
            textContent(`${money(invoice.amount).replace("Rp", " ")}`, 12, "right"),
        ],
        ...[taxes],
        [textContent(` `, 20), "-".padStart(27, "-")],
        [
            textContent("Total :", 35, "right"),
            textContent(`${money(invoice?.grand_total ?? 0).replace("Rp", " ")}`, 12, "right"),
        ],
    ].map((tr) => tr.join(" "))

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
        [
            textContent("Tanggal", 8),
            textContent(":", 1),
            textContent(`${moment(invoice.issued).format("YYYY-MM-DD HH:mm")}`, 37),
        ],
    ].map((tr) => tr.join(" "))

    const footer = [[" ".padStart(LINE_WIDTH, " ")], [textContent("Terima Kasih", LINE_WIDTH, "center")]].map((tr) =>
        tr.join(" ")
    )

    return [
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
}

const encoder = new ReceiptEncoder({
    columns: LINE_WIDTH,
    feedBeforeCut: 4,
})

export const encodeReceipt = (invoice: TInvoice, storeName: string = "RM. Siang Malam", branchName: string = "-") => {
    const content = previewReceipt(invoice, storeName, branchName)
    content.split(NEWLINE).map((row) => {
        encoder.line(row)
    })
    return encoder.cut().encode()
}
