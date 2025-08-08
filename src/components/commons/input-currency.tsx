import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

interface CurrencyInputProps {
    value: number;
    onChange: (value: number) => void;
    placeholder?: string;
    className?: string;
    readOnly?: boolean
}

export function InputCurrency({ value, onChange, placeholder, className, readOnly }: CurrencyInputProps) {
    const [display, setDisplay] = useState('');

    useEffect(() => {
        setDisplay(formatNumber(value));
    }, [value]);

    const formatNumber = (val: number | string) => {
        if (val === '') return '';
        const num = typeof val === 'number' ? val : parseInt(val.replace(/\D/g, '')) || 0;
        return num.toLocaleString('id-ID');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, '');
        const num = Number(raw);
        setDisplay(formatNumber(raw));
        onChange(isNaN(num) ? 0 : num);
    };

    return (
        <Input
            inputMode="numeric"
            placeholder={placeholder}
            className={className}
            value={display}
            onChange={handleChange}
            {...{ readOnly }}
        />
    );
}
