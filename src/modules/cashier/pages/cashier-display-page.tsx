import { useEffect, useState } from "react"
import { QRCodeSVG } from "qrcode.react"

export default function CashierDisplayPage() {
    const [invoice, setInvoice] = useState<string>()
    const [qris, setQris] = useState<string>("")

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return

            if (event.data?.type === "UPDATE_INVOICE") {
                setInvoice(event.data.invoice)
            }

            if (event.data?.type === "SHOW_QRIS") {
                setQris(event.data.qris || false)
            }
        }

        window.addEventListener("message", handleMessage)
        return () => window.removeEventListener("message", handleMessage)
    }, [])

    return (
        <div className="w-full h-screen space-y-4">
            <div className="flex justify-center max-w-lg mx-auto overflow-x-auto">
                <pre>{invoice}</pre>
            </div>
            <div className="flex justify-center">{qris && <QRCodeSVG value={qris} size={250} />}</div>
        </div>
    )
}
