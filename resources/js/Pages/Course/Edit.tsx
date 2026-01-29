import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/Components/ui/button";
import Step1CourseDetails from "./Partials/Step1CourseDetails";
import { toast } from "sonner";
import { PageProps } from "@/types";

interface EditProps extends PageProps {
    course: any;
    availableMentors: any[];
    availableCodingTools: any;
}

export default function Edit({
    auth,
    course,
    availableMentors,
    availableCodingTools,
}: EditProps) {
    const { data, setData, post, processing, errors, setError, clearErrors } =
        useForm({
            title: course.title,
            description: course.description,
            price: String(course.price),
            status: course.is_published ? "published" : "draft",
            images: [] as File[],
            existingImages: course.course_images || [],
            deleted_images: [] as string[],
            mentors: course.course_mentors.map((cm: any) => cm.user.id),
            coding_tools: course.course_tools ? course.course_tools.map((ct: any) => ct.id) : [],
            _method: "POST", // Use POST for file upload support, handled as PUT by Laravel
        });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("course.update", course.id), {
            onSuccess: () => {
                toast.success("Course updated successfully!");
            },
            onError: () => {
                toast.error("Failed to update course.");
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 font-vt323">
                    Edit Course Details
                </h2>
            }
        >
            <Head title={`Edit ${course.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Button
                            variant="ghost"
                            onClick={() => window.history.back()}
                            className="font-vt323 text-lg"
                        >
                            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Courses
                        </Button>
                    </div>

                    <Step1CourseDetails
                        data={data}
                        setData={setData}
                        errors={errors}
                        onNext={() => {}}
                        setError={setError}
                        clearErrors={clearErrors}
                        availableMentors={availableMentors}
                        availableCodingTools={availableCodingTools}
                        currentUserId={auth.user.id}
                        isEdit={true}
                        onSubmit={submit}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
