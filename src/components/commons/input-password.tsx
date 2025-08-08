import * as React from "react"
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

function InputPassword({ className, ...props }: React.ComponentProps<"input">) {
    const [type, setType] = React.useState<"text" | "password">("password");
    const toggleType = () => {
        const newType = type == 'password' ? 'text' : 'password';
        setType(newType)
    }
    return (
        <div className="relative">
            <Input {...props} type={type} className={cn(
                "pr-8",
                className
            )} />
            <div onClick={toggleType} className="cursor-pointer text-muted-foreground px-3 py-1 h-full aspect-square flex flex-col items-center justify-center absolute top-1/2 -translate-y-1/2 right-0">
                {
                    type == 'password'
                        ? <EyeIcon />
                        : <EyeClosedIcon />
                }
            </div>
        </div>

    )
}

export { InputPassword }