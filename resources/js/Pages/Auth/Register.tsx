import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        phone_number: "",
        password: "",
        password_confirmation: "",
        profile_url: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("register"), {
            forceFormData: true,
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Daftar Akun" />

            <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold">
                        Daftar Akun Baru
                    </CardTitle>
                    <CardDescription>
                        Silakan lengkapi data diri Anda
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                className="border-black focus-visible:ring-offset-0"
                                required
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                className="border-black focus-visible:ring-offset-0"
                                required
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone_number">Nomor Telepon</Label>
                            <Input
                                id="phone_number"
                                type="tel"
                                value={data.phone_number}
                                onChange={(e) =>
                                    setData("phone_number", e.target.value)
                                }
                                className="border-black focus-visible:ring-offset-0"
                            />
                            {errors.phone_number && (
                                <p className="text-sm text-red-500">
                                    {errors.phone_number}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="profile_url">Foto Profil</Label>
                            <Input
                                id="profile_url"
                                type="file"
                                onChange={(e) =>
                                    setData(
                                        "profile_url",
                                        e.target.files
                                            ? e.target.files[0]
                                            : null,
                                    )
                                }
                                className="border-black focus-visible:ring-offset-0 file:text-foreground"
                            />
                            {errors.profile_url && (
                                <p className="text-sm text-red-500">
                                    {errors.profile_url}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                className="border-black focus-visible:ring-offset-0"
                                required
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation">
                                Konfirmasi Password
                            </Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value,
                                    )
                                }
                                className="border-black focus-visible:ring-offset-0"
                                required
                            />
                            {errors.password_confirmation && (
                                <p className="text-sm text-red-500">
                                    {errors.password_confirmation}
                                </p>
                            )}
                        </div>

                        <Button
                            className="w-full border-2 border-black bg-[#C25E28] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#a84f1f] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                            disabled={processing}
                        >
                            Daftar
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center text-sm text-gray-500">
                    <Link
                        href={route("login")}
                        className="underline hover:text-gray-900"
                    >
                        Sudah punya akun? Masuk
                    </Link>
                </CardFooter>
            </Card>
        </GuestLayout>
    );
}
