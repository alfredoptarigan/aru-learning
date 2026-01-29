import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { DataTable } from "@/Components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import {
    Layers,
    Video,
    Edit,
    Trash2,
    MoreHorizontal,
    Image as ImageIcon,
    Loader2,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";

type CourseImage = {
    id: string;
    image_url: string;
};

type Mentor = {
    id: string;
    name: string;
    profile_url?: string;
};

type CourseMentor = {
    id: string;
    user: Mentor;
};

type SubCourseVideo = {
    id: string;
};

type SubCourse = {
    id: string;
    sub_course_videos: SubCourseVideo[];
};

type Course = {
    id: string;
    title: string;
    price: string;
    is_published: boolean;
    is_premium: boolean;
    created_at: string;
    course_images: CourseImage[];
    course_mentors: CourseMentor[];
    sub_courses: SubCourse[];
};

type PaginationProps = {
    data: Course[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
};

interface CoursePageProps {
    courses: PaginationProps;
}

export default function Course({ courses }: CoursePageProps) {
    const [togglingId, setTogglingId] = useState<string | null>(null);

    const formatRupiah = (value: string) => {
        const number = Number(value);
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    const toggleStatus = (course: Course) => {
        setTogglingId(course.id);
        const newStatus = !course.is_published;

        router.patch(
            route("course.update-status", course.id),
            { is_published: newStatus },
            {
                onSuccess: () => {
                    toast.success(
                        `Course ${newStatus ? "published" : "unpublished"} successfully!`,
                    );
                    setTogglingId(null);
                },
                onError: (err) => {
                    toast.error(err.error || "Failed to update status");
                    setTogglingId(null);
                },
                preserveScroll: true,
            },
        );
    };

    const columns: ColumnDef<Course>[] = [
        {
            accessorKey: "title",
            header: "Course Info",
            cell: ({ row }) => {
                const course = row.original;
                const coverImage = course.course_images[0]?.image_url;

                return (
                    <div className="flex items-start gap-3 min-w-[250px]">
                        <Dialog>
                            <DialogTrigger>
                                <div className="relative w-16 h-16 rounded border border-gray-200 overflow-hidden shrink-0 group cursor-pointer">
                                    {coverImage ? (
                                        <img
                                            src={coverImage}
                                            alt={course.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                            <ImageIcon className="w-6 h-6" />
                                        </div>
                                    )}
                                </div>
                            </DialogTrigger>
                            {coverImage && (
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle className="font-vt323 text-xl">
                                            {course.title}
                                        </DialogTitle>
                                    </DialogHeader>
                                    <img
                                        src={coverImage}
                                        alt={course.title}
                                        className="w-full rounded-lg"
                                    />
                                </DialogContent>
                            )}
                        </Dialog>
                        <div>
                            <div className="font-bold text-base line-clamp-2 leading-tight">
                                {course.title}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 font-mono">
                                Created:{" "}
                                {format(
                                    new Date(course.created_at),
                                    "MMM d, yyyy",
                                )}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            id: "mentors",
            header: "Instructors",
            cell: ({ row }) => {
                const mentors = row.original.course_mentors;
                return (
                    <div className="flex -space-x-2 overflow-hidden">
                        {mentors.length > 0 ? (
                            mentors.map((cm) => (
                                <img
                                    key={cm.id}
                                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                                    src={
                                        cm.user.profile_url ||
                                        `https://ui-avatars.com/api/?name=${cm.user.name}&background=random`
                                    }
                                    alt={cm.user.name}
                                    title={cm.user.name}
                                />
                            ))
                        ) : (
                            <span className="text-gray-400 text-xs italic">
                                No instructors
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            id: "stats",
            header: "Content",
            cell: ({ row }) => {
                const subCourses = row.original.sub_courses || [];
                const totalVideos = subCourses.reduce(
                    (acc, curr) => acc + (curr.sub_course_videos?.length || 0),
                    0,
                );

                return (
                    <div className="flex flex-col gap-1 text-xs font-vt323">
                        <Badge variant="outline" className="w-fit bg-gray-50">
                            <Layers className="w-3 h-3 mr-1" />
                            {subCourses.length} Modules
                        </Badge>
                        <Badge variant="outline" className="w-fit bg-gray-50">
                            <Video className="w-3 h-3 mr-1" />
                            {totalVideos} Videos
                        </Badge>
                    </div>
                );
            },
        },
        {
            id: "status_price",
            header: "Status & Price",
            cell: ({ row }) => {
                const course = row.original;
                const isToggling = togglingId === course.id;

                return (
                    <div className="space-y-2">
                        <div>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={isToggling}
                                onClick={() => toggleStatus(course)}
                                className={`font-vt323 tracking-wide h-6 text-xs border ${
                                    course.is_published
                                        ? "bg-green-100 text-green-800 border-green-800 hover:bg-green-200"
                                        : "bg-yellow-100 text-yellow-800 border-yellow-800 hover:bg-yellow-200"
                                }`}
                            >
                                {isToggling ? (
                                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                ) : null}
                                {course.is_published ? "PUBLISHED" : "DRAFT"}
                            </Button>
                        </div>
                        <div className="font-vt323 text-lg">
                            {course.is_premium ? (
                                <span className="text-emerald-700 font-bold">
                                    {formatRupiah(course.price)}
                                </span>
                            ) : (
                                <span className="text-blue-600 font-bold uppercase">
                                    Free
                                </span>
                            )}
                        </div>
                    </div>
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="font-vt323">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem className="cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" /> Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                                <Layers className="mr-2 h-4 w-4" /> Manage
                                Modules
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                Course
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 font-vt323">
                    Course Management
                </h2>
            }
        >
            <Head title="Course" />
            <div className="py-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-bold font-vt323">
                            All Courses
                        </h3>
                        <p className="text-gray-500 font-vt323 text-lg">
                            Manage your courses, modules, and instructors here.
                        </p>
                    </div>

                    <Link href={route("course.create")}>
                        <Button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 font-vt323 text-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">
                            Create New Course
                        </Button>
                    </Link>
                </div>

                <div className="bg-white rounded-md border border-gray-200">
                    <DataTable
                        columns={columns}
                        data={courses.data}
                        pagination={courses}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
