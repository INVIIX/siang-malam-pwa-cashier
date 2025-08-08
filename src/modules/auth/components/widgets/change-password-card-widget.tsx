"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChangePasswordForm } from "../ui/change-password-form";

export default function ChangePasswordCardWidget({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <>
            <Card className={cn("",)} {...props}>
                <CardHeader className="flex flex-col items-center gap-2 text-center">
                    <CardTitle className="text-2xl font-bold">
                        Change Password
                    </CardTitle>
                    <CardDescription className="text-muted-foreground text-sm text-balance">
                        Enter your new password below.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6">
                    <ChangePasswordForm className={cn("w-full", className)} />
                </CardContent>
            </Card>
        </>
    );
}