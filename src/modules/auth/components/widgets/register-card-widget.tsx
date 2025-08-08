"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router";
import { RegisterForm } from "../ui/register-form";

export default function RegisterCardWidget({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <>
            <Card className={cn("",)} {...props}>
                <CardHeader className="flex flex-col items-center gap-2 text-center">
                    <CardTitle className="text-2xl font-bold">
                        Create an Account
                    </CardTitle>
                    <CardDescription className="text-muted-foreground text-sm text-balance">
                        Enter your information below to to create an account
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6">
                    <RegisterForm className={cn("w-full", className)} />
                </CardContent>
                <CardFooter>
                    <div className="w-full text-center text-sm">
                        Have an account?{" "}
                        <NavLink to="/login" className="underline underline-offset-4">
                            Sign In
                        </NavLink>
                    </div>
                </CardFooter>
            </Card>
        </>
    );
}