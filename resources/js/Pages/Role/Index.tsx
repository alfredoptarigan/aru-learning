import { Button } from "@/Components/ui/button";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { DataTable } from "@/Components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";

type Permission = {
    id: string;
    name: string;
};

type Role = {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    permissions: Permission[];
};

interface RolePageProps {
    roles: Role[];
}

export default function RoleIndex({ roles }: RolePageProps) {
    const [deletingRole, setDeletingRole] = useState<Role | null>(null);
    const { delete: destroy } = useForm();

    const handleDelete = () => {
        if (deletingRole) {
            destroy(route("role.destroy", deletingRole.id), {
                onSuccess: () => setDeletingRole(null),
            });
        }
    };

    const columns: ColumnDef<Role>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => (
                <div className="font-bold uppercase">
                    {row.getValue("name")}
                </div>
            ),
        },
        {
            accessorKey: "permissions",
            header: "Permissions",
            cell: ({ row }) => {
                const permissions = row.original.permissions;
                const displayLimit = 3;
                const extra = permissions.length - displayLimit;

                return (
                    <div className="flex flex-wrap gap-1">
                        {permissions.slice(0, displayLimit).map((p) => (
                            <span
                                key={p.id}
                                className="bg-gray-200 px-2 py-0.5 text-xs rounded border border-black font-vt323"
                            >
                                {p.name}
                            </span>
                        ))}
                        {extra > 0 && (
                            <span className="bg-gray-100 px-2 py-0.5 text-xs rounded border border-black font-vt323">
                                +{extra} more
                            </span>
                        )}
                    </div>
                );
            },
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
                const role = row.original;
                return (
                    <div className="flex gap-2">
                        <Link href={route("role.edit", role.id)}>
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-8 font-vt323"
                            >
                                Edit
                            </Button>
                        </Link>
                        <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 font-vt323"
                            onClick={() => setDeletingRole(role)}
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
                    Role Management
                </h2>
            }
        >
            <Head title="Roles" />
            <div className="py-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-bold font-vt323">
                            All Roles
                        </h3>
                        <p className="text-gray-500 font-vt323 text-lg">
                            Manage user roles and their permissions.
                        </p>
                    </div>

                    <Link href={route("role.create")}>
                        <Button className="font-vt323 text-xl">
                            Create New Role
                        </Button>
                    </Link>
                </div>

                <DataTable columns={columns} data={roles} pagination={null} />
            </div>

            {/* Delete Confirmation Modal */}
            <Dialog
                open={!!deletingRole}
                onOpenChange={(open) => !open && setDeletingRole(null)}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Delete Role</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the role "
                            {deletingRole?.name}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setDeletingRole(null)}
                            className="font-vt323 text-lg"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                            className="font-vt323 text-lg"
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
