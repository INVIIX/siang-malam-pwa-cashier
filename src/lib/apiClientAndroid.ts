import axios from "axios"

const localhostApiClient = axios.create({
    baseURL: "http://localhost:8080",
})

export function checkServiceStatus() {
    return localhostApiClient.get("/status")
}

export function printRaw(commands: number[]) {
    return localhostApiClient.post(
        "/printraw",
        {
            commands: commands,
            deviceAddress: "",
        },
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    )
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