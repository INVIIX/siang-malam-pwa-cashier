export type TStatusResponse = {
    printer: boolean
    customerDisplay: boolean
}

export type TPrinterDevice = {
    deviceName: string
    deviceId: string
}

export type TPrintTextRequest = {
    deviceId: string
    content: string
}

export type TPrintRawRequest = {
    deviceId: string
    commands: number[]
}
