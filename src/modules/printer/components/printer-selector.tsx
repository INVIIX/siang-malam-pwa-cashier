import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLocalPrinter } from "./context/local-printer-context"
import { Button } from "@/components/ui/button"
import { RefreshCw, Printer } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TPrinterDevice } from "@/types/android-api-resources"

export const PrinterSelector = () => {
    const { printers, selectedPrinter, isLoading, loadPrinters, selectPrinter } = useLocalPrinter()

    const handlePrinterChange = (deviceId: string) => {
        const printer = printers.find((p: TPrinterDevice) => p.deviceId === deviceId)
        if (printer) {
            selectPrinter(printer)
        }
    }

    return (
        <Card className="w-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Printer className="h-4 w-4" />
                    Printer Selection
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex gap-2">
                    <Select
                        value={selectedPrinter?.deviceId || ""}
                        onValueChange={handlePrinterChange}
                        disabled={isLoading || printers.length === 0}
                    >
                        <SelectTrigger className="flex-1">
                            <SelectValue
                                placeholder={
                                    isLoading
                                        ? "Loading printers..."
                                        : printers.length === 0
                                        ? "No printers found"
                                        : "Select printer"
                                }
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {printers.map((printer: TPrinterDevice) => (
                                <SelectItem key={printer.deviceId} value={printer.deviceId}>
                                    {printer.deviceName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" onClick={loadPrinters} disabled={isLoading} className="px-3">
                        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    </Button>
                </div>

                {selectedPrinter && (
                    <div className="text-xs text-muted-foreground">Selected: {selectedPrinter.deviceName}</div>
                )}

                {printers.length === 0 && !isLoading && (
                    <div className="text-xs text-muted-foreground text-center py-2">
                        No printers available. Make sure Android service is running.
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
