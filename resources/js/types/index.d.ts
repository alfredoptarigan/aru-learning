export interface Tier {
    id: string;
    name: string;
    created_at?: string;
    updated_at?: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    profile_url?: string;
    role?: string;
    phone_number?: string;
    tier?: Tier | null;
}

export interface PaginationProps<T> {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    flash: {
        success?: string;
        error?: string;
        warning?: string;
        info?: string;
    };
};
