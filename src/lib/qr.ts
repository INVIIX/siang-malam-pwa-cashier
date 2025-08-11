import QRCode from "qrcode"

export async function makeQrSvg(data: string, size = 256) {
    const svg = await QRCode.toString(data, {
        type: "svg",
        width: size,
        margin: 4,
        color: {
            dark: "#000000",
            light: "#00000000",
        },
    })
    
    return svg
}
