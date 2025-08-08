"use client"

import { Loader2Icon } from "lucide-react"

export function AuthLoader() {
    return <>
        <div className='w-full min-h-screen flex justify-center items-center'>
            <div className="flex flex-col justify-center items-center text-center">
                <Loader2Icon className='animate-spin' />
                <p>Auth check ...</p>
            </div>
        </div>
    </>
}