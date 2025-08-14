import { useAuth } from "@/modules/auth/components/context/auth-context"
import { PosResto } from "../components/ui/pos-resto";
import { PosRetail } from "../components/ui/pos-retail";

export default function CashierPosPage() {
    const { user } = useAuth()
    const isRetail = user?.department?.retail ?? false; 
    return <>
        { isRetail ? <PosRetail /> : <PosResto /> }
    </>
}