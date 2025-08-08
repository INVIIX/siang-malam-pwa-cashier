import { ButtonSubmit } from "@/components/commons/button-submit";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { useCashier } from "../context/cashier-context";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { errorValidation } from "@/lib/error-validation";
import { InputCurrency } from "@/components/commons/input-currency";

const formSchema = z.object({
    begining: z.number(),
});

export function FormCashierOpen({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const { setCashier } = useCashier();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        // mode: "onChange",
        defaultValues: {
            begining: 0,
        },
    })

    const {
        handleSubmit,
        setError,
        formState: { isSubmitting },
    } = form;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await apiClient.post('/cashiers', {
                begining_balance: values.begining
            });

            if (response.status === 200 || response.status === 201) {
                setCashier(response.data.data);
                toast.success('Cashier open success');
            }
        } catch (err) {
            const error = err as AxiosError;
            errorValidation(error, setError);
        }
    }

    return <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className={cn("w-full max-w-sm flex flex-col gap-6", className)} {...props}>
            <div className="grid gap-6">
                <FormField
                    control={form.control}
                    name="begining"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Saldo Awal</FormLabel>
                            <FormControl>
                                <InputCurrency placeholder="Saldo awal" value={field.value} onChange={field.onChange}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <ButtonSubmit loading={isSubmitting}>Buka</ButtonSubmit>
            </div>
        </form>
    </Form>
}