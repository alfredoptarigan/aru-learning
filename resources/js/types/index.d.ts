export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    profile_url?: string;
    role?: string;
    phone_number?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
