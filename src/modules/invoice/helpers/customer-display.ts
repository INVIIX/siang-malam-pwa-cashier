import orderListHTML from "@/templates/orderlist.html?raw"
import { TTransactionDetail } from "../types/transaction"
import { setCustomerDisplay } from "@/lib/apiClientAndroid"

type DisplayOrderItem = {
    item: string
    quantity: number
    total: number
}

export function displayOrderItems(orderItems: TTransactionDetail[]) {
    const items: DisplayOrderItem[] = orderItems.map((item) => ({
        item: item.product.name,
        quantity: item.quantity,
        total: item.price * item.quantity,
    }))

    const htmlBody: string = orderListHTML.replace("[[items]]", JSON.stringify(items))
    return setCustomerDisplay(htmlBody)
}
