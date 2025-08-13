import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { useCart } from "@/modules/cart/components/context/cart-context";
import { ProductList } from "@/modules/cart/components/ui/product-list";
import { TCartItem, TProduct } from "@/modules/cart/helpers/cart-utils";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

export function PosCatalogue() {
    const { cartId } = useParams()
    const { setCartId } = useCart();
    const [search, setSearch] = useState<string>('');
    const debouncedSearch = useDebounce(search, 300) // 500ms delay
    const { addItem } = useCart();

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
        <div className="w-full h-full flex flex-col gap-2 px-1">
            <div className="w-full h-auto relative mt-1 py-2">
                <SearchIcon className="absolute top-1/2 -translate-y-1/2 ms-3 text-gray-500" />
                <Input type="search" className="ps-11 bg-white w-full" placeholder="Cari menu atau produk"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <ProductList className="flex-1 overflow-y-auto" search={debouncedSearch} onAddItem={onAddItem} />
        </div>
    </>
}