import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/Components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Group {
    id: string;
    name: string;
}

interface CreatePermissionProps {
    isOpen: boolean;
    onClose: () => void;
    groups: Group[];
}

export default function CreatePermission({
    isOpen,
    onClose,
    groups,
}: CreatePermissionProps) {
    const { data, setData, post, processing, errors, reset, wasSuccessful } =
        useForm({
            name: "",
            permission_group_id: "",
        });

    const [openCombobox, setOpenCombobox] = useState(false);

    useEffect(() => {
        if (wasSuccessful) {
            onClose();
            reset();
        }
    }, [wasSuccessful]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("permission.store"));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] overflow-visible">
                <DialogHeader>
                    <DialogTitle>Create Permission</DialogTitle>
                    <DialogDescription>
                        Add a new permission to the system.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2 flex flex-col">
                        <Label htmlFor="permission_group_id">Group</Label>
                        <Popover
                            open={openCombobox}
                            onOpenChange={setOpenCombobox}
                            modal={true}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openCombobox}
                                    className="w-full justify-between font-vt323 text-lg"
                                >
                                    {data.permission_group_id
                                        ? groups.find(
                                              (group) =>
                                                  group.id ===
                                                  data.permission_group_id,
                                          )?.name
                                        : "Select a group..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[380px] p-0 z-[100]">
                                <Command>
                                    <CommandInput placeholder="Search group..." />
                                    <CommandList>
                                        <CommandEmpty>
                                            No group found.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {groups.map((group) => (
                                                <CommandItem
                                                    key={group.id}
                                                    value={group.name} // Search by name
                                                    onSelect={() => {
                                                        setData(
                                                            "permission_group_id",
                                                            group.id ===
                                                                data.permission_group_id
                                                                ? ""
                                                                : group.id,
                                                        );
                                                        setOpenCombobox(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            data.permission_group_id ===
                                                                group.id
                                                                ? "opacity-100"
                                                                : "opacity-0",
                                                        )}
                                                    />
                                                    {group.name}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        {errors.permission_group_id && (
                            <p className="text-red-500 text-sm font-vt323">
                                {errors.permission_group_id}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name">Permission Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            placeholder="e.g. course.create"
                            className="font-vt323 text-lg"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm font-vt323">
                                {errors.name}
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
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
    );
}
