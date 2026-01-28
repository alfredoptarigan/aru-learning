import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect } from "react";

type Tier = {
    id: string;
    name: string;
};

interface EditTierProps {
    tier: Tier | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function EditTier({ tier, isOpen, onClose }: EditTierProps) {
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm({
        name: "",
    });

    useEffect(() => {
        if (tier) {
            setData("name", tier.name);
            clearErrors();
        }
    }, [tier, isOpen]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!tier) return;

        put(route("tier.update", { id: tier.id }), {
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Tier</DialogTitle>
                    <DialogDescription>
                        Make changes to the tier here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-6 mt-4">
                    <div>
                        <InputLabel htmlFor="name" value="Tier Name" className="font-vt323 text-xl" />
                        <TextInput
                            id="name"
                            className="mt-1 block w-full font-vt323 text-lg"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                            isFocused
                        />
                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="font-vt323 text-xl border-2 border-black"
                        >
                            Cancel
                        </Button>
                        <PrimaryButton disabled={processing} className="font-vt323 text-xl">
                            Save Changes
                        </PrimaryButton>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
