"use client"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod/v4"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { AxiosError } from "axios"
import { toast } from "sonner"
import { useAuth } from "@/modules/auth/components/context/auth-context"
import apiClient from "@/lib/apiClient"
import { errorValidation } from "@/lib/error-validation"
import { InputPassword } from "@/components/commons/input-password"
import { ButtonSubmit } from "@/components/commons/button-submit"

const formSchema = z.object({
    email: z.string(),
    password: z.string(),
    device: z.string(),
});

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            device: "Waiter-Api-Token",
        },
    })

    const {
        handleSubmit,
        setError,
        formState: { isSubmitting },
    } = form;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const response = await apiClient.post('/token', values);
            if (response.status === 200) {
                const access_token: string = response.data.token;
                localStorage.setItem('access_token', access_token);
                setUser(response.data.data);
                navigate('/')
                toast.success('Login success');
            }

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
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="Email" {...field} disabled={isSubmitting} />
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
                                    <div className="flex items-center">
                                        <FormLabel>Password</FormLabel>
                                        {/* <NavLink
                                            to="/forgot-password"
                                            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                        >
                                            Forgot your password?
                                        </NavLink> */}
                                    </div>
                                    <FormControl>
                                        <InputPassword placeholder="Password" {...field} disabled={isSubmitting} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <ButtonSubmit loading={isSubmitting}>Login</ButtonSubmit>
                    </div>
                </form>
            </Form>
        </>

    )
}
