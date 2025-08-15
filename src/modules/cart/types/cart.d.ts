import { IProduct } from "@/modules/product/types/product"

export type TCartItem = IProduct & {
    product_id: number
    quantity: number
    options?: string[]
}

export type TArea = {
    id: number | null
    name: string
}

export type TTable = {
    id: number | null
    number: number | null
    area?: TArea
}

export type TCart = {
    id: number
    table: TTable
    items: TCartItem[]
    total_items: number
    total_discounts: number
    total_taxes: number
    grand_total: number
}
