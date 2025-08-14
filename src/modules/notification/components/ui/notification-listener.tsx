import { useNotificationSound } from "@/hooks/use-notification-sound";
import { echo } from "@/lib/echo";
import { useAuth } from "@/modules/auth/components/context/auth-context";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

export function NotificationListener() {
    const { play, ready } = useNotificationSound();
    const { user } = useAuth();
    const queryClient = useQueryClient()

    useEffect(() => {
        const channel = echo.channel(`socket.sales-orders.${user?.department.id}`);
        channel.listen('.socket.message', (e: any) => {
            toast.info(e.message)
            queryClient.invalidateQueries({ queryKey: ['unpaid-sales-orders-count'], exact: false });
            queryClient.invalidateQueries({ queryKey: ['invoice-orders'], exact: false });
            if (ready) { play(); }
            console.log(ready)
        });
    }, [user, play, ready]);

    return null;
}