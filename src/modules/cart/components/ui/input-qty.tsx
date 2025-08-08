import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Minus, Plus } from "lucide-react"

interface FieldNumericProps {
    label?: string
    name: string
    value: number
    onChange: (value: number) => void
    min?: number
    max?: number
    step?: number
}

export const InputQty: React.FC<FieldNumericProps> = ({
    label,
    name,
    value,
    onChange,
    min = 0,
    max = Infinity,
    step = 1,
}) => {
    const handleDecrement = () => {
        const newValue = Math.max(min, value - step)
        onChange(newValue)
    }

    const handleIncrement = () => {
        const newValue = Math.min(max, value + step)
        onChange(newValue)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        if (/^\d*$/.test(val)) {
            const num = parseInt(val || "0", 10)
            onChange(Math.min(Math.max(num, min), max))
        }
    }

    return (
        <div className="flex flex-col gap-2">
            {label && <Label htmlFor={name}>{label}</Label>}
            <div className="flex items-center border rounded-md overflow-hidden">
                <button
                    type="button"
                    onClick={handleDecrement}
                    className="px-3 py-2 hover:bg-muted"
                >
                    <Minus size={16} />
                </button>
                <Input
                    id={name}
                    name={name}
                    type="text"
                    value={value}
                    onChange={handleChange}
                    className="text-center border-x-0 rounded-none w-[60px]"
                    readOnly={true}
                />
                <button
                    type="button"
                    onClick={handleIncrement}
                    className="px-3 py-2 hover:bg-muted"
                >
                    <Plus size={16} />
                </button>
            </div>
        </div>
    )
}
