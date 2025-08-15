import indexHTML from "@/templates/index.html?raw"
import { setCustomerDisplay } from "./apiClientAndroid"

export async function displayCustomerIndex() {
    const logoResponse = await fetch("/logo.png")
    const logoBlob = await logoResponse.blob()
    const logoBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(logoBlob)
    })

    const body = indexHTML.replace("[[logo]]", logoBase64)
    return setCustomerDisplay(body)
}
