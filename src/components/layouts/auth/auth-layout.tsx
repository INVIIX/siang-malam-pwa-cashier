"use client"

import { cn } from "@/lib/utils";
import { Outlet } from "react-router";

export default function AuthLayout({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div className={cn("flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-orange-200 to-orange-50", className)} {...props}>
            <div className="w-full flex flex-col gap-4 max-w-sm p-6">
                <div className="flex justify-center">
                    <img className="w-[150px]" src="/logo.png" alt="Logo" />
                </div>
                <Outlet />
            </div>
        </div>
    );
}