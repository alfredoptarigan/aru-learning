import { Button } from "@/Components/ui/button";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { DataTable } from "@/Components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useState } from "react";
import EditTier from "./Partials/EditTier";
import DeleteTier from "./Partials/DeleteTier";

type Tier = {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
};

type PaginationProps = {
    data: Tier[];
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

interface TierPageProps {
    tiers: PaginationProps;
}

export default function Tier({ tiers }: TierPageProps) {
    const [editingTier, setEditingTier] = useState<Tier | null>(null);
    const [deletingTier, setDeletingTier] = useState<Tier | null>(null);

    const columns: ColumnDef<Tier>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => (
                <div className="font-bold">{row.getValue("name")}</div>
            ),
        },
        {
            accessorKey: "created_at",
            header: "Created At",
            cell: ({ row }) => {
                return (
                    <div>
                        {format(
                            new Date(row.getValue("created_at")),
                            "MMM d, yyyy",
                        )}
                    </div>
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const tier = row.original;
                return (
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-2 border-black h-8 font-vt323"
                            onClick={() => setEditingTier(tier)}
                        >
                            Edit
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            className="border-2 border-black h-8 font-vt323 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                            onClick={() => setDeletingTier(tier)}
                        >
                            Delete
                        </Button>
                    </div>
                );
            },
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Tier Management
                </h2>
            }
        >
            <Head title="Tier" />
            <div className="py-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-bold font-vt323">
                            All Tiers
                        </h3>
                        <p className="text-gray-500 font-vt323 text-lg">
                            Manage your course tiers here.
                        </p>
                    </div>

                    {/* Button create tier */}
                    <Link href={route("tier.create")}>
                        <Button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 font-vt323 text-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">
                            Create New Tier
                        </Button>
                    </Link>
                </div>

                <DataTable
                    columns={columns}
                    data={tiers.data}
                    pagination={tiers}
                />
            </div>

            {/* Modals */}
            <EditTier 
                tier={editingTier} 
                isOpen={!!editingTier} 
                onClose={() => setEditingTier(null)} 
            />
            
            <DeleteTier 
                tier={deletingTier} 
                isOpen={!!deletingTier} 
                onClose={() => setDeletingTier(null)} 
            />
        </AuthenticatedLayout>
    );
}
