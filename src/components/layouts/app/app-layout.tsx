"use client"

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import { AppSidebar } from "./app-sidebar";
import { useLocalStorage } from "react-use";
import { useCashier } from "@/modules/cashier/components/context/cashier-context";
import { FormCashierOpen } from "@/modules/cashier/components/ui/form-open";

export default function AppLayout() {
    const [sidebarState, setSidebarState] = useLocalStorage("sidebar_state", true);
    const { open } = useCashier();
    return (
        <SidebarProvider defaultOpen={sidebarState} open={sidebarState} onOpenChange={setSidebarState} >
            <AppSidebar />
            <SidebarInset className="md:p-2 md:pl-0 bg-transparent">
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col px-4">
                        <div className="hidden"><SidebarTrigger /></div>
                        {open ? <Outlet /> : <FormCashierOpen />}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}