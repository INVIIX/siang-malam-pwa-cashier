import { Button } from "@/components/ui/button";
import { money } from "@/lib/utils";
import { PrinterIcon, SoupIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router";
import { CartList } from "../components/ui/cart-list";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ButtonSubmit } from "@/components/commons/button-submit";
import { toast } from "sonner";
import { useCart } from "../components/context/cart-context";
import apiClient from "@/lib/apiClient";

export default function CartPreviewPage() {
    const { cartId } = useParams()
    const navigate = useNavigate();
    const { cart, setCartId, clearItems, cartItemsCount, cartTotalAmount } = useCart();
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        setCartId(parseInt(cartId ?? "0"));
    }, [])

    const handleSubmit = async () => {
        setProcessing(true);
        const response = await apiClient.post('transactions', {
            table_id: cart.table.id,
            items: cart.items
        })
        const data = response.data.data;
        if (response.status == 200 || response.status == 201) {
            clearItems();
            toast.success('Data berhasil dikirim');
            navigate(`/invoices/${data.id}`);
        } else {

        }
        setProcessing(false);
    }

    return <>
        <section className="size-full flex flex-col">
            <div className="w-full h-auto p-4 text-center">
                <h1 className="text-center font-bold text-lg">{cart.table.id !== null ? `Meja ${cart.table.number}` : 'Bawa Pulang'}</h1>
            </div>
            <div className="w-full h-full flex-1 py-4 overflow-y-auto px-4 relative">
                <CartList />
            </div>
            <div className="w-full h-auto relative py-3 border-t flex flex-row gap-2 px-4">
                <Button variant="outline" className="flex flex-row justify-between py-2 h-auto" asChild>
                    <NavLink to={`/carts/${cart.id}`}>
                        <SoupIcon strokeWidth={1} className="size-8" />
                    </NavLink>
                </Button>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button className="flex flex-row justify-between flex-1 py-2 h-auto">
                            <div className="flex flex-col text-start leading-none">
                                <span>{cartItemsCount} Items</span>
                                <span>{money(cartTotalAmount)}</span>
                            </div>
                            <div className="h-auto flex items-center justify-center gap-2">
                                <span>Poses</span>
                                <PrinterIcon strokeWidth={1} className="size-8" />
                            </div>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="gap-0">
                        <SheetHeader>
                            <SheetTitle>Apakah anda yakin?</SheetTitle>
                            <SheetDescription>
                                Tindakan ini tidak bisa di kembalikan. Data ini akan dicatat dan dikirimkan ke kasir.
                            </SheetDescription>
                        </SheetHeader>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cart.items && cart.items.map((item, key) => (
                                    <TableRow key={key}>
                                        <TableCell >{item.quantity} {item.name}</TableCell>
                                        <TableCell className="text-right">{money(item.quantity * item.price)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell>Total</TableCell>
                                    <TableCell className="text-right">{money(cartTotalAmount)}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                        <div className="w-full p-4">
                            <ButtonSubmit className="w-full h-12" loading={processing} onClick={handleSubmit}>
                                <div className="flex justify-between gap-4">
                                    <span>Kirim & Cetak</span>
                                    <PrinterIcon className="size-6"></PrinterIcon>
                                </div>
                            </ButtonSubmit>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </section>
    </>
}