import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import apiClient from "@/lib/apiClient"
import { money } from "@/lib/utils"
import { TInvoice } from "@/modules/cart/helpers/cart-utils"
import { useQuery } from "@tanstack/react-query"
import { PlusCircleIcon, SearchIcon, XCircleIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { encodeReceipt, previewReceipt } from "@/modules/invoice/helpers/receipt-printer-text"
import { toast } from "sonner"
import { errorValidation } from "@/lib/error-validation"
import { AxiosError } from "axios"
import { useJSPM } from "@/modules/printer/components/context/jspm-context"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useDebounce } from "@/hooks/use-debounce"
import { ButtonSubmit } from "@/components/commons/button-submit"
import { z } from "zod/v4"
import { zodResolver } from "@hookform/resolvers/zod"
import { InputCurrency } from "@/components/commons/input-currency"
import { useAuth } from "@/modules/auth/components/context/auth-context"
import { printRaw, setCustomerDisplay } from "@/lib/apiClientAndroid"
import { generateIdleHtml, generateInvoiceHtml } from "@/lib/customerDisplay"
import { makeQrSvg } from "@/lib/qr"

const paymentSchema = z.object({
    note: z.string(),
    method: z.string(),
    amount: z.preprocess((val: number) => {
        const num = Number(val)
        return isNaN(num) ? undefined : num
    }, z.number().min(0)),
})

const fieldsPaymentSchema = z.object({
    payments: z.array(paymentSchema),
    change: paymentSchema,
})

type TPayment = {
    method: string
    amount: number
    note: string
}

export type TFormPayment = {
    payments: TPayment[]
    change: TPayment
}

export default function CashierPosPage() {
    const { user } = useAuth()
    // const { printers, selectedPrinter, changePrinter, printCommand } = useJSPM()

    const [invoice, setInvoice] = useState<TInvoice>()
    const [preview, setPreview] = useState<string | null>(null)
    const [search, setSearch] = useState<string>("")
    const debouncedSearch = useDebounce(search, 300) // 500ms delay
    const invoicesQuery = useQuery<TInvoice[]>({
        queryKey: ["invoices", debouncedSearch],
        queryFn: async () => {
            const response = await apiClient.get("/invoices", {
                params: {
                    status: "unpaid",
                    search: debouncedSearch,
                },
            })
            return response.data.data
        },
    })

    const paymentMethodQuery = useQuery<string[]>({
        queryKey: ["payment-method", search],
        queryFn: async () => {
            const response = await apiClient.get("/datasheets/paymentmethods")
            return response.data
        },
    })

    const defaultPayment = { method: "cash", amount: 0, note: "Pembayaran Penjualan" }
    const defaultChange = { method: "cash", amount: 0, note: "Kembalian Penjualan" }
    const formPayment = useForm<TFormPayment>({
        resolver: zodResolver(fieldsPaymentSchema),
        defaultValues: {
            payments: [defaultPayment],
            change: defaultChange,
        },
    })
    const {
        handleSubmit,
        control,
        setError,
        formState: { isSubmitting },
    } = formPayment
    const paymentArray = useFieldArray({ control, name: "payments" })
    const watchedPayments = useWatch({ control, name: "payments" })

    useEffect(() => {
        const totalPaid = watchedPayments?.reduce((sum, p) => sum + (Number(p.amount) || 0), 0) ?? 0
        const invoiceTotal = invoice?.grand_total ?? 0
        const changeAmount = Math.max(totalPaid - invoiceTotal, 0)
        formPayment.setValue("change.amount", changeAmount)

        if (invoice) {
            setPreview(previewReceipt(invoice))
        }
    }, [invoice, watchedPayments, formPayment])

    useEffect(() => {
        displayPreviewToCustomer()
    }, [preview])

    async function displayPreviewToCustomer() {
        if (invoice && preview) {
            const qrSvg = await makeQrSvg(user?.department.qris ?? "12345678")
            const invoiceHtml = generateInvoiceHtml(preview, qrSvg)
            setCustomerDisplay(invoiceHtml)
        } else {
            const idleHtml = generateIdleHtml()
            setCustomerDisplay(idleHtml)
        }
    }

    const closeForm = () => {
        setInvoice(undefined)
        formPayment.reset()
        setCustomerDisplay(generateIdleHtml())
    }

    const onSubmit = async (values: TFormPayment) => {
        try {
            const payments: TPayment[] = values.payments.filter((p) => p.amount > 0) ?? []
            console.log(payments)
            const totalPayments = payments.reduce((total, p) => total + (Number(p.amount) || 0), 0) ?? 0
            if (totalPayments < (invoice?.grand_total ?? 0)) {
                throw new Error("Nilai Pembayaran kurang")
            }
            if (values.change.amount != 0) {
                payments.push({ ...defaultChange, ...{ amount: -1 * values.change.amount } })
            }
            const data = {
                invoice_code: invoice?.code ?? "",
                methods: payments,
            }
            const response = await apiClient.post("payments", data)
            if (response.status == 200 || response.status == 201) {
                toast.success(`Payment sukses`)
                invoicesQuery.refetch()
                closeForm()

                if (invoice) {
                    let encodedReceipt: Object = encodeReceipt(
                        invoice,
                        user?.department?.name ?? "RM. Siang Malam",
                        user?.branch?.name ?? "-"
                    )
                    let ESCPOSByteArray = Object.values(encodedReceipt)

                    try {
                        printRaw(ESCPOSByteArray)
                    } catch (error) {
                        console.error("Error printing receipt:", error)
                        toast.error("Gagal mencetak nota")
                    }
                }
            }
        } catch (err) {
            const error = err as AxiosError
            errorValidation(error, setError)
        }
    }

    return (
        <>
            <div className="grid gap-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Penjualan</h2>
                        <p className="text-muted-foreground">Transaksi pembayaran penjualan.</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {invoice ? (
                        <>
                            <Card className="w-full py-3">
                                <CardHeader className="border-b-1 pb-1">
                                    <CardTitle className="text-center">Nota Tagihan</CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-4">
                                    <div className="text-center w-full mx-auto overflow-x-auto ">
                                        {preview && <pre className="text-[clamp(0.2rem,1vw,1rem)]">{preview}</pre>}
                                    </div>
                                </CardContent>
                                <CardFooter className="border-t">
                                    {/* 
                                    JSPM Printer Selection

                                    <Select
                                        value={selectedPrinter}
                                        onValueChange={(value) => {
                                            changePrinter(value)
                                        }}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a fruit" />
                                        </SelectTrigger>
                                        <SelectContent className="w-full">
                                            <SelectGroup>
                                                <SelectLabel>Fruits</SelectLabel>
                                                {printers?.map((printer: any, key: number) => {
                                                    return (
                                                        <SelectItem key={key} value={printer.name}>
                                                            {printer.name}
                                                        </SelectItem>
                                                    )
                                                })}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select> */}
                                </CardFooter>
                            </Card>
                            <Card className="w-full py-3">
                                <CardHeader className="border-b-1 pb-1">
                                    <CardTitle className="text-center">Pembayaran</CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-4">
                                    <Form {...formPayment}>
                                        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                                            {paymentArray.fields.map((field, index) => {
                                                return (
                                                    <div key={field.id} className="flex items-center gap-2">
                                                        <FormField
                                                            control={control}
                                                            name={`payments.${index}.method`}
                                                            render={({ field }) => (
                                                                <FormItem className="basis-1/5">
                                                                    <FormControl>
                                                                        <Select
                                                                            defaultValue="cash"
                                                                            value={field.value}
                                                                            onValueChange={field.onChange}
                                                                        >
                                                                            <SelectTrigger className="w-full">
                                                                                <SelectValue placeholder="Method" />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                {paymentMethodQuery.data &&
                                                                                    paymentMethodQuery.data.map(
                                                                                        (method, key) => {
                                                                                            return (
                                                                                                <SelectItem
                                                                                                    key={key}
                                                                                                    value={method}
                                                                                                >
                                                                                                    {method}
                                                                                                </SelectItem>
                                                                                            )
                                                                                        }
                                                                                    )}
                                                                            </SelectContent>
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
                                                                <FormItem className="w-full">
                                                                    <FormControl>
                                                                        <Input
                                                                            value={field.value ?? ""}
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
                                                        >
                                                            <XCircleIcon />
                                                        </Button>
                                                    </div>
                                                )
                                            })}

                                            <div className="flex place-content-center gap-2">
                                                <Button
                                                    type="button"
                                                    variant="link"
                                                    color="orange"
                                                    className="w-fit px-4 my-0 cursor-pointer"
                                                    onClick={() => paymentArray.append(defaultPayment)}
                                                >
                                                    <PlusCircleIcon />
                                                    Tambah Pembayaran
                                                </Button>
                                            </div>

                                            <div className="mt-4 flex justify-end items-center gap-2">
                                                <p className="">Kembalian: </p>
                                                <FormField
                                                    control={control}
                                                    name={`change.amount`}
                                                    render={({ field }) => (
                                                        <FormItem className="grow">
                                                            <FormControl>
                                                                <InputCurrency
                                                                    value={field.value ?? 0}
                                                                    onChange={field.onChange}
                                                                    placeholder="Nominal"
                                                                    readOnly={true}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="flex flex-col justify-end gap-2">
                                                <ButtonSubmit
                                                    loading={isSubmitting}
                                                    children={"Konfirmasi Pembayaran"}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    color="orange"
                                                    onClick={() => closeForm()}
                                                >
                                                    Tutup
                                                </Button>
                                            </div>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </>
                    ) : (
                        <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-4">
                            <div className="w-full grid gap-4">
                                <div className="flex w-full items-center justify-between">
                                    <div className="text-foreground text-base font-medium">Tagihan Masuk</div>
                                </div>
                                <div className="relative">
                                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari..."
                                        type="search"
                                        className="w-full pl-10"
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="w-full grid gap-2">
                                {invoicesQuery.data &&
                                    invoicesQuery.data.map((invoice) => (
                                        <Button
                                            key={invoice.id}
                                            variant="outline"
                                            className="h-auto w-full flex-col text-left shadow"
                                            onClick={() => {
                                                setInvoice(invoice)
                                            }}
                                        >
                                            <div className="flex w-full justify-between items-center gap-2">
                                                <div className="grid">
                                                    <span>{invoice?.code}</span>
                                                    <span className="font-normal">
                                                        Area {invoice?.transaction?.table?.area?.name}
                                                    </span>
                                                    <span>Meja {invoice?.transaction?.table?.number}</span>
                                                </div>
                                                <div>
                                                    <span>{money(invoice?.grand_total ?? 0)}</span>
                                                </div>
                                            </div>
                                        </Button>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
