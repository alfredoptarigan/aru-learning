import { Button } from "@/Components/ui/button";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Course() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Course
                </h2>
            }
        >
            <Head title="Course" />
            <div className="py-6">
                {/* Button create course */}
                <Button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                    Create Course
                </Button>
            </div>
        </AuthenticatedLayout>
    );
}
