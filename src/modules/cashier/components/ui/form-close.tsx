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
    ending_balance: z.number(),
});

export function FormCashierClose({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const { summary, refetchCashier } = useCashier();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            ending_balance: summary.cash.current,
        },
    })
    const {
        handleSubmit,
        setError,
        formState: { isSubmitting },
    } = form;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await apiClient.put('/cashiers', values);
            if (response.status === 200 || response.status === 201) {
                refetchCashier();
                toast.success('Cashier close success');
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
                    name="ending_balance"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Saldo Akhir</FormLabel>
                            <FormControl>
                                <InputCurrency placeholder="Saldo Akhir" value={field.value} onChange={field.onChange}/>
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