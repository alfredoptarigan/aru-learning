import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
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
import { Switch } from "@/Components/ui/switch";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { FormEventHandler } from "react";
import { toast } from "sonner";

interface Course {
    id: string;
    title: string;
}

interface CreateProps {
    courses: Course[];
}

export default function Create({ courses }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        code: "",
        type: "percentage",
        value: "",
        max_uses: "",
        start_date: "",
        end_date: "",
        is_active: true,
        course_id: "global", // "global" means null in backend
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("promo.store"), {
            onSuccess: () => toast.success("Promo created successfully"),
            onError: () => toast.error("Failed to create promo"),
            transform: (data) => ({
                ...data,
                course_id: data.course_id === "global" ? null : data.course_id,
            }),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 font-vt323">
                    Create Promo
                </h2>
            }
        >
            <Head title="Create Promo" />
            <div className="py-6 max-w-3xl mx-auto">
                <form onSubmit={submit} className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                        <Link href={route("promo.index")}>
                            <Button variant="ghost" className="font-vt323 text-lg">
                                <ArrowLeft className="mr-2 h-5 w-5" />
                                Back to List
                            </Button>
                        </Link>
                    </div>

                    <Card className="border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                        <CardHeader>
                            <CardTitle className="font-vt323 text-2xl">
                                Promo Details
                            </CardTitle>
                            <CardDescription className="font-vt323 text-lg">
                                Create a new promo code.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="code" className="font-vt323 text-xl">
                                        Promo Code
                                    </Label>
                                    <Input
                                        id="code"
                                        value={data.code}
                                        onChange={(e) =>
                                            setData("code", e.target.value.toUpperCase())
                                        }
                                        placeholder="e.g. SUMMER2024"
                                        className="font-vt323 text-lg uppercase"
                                    />
                                    {errors.code && (
                                        <p className="text-red-500 text-sm">{errors.code}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="course_id" className="font-vt323 text-xl">
                                        Scope
                                    </Label>
                                    <Select
                                        value={data.course_id}
                                        onValueChange={(val) => setData("course_id", val)}
                                    >
                                        <SelectTrigger className="font-vt323 text-lg">
                                            <SelectValue placeholder="Select Scope" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="global">
                                                Global (All Courses)
                                            </SelectItem>
                                            {courses.map((course) => (
                                                <SelectItem key={course.id} value={course.id}>
                                                    {course.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.course_id && (
                                        <p className="text-red-500 text-sm">
                                            {errors.course_id}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="type" className="font-vt323 text-xl">
                                        Discount Type
                                    </Label>
                                    <Select
                                        value={data.type}
                                        onValueChange={(val) => setData("type", val)}
                                    >
                                        <SelectTrigger className="font-vt323 text-lg">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="percentage">Percentage (%)</SelectItem>
                                            <SelectItem value="fixed">Fixed Amount (Rp)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.type && (
                                        <p className="text-red-500 text-sm">{errors.type}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="value" className="font-vt323 text-xl">
                                        Value
                                    </Label>
                                    <Input
                                        id="value"
                                        type="number"
                                        value={data.value}
                                        onChange={(e) => setData("value", e.target.value)}
                                        placeholder={
                                            data.type === "percentage" ? "10" : "50000"
                                        }
                                        className="font-vt323 text-lg"
                                    />
                                    {errors.value && (
                                        <p className="text-red-500 text-sm">{errors.value}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="max_uses" className="font-vt323 text-xl">
                                        Max Uses (Optional)
                                    </Label>
                                    <Input
                                        id="max_uses"
                                        type="number"
                                        value={data.max_uses}
                                        onChange={(e) => setData("max_uses", e.target.value)}
                                        placeholder="e.g. 100"
                                        className="font-vt323 text-lg"
                                    />
                                    {errors.max_uses && (
                                        <p className="text-red-500 text-sm">
                                            {errors.max_uses}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="start_date" className="font-vt323 text-xl">
                                        Start Date (Optional)
                                    </Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData("start_date", e.target.value)}
                                        className="font-vt323 text-lg"
                                    />
                                    {errors.start_date && (
                                        <p className="text-red-500 text-sm">
                                            {errors.start_date}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="end_date" className="font-vt323 text-xl">
                                        End Date (Optional)
                                    </Label>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) => setData("end_date", e.target.value)}
                                        className="font-vt323 text-lg"
                                    />
                                    {errors.end_date && (
                                        <p className="text-red-500 text-sm">
                                            {errors.end_date}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 pt-4">
                                <Switch
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) =>
                                        setData("is_active", checked)
                                    }
                                />
                                <Label
                                    htmlFor="is_active"
                                    className="font-vt323 text-xl cursor-pointer"
                                >
                                    Active Status
                                </Label>
                            </div>

                            <div className="pt-6">
                                <Button
                                    type="submit"
                                    className="w-full font-vt323 text-xl border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-5 w-5" />
                                            Create Promo
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
