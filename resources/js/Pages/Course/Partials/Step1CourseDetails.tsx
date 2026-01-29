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
import { ArrowRight, Loader2 } from "lucide-react";
import axios from "axios";

import { MultiSelect, Option } from "@/Components/ui/multi-select";

interface Step1Props {
    data: any;
    setData: (key: string, value: any) => void;
    errors: any;
    onNext: () => void;
    setError: (field: string, message: string) => void;
    clearErrors: () => void;
    availableMentors: any[];
    currentUserId: string;
}

export default function Step1CourseDetails({ 
    data, 
    setData, 
    errors, 
    onNext, 
    setError, 
    clearErrors,
    availableMentors,
    currentUserId
}: Step1Props) {
    const [validating, setValidating] = useState(false);

    // Prepare options for MultiSelect
    const mentorOptions: Option[] = availableMentors.map(mentor => ({
        label: mentor.name,
        value: mentor.id,
        image: mentor.profile_url || `https://ui-avatars.com/api/?name=${mentor.name}&background=random`
    }));

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        setValidating(true);
        clearErrors();

        try {
            // Partial validation via backend
            await axios.post(route("course.validate-step-1"), {
                title: data.title,
                description: data.description,
                price: data.price,
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
                                    You are automatically added as the main instructor.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label className="font-vt323 text-xl">
                                    Course Images
                                </Label>
                                <PixelDropzone
                                    onFilesChange={(files) =>
                                        setData("images", files)
                                    }
                                    maxFiles={5}
                                />
                                {errors.images && (
                                    <p className="text-red-500 text-sm font-vt323">
                                        {errors.images}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Settings */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-vt323 text-2xl">
                                Publishing
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

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    className="w-full text-xl"
                                    disabled={validating}
                                >
                                    {validating ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Validating...
                                        </>
                                    ) : (
                                        <>
                                            Next Step <ArrowRight className="ml-2 h-5 w-5" />
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
