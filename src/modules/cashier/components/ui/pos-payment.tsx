import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { previewReceipt } from "@/modules/invoice/helpers/receipt-printer-text"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { InputCurrency } from "@/components/commons/input-currency";
import { Button } from "@/components/ui/button";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { errorValidation } from "@/lib/error-validation";
import { AxiosError } from "axios";
import { Input } from "@/components/ui/input";
import { PlusCircleIcon, XCircleIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { useEffect } from "react";

const paymentSchema = z.object({
    note: z.string(),
    method: z.string(),
    amount: z.preprocess(
        (val: number) => {
            const num = Number(val);
            return isNaN(num) ? undefined : num;
        },
        z.number().min(0)
    ),
});

const fieldsPaymentSchema = z.object({
    payments: z.array(paymentSchema),
    change: paymentSchema
});

export type TPayment = {
    method: string;
    amount: number;
    note: string;
}

export type TFormPayment = {
    payments: TPayment[];
    change: TPayment;
};

type TPosPayment = {
    billAmount: number,
    handlePayment: (data: TPayment[]) => void,
    receipt?: any
}

export function PosPayment({ billAmount = 0, handlePayment, receipt }: TPosPayment) {
    const paymentMethodQuery = useQuery<string[]>({
        queryKey: ['payment-method'],
        queryFn: async () => {
            const response = await apiClient.get('/datasheets/paymentmethods');
            return response.data
        }
    })
    const defaultPayment = { method: "cash", amount: 0, note: "Pembayaran Penjualan" };
    const defaultChange = { method: "cash", amount: 0, note: "Kembalian Penjualan" };
    const formPayment = useForm<TFormPayment>({
        resolver: zodResolver(fieldsPaymentSchema),
        defaultValues: {
            payments: [defaultPayment],
            change: defaultChange
        },
    });

    const {
        handleSubmit,
        control,
        setError,
        formState: { isSubmitting },
        setValue,
        getValues
    } = formPayment;

    const paymentArray = useFieldArray({ control, name: "payments" });
    const watchedPayments = useWatch({ control, name: 'payments' });

    useEffect(() => {
        const totalPaid = watchedPayments?.reduce((sum, p) => sum + (Number(p.amount) || 0), 0) ?? 0;
        const invoiceTotal = billAmount ?? 0;
        const changeAmount = Math.max(totalPaid - invoiceTotal, 0);
        setValue("change.amount", changeAmount);
        const payments: TPayment[] = watchedPayments.filter((p) => p.amount > 0) ?? [];
        const values = getValues();
        if (values.change.amount != 0) {
            payments.push({ ...defaultChange, ...{ amount: -1 * values.change.amount } });
        }
        handlePayment(payments);
    }, [billAmount, watchedPayments, formPayment]);

    const onSubmit = async (values: TFormPayment) => {
        try {
            const payments: TPayment[] = values.payments.filter((p) => p.amount > 0) ?? [];

            const totalPayments = payments.reduce((total, p) => total + (Number(p.amount) || 0), 0) ?? 0;
            if (totalPayments < billAmount) {
                throw new Error("Nilai Pembayaran kurang");
            }
            if (values.change.amount != 0) {
                payments.push({ ...defaultChange, ...{ amount: -1 * values.change.amount } });
            }
            handlePayment(payments);
        } catch (err) {
            const error = err as AxiosError;
            errorValidation(error, setError);
        }
    };
    return <>
        <Card className="w-full">
            <CardHeader className="border-b">
                <CardTitle className="text-center">Pembayaran</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="max-w-full mx-auto overflow-x-auto">
                    <pre>{receipt && previewReceipt(receipt)}</pre>
                </div>
                <Form {...formPayment}>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                        {
                            paymentArray.fields.map((field, index) => {
                                return <div key={field.id} className="flex items-center gap-2">
                                    <FormField
                                        control={control}
                                        name={`payments.${index}.method`}
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormControl>
                                                    <Select defaultValue="cash"
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Method" />
                                                        </SelectTrigger>
                                                        <SelectContent>{paymentMethodQuery.data && paymentMethodQuery.data.map((method, key) => {
                                                            return <SelectItem key={key} value={method}>{method}</SelectItem>
                                                        })}</SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={control}
                                        name={`payments.${index}.amount`}
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormControl>
                                                    <InputCurrency
                                                        value={field.value ?? 0}
                                                        onChange={field.onChange}
                                                        placeholder="Nominal"
                                                        className="text-right"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={control}
                                        name={`payments.${index}.note`}
                                        render={({ field }) => (
                                            <FormItem className="w-full hidden">
                                                <FormControl>
                                                    <Input
                                                        value={field.value ?? ''}
                                                        onChange={field.onChange}
                                                        placeholder="Note/Code"
                                                        className="text-right"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => paymentArray.remove(index)}
                                        disabled={index < 1}
                                    ><XCircleIcon /></Button>
                                </div>
                            })
                        }
                        <div className="flex justify-end items-center gap-2">
                            <div className="w-full text-right">Kembalian:</div>
                            <FormField
                                control={control}
                                name={`change.amount`}
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormControl>
                                            <InputCurrency
                                                value={field.value ?? 0}
                                                onChange={field.onChange}
                                                placeholder="Nominal"
                                                className="text-right"
                                                readOnly={true}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => paymentArray.append(defaultPayment)}
                            ><PlusCircleIcon /></Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    </>
}