export type TApiResponse<TData> = {
    message?: string;
    errors?: [];
    data: TData | TData[];
    meta?: Record<string, string | number | null | boolean>;
    links?: Record<string, string | number | null | boolean>;
}

export type TRole = {
    id?: number | string;
    guard?: string;
    name: string;
}

export type TUser = {
    id?: number | string;
    email: string;
    name: string;
    status?: boolean;
    avatar?: string;
    roles?: TRole[]
}