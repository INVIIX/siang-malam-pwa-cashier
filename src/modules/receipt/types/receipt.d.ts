export type TReceiptItem = {
    product_id: number;
    product_name: number;
    regular_price: number;
    discount_amount: number;
    tax_base: number;
    tax_amount: number;
    final_price: number;
    quantity: number;
    total: number;
}

export type TReceipt = {
    items: TReceiptItem[];
    total_items: number;
    total_discounts: number;
    total_taxes: number;
    grand_total: number;
}