import { TTable } from "@/modules/cart/types/cart";
import { TProduct } from "@/modules/product/types/product";

export type TTransaction = {
    table_id: number | null;
    direct_payment?: boolean;
    status?: 'open' | 'paid' | 'canceled';
}

export type TTransactionDetail = {
    product: TProduct;
    quantity: number;
    price: number;
    sub_total: number;
}

export interface ITransaction extends TTransaction {
    table?: TTable;
    details: TTransactionDetail[]
}