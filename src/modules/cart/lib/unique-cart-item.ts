import { TCartItem } from "../types/cart";

export const isSameCartItem = (
    a: TCartItem,
    b: TCartItem
): boolean => {
    const optionsA = JSON.stringify(Object.values(a.options || {}).sort());
    const optionsB = JSON.stringify(Object.values(b.options || {}).sort());
    return (
        a.product_id === b.product_id &&
        optionsA === optionsB
    );
};

export const findCartItemMatchingIndex = (
    item: TCartItem,
    items: TCartItem[]
): number => {
    return items.findIndex(existing => isSameCartItem(item, existing));
};