import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useMemo } from "react";

type Group = {
    id: string;
    name: string;
};

type Permission = {
    id: string;
    name: string;
    group_name?: string;
    group?: Group;
};

interface CreateRoleProps {
    permissions: Permission[];
}

export default function CreateRole({ permissions }: CreateRoleProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        permissions: [] as string[],
    });

    const groupedPermissions = useMemo(() => {
        const groups: Record<string, Permission[]> = {};
        permissions.forEach((permission) => {
            const groupName = permission.group?.name || permission.group_name || "Other";
            if (!groups[groupName]) {
                groups[groupName] = [];
            }
            groups[groupName].push(permission);
        });
        return groups;
    }, [permissions]);

    const handlePermissionToggle = (permissionId: string) => {
        const currentPermissions = [...data.permissions];
        if (currentPermissions.includes(permissionId)) {
            setData("permissions", currentPermissions.filter((id) => id !== permissionId));
        } else {
            setData("permissions", [...currentPermissions, permissionId]);
        }
    };

    const handleGroupToggle = (groupPermissions: Permission[], isSelected: boolean) => {
        const groupIds = groupPermissions.map((p) => p.id);
        const currentPermissions = [...data.permissions];

        if (isSelected) {
            // Add all missing permissions from this group
            const newPermissions = Array.from(new Set([...currentPermissions, ...groupIds]));
            setData("permissions", newPermissions);
        } else {
            // Remove all permissions from this group
            setData("permissions", currentPermissions.filter((id) => !groupIds.includes(id)));
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("role.store"));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Create Role
                </h2>
            }
        >
            <Head title="Create Role" />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg border-2 border-black dark:border-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                    <form onSubmit={submit} className="space-y-6">
                        {/* Name Input */}
                        <div className="space-y-2 max-w-md">
                            <Label htmlFor="name" className="text-lg font-vt323 text-black dark:text-white">Role Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                placeholder="e.g. editor"
                                className="font-vt323 text-lg"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm font-vt323">{errors.name}</p>
                            )}
                        </div>

                        {/* Permissions Groups */}
                        <div className="space-y-4">
                            <Label className="text-lg font-vt323 text-black dark:text-white">Assign Permissions</Label>
                            
                            {permissions.length === 0 && (
                                <p className="text-gray-500 dark:text-gray-400 font-vt323">No permissions available. Create some first.</p>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Object.entries(groupedPermissions).map(([groupName, groupPerms]) => {
                                    const allSelected = groupPerms.every((p) => data.permissions.includes(p.id));
                                    
                                    return (
                                        <div key={groupName} className="border-2 border-black dark:border-white p-4 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] bg-gray-50 dark:bg-gray-700">
                                            <div className="flex items-center justify-between mb-4 border-b-2 border-gray-200 dark:border-gray-600 pb-2">
                                                <h3 className="font-bold text-lg font-vt323 uppercase text-black dark:text-white">{groupName}</h3>
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        id={`group-${groupName}`}
                                                        checked={allSelected}
                                                        onChange={(e) => handleGroupToggle(groupPerms, e.target.checked)}
                                                        className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-800"
                                                    />
                                                    <label htmlFor={`group-${groupName}`} className="text-xs font-vt323 cursor-pointer text-gray-500 dark:text-gray-400">
                                                        Select All
                                                    </label>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                {groupPerms.map((permission) => (
                                                    <div key={permission.id} className="flex items-center space-x-2">
                                                        <input
                                                            type="checkbox"
                                                            id={`permission-${permission.id}`}
                                                            checked={data.permissions.includes(permission.id)}
                                                            onChange={() => handlePermissionToggle(permission.id)}
                                                            className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-800"
                                                        />
                                                        <label
                                                            htmlFor={`permission-${permission.id}`}
                                                            className="text-gray-700 dark:text-gray-200 font-vt323 text-lg cursor-pointer"
                                                        >
                                                            {permission.name}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                             {errors.permissions && (
                                <p className="text-red-500 text-sm font-vt323">{errors.permissions}</p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            <Link href={route('role.index')}>
                                <Button type="button" variant="secondary" className="font-vt323 text-lg border-2 border-black dark:border-white">
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="font-vt323 text-lg bg-blue-600 hover:bg-blue-700 text-white border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
                            >
                                Create Role
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
