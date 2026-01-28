import { Card } from "@/Components/ui/card";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ChevronLeft } from "lucide-react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { FormEventHandler } from "react";
import { createTierSchema } from "@/types/schema";
import { ZodError } from "zod";

export default function CreateTier() {
    const { data, setData, post, processing, errors, setError, clearErrors } =
        useForm({
            name: "",
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Client-side Validation
        try {
            createTierSchema.parse(data);
            clearErrors(); // Clear any previous errors if validation passes
            post(route("tier.store"));
        } catch (error) {
            if (error instanceof ZodError) {
                const formattedErrors: Record<string, string> = {};
                error.issues.forEach((issue: any) => {
                    if (issue.path[0]) {
                        formattedErrors[issue.path[0].toString()] =
                            issue.message;
                    }
                });
                setError(formattedErrors);
            }
            // if (err instanceof ZodError) {
            //     // Map Zod errors to Inertia's error format
            //     const formattedErrors: Record<string, string> = {};
            //     err.errors.forEach((error: any) => {
            //         if (error.path[0]) {
            //             formattedErrors[error.path[0].toString()] =
            //                 error.message;
            //         }
            //     });
            //     setError(formattedErrors);
            // }
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link
                        href={route("tier.index")}
                        className="flex h-10 w-10 items-center justify-center border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-gray-50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                    >
                        <ChevronLeft className="h-6 w-6 text-black" />
                    </Link>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 font-vt323">
                        Create Tier
                    </h2>
                </div>
            }
        >
            <Head title="Create Tier" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel
                                    htmlFor="name"
                                    value="Tier Name"
                                    className="font-vt323 text-xl"
                                />

                                <TextInput
                                    id="name"
                                    className="mt-1 block w-full font-vt323 text-lg"
                                    value={data.name}
                                    onChange={(e) => {
                                        setData("name", e.target.value);
                                        // Optional: Clear error as user types
                                        if (errors.name) clearErrors("name");
                                    }}
                                    isFocused
                                    placeholder="e.g. Basic, Premium, Gold"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.name}
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <PrimaryButton
                                    disabled={processing}
                                    className="font-vt323 text-xl"
                                >
                                    Create Tier
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
