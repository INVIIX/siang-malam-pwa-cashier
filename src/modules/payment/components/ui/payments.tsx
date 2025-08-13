import { useEffect, useState } from "react";
import { TPayment } from "../../types/payment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { money } from "@/lib/utils";
import { Trash2Icon } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { InputCurrency } from "@/components/commons/input-currency";

export function PaymentItem(
    { index, item, handleChange, removePayment }:
        { index: number, item: TPayment, handleChange: (index: number, value: string) => void, removePayment: (index: number) => void }
) {
    return <>
        <div className="flex gap-2 items-center">
            <Select defaultValue="cash">
                <SelectTrigger className="w-[110px]">
                    <SelectValue placeholder="Pilih Metode Pembayaran" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="cash">Tunai</SelectItem>
                        <SelectItem value="qris">QRIS</SelectItem>
                        <SelectItem value="transfer">Transfer</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <InputCurrency
                value={item.amount}
                className="flex-1 text-right"
                onChange={(value) => handleChange(index, String(value))}
            />
            <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removePayment(index)}
                disabled={index === 0}
            >
                <Trash2Icon />
            </Button>
        </div>
    </>
}

export function ChangeItem() {
    return <>

    </>
}


export function Payments({ billAmount = 0, handlePayments }: { billAmount: number, handlePayments: (payments: TPayment[]) => void }) {
    const [paymentAmount, setPaymentAmount] = useState<number>(0);
    const [changeAmount, setChangeAmount] = useState<number>(0);

    const defaultPaymentItem = {
        method: 'cash',
        amount: 0,
        note: 'Pembayaran Penjualan'
    };

    const defaultChangeItem = {
        method: 'cash',
        amount: 0,
        note: 'Kembalian Penjualan'
    };

    const defaultVoucherItem = {
        method: 'cash',
        amount: 0,
        note: 'Kembalian Penjualan'
    };

    const [paymentItems, setPaymentItems] = useState<TPayment[]>([defaultPaymentItem]);
    const [changeItems, setChangeItems] = useState<TPayment[]>([defaultChangeItem]);
    const [voucherItems, setVoucherItems] = useState<TPayment[]>([defaultVoucherItem]);

    const handleChange = (index: number, newValue: string) => {
        const updated = [...paymentItems];
        updated[index].amount = parseInt(newValue);
        setPaymentItems(updated);
    }

    const addPayment = () => {
        setPaymentItems([...paymentItems, defaultPaymentItem]);
    };

    const removePayment = (index: number) => {
        const updated = paymentItems.filter((_, i) => i !== index);
        setPaymentItems(updated.length > 0 ? updated : [defaultPaymentItem]);
    };

    useEffect(() => {
        const paidAmount = paymentItems.reduce((sum, payment) => sum + payment.amount, 0);
        const changedAmount = paidAmount - billAmount;
        setPaymentAmount(paidAmount);
        setChangeAmount(changedAmount);
        if (changedAmount > 0) {
            setChangeItems([{ method: 'cash', amount: (changedAmount * -1), note: 'Kembalian Penjualan' }])
        }
    }, [billAmount, paymentItems])

    const submitPayments = () => {
        const allPayments = [...paymentItems, ...changeItems, ...voucherItems].filter((payment) => payment.amount !== 0);
        handlePayments(allPayments);
    }

    return <>
        <div className="size-full flex flex-col gap-2 bg-white">
            <div className="flex flex-1 flex-col gap-2 p-2">
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        <Input className="flex-1" placeholder="Masukan Kode Voucher" />
                        <Button variant="outline">Gunakan Voucher</Button>
                    </div>
                </div>
                {
                    paymentItems.map((item, key) => <PaymentItem
                        key={key}
                        index={key}
                        item={item}
                        handleChange={handleChange}
                        removePayment={removePayment}
                    />)
                }
                <Button variant="outline" onClick={addPayment}>
                    Tambah baris pembayaran
                </Button>
                <Button size="lg" onClick={submitPayments}>Bayar dan Cetak</Button>
            </div>
            <div className="h-auto">
                <Table className="w-full border-separate border-spacing-0 bg-white">
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-medium">Total Tagihan</TableCell>
                            <TableCell className="font-medium text-right">{money(billAmount)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Total Dibayar</TableCell>
                            <TableCell className="font-medium text-right">{money(paymentAmount)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Kembalian</TableCell>
                            <TableCell className="font-medium text-right">{money(changeAmount)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    </>
}