import { Button } from "@/Components/ui/button";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { DataTable } from "@/Components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";

type PermissionGroup = {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
};

interface PermissionGroupPageProps {
    groups: PermissionGroup[];
}

export default function PermissionGroupIndex({ groups }: PermissionGroupPageProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [deletingGroup, setDeletingGroup] = useState<PermissionGroup | null>(null);
    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
        name: "",
    });
    const { delete: destroy, processing: isDeleting } = useForm();

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("permission-group.store"), {
            onSuccess: () => {
                setIsCreateOpen(false);
                reset();
            },
        });
    };

    const handleDelete = () => {
        if (deletingGroup) {
            destroy(route("permission-group.destroy", deletingGroup.id), {
                onSuccess: () => setDeletingGroup(null),
            });
        }
    };

    const columns: ColumnDef<PermissionGroup>[] = [
        {
            accessorKey: "name",
            header: "Group Name",
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
                const group = row.original;
                return (
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="destructive"
                            className="border-2 border-black h-8 font-vt323 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                            onClick={() => setDeletingGroup(group)}
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
                    Permission Group Management
                </h2>
            }
        >
            <Head title="Permission Groups" />
            <div className="py-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-bold font-vt323">
                            All Groups
                        </h3>
                        <p className="text-gray-500 font-vt323 text-lg">
                            Manage groups for categorizing permissions.
                        </p>
                    </div>

                    <Button 
                        onClick={() => setIsCreateOpen(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 font-vt323 text-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
                    >
                        Create Group
                    </Button>
                </div>

                <DataTable
                    columns={columns}
                    data={groups}
                    pagination={null}
                />
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create Permission Group</DialogTitle>
                        <DialogDescription>
                            Create a new group to categorize permissions.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Group Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                placeholder="e.g. Course Management"
                                className="font-vt323 text-lg"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm font-vt323">{errors.name}</p>
                            )}
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setIsCreateOpen(false)}
                                className="font-vt323 text-lg"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="font-vt323 text-lg"
                            >
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={!!deletingGroup} onOpenChange={(open) => !open && setDeletingGroup(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Delete Group</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the group "{deletingGroup?.name}"? This might affect permissions categorized under it.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setDeletingGroup(null)}
                            className="font-vt323 text-lg"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
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
