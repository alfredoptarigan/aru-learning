import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2, Plus, Tag } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { DataTable } from "@/Components/DataTable";

import { PaginationProps } from "@/types";

interface Promo {
    id: string;
    code: string;
    type: "fixed" | "percentage";
    value: number;
    max_uses: number | null;
    used_count: number;
    is_active: boolean;
    course_id: string | null;
    course?: {
        title: string;
    };
    start_date: string | null;
    end_date: string | null;
}

interface PromoPageProps {
    promos: PaginationProps<Promo>;
}

export default function Index({ promos }: PromoPageProps) {
    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this promo code?")) {
            router.delete(route("promo.destroy", id), {
                onSuccess: () => toast.success("Promo deleted successfully"),
            });
        }
    };

    const columns: ColumnDef<Promo>[] = [
        {
            accessorKey: "code",
            header: "Code",
            cell: ({ row }) => (
                <div className="font-bold font-vt323 text-lg">
                    {row.original.code}
                </div>
            ),
        },
        {
            accessorKey: "type",
            header: "Discount",
            cell: ({ row }) => (
                <div className="font-vt323 text-lg">
                    {row.original.type === "percentage"
                        ? `${row.original.value}%`
                        : `Rp ${row.original.value.toLocaleString()}`}
                </div>
            ),
        },
        {
            accessorKey: "course",
            header: "Scope",
            cell: ({ row }) => (
                <Badge
                    variant={row.original.course ? "outline" : "secondary"}
                    className="font-vt323"
                >
                    {row.original.course
                        ? row.original.course.title
                        : "Global (All Courses)"}
                </Badge>
            ),
        },
        {
            accessorKey: "usage",
            header: "Usage",
            cell: ({ row }) => (
                <div className="font-vt323 text-lg">
                    {row.original.used_count} / {row.original.max_uses || "∞"}
                </div>
            ),
        },
        {
            accessorKey: "is_active",
            header: "Status",
            cell: ({ row }) => (
                <Badge
                    className={`${
                        row.original.is_active
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-red-100 text-red-800 border-red-200"
                    } font-vt323`}
                >
                    {row.original.is_active ? "Active" : "Inactive"}
                </Badge>
            ),
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const promo = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() =>
                                    router.get(route("promo.edit", promo.id))
                                }
                                className="cursor-pointer"
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => handleDelete(promo.id)}
                                className="text-red-600 cursor-pointer focus:text-red-600"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 font-vt323">
                    Promo Management
                </h2>
            }
        >
            <Head title="Promos" />
            <div className="py-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-bold font-vt323 text-black dark:text-white flex items-center gap-2">
                            <Tag className="h-6 w-6" /> Promo Codes
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 font-vt323 text-lg">
                            Manage discount codes and promotions.
                        </p>
                    </div>

                    <Link href={route("promo.create")}>
                        <Button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 font-vt323 text-xl border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">
                            <Plus className="mr-2 h-5 w-5" />
                            Create Promo
                        </Button>
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-md border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                    <DataTable
                        columns={columns}
                        data={promos.data}
                        pagination={promos}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
