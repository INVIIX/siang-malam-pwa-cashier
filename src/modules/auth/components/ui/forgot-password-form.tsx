"use client"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod/v4"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { AxiosError } from "axios"
import { toast } from "sonner"
import apiClient from "@/lib/apiClient"
import { errorValidation } from "@/lib/error-validation"
import { ButtonSubmit } from "@/components/commons/button-submit"
import { useState } from "react"
import { CheckCircle2Icon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const formSchema = z.object({
    email: z.email(),
    redirect_url: z.url().optional(),
});

export function ForgotPasswordForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const [hasBeenSent, setHasBeenSent] = useState(false);
    const redirect_url = `${import.meta.env.VITE_APP_URL}/reset-password`;
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            redirect_url: redirect_url,
        },
    })

    const {
        handleSubmit,
        setError,
        formState: { isSubmitting },
    } = form;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await apiClient.post('/auth/forgot-password', values);
            toast.success('Email reset password telah dikirim.');
            form.reset();
            setHasBeenSent(true);
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
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="Email" {...field} readOnly={isSubmitting} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <ButtonSubmit loading={isSubmitting}>{hasBeenSent ? 'Resend Link Again' : 'Send Link'}</ButtonSubmit>
                        {
                            hasBeenSent && <Alert className="bg-green-100">
                                <CheckCircle2Icon />
                                <AlertTitle>Terkirim!</AlertTitle>
                                <AlertDescription>
                                    Link reset password telah dikirim ke email anda,
                                    pastikan anda telah memeriksa pada folder spam.
                                </AlertDescription>
                            </Alert>
                        }
                    </div>
                </form>
            </Form>
        </>
    )
}
