import { createContext, useContext, useEffect, useState } from "react"
import { useLocalStorage } from "react-use"
import { toast } from "sonner"
import { findCartItemMatchingIndex, TCart, TCartItem, TTable } from "../../helpers/cart-utils"

export type TCartProvider = {
    cart: TCart,
    setCartId: (id: number) => void,
    addItem: (item: TCartItem) => void,
    updateItem: (item: TCartItem) => void,
    clearItems: () => void,
    cartItemsCount: number;
    cartTotalAmount: number;
}

const defaultcart = {
    id: 0,
    table: { id: null, number: null },
    items: []
} as TCart

const initialState: TCartProvider = {
    cart: defaultcart,
    setCartId: () => { },
    addItem: () => { },
    updateItem: () => { },
    clearItems: () => { },
    cartItemsCount: 0,
    cartTotalAmount: 0,
}

const CartProviderContext = createContext<TCartProvider>(initialState)

type CartProviderProps = {
    children: React.ReactNode
}

export function CartProvider({
    children
}: CartProviderProps) {
    const [cartId, setCartId] = useState<number>(0);
    const [tables] = useLocalStorage<TTable[]>('tables', []);
    const [carts, setCarts] = useLocalStorage<TCart[]>('carts', []);
    const [cart, setCart] = useState<TCart>(defaultcart);
    const [cartTotalAmount, setCartTotalAmount] = useState<number>(0);
    const [cartItemsCount, setCartItemsCount] = useState<number>(0);

    const getCart = (id: number) => {
        const storageCarts = carts?.filter((cart) => cart.id == id)
        const storageCart = storageCarts && storageCarts.length > 0 ? storageCarts[0] : defaultcart
        return storageCart;
    }

    const getTable = (id: number) => {
        return tables?.filter((table) => table.id == id)[0] ?? { id: null, number: null }
    }

    const setupCart = (id: number) => {
        let tableData = getTable(id);
        let cartData = defaultcart
        if (tableData.id != null) {
            cartData = getCart(tableData.id);
            cartData.id = tableData.id;
            if (cartData.id === tableData.id) {
                cartData.table = tableData;
            }
        }
        const cartIndex = carts?.findIndex((cart) => cart.id == cartData.id) ?? -1;
        if (cartIndex < 0) {
            setCarts([...(carts ?? []), ...[cartData]]);
        }
        setCart(cartData);
    }

    useEffect(() => {
        setupCart(cartId);
    }, [cartId])

    useEffect(() => {
        const cartIndex = carts?.findIndex((cartRow) => cartRow.id === cart.id) ?? -1;
        if (carts != undefined && cartIndex >= 0) {
            const cartsData = carts;
            cartsData[cartIndex] = cart;
            setCarts(cartsData)
        }

        let count = cart?.items.length ?? 0;
        let cartTotalAmount = (cart?.items && cart?.items.reduce(function (current, item) {
            return current + (item.price * item.quantity)
        }, 0)) ?? 0;

        setCartItemsCount(count)
        setCartTotalAmount(cartTotalAmount)
    }, [cart])

    const storeItem = (list: TCartItem[], item: TCartItem, index: number) => {
        if (index < 0) {
            list.push(item);
        } else {
            list[index] = item;
        }
        const newCart = { ...cart, ...{ items: list } };
        setCart(newCart)
    }

    const destroyItem = (list: TCartItem[], index: number) => {
        list.splice(index, 1);
        setCart({ ...cart, ...{ items: list } });
    }

    const addItem = (item: TCartItem) => {
        const list = cart.items || [];
        const index = findCartItemMatchingIndex(item, list);
        const existing = list[index];
        let message = `${item.name} telah ditambahkan ${(existing ? 'lagi ' : '')}sebanyak ${item.quantity}`
        item.options = Object.values(item.options || []).sort();
        item.quantity += existing?.quantity || 0;
        storeItem(list, item, index)
        toast.success(message)
    }

    const updateItem = (item: TCartItem) => {
        const list = cart.items || [];
        const index = findCartItemMatchingIndex(item, list);
        let message = item.quantity > 0 ? `${item.name} telah diubah sebanyak ${item.quantity}` : `${item.name} telah dihapus`;
        if (item.quantity > 0) {
            item.options = Object.values(item.options || []).sort();
            storeItem(list, item, index)
            toast.success(message)
        } else {
            destroyItem(list, index)
            toast.success(message)
        }
    }

    const clearItems = () => {
        setCart({ ...cart, ...{ items: [] } })
    }

    const value = { setCartId, cart, addItem, updateItem, clearItems, cartItemsCount, cartTotalAmount }

    return (
        <CartProviderContext.Provider value={value}>
            {children}
        </CartProviderContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext<TCartProvider>(CartProviderContext)
    if (context === undefined)
        throw new Error("useTheme must be used within a CartProvider")
    return context
}