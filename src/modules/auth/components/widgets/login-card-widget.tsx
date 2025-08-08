"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LoginForm } from "../ui/login-form";
import { NavLink } from "react-router";

export default function LoginCardWidget({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <>
            <Card className={cn("",)} {...props}>
                <CardHeader className="flex flex-col items-center gap-2 text-center">
                    <CardTitle className="text-2xl font-bold">
                        Login to your account
                    </CardTitle>
                    <CardDescription className="text-muted-foreground text-sm text-balance">
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6">
                    <LoginForm className={cn("w-full", className)} />
                </CardContent>
                <CardFooter>
                    <div className="w-full text-center text-sm">
                        Don't have an account?{" "}
                        <NavLink to="/register" className="underline underline-offset-4">
                            Sign Up
                        </NavLink>
                    </div>
                </CardFooter>
            </Card>
        </>
    );
}