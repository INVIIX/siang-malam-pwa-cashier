import receiptTemplate from "../templates/receipt.html?raw"
import idleTemplate from "../templates/idle.html?raw"

export function generateInvoiceHtml(invoicePreview: string, qrisSvg: string) {
    let finalHtml = receiptTemplate
    finalHtml = finalHtml.replace("{{receiptcontent}}", invoicePreview)
    finalHtml = finalHtml.replace("{{qris}}", qrisSvg)
    return finalHtml
}

export function generateIdleHtml() {
    return idleTemplate
}
