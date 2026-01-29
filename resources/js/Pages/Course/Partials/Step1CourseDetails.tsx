import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/Components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import PixelEditor from "@/Components/PixelEditor";
import PixelDropzone from "@/Components/PixelDropzone";
import { FormEventHandler, useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Loader2, Plus, Trash2 } from "lucide-react";
import axios from "axios";

import { MultiSelect, Option } from "@/Components/ui/multi-select";

interface Promo {
    code: string;
    type: "fixed" | "percentage";
    value: string;
}

interface Step1Props {
    data: any;
    setData: (key: string, value: any) => void;
    errors: any;
    onNext: () => void;
    setError: (field: string, message: string) => void;
    clearErrors: () => void;
    availableMentors: any[];
    availableCodingTools: any; // Using any for pagination wrapper or array
    currentUserId: string;
    isEdit?: boolean;
    onSubmit?: (e: React.FormEvent) => void;
}

export default function Step1CourseDetails({
    data,
    setData,
    errors,
    onNext,
    setError,
    clearErrors,
    availableMentors,
    availableCodingTools,
    currentUserId,
    isEdit = false,
    onSubmit,
}: Step1Props) {
    const [validating, setValidating] = useState(false);
    const [newPromo, setNewPromo] = useState<Promo>({
        code: "",
        type: "percentage",
        value: "",
    });

    // Prepare options for MultiSelect
    const mentorOptions: Option[] = availableMentors.map((mentor) => ({
        label: mentor.name,
        value: mentor.id,
        image:
            mentor.profile_url ||
            `https://ui-avatars.com/api/?name=${mentor.name}&background=random`,
    }));

    // Handle pagination wrapper or direct array for coding tools
    const codingToolsArray =
        availableCodingTools?.data || availableCodingTools || [];

    const codingToolOptions: Option[] = codingToolsArray.map((tool: any) => ({
        label: tool.name,
        value: tool.id,
        image: tool.image,
    }));

    const submit: FormEventHandler = async (e) => {
        if (onSubmit) {
            onSubmit(e);
            return;
        }

        e.preventDefault();
        setValidating(true);
        clearErrors();

        try {
            // Partial validation via backend
            await axios.post(route("course.validate-step-1"), {
                title: data.title,
                description: data.description,
                price: data.price,
                discount_price: data.discount_price,
                status: data.status,
            });

            // If success
            onNext();
        } catch (error: any) {
            if (error.response && error.response.data.errors) {
                const serverErrors = error.response.data.errors;
                Object.keys(serverErrors).forEach((key) => {
                    setError(key, serverErrors[key][0]);
                    toast.error(serverErrors[key][0]);
                });
            } else {
                toast.error("Validation failed. Please check your inputs.");
            }
        } finally {
            setValidating(false);
        }
    };

    const formatRupiah = (value: string) => {
        if (!value) return "";
        const numberString = value.replace(/[^,\d]/g, "").toString();
        const split = numberString.split(",");
        const sisa = split[0].length % 3;
        let rupiah = split[0].substr(0, sisa);
        const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

        if (ribuan) {
            const separator = sisa ? "." : "";
            rupiah += separator + ribuan.join(".");
        }

        rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
        return rupiah;
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\./g, "");
        if (!isNaN(Number(rawValue))) {
            setData("price", rawValue);
        }
    };

    const handleDiscountPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\./g, "");
        if (!isNaN(Number(rawValue))) {
            setData("discount_price", rawValue);
        }
    };

    const addPromo = () => {
        if (!newPromo.code || !newPromo.value) {
            toast.error("Please fill in promo code and value");
            return;
        }
        
        const promos = [...(data.promos || [])];
        promos.push({ ...newPromo });
        setData("promos", promos);
        setNewPromo({ code: "", type: "percentage", value: "" });
    };

    const removePromo = (index: number) => {
        const promos = [...(data.promos || [])];
        promos.splice(index, 1);
        setData("promos", promos);
    };

    return (
        <form onSubmit={submit}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left Column: Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-vt323 text-2xl">
                                Course Details
                            </CardTitle>
                            <CardDescription className="font-vt323 text-lg">
                                Basic information about your course.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="title"
                                    className="font-vt323 text-xl"
                                >
                                    Course Title
                                </Label>
                                <Input
                                    id="title"
                                    placeholder="e.g. Master Pixel Art in 30 Days"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                    className="text-lg"
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-sm font-vt323">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="description"
                                    className="font-vt323 text-xl"
                                >
                                    Description
                                </Label>
                                <PixelEditor
                                    value={data.description}
                                    onChange={(val) =>
                                        setData("description", val)
                                    }
                                    placeholder="Describe what students will learn..."
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-sm font-vt323">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="font-vt323 text-xl">
                                    Instructors & Collaborators
                                </Label>
                                <MultiSelect
                                    options={mentorOptions}
                                    selected={data.mentors}
                                    onChange={(selected) => {
                                        // Ensure current user is always selected
                                        if (!selected.includes(currentUserId)) {
                                            selected.push(currentUserId);
                                        }
                                        setData("mentors", selected);
                                    }}
                                    placeholder="Select mentors..."
                                />
                                <p className="text-sm text-gray-500 font-vt323">
                                    You are automatically added as the main
                                    instructor.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label className="font-vt323 text-xl">
                                    Coding Tools
                                </Label>
                                <MultiSelect
                                    options={codingToolOptions}
                                    selected={data.coding_tools || []}
                                    onChange={(selected) =>
                                        setData("coding_tools", selected)
                                    }
                                    placeholder="Select coding tools..."
                                />
                                <p className="text-sm text-gray-500 font-vt323">
                                    Select the tools used in this course.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label className="font-vt323 text-xl">
                                    Course Images
                                </Label>
                                {data.existingImages &&
                                    data.existingImages.length > 0 && (
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            {data.existingImages.map(
                                                (img: any) => (
                                                    <div
                                                        key={img.id}
                                                        className="relative group"
                                                    >
                                                        <img
                                                            src={img.image_url}
                                                            alt="Course Image"
                                                            className="w-full h-32 object-cover rounded-md border border-gray-200"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newExisting =
                                                                    data.existingImages.filter(
                                                                        (
                                                                            i: any,
                                                                        ) =>
                                                                            i.id !==
                                                                            img.id,
                                                                    );
                                                                const newDeleted =
                                                                    [
                                                                        ...(data.deleted_images ||
                                                                            []),
                                                                        img.id,
                                                                    ];
                                                                setData(
                                                                    "existingImages",
                                                                    newExisting,
                                                                );
                                                                setData(
                                                                    "deleted_images",
                                                                    newDeleted,
                                                                );
                                                            }}
                                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    )}
                                <PixelDropzone
                                    onFilesChange={(files) =>
                                        setData("images", files)
                                    }
                                    maxFiles={
                                        5 - (data.existingImages?.length || 0)
                                    }
                                />
                                {errors.images && (
                                    <p className="text-red-500 text-sm font-vt323">
                                        {errors.images}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    
                    {/* Promo Codes Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-vt323 text-2xl">Promo Codes</CardTitle>
                            <CardDescription className="font-vt323 text-lg">
                                Manage promo codes for this course.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                <div className="space-y-2 md:col-span-1">
                                    <Label className="font-vt323">Code</Label>
                                    <Input 
                                        value={newPromo.code}
                                        onChange={(e) => setNewPromo({...newPromo, code: e.target.value.toUpperCase()})}
                                        placeholder="SALE50"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-1">
                                    <Label className="font-vt323">Type</Label>
                                    <Select 
                                        value={newPromo.type} 
                                        onValueChange={(val: "fixed" | "percentage") => setNewPromo({...newPromo, type: val})}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="percentage">Percentage (%)</SelectItem>
                                            <SelectItem value="fixed">Fixed Amount (Rp)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 md:col-span-1">
                                    <Label className="font-vt323">Value</Label>
                                    <Input 
                                        type="number"
                                        value={newPromo.value}
                                        onChange={(e) => setNewPromo({...newPromo, value: e.target.value})}
                                        placeholder={newPromo.type === 'percentage' ? '10' : '50000'}
                                    />
                                </div>
                                <Button type="button" onClick={addPromo} variant="secondary" className="border-2 border-black dark:border-white">
                                    <Plus className="mr-2 h-4 w-4" /> Add
                                </Button>
                            </div>

                            {data.promos && data.promos.length > 0 && (
                                <div className="mt-4 border rounded-md divide-y">
                                    {data.promos.map((promo: Promo, index: number) => (
                                        <div key={index} className="p-3 flex justify-between items-center">
                                            <div>
                                                <span className="font-bold font-vt323 text-lg">{promo.code}</span>
                                                <span className="text-gray-500 ml-2">
                                                    ({promo.type === 'percentage' ? `${promo.value}%` : `Rp ${parseInt(promo.value).toLocaleString()}`})
                                                </span>
                                            </div>
                                            <Button 
                                                type="button" 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => removePromo(index)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Settings */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-vt323 text-2xl">
                                Publishing & Pricing
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="status"
                                    className="font-vt323 text-xl"
                                >
                                    Status
                                </Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(val) =>
                                        setData("status", val)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">
                                            Draft
                                        </SelectItem>
                                        <SelectItem value="published">
                                            Published
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && (
                                    <p className="text-red-500 text-sm font-vt323">
                                        {errors.status}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="price"
                                    className="font-vt323 text-xl"
                                >
                                    Price (IDR)
                                </Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 font-vt323 text-lg text-gray-500">
                                        Rp
                                    </span>
                                    <Input
                                        id="price"
                                        type="text"
                                        placeholder="0"
                                        value={formatRupiah(data.price)}
                                        onChange={handlePriceChange}
                                        className="pl-10 text-lg"
                                    />
                                </div>
                                {errors.price && (
                                    <p className="text-red-500 text-sm font-vt323">
                                        {errors.price}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="discount_price"
                                    className="font-vt323 text-xl"
                                >
                                    Discount Price (Optional)
                                </Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 font-vt323 text-lg text-gray-500">
                                        Rp
                                    </span>
                                    <Input
                                        id="discount_price"
                                        type="text"
                                        placeholder="0"
                                        value={formatRupiah(data.discount_price)}
                                        onChange={handleDiscountPriceChange}
                                        className="pl-10 text-lg"
                                    />
                                </div>
                                <p className="text-xs text-gray-500">Leave empty or 0 if no discount.</p>
                                {errors.discount_price && (
                                    <p className="text-red-500 text-sm font-vt323">
                                        {errors.discount_price}
                                    </p>
                                )}
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    className="w-full text-xl"
                                    disabled={validating}
                                >
                                    {validating ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            {isEdit
                                                ? "Saving..."
                                                : "Validating..."}
                                        </>
                                    ) : (
                                        <>
                                            {isEdit
                                                ? "Save Changes"
                                                : "Next Step"}
                                            {!isEdit && (
                                                <ArrowRight className="ml-2 h-5 w-5" />
                                            )}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
