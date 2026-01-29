import { Button } from "@/Components/ui/button";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import { Link, Head, useForm } from "@inertiajs/react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { useState } from "react";
import PixelDropzone from "@/Components/PixelDropzone";
import { DataTable } from "@/Components/DataTable";

type CodingTool = {
    id: number;
    name: string;
    description: string;
    image: string;
};

type PaginationProps = {
    data: CodingTool[];
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
};

export default function CodingTool({
    codingTools,
}: {
    codingTools: PaginationProps;
}) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        description: "",
        image: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("coding-tool.store"), {
            onSuccess: () => {
                setIsCreateOpen(false);
                reset();
            },
        });
    };

    const columns = [
        {
            header: "Image",
            accessorKey: "image",
            cell: (info: any) => (
                <div className="w-12 h-12 overflow-hidden rounded-md border-2 border-black dark:border-white">
                    {info.getValue() ? (
                        <img
                            src={info.getValue()}
                            alt="Tool Logo"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-500">
                            No Img
                        </div>
                    )}
                </div>
            ),
        },
        {
            header: "Name",
            accessorKey: "name",
            cell: (info: any) => (
                <span className="font-bold font-vt323 text-lg">
                    {info.getValue()}
                </span>
            ),
        },
        {
            header: "Description",
            accessorKey: "description",
            cell: (info: any) => (
                <span className="text-sm text-gray-600 dark:text-gray-400 font-vt323 text-lg line-clamp-1">
                    {info.getValue() || "-"}
                </span>
            ),
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Coding Tools
                </h2>
            }
        >
            <Head title="Coding Tools" />
            <div className="py-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-bold font-vt323 text-black dark:text-white">
                            All Coding Tools
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 font-vt323 text-lg">
                            Manage coding tools available for courses.
                        </p>
                    </div>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="font-vt323 text-xl">
                                Create New Coding Tool
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle className="text-black dark:text-white">
                                    Create Coding Tool
                                </DialogTitle>
                                <DialogDescription className="text-gray-500 dark:text-gray-400">
                                    Add a new coding tool to the library.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={submit} className="space-y-6 mt-4">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="name"
                                        className="text-lg font-vt323 text-black dark:text-white"
                                    >
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        placeholder="e.g. VS Code"
                                        className="font-vt323 text-lg"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm font-vt323">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="description"
                                        className="text-lg font-vt323 text-black dark:text-white"
                                    >
                                        Description
                                    </Label>
                                    <Input
                                        id="description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Brief description of the tool"
                                        className="font-vt323 text-lg"
                                    />
                                    {errors.description && (
                                        <p className="text-red-500 text-sm font-vt323">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-lg font-vt323 text-black dark:text-white">
                                        Logo / Image
                                    </Label>
                                    <PixelDropzone
                                        maxFiles={1}
                                        onFilesChange={(files) =>
                                            setData("image", files[0] || null)
                                        }
                                    />
                                    {errors.image && (
                                        <p className="text-red-500 text-sm font-vt323">
                                            {errors.image}
                                        </p>
                                    )}
                                </div>

                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => setIsCreateOpen(false)}
                                        className="font-vt323 text-lg border-2 border-black dark:border-white"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="font-vt323 text-lg bg-blue-600 hover:bg-blue-700 text-white border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
                                    >
                                        Create Tool
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-md border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                    <DataTable
                        columns={columns}
                        data={codingTools.data}
                        pagination={codingTools}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
