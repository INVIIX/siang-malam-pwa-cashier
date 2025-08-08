"use client"

import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod/v4"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { AxiosError } from "axios"
import { toast } from "sonner"
import apiClient from "@/lib/apiClient"
import { errorValidation } from "@/lib/error-validation"
import { ButtonSubmit } from "@/components/commons/button-submit"
import { InputPassword } from "@/components/commons/input-password"

const formSchema = z.object({
    current_password: z.string(),
    password: z.string(),
});

export function ChangePasswordForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            current_password: "",
            password: "",
        },
    })

    const {
        handleSubmit,
        setError,
        formState: { isSubmitting },
    } = form;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await apiClient.put('/auth/me/password', values);
            toast.success('Password has been changed.');
        } catch (err) {
            const error = err as AxiosError;
            errorValidation(error, setError);
        }
    }
    return (
        <>
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className={cn("w-full max-w-md flex flex-col gap-6", className)} {...props}>
                    <div className="grid gap-6">
                        <FormField
                            control={form.control}
                            name="current_password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <InputPassword placeholder="Password" {...field} readOnly={isSubmitting} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <InputPassword placeholder="New Password" {...field} readOnly={isSubmitting} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <ButtonSubmit loading={isSubmitting}>Change Password</ButtonSubmit>
                    </div>
                </form>
            </Form>
        </>
    )
}
