import { lazy, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router"
import { ErrorPage } from "./components/commons/error-page.tsx";
import AuthenticatedRoute from './modules/auth/components/context/authenticated-route.tsx'
import GuestRoute from "./modules/auth/components/context/guest-route.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { CartProvider } from "./modules/cart/components/context/cart-context.tsx";
import { echo } from "./lib/echo.ts";
import { useAuth } from "./modules/auth/components/context/auth-context.tsx";

const AuthLayout = lazy(() => import('./components/layouts/auth/auth-layout.tsx'));
const AppLayout = lazy(() => import('./components/layouts/app/app-layout.tsx'));
const LoginPage = lazy(() => import('./modules/auth/pages/login-page.tsx'));
const RegisterPage = lazy(() => import('./modules/auth/pages/register-page.tsx'));
const ForgotPasswordPage = lazy(() => import('./modules/auth/pages/forgot-password-page.tsx'));
const ResetPasswordPage = lazy(() => import('./modules/auth/pages/reset-password-page.tsx'));
const AuthProfilePage = lazy(() => import('./modules/auth/pages/auth-profile-page.tsx'));
const DashboardPage = lazy(() => import('./modules/dashboard/pages/dashboard-page.tsx'));
const CashierPosPage = lazy(() => import('./modules/cashier/pages/cashier-pos-page.tsx'));
const CashierDisplayPage = lazy(() => import('./modules/cashier/pages/cashier-display-page.tsx'));
const InvoiceIndexPage = lazy(() => import('./modules/invoice/pages/invoice-index-page.tsx'));
const InvoiceDetailPage = lazy(() => import('./modules/invoice/pages/invoice-detail-page.tsx'));
const queryClient = new QueryClient();
export default function App() {
    const { user } = useAuth()
    const socket = echo;

    useEffect(() => {
        const channel = socket.channel(`sales.${user?.department.id}`);
        channel.listen('SaleEvent', (e: any) => {
            console.log(e)
        });
        return () => {
            socket.leave(`sales`);
        };
    }, [socket])
    return <>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <CartProvider>
                    <Routes>
                        <Route element={<GuestRoute />}>
                            <Route element={<AuthLayout />}>
                                <Route path="register" element={<RegisterPage />} />
                                <Route path="login" element={<LoginPage />} />
                                <Route path="forgot-password" element={<ForgotPasswordPage />} />
                                <Route path="reset-password" element={<ResetPasswordPage />} />
                            </Route>
                        </Route>
                        <Route element={<AuthenticatedRoute />}>
                            <Route element={<AppLayout />}>
                                <Route index element={<DashboardPage />} />
                                <Route path="me" element={<AuthProfilePage />} />
                                <Route path="cashier" element={<CashierPosPage />} />
                                <Route path="invoices" element={<InvoiceIndexPage />} />
                                <Route path="invoices/:invoiceId" element={<InvoiceDetailPage />} />
                            </Route>
                            <Route path="cashier/display" element={<CashierDisplayPage />} />
                        </Route>
                        <Route path="*" element={<ErrorPage />} />
                    </Routes>
                    <Toaster richColors position='top-center' />
                </CartProvider>
            </BrowserRouter>
        </QueryClientProvider>
    </>
}