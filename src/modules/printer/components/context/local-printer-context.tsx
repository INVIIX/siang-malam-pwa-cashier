"use client"

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react"
import { useLocalStorage } from "react-use"
import { findPrinters, printRaw } from "@/lib/apiClientAndroid"
import { TPrinterDevice } from "@/types/android-api-resources"
import { encodeReceipt } from "@/modules/payment/helpers/receipt-printer-text"
import { toast } from "sonner"
import { TInvoice } from "@/modules/cart/lib/cart-utils"

type LocalPrinterContextType = {
    printers: TPrinterDevice[]
    selectedPrinter: TPrinterDevice | null
    loadPrinters: () => Promise<void>
    selectPrinter: (printer: TPrinterDevice) => void
    printReceipt: (invoice: TInvoice, storeName?: string, branchName?: string) => Promise<void>
}

const LocalPrinterContext = createContext<LocalPrinterContextType>({
    printers: [],
    selectedPrinter: null,
    loadPrinters: async () => {},
    selectPrinter: () => {},
    printReceipt: async () => {},
})

export const LocalPrinterProvider = ({ children }: { children: ReactNode }) => {
    const [printers, setPrinters] = useState<TPrinterDevice[]>([])
    const [selectedPrinter, setSelectedPrinter] = useLocalStorage<TPrinterDevice | null>("selectedLocalPrinter", null)
    const currentSelectedPrinter = selectedPrinter || null

    const loadPrinters = useCallback(async () => {
        try {
            const printerList = await findPrinters()
            setPrinters(printerList)
            if (printerList.length > 0 && !currentSelectedPrinter) {
                setSelectedPrinter(printerList[0])
            }
        } catch (error) {
            console.error("Error loading printers:", error)
            setPrinters([])
        }
    }, [currentSelectedPrinter, setSelectedPrinter])

    const selectPrinter = (printer: TPrinterDevice) => {
        setSelectedPrinter(printer)
    }

    const printReceipt = async (invoice: TInvoice, storeName: string = "RM. Siang Malam", branchName: string = "-") => {
        if (!currentSelectedPrinter) {
            toast.error("Pilih printer terlebih dahulu")
            return
        }
        try {
            const encodedReceipt: Object = encodeReceipt(invoice, storeName, branchName)
            const ESCPOSByteArray = Object.values(encodedReceipt) as number[]
            await printRaw(currentSelectedPrinter.deviceId, ESCPOSByteArray)
        } catch (error) {
            console.error("Error printing receipt:", error)
            toast.error("Gagal mencetak nota")
        }
    }

    useEffect(() => {
        loadPrinters()
    }, [loadPrinters])

    return (
        <LocalPrinterContext.Provider
            value={{
                printers,
                selectedPrinter: currentSelectedPrinter,
                loadPrinters,
                selectPrinter,
                printReceipt,
            }}
        >
            {children}
        </LocalPrinterContext.Provider>
    )
}

export const useLocalPrinter = () => useContext(LocalPrinterContext)
