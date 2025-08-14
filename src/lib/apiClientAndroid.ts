import { TPrinterDevice, TPrintRawRequest } from "@/types/android-api-resources"
import axios from "axios"

const localhostApiClient = axios.create({
    baseURL: "http://localhost:8080",
})

export function checkServiceStatus() {
    return localhostApiClient.get("/status")
}

export function findPrinters(): Promise<TPrinterDevice[]> {
    return localhostApiClient.get<TPrinterDevice[]>("/printer/find").then((response) => response.data)
}

export function printRaw(deviceId: string = "", commands: number[]) {
    const requestBody: TPrintRawRequest = {
        deviceId: deviceId,
        commands: commands,
    }

    return localhostApiClient.post("/printraw", requestBody, {
        headers: {
            "Content-Type": "application/json",
        },
    })
}

export function setCustomerDisplay(html: string) {
    return localhostApiClient.post("/display", html, {
        headers: {
            "Content-Type": "text/plain",
        },
    })
}

// Testing functions
export function testPrinter() {
    return localhostApiClient
        .get("/testprint")
        .then((response) => {
            console.log("Printer test successful:", response.data)
        })
        .catch((error) => {
            console.error("Printer test failed:", error)
        })
}

export function testPrinterRaw() {
    return localhostApiClient.get("/testprintraw")
}
