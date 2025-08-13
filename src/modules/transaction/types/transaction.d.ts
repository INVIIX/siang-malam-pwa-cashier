
export type TTransaction = {
    table_id: number | null;
    direct_payment?: boolean;
    status?: 'open' | 'paid' | 'canceled';
}