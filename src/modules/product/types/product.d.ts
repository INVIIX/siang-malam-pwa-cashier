import { TCategory } from "./category";

export type TMembership = {
    id: number;
    name: string;
}

export type TUnit = {
    id: number;
    name: string;
}

export type TPrice = {
    price: number;
    membership_id: number;
    membership: TMembership;
}

export type TProduct = {
    id: number;
    name: string;
    unit_id: number;
    category_id: number;
    description: string;
    is_sale: boolean;
    is_bundle: boolean;
    have_ingredient: boolean;
    default_price: number;
    default_price_total_tax: number;
    default_price_with_tax: number;
}

export interface IProduct extends TProduct {
    membership_prices: TPrice[];
    unit: TUnit;
    category: TCategory;
}