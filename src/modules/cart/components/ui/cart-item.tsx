import { useEffect, useState } from "react";
import { money } from "@/lib/utils";
import { useCart } from "../context/cart-context";
import { TCartItem } from "../../helpers/cart-utils";
import { InputQty } from "./input-qty";

export function CartItem({ item }: { item: TCartItem }) {
    const { updateItem } = useCart()
    const [quantity, setQuantity] = useState(item.quantity);

    useEffect(() => {
        setQuantity(item.quantity)
    }, [item])

    const updateQuantity = (qty: number) => {
        setQuantity(qty)
        const newItem = { ...item, ...{ quantity: qty } };
        updateItem(newItem)
    }

    return <>
        <div className="w-full flex gap-3">
            <div className="text-foreground flex flex-col gap-1">
                <h3 className="font-medium leading-none">{item.name}</h3>
                <p className="text-sm leading-none">{money(item.price)}</p>
            </div>
            <div className="ms-auto">
                <InputQty name="quantity" value={quantity} onChange={updateQuantity} />
            </div>
        </div>
    </>
}