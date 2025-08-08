"use client"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod/v4"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { AxiosError } from "axios"
import { toast } from "sonner"
import { errorValidation } from "@/lib/error-validation"
import { ButtonSubmit } from "@/components/commons/button-submit"
import apiClient from "@/lib/apiClient"
import { useAuth } from "../context/auth-context"
import { InputPassword } from "@/components/commons/input-password"

const formSchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
    password_confirmation: z.string(),
});

export function EditProfileForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const { user, setUser } = useAuth();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: user?.email,
            name: user?.name,
            password: "",
            password_confirmation: ""
        },
    })

    const {
        handleSubmit,
        setError,
        formState: { isSubmitting },
    } = form;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const response = await apiClient.put('/me', values);
            const newUser = response.data.data;
            setUser({ ...user, ...newUser });
            toast.success('Profile updated successfully.');
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
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="Name" {...field} readOnly={isSubmitting} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                                    <FormLabel>Ulangi Password</FormLabel>
                                    <FormControl>
                                        <InputPassword placeholder="New Password" {...field} readOnly={isSubmitting} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <ButtonSubmit loading={isSubmitting}>Update</ButtonSubmit>
                    </div>
                </form>
            </Form>
        </>
    )
}
