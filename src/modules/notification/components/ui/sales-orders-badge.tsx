import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import apiClient from "@/lib/apiClient";

export const NotificationSalesOrderBadge = () => {
    const { data: unpaidCount, isLoading } = useQuery({
        queryKey: ['unpaid-sales-orders-count'],
        queryFn: async () => {
            const res = await apiClient.get('invoices', {
                params: {
                    status: 'unpaid'
                }
            });
            return res.data.meta.total ?? 0;
        },
        staleTime: 1000 * 60, // Cache selama 1 menit
    });
    return (
        <>
            {!isLoading && unpaidCount > 0 && (
                <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">{unpaidCount}</Badge>
            )}
        </>
    );
};