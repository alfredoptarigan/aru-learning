import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
    ArrowLeft,
    Save,
    Video,
    Layers,
    FileText,
    Image as ImageIcon,
    X,
    Users,
} from "lucide-react";
import { Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { useState } from "react";
import { Badge } from "@/Components/ui/badge";

interface Step3Props {
    data: any;
    onBack: () => void;
    onSubmit: () => void;
    processing: boolean;
    availableMentors: any[];
}

export default function Step3Review({
    data,
    onBack,
    onSubmit,
    processing,
    availableMentors,
}: Step3Props) {
    const [previewOpen, setPreviewOpen] = useState(false);

    // Filter selected mentors
    const selectedMentors =
        availableMentors?.filter((mentor) =>
            data.mentors?.includes(mentor.id),
        ) || [];

    const formatRupiah = (value: string) => {
        if (!value) return "0";
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

    const ImagePreview = () => {
        if (!data.images || data.images.length === 0) {
            return (
                <p className="text-gray-400 font-vt323 italic">
                    No images selected
                </p>
            );
        }

        const firstImage = data.images[0];
        const previewUrl = URL.createObjectURL(firstImage);
        // Only show "+N more" if total images > 3
        const showOverlay = data.images.length > 3;
        const remainingCount = data.images.length - 1;

        return (
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogTrigger asChild>
                    <div className="relative cursor-pointer group w-32 h-32 border-2 border-black rounded overflow-hidden shadow-sm hover:shadow-md transition-all">
                        <img
                            src={previewUrl}
                            alt="Course Preview"
                            className="w-full h-full object-cover"
                            onLoad={() => URL.revokeObjectURL(previewUrl)}
                        />
                        {showOverlay && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="text-white font-vt323 text-2xl font-bold">
                                    +{remainingCount} more
                                </span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="font-vt323 text-2xl">
                            Course Images Preview
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {data.images.map((file: File, index: number) => {
                            const url = URL.createObjectURL(file);
                            return (
                                <div
                                    key={index}
                                    className="relative aspect-video border border-gray-200 rounded overflow-hidden"
                                >
                                    <img
                                        src={url}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        onLoad={() => URL.revokeObjectURL(url)}
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 font-vt323 truncate">
                                        {file.name}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </DialogContent>
            </Dialog>
        );
    };

    return (
        <div className="space-y-8">
            <div className="space-y-2 text-center">
                <h3 className="text-3xl font-bold font-vt323">
                    Review & Publish
                </h3>
                <p className="text-gray-500 font-vt323 text-lg">
                    Please review all details before publishing your course.
                </p>
            </div>

            <div className="grid gap-6">
                {/* Course Details Review */}
                <Card className="border-2 border-black shadow-pixel">
                    <CardHeader className="bg-gray-50 border-b border-gray-200">
                        <CardTitle className="font-vt323 text-2xl flex items-center gap-2">
                            <FileText className="h-6 w-6" />
                            Course Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 grid gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm text-gray-500 font-vt323 uppercase">
                                    Title
                                </label>
                                <p className="text-xl font-bold font-vt323">
                                    {data.title}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500 font-vt323 uppercase">
                                    Price
                                </label>
                                <p className="text-xl font-bold font-vt323 flex items-center gap-1">
                                    Rp {formatRupiah(data.price)}
                                </p>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm text-gray-500 font-vt323 uppercase mb-1">
                                    Status
                                </label>
                                <div>
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-vt323 border ${
                                            data.status === "published"
                                                ? "bg-green-100 text-green-800 border-green-800"
                                                : "bg-yellow-100 text-yellow-800 border-yellow-800"
                                        }`}
                                    >
                                        {data.status === "published"
                                            ? "Published"
                                            : "Draft"}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500 font-vt323 uppercase mb-2 block">
                                    Images
                                </label>
                                <ImagePreview />
                            </div>

                            {/* Mentors Section */}
                            <div className="md:col-span-2">
                                <label className="text-sm text-gray-500 font-vt323 uppercase mb-2 block">
                                    Instructors
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {selectedMentors.length > 0 ? (
                                        selectedMentors.map((mentor) => (
                                            <Badge
                                                key={mentor.id}
                                                variant="secondary"
                                                className="pl-1 pr-3 py-1 font-vt323 text-lg border-black"
                                            >
                                                <img
                                                    src={
                                                        mentor.profile_url ||
                                                        `https://ui-avatars.com/api/?name=${mentor.name}&background=random`
                                                    }
                                                    alt={mentor.name}
                                                    className="w-6 h-6 rounded-full mr-2 object-cover border border-gray-200"
                                                />
                                                {mentor.name}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-gray-400 font-vt323 italic">
                                            No instructors selected
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500 font-vt323 uppercase">
                                Description
                            </label>
                            <div
                                className="prose prose-sm max-w-none font-vt323 mt-1 p-3 bg-gray-50 rounded border border-gray-200"
                                dangerouslySetInnerHTML={{
                                    __html: data.description,
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Modules Review */}
                <Card className="border-2 border-black shadow-pixel">
                    <CardHeader className="bg-gray-50 border-b border-gray-200">
                        <CardTitle className="font-vt323 text-2xl flex items-center gap-2">
                            <Layers className="h-6 w-6" />
                            Curriculum ({data.subcourses.length} Modules)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            {data.subcourses.map((module: any, i: number) => (
                                <div
                                    key={i}
                                    className="border border-gray-200 rounded-lg p-4"
                                >
                                    <h4 className="font-bold font-vt323 text-xl mb-2 flex justify-between">
                                        <span>
                                            Module {i + 1}: {module.title}
                                        </span>
                                        <span className="text-sm font-normal text-gray-500">
                                            {module.videos.length} Videos
                                        </span>
                                    </h4>
                                    <p
                                        className="text-gray-600 font-vt323 text-sm mb-4"
                                        dangerouslySetInnerHTML={{
                                            __html: module.description,
                                        }}
                                    ></p>

                                    {module.videos.length > 0 && (
                                        <div className="bg-gray-50 p-3 rounded border border-gray-100 space-y-2">
                                            {module.videos.map(
                                                (video: any, j: number) => (
                                                    <div
                                                        key={j}
                                                        className="flex items-center gap-2 text-sm font-vt323"
                                                    >
                                                        <Video className="h-4 w-4 text-blue-500" />
                                                        <span className="font-semibold">
                                                            {video.title ||
                                                                "Untitled Video"}
                                                        </span>
                                                        <span className="text-gray-400">
                                                            -
                                                        </span>
                                                        <span className="text-gray-500 truncate max-w-[200px]">
                                                            {video.video_url ||
                                                                "No URL"}
                                                        </span>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-between pt-4">
                <Button
                    type="button"
                    variant="secondary"
                    className="text-xl"
                    onClick={onBack}
                    disabled={processing}
                >
                    <ArrowLeft className="mr-2 h-5 w-5" /> Back
                </Button>

                <Button
                    onClick={onSubmit}
                    className="text-xl bg-green-600 hover:bg-green-700 text-white"
                    disabled={processing}
                >
                    {processing ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Publishing...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-5 w-5" />
                            Confirm & Publish
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
