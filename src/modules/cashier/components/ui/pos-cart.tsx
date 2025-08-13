import { useCart } from "@/modules/cart/components/context/cart-context"
import { CartItem } from "@/modules/cart/components/ui/cart-item"

export function PosCart() {
    const { cart } = useCart()
    return <>
        <div>
            {cart.items.map((item, key) => <CartItem key={key} item={item} />)}
        </div>
    </>
}