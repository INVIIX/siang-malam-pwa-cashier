import { NavLink, useParams } from "react-router";
import { useCart } from "../components/context/cart-context";
import { useEffect, useState } from "react";
import { ProductList } from "../components/ui/product-list";
import { useDebounce } from "@/hooks/use-debounce";
import { TCartItem, TProduct } from "../helpers/cart-utils";
import { SearchIcon, ShoppingBasketIcon, Trash2Icon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { money } from "@/lib/utils";

export default function CartCatalogPage() {
    const { cartId } = useParams()
    const { cart, setCartId } = useCart();
    const [search, setSearch] = useState<string>('');
    const debouncedSearch = useDebounce(search, 300) // 500ms delay
    const { addItem, clearItems, cartItemsCount, cartTotalAmount } = useCart();

    const onAddItem = (product: TProduct) => {
        const item: TCartItem = {
            name: product.name,
            product_id: product.id,
            quantity: 1,
            price: product.default_price
        }
        addItem(item)
    }

    useEffect(() => {
        setCartId(parseInt(cartId ?? '0'))
    }, [cartId])

    return <>
        <div className="w-full h-full flex flex-col">
            <div className="w-full h-auto px-4 text-center">
                <h1 className="text-center font-bold text-lg">{cart.table.id !== null ? `Meja ${cart.table.number}` : 'Bawa Pulang'}</h1>
            </div>
            <div className="w-full h-auto relative mt-1 py-2 px-4">
                <SearchIcon className="absolute top-1/2 -translate-y-1/2 ms-3 text-gray-500" />
                <Input type="search" className="ps-11 bg-white w-full" placeholder="Cari menu atau produk"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <ProductList className="flex-1 py-2 px-4 overflow-y-auto" search={debouncedSearch} onAddItem={onAddItem} />
            <div className="w-full h-auto relative py-2 px-4 flex flex-row gap-2">
                <Button variant="destructive" className="flex flex-row justify-between h-auto" onClick={() => clearItems()}>
                    <Trash2Icon strokeWidth={1} className="size-8" />
                </Button>
                <Button variant="outline" className="flex flex-row justify-between flex-1 py-2 h-auto" asChild>
                    <NavLink to={`/carts/${cartId}/preview`}>
                        <div className="flex flex-col text-start leading-none">
                            <span>{cartItemsCount} Items</span>
                            <span>{money(cartTotalAmount)}</span>
                        </div>
                        <div className="h-auto flex items-center justify-center gap-2">
                            <span>Keranjang</span>
                            <ShoppingBasketIcon strokeWidth={1} className="size-8" />
                        </div>
                    </NavLink>
                </Button>
            </div>
        </div>
    </>
}