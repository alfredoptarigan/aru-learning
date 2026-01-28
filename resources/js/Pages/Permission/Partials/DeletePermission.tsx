import { Button } from "@/Components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { useForm } from "@inertiajs/react";
import { useEffect } from "react";

interface DeletePermissionProps {
    permission: { id: string; name: string } | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function DeletePermission({ permission, isOpen, onClose }: DeletePermissionProps) {
    const { delete: destroy, processing, wasSuccessful } = useForm();

    useEffect(() => {
        if (wasSuccessful) {
            onClose();
        }
    }, [wasSuccessful]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (permission) {
            destroy(route("permission.destroy", permission.id));
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Delete Permission</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the permission "{permission?.name}"? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
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
                            variant="destructive"
                            disabled={processing}
                            className="font-vt323 text-lg"
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
