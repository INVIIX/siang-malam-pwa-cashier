import { ReactNode } from "react";
import { Loader2Icon } from "lucide-react";
import { Button } from "../ui/button";

export function ButtonSubmit({
    className,
    loading = false,
    children = 'Submit',
    ...props
}: React.ComponentProps<"button"> & {
    loading?: boolean,
    children?: ReactNode | string
}) {
    return <>
        <Button {...props} disabled={loading} className={className}>
            {loading ? <Loader2Icon className="animate-spin" /> : children}
        </Button>
    </>
}