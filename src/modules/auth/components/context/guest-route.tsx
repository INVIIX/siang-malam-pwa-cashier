"use client";

import { Navigate, Outlet } from "react-router";
import { useAuth } from "./auth-context";
import { AuthLoader } from "../ui/auth-loader";

export default function GuestRoute() {
    const { loading, isAuthenticated } = useAuth();
    if (loading) {
        return <AuthLoader />
    }
    return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}