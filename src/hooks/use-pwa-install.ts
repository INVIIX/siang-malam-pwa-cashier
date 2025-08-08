import { useEffect, useState } from 'react'

export const usePWAInstallPrompt = () => {
    const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault()
            setInstallEvent(e as BeforeInstallPromptEvent)
        }

        window.addEventListener('beforeinstallprompt', handler)

        return () => {
            window.removeEventListener('beforeinstallprompt', handler)
        }
    }, [])

    const promptInstall = async () => {
        if (installEvent) {
            installEvent.prompt()
            const { outcome } = await installEvent.userChoice
            console.log(`User response to the install prompt: ${outcome}`)
            setInstallEvent(null) // hanya sekali
        }
    }

    return { installEvent, promptInstall }
}
