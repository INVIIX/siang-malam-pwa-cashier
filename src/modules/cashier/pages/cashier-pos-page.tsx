import { useAuth } from "@/modules/auth/components/context/auth-context"
import { PosResto } from "../components/ui/pos-resto"
import { PosRetail } from "../components/ui/pos-retail"
import { use, useEffect } from "react"
import { displayCustomerIndex } from "@/lib/customer-display"

export default function CashierPosPage() {
    const { user } = useAuth()
    const isRetail = user?.department?.retail ?? false

    // display customer index when cashier page is closed
    useEffect(() => {
        return () => {
            displayCustomerIndex()
        }
    }, [])

    return <>{isRetail ? <PosRetail /> : <PosResto />}</>
}
