import { TBranch } from "@/modules/auth/types/branch";
import { TDepartment } from "@/modules/auth/types/department";

export type TRole = {
    id?: number;
    name: string;
}

export type TUser = {
    id?: number;
    branch_id: number | null;
    department_id: number | null;
    name: string;
    email: string;
    password?: string;
}

export interface IAuthUser extends TUser {
    role?: TRole;
    department?: TDepartment;
    branch?: TBranch;
}