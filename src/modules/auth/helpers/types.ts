export type TCredentials = {
    email: string;
    password: string;
    device: string;
    rememberMe?: boolean;
};

export type TRole = {
    id: number;
    name: string;
    guard_name?: string;
}

export type TBranch = {
    id: number;
    name: string;
}

export type TDepartment = {
    id: number;
    name: string;
}

export type TUser = {
    id?: number | string;
    email: string;
    name: string;
    avatar?: string;
    role: TRole;
    branch: TBranch;
    department: TDepartment;
};