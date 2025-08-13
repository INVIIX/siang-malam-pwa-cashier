export type TDepartment = {
    id?: number;
    branch_id: number;
    name: string;
    retail?: boolean;
    meta?: { [key: string]: any }
}