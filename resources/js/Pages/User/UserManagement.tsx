import { DataTable } from "@/Components/DataTable";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { User, PaginationProps } from "@/types";

interface UserManagementProps {
    users: PaginationProps<User>;
}

export default function UserManagement({ users }: UserManagementProps) {
    const columns: ColumnDef<User>[] = [
        {
            accessorKey: "No",
            header: "No",
            cell: ({ row }) => <div className="font-bold">{row.index + 1}</div>,
        },
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-black bg-gray-100">
                            {user.profile_url ? (
                                <img
                                    src={user.profile_url}
                                    alt={user.name}
                                    className="h-full w-full object-cover rounded-full"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center font-vt323 text-xl font-bold text-gray-500">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="font-bold">{user.name}</div>
                    </div>
                );
            },
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => (
                <div className="font-bold">{row.getValue("email")}</div>
            ),
        },
        {
            accessorKey: "phone_number",
            header: "Phone Number",
            cell: ({ row }) => (
                <div className="font-bold">{row.getValue("phone_number")}</div>
            ),
        },
        {
            accessorKey: "tier",
            header: "Tier",
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="font-bold">
                        {user.tier ? user.tier.name : "(-)"}
                    </div>
                );
            },
        },
        {
            accessorKey: "role",
            header: "Role",
            cell: ({ row }) => (
                <div className="font-bold">{row.getValue("role")}</div>
            ),
        },
    ];
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    User Management
                </h2>
            }
        >
            <Head title="User Management" />
            <div className="py-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-bold font-vt323">
                            User Management
                        </h3>
                        <p className="text-gray-500 font-vt323 text-lg">
                            Manage user accounts here.
                        </p>
                    </div>
                </div>

                <DataTable<User, unknown>
                    columns={columns}
                    data={users.data}
                    pagination={users}
                />
            </div>
        </AuthenticatedLayout>
    );
}
