"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { EditProfileForm } from "../ui/edit-profile-form";

export default function EditProfileCardWidget({ className, ...props }: React.ComponentProps<"div">) {
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
                    <EditProfileForm className={cn("w-full", className)} />
                </CardContent>
            </Card>
        </>
    );
}