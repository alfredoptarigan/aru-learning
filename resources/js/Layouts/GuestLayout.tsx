import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#FDFBF7] p-4 text-gray-900">
            <div className="w-full max-w-md">
                {children}
            </div>
        </div>
    );
}
