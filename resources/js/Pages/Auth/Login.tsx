import { Button } from '@/Components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Masuk ke Dashboard" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold">
                        Masuk ke Dashboard
                    </CardTitle>
                    <CardDescription>
                        Akses benefit ebook kamu di sini
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="nama@email.com"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="border-black focus-visible:ring-offset-0"
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Masukkan password"
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                className="border-black focus-visible:ring-offset-0"
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500">
                                    {errors.password}
                                </p>
                            )}
                        </div>
                        <Button
                            className="w-full border-2 border-black bg-[#C25E28] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#a84f1f] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                            disabled={processing}
                        >
                            Masuk
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 text-center text-sm text-gray-500">
                    <div className="space-x-1">
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="underline hover:text-gray-900"
                            >
                                Lupa password?
                            </Link>
                        )}
                        <span>/</span>
                        <Link
                            href={route('register')}
                            className="underline hover:text-gray-900"
                        >
                            Belum punya akun?
                        </Link>
                    </div>
                    <p className="text-xs">
                        Belum punya akun? Beli ebook terlebih dahulu dan kami
                        akan mengirimkan link akses ke email kamu.
                    </p>
                </CardFooter>
            </Card>
        </GuestLayout>
    );
}
