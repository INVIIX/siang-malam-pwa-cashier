"use client"

import { Loader2Icon } from "lucide-react"

export function SplashScreen() {
    return <>
        <div className='w-full min-h-screen flex justify-center items-center bg-blue-100'>
            <Loader2Icon className='animate-spin' />
        </div>
    </>
}