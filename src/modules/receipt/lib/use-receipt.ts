import { TReceipt, TReceiptItem } from "../types/receipt";

export function buildDataReceiptItemFromInvoice(): TReceiptItem[] {
    return []
}

export function buildDataReceipt(items: TReceiptItem[] = []): TReceipt {
    return {
        items: items,
        total_items: items.reduce((sum, item) => sum + (item.quantity * item.regular_price), 0),
        total_discounts: items.reduce((sum, item) => sum + (item.quantity * item.discount_amount), 0),
        total_taxes: items.reduce((sum, item) => sum + (item.quantity * item.tax_amount), 0),
        grand_total: items.reduce((sum, item) => sum + (item.quantity * item.total), 0),
    }
}

