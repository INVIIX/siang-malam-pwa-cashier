import apiClient from "@/lib/apiClient";
import { QueryObserverResult, useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";

export type TCashier = {
    id: number;
    begining_balance: number;
    change: number;
    current_balance?: { [key: string]: number },
    payment_summary?: { [key: string]: { total: number, change: number, net: number } }
}

type TSummary = {
    cash: {
        initial: number;
        income: number;
        outcome: number;
        current: number;
    },
    sales: {
        cash: number;
        non_cash: number;
        total: number;
    }
};

type TCashierProvider = {
    open: boolean;
    cashier?: TCashier;
    summary: TSummary;
    setCashier: (data: TCashier) => void,
    refetchCashier: () => Promise<QueryObserverResult<any, Error>>
}

const defaultSummary = {
    cash: {
        initial: 0,
        income: 0,
        outcome: 0,
        current: 0,
    },
    sales: {
        cash: 0,
        non_cash: 0,
        total: 0,
    }
}

const initialState: TCashierProvider = {
    open: false,
    cashier: undefined,
    summary: defaultSummary,
    setCashier: () => { },
    refetchCashier: () => new Promise(() => { })
}

const CashierProviderContext = createContext<TCashierProvider>(initialState)

type CashierProviderProps = {
    children: React.ReactNode
}

export function CashierProvider({
    children
}: CashierProviderProps) {
    const [open, setOpen] = useState<boolean>(false);
    const [cashier, setCashier] = useState<TCashier>();
    const [summary, setSummary] = useState<TSummary>(defaultSummary);

    const { refetch } = useQuery({
        queryKey: ['cashier'],
        queryFn: async () => {
            try {
                const response = await apiClient.get('cashiers');
                const data = response?.data?.data ?? {}
                setCashier(data)
                return data;
            } catch (error) {
                setCashier(undefined);
                setOpen(false);
                return {}
            }
        }
    });

    useEffect(() => {
        const nonCashSales = Object.entries(cashier?.payment_summary ?? {}).reduce((sum, [key, val]) => sum + (key != 'cash' ? val.net : 0), 0);
        const totalSales = Object.values(cashier?.payment_summary ?? {}).reduce((sum, val) => sum + val.net, 0);
        setSummary({
            cash: {
                initial: cashier?.begining_balance ?? 0,
                income: cashier?.payment_summary?.cash?.total ?? 0,
                outcome: cashier?.change ?? 0,
                current: cashier?.current_balance?.cash ?? 0
            },
            sales: {
                cash: cashier?.payment_summary?.cash?.net ?? 0,
                non_cash: nonCashSales,
                total: totalSales
            }
        })
        setOpen(cashier?.id != 0)
    }, [cashier])
    const value = { open, cashier, summary, setOpen, setCashier, refetchCashier: refetch };
    return (
        <CashierProviderContext.Provider value={value}>
            {children}
        </CashierProviderContext.Provider>
    )
}

export const useCashier = () => {
    const context = useContext<TCashierProvider>(CashierProviderContext)
    if (context === undefined)
        throw new Error("useCashier must be used within a CashierProvider")
    return context
}