import { cn, money } from "@/lib/utils";
import { useCart } from "../context/cart-context";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { SelectPagination } from "@/components/commons/select-paginate";
import apiClient from "@/lib/apiClient";
import { TCartItem } from "../../types/cart";

export function InputQuantity({ quantity, onQuantityUpdated }: { quantity: number; onQuantityUpdated: (quantity: number) => void }) {
    const handleDecrement = () => {
        const newValue = Math.max(0, quantity - 1)
        onQuantityUpdated(newValue)
    }
    const handleIncrement = () => {
        const newValue = Math.min(100, quantity + 1)
        onQuantityUpdated(newValue)
    }
    return <>
        <div className="flex items-center gap-2">
            <Button className="rounded-full" size="icon" variant="outline" onClick={handleDecrement}>
                <MinusIcon />
            </Button>
            <div className="w-14 text-center font-semibold">{quantity}</div>
            <Button className="rounded-full" size="icon" variant="outline" onClick={handleIncrement}>
                <PlusIcon />
            </Button>
        </div>
    </>
}

export function CartItem({ item, className, ...props }: { item: TCartItem } & React.ComponentProps<"div">) {
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
        <div className={cn("w-full flex gap-2 bg-white shadow-md rounded-md p-2", className)} {...props}>
            <div className="text-foreground flex flex-col gap-1">
                <h3 className="font-medium leading-none">{item.name}</h3>
                <p className="text-sm leading-none">{money(item.default_price_with_tax)}</p>
            </div>
            <div className="ms-auto">
                <InputQuantity quantity={quantity} onQuantityUpdated={updateQuantity} />
            </div>
        </div>
    </>
}

export function CartList({ className, ...props }: React.ComponentProps<"div">) {
    const { cart, cartItemsCount } = useCart()
    const bottomRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [cartItemsCount])
    return <>
        <div className={cn("size-full flex flex-col gap-2", className)} {...props}>
            {
                cartItemsCount > 0 ? <>
                    {cart.items.map((item, key) => <CartItem key={key} item={item} />)}
                    <div ref={bottomRef} />
                </> :
                    <div className="size-full flex justify-center items-center">
                        <p>Silahkan pilih menu atau produk pada katalog.</p>
                    </div>
            }
        </div>
    </>
}

export function CartTableInfo({
    showItems = false,
    className,
    ...props
}: { showItems?: boolean } & React.ComponentProps<"table">) {
    const { cart } = useCart();
    return <>
        <Table className={cn(["w-full border-separate border-spacing-0", className])} {...props}>
            {
                showItems && <>
                    <TableHeader className="sticky top-0 z-10">
                        <TableRow>
                            <TableHead>Items</TableHead>
                            <TableHead className="text-right">Qty</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            cart.items.map((item, key) => <TableRow key={key}>
                                <TableCell className="">{item.name}</TableCell>
                                <TableCell className="text-right">{item.quantity}</TableCell>
                                <TableCell className="text-right">{money(item.default_price * item.quantity)}</TableCell>
                            </TableRow>)
                        }
                    </TableBody>
                </>
            }
            <TableFooter className="sticky bottom-0 z-10">
                {cart.total_items > 0 && <TableRow>
                    <TableCell className="font-medium" colSpan={2}>Subtotal</TableCell>
                    <TableCell className="font-medium text-right">{money(cart.total_items)}</TableCell>
                </TableRow>
                }
                {cart.total_discounts > 0 && <TableRow>
                    <TableCell className="font-medium" colSpan={2}>Total Diskon</TableCell>
                    <TableCell className="font-medium text-right">{money(cart.total_discounts)}</TableCell>
                </TableRow>
                }
                {cart.total_taxes > 0 && <TableRow>
                    <TableCell className="font-medium" colSpan={2}>Pajak</TableCell>
                    <TableCell className="font-medium text-right">{money(cart.total_taxes)}</TableCell>
                </TableRow>
                }
                <TableRow>
                    <TableCell className="font-medium" colSpan={2}>Total Tagihan</TableCell>
                    <TableCell className="font-medium text-right">{money(cart.grand_total)}</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    </>
}

export function Cart({ className, ...props }: React.ComponentProps<"div">) {
    const [memberSelected, setMemberSelected] = useState<string | string[]>("");
    const { clearItems } = useCart();
    return <>
        <div className={cn("flex flex-col gap-2", className)} {...props}>
            <div className="h-auto flex flex-col gap-2 overflow-visible">
                <SelectPagination
                    placeholder="Pilih Member Jika Ada"
                    value={memberSelected}
                    onChange={(val) => setMemberSelected(val)}
                    fetchOptions={async ({ search, page }) => {
                        const response = await apiClient.get('datasheets/members', {
                            params: {
                                page: page,
                                search: search
                            }
                        })
                        const json = await response.data;
                        const items = json.data.map((member: any) => ({
                            value: String(member.id),
                            label: member.name,
                        }));
                        return {
                            items,
                            hasMore: json.meta.current_page < json.meta.last_page,
                        }
                    }}
                />
                <Button variant="outline" onClick={() => clearItems()}><Trash2Icon /></Button>
            </div>
            <CartList className="flex-1 h-full overflow-y-auto" />
            <div className="h-auto flex flex-col gap-2 overflow-visible bg-white">
                <CartTableInfo />
            </div>
        </div>
    </>
}