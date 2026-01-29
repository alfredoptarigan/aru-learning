import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import PixelEditor from "@/Components/PixelEditor";
import { FormEventHandler, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash, Wand2, ArrowRight, Video, ArrowLeft } from "lucide-react";

interface SubCourseVideo {
    title: string;
    video_url: string;
}

interface SubCourse {
    title: string;
    description: string;
    videos: SubCourseVideo[];
}

interface Step2Props {
    data: any;
    setData: (key: string, value: any) => void;
    onBack: () => void;
    onNext: () => void;
    isEdit?: boolean;
}

export default function Step2SubCourses({
    data,
    setData,
    onBack,
    onNext,
    isEdit = false,
}: Step2Props) {
    const subcourses: SubCourse[] = data.subcourses || [];

    const updateGlobalSubcourses = (newSubcourses: SubCourse[]) => {
        setData("subcourses", newSubcourses);
    };

    const addSubCourse = () => {
        updateGlobalSubcourses([
            ...subcourses,
            {
                title: "",
                description: "",
                videos: [{ title: "", video_url: "" }],
            },
        ]);
    };

    const addFiveSubCourses = () => {
        const newCourses = Array(5).fill({
            title: "",
            description: "",
            videos: [{ title: "", video_url: "" }],
        });
        updateGlobalSubcourses([...subcourses, ...newCourses]);
    };

    const removeSubCourse = (index: number) => {
        const newSubcourses = [...subcourses];
        newSubcourses.splice(index, 1);
        updateGlobalSubcourses(newSubcourses);
    };

    const updateSubCourse = (
        index: number,
        field: keyof SubCourse,
        value: any,
    ) => {
        const newSubcourses = [...subcourses];
        newSubcourses[index] = { ...newSubcourses[index], [field]: value };
        updateGlobalSubcourses(newSubcourses);
    };

    // Video Management
    const addVideo = (subCourseIndex: number) => {
        const newSubcourses = [...subcourses];
        newSubcourses[subCourseIndex].videos.push({
            title: "",
            video_url: "",
        });
        updateGlobalSubcourses(newSubcourses);
    };

    const removeVideo = (subCourseIndex: number, videoIndex: number) => {
        const newSubcourses = [...subcourses];
        newSubcourses[subCourseIndex].videos.splice(videoIndex, 1);
        updateGlobalSubcourses(newSubcourses);
    };

    const updateVideo = (
        subCourseIndex: number,
        videoIndex: number,
        field: keyof SubCourseVideo,
        value: string,
    ) => {
        const newSubcourses = [...subcourses];
        newSubcourses[subCourseIndex].videos[videoIndex] = {
            ...newSubcourses[subCourseIndex].videos[videoIndex],
            [field]: value,
        };
        updateGlobalSubcourses(newSubcourses);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Basic validation
        if (subcourses.length === 0) {
            // Auto set to draft if no modules
            setData("status", "draft");
            toast.info("Course status set to Draft as no modules were added.");
            onNext();
            return;
        }

        const invalid = subcourses.some((sc) => !sc.title || !sc.description);
        if (invalid) {
            toast.error(
                "Please fill in Title and Description for all modules.",
            );
            return;
        }

        // Proceed to next step (Review)
        onNext();
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h3 className="text-2xl font-bold font-vt323">
                        Course Modules
                    </h3>
                    <p className="text-gray-500 font-vt323 text-lg">
                        Add modules to your course. Each module can contain
                        multiple videos.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={addFiveSubCourses}
                        className="font-vt323 text-lg"
                    >
                        <Wand2 className="mr-2 h-4 w-4" />
                        Generate 5 Modules
                    </Button>
                    <Button
                        type="button"
                        onClick={addSubCourse}
                        className="font-vt323 text-lg"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Module
                    </Button>
                </div>
            </div>

            <div className="grid gap-6">
                {subcourses.map((subcourse, index) => (
                    <Card
                        key={index}
                        className="relative border-2 border-black shadow-pixel"
                    >
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute right-4 top-4 h-8 w-8"
                            onClick={() => removeSubCourse(index)}
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                        <CardHeader>
                            <CardTitle className="font-vt323 text-2xl">
                                Module {index + 1}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            {/* Module Info */}
                            <div className="grid gap-4 p-4 bg-gray-50 border border-gray-200">
                                <div className="grid gap-2">
                                    <Label className="font-vt323 text-lg">
                                        Module Title
                                    </Label>
                                    <Input
                                        value={subcourse.title}
                                        onChange={(e) =>
                                            updateSubCourse(
                                                index,
                                                "title",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="e.g. Chapter 1: Basics"
                                        className="font-vt323"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="font-vt323 text-lg">
                                        Description
                                    </Label>
                                    <PixelEditor
                                        value={subcourse.description}
                                        onChange={(val) =>
                                            updateSubCourse(
                                                index,
                                                "description",
                                                val,
                                            )
                                        }
                                        placeholder="What will be covered in this module?"
                                    />
                                </div>
                            </div>

                            {/* Videos Section */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label className="font-vt323 text-xl font-bold flex items-center gap-2">
                                        <Video className="h-5 w-5" />
                                        Videos in this Module
                                    </Label>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => addVideo(index)}
                                        className="font-vt323"
                                    >
                                        <Plus className="mr-2 h-3 w-3" />
                                        Add Video
                                    </Button>
                                </div>

                                <div className="space-y-3">
                                    {subcourse.videos.map((video, vIndex) => (
                                        <div
                                            key={vIndex}
                                            className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 border border-gray-200 bg-white relative group"
                                        >
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute -right-2 -top-2 h-6 w-6 bg-red-100 hover:bg-red-200 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() =>
                                                    removeVideo(index, vIndex)
                                                }
                                            >
                                                <Trash className="h-3 w-3" />
                                            </Button>

                                            <div className="space-y-1">
                                                <Label className="text-xs text-gray-500 font-vt323">
                                                    Video Title
                                                </Label>
                                                <Input
                                                    value={video.title}
                                                    onChange={(e) =>
                                                        updateVideo(
                                                            index,
                                                            vIndex,
                                                            "title",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Video Title"
                                                    className="h-8 font-vt323"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs text-gray-500 font-vt323">
                                                    Video URL
                                                </Label>
                                                <Input
                                                    value={video.video_url}
                                                    onChange={(e) =>
                                                        updateVideo(
                                                            index,
                                                            vIndex,
                                                            "video_url",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="https://..."
                                                    className="h-8 font-vt323"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    {subcourse.videos.length === 0 && (
                                        <div className="text-center py-4 text-gray-400 font-vt323 italic border border-dashed">
                                            No videos added yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {subcourses.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
                        <p className="font-vt323 text-xl text-gray-500">
                            No modules added yet. Start by adding one!
                        </p>
                    </div>
                )}
            </div>

            <div className="pt-4 flex justify-between">
                <Button
                    type="button"
                    variant="secondary"
                    className="text-xl"
                    onClick={onBack}
                >
                    <ArrowLeft className="mr-2 h-5 w-5" /> Back
                </Button>

                <Button type="submit" className="text-xl">
                    {isEdit ? "Save Modules" : <>Review Course <ArrowRight className="ml-2 h-5 w-5" /></>}
                </Button>
            </div>
        </form>
    );
}
