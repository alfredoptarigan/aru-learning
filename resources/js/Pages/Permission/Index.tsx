import { Button } from "@/Components/ui/button";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { DataTable } from "@/Components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useState } from "react";
import CreatePermission from "./Partials/CreatePermission";
import DeletePermission from "./Partials/DeletePermission";

interface Group {
    id: string;
    name: string;
}

type Permission = {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    group?: Group;
};

interface PermissionPageProps {
    permissions: Permission[];
    groups: Group[];
}

export default function PermissionIndex({
    permissions,
    groups,
}: PermissionPageProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [deletingPermission, setDeletingPermission] =
        useState<Permission | null>(null);

    const columns: ColumnDef<Permission>[] = [
        {
            accessorKey: "group.name",
            header: "Group",
            cell: ({ row }) => (
                <div className="font-bold uppercase text-gray-600">
                    {row.original.group?.name || "Other"}
                </div>
            ),
        },
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
                const permission = row.original;
                return (
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 font-vt323"
                            onClick={() => setDeletingPermission(permission)}
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
                    Permission Management
                </h2>
            }
        >
            <Head title="Permissions" />
            <div className="py-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-bold font-vt323">
                            All Permissions
                        </h3>
                        <p className="text-gray-500 font-vt323 text-lg">
                            Manage system permissions.
                        </p>
                    </div>

                    <Button
                        onClick={() => setIsCreateOpen(true)}
                        className="font-vt323 text-xl"
                    >
                        Create Permission
                    </Button>
                </div>

                <DataTable
                    columns={columns}
                    data={permissions}
                    pagination={null} // We are just showing all permissions for now as per controller
                />
            </div>

            <CreatePermission
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                groups={groups}
            />

            <DeletePermission
                permission={deletingPermission}
                isOpen={!!deletingPermission}
                onClose={() => setDeletingPermission(null)}
            />
        </AuthenticatedLayout>
    );
}
