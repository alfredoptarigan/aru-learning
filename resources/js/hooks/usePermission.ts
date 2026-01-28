import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

export const usePermission = () => {
    const { auth } = usePage<PageProps>().props;

    const can = (permission: string) => auth.permissions.includes(permission);
    const hasRole = (role: string) => auth.roles.includes(role);

    return { can, hasRole };
};
