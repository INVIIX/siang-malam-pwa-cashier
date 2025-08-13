import { PosPayment, TPayment } from "./pos-payment";
import { PosCart } from "./pos-cart";
import { useCart } from "@/modules/cart/components/context/cart-context";
import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ProductCatalogue } from "@/modules/product/components/ui/product-catalogue";
import { IProduct } from "@/modules/product/types/product";
import { Cart, CartTableInfo } from "@/modules/cart/components/ui/cart";
import { Payments } from "@/modules/payment/components/ui/payments";

type TSaleItem = {
    product_id: number;
    price: number;
    quantity: number;
}
type TSale = {
    table_id: null,
    direct_payment: boolean;
    items: TSaleItem[];
    methods: TPayment[];
}
const defaultSaleData: TSale = {
    table_id: null,
    direct_payment: true,
    items: [],
    methods: [],
}
export function PosRetail() {
    const { cart, addItem, clearItems } = useCart();
    const addProductToCart = (product: IProduct) => {
        addItem({
            ...product,
            ...{
                product_id: product.id,
                quantity: 1
            }
        })
    }
    const submitSale = async (formData: TSale) => {
        try {
            const response = await apiClient.post('transactions', formData);
            if (response.status == 200 || response.status == 201) {
                clearItems();
            }
        } catch (err) {
            const error = err as AxiosError;
            const responseData: { message?: string } | any = error?.response?.data;
            const errorMessage = responseData?.message ?? error?.message ?? 'Failed process';
            toast.error(errorMessage)
        }
    }

    const handlePayments = (payments: TPayment[]) => {
        const formData: TSale = {
            table_id: null,
            direct_payment: true,
            items: cart.items.map((item) => {
                return {
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: item.default_price
                }
            }),
            methods: payments
        }
        const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0)
        if (cart.grand_total <= 0) {
            toast.error('Tidak ada tagihan untuk dibayarkan');
        }
        else if (cart.grand_total > totalPayments) {
            toast.error('Nilai pembayaran kurang');
        } else {
            submitSale(formData);
        }
    }
    return (
        <div className="grid lg:grid-cols-3 gap-4">
            <ProductCatalogue className="w-full h-[calc(100dvh-1rem)]" handleAction={addProductToCart} />
            <Cart className="w-full h-[calc(100dvh-1rem)]" />
            <Payments billAmount={cart.grand_total} handlePayments={handlePayments} />
        </div>
    )
}