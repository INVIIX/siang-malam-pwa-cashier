import { Navigate, Outlet } from "react-router";
import { AuthLoader } from "../ui/auth-loader";
import { useAuth } from "./auth-context";
import { CashierProvider } from "@/modules/cashier/components/context/cashier-context";

export default function AuthenticatedRoute() {
    const { loading, isAuthenticated } = useAuth();

    if (loading) {
        return <AuthLoader />
    }

    return isAuthenticated
        ? <CashierProvider><Outlet /></CashierProvider> :
        <Navigate to="/login" replace />
};