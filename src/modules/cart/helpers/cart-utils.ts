export type TUnit = {
    id: number
    name: string
}
export type TCategory = TUnit
export type TProduct = {
    id: number
    name: string
    unit_id: number
    category_id: number
    default_price: number
    description: string
    is_sale: boolean
    is_bundle: boolean
    have_ingredient: boolean
}

export type TArea = {
    id: number | null
    name: string
}

export type TTable = {
    id: number | null
    number: number | null
    area: TArea
}

export type TCartItem = {
    name: string
    product_id: number
    quantity: number
    price: number
    options?: string[]
}

export type TCart = {
    id: number
    table: TTable
    items: TCartItem[] | []
}

export const isSameCartItem = (a: TCartItem, b: TCartItem): boolean => {
    const optionsA = JSON.stringify(Object.values(a.options || {}).sort())
    const optionsB = JSON.stringify(Object.values(b.options || {}).sort())
    return a.product_id === b.product_id && optionsA === optionsB
}

export const findCartItemMatchingIndex = (item: TCartItem, items: TCartItem[]): number => {
    return items.findIndex((existing) => isSameCartItem(item, existing))
}

type TTax = {
    name: string
    amount: number
}

export type TTransaction = {
    id: number
    table: TTable
    items: TCartItem[] | []
    department_id: number
    user_id: number
    table_id: number
    type: string
    date: string
    amount: number
    tax: number
    total: number
    status: boolean
    details?: TInvoiceItem[]
    taxes?: TTax[]
    // invoice?: TInvoice
}

export type TInvoiceItem = {
    price: number
    quantity: number
    sub_total: number
    product: TProduct
}

export type TInvoice = {
    id: number
    code?: string
    table: TTable
    items: TCartItem[] | []
    department_id: number
    user_id: number
    table_id: number
    type: string
    issued: string
    amount: number
    tax: number
    grand_total: number
    status: string
    details?: TInvoiceItem[]
    transaction?: TTransaction
}
