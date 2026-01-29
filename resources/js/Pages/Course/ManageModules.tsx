import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/Components/ui/button";
import Step2SubCourses from "./Partials/Step2SubCourses";
import { toast } from "sonner";
import { PageProps } from "@/types";

interface ManageModulesProps extends PageProps {
    course: any;
}

export default function ManageModules({ auth, course }: ManageModulesProps) {
    const { data, setData, put, processing, errors } = useForm({
        subcourses: (course.sub_courses || []).map((sc: any) => ({
            ...sc,
            videos: sc.sub_course_videos || sc.videos || []
        })),
    });

    const submit = () => {
        put(route("course.modules.update", course.id), {
            onSuccess: () => {
                toast.success("Modules updated successfully!");
            },
            onError: () => {
                toast.error("Failed to update modules.");
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 font-vt323">
                    Manage Modules
                </h2>
            }
        >
            <Head title={`Manage Modules - ${course.title}`} />

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

                    <Step2SubCourses
                        data={data}
                        setData={setData}
                        onBack={() => window.history.back()}
                        onNext={submit}
                        isEdit={true}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
