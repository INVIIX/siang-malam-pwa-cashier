import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { previewReceipt } from "@/modules/invoice/helpers/receipt-printer-text";
import { useJSPM } from "@/modules/printer/components/context/jspm-context";

export function PosReceipt() {
    const invoice = false;
    const { printers, selectedPrinter, changePrinter, printCommand } = useJSPM();

    return <>
        <Card className="w-full">
            <CardHeader className="border-b">
                <CardTitle className="text-center">Nota Tagihan</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="max-w-full mx-auto overflow-x-auto">
                    <pre>{invoice && previewReceipt(invoice)}</pre>
                </div>
            </CardContent>
            <CardFooter className="border-t">
                <Select value={selectedPrinter} onValueChange={(value) => { changePrinter(value) }}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                        <SelectGroup>
                            <SelectLabel>Fruits</SelectLabel>
                            {
                                printers?.map((printer: any, key: number) => {
                                    return <SelectItem key={key} value={printer.name}>{printer.name}</SelectItem>
                                })
                            }
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </CardFooter>
        </Card>
    </>
}