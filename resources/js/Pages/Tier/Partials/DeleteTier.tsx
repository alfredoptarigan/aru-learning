import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

type Tier = {
    id: string;
    name: string;
};

interface DeleteTierProps {
    tier: Tier | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function DeleteTier({ tier, isOpen, onClose }: DeleteTierProps) {
    const { delete: destroy, processing } = useForm();

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!tier) return;

        destroy(route("tier.destroy", { id: tier.id }), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Delete Tier</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the tier "{tier?.name}"? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={submit} className="mt-4 flex justify-end gap-4">
                     <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="font-vt323 text-xl border-2 border-black"
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="destructive" 
                        disabled={processing} 
                        className="font-vt323 text-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    >
                        Delete Tier
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
