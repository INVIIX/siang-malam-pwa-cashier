"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router";
import { ResetPasswordForm } from "../ui/reset-password-form";

export default function ResetPasswordCardWidget({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <>
            <Card className={cn("",)} {...props}>
                <CardHeader className="flex flex-col items-center gap-2 text-center">
                    <CardTitle className="text-2xl font-bold">
                        Reset Password
                    </CardTitle>
                    <CardDescription className="text-muted-foreground text-sm text-balance">
                        Enter your new password below.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6">
                    <ResetPasswordForm className={cn("w-full", className)} />
                </CardContent>
                <CardFooter>
                    <div className="w-full text-center text-sm">
                        Have remember password?{" "}
                        <NavLink to="/login" className="underline underline-offset-4">
                            Sign In
                        </NavLink>
                    </div>
                </CardFooter>
            </Card>
        </>
    );
}