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
import { useNavigate, useSearchParams } from "react-router"

const formSchema = z.object({
    token: z.string(),
    email: z.email(),
    password: z.string(),
    password_confirmation: z.string()
});

export function ResetPasswordForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const token = params.get('token') || '';
    const emailFromUrl = params.get('email') || '';

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            token: token,
            email: emailFromUrl,
            password: "",
            password_confirmation: "",
        },
    })

    const {
        handleSubmit,
        setError,
        formState: { isSubmitting },
    } = form;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await apiClient.post('/auth/reset-password', values);
            toast.success('Password has been reset.');
            navigate('/login');
        } catch (err) {
            const error = err as AxiosError;
            errorValidation(error, setError);
        }
    }
    return (
        <>
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className={cn("w-full max-w-sm flex flex-col gap-6", className)} {...props}>
                    <div className="grid gap-6">
                        <FormField
                            control={form.control}
                            name="password"
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
                            name="password_confirmation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <InputPassword placeholder="Confirm Password" {...field} readOnly={isSubmitting} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <ButtonSubmit loading={isSubmitting}>Reset Password</ButtonSubmit>
                    </div>
                </form>
            </Form>
        </>
    )
}
