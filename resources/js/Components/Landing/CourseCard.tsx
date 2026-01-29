import { Link } from "@inertiajs/react";
import { Star, BarChart } from "lucide-react";

interface CourseCardProps {
    course: any;
}

export default function CourseCard({ course }: CourseCardProps) {
    const formatRupiah = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);
    };

    // Get first image from course_images array if available
    const coverImage = course.course_images && course.course_images.length > 0 
        ? (course.course_images[0].image_url.startsWith('http') 
            ? course.course_images[0].image_url 
            : `/storage/${course.course_images[0].image_url}`)
        : null;

    return (
        <Link href={`/course/${course.id}`} className="group block h-full">
            <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200 h-full flex flex-col rounded-xl overflow-hidden">
                {/* Image */}
                <div className="relative aspect-video overflow-hidden border-b-2 border-black bg-gray-100">
                    <img 
                        src={coverImage || `https://ui-avatars.com/api/?name=${course.title}&background=random&size=400`} 
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {course.is_premium && (
                        <div className="absolute top-2 right-2 bg-yellow-400 border-2 border-black px-2 py-0.5 font-vt323 text-lg font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            PREMIUM
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                    <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-gray-500 text-xs font-mono ml-1">(4.8)</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500 text-xs font-vt323 uppercase">
                            <BarChart className="w-3 h-3" />
                            <span>Beginner</span>
                        </div>
                    </div>

                    <h3 className="font-vt323 text-2xl font-bold leading-tight mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {course.title}
                    </h3>
                    
                    <p className="text-gray-500 font-vt323 text-lg line-clamp-2 mb-4 flex-grow">
                        {course.description ? course.description.replace(/<[^>]*>?/gm, '') : "No description available."}
                    </p>

                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex -space-x-2">
                            {course.mentors?.map((mentor: any, i: number) => (
                                <img 
                                    key={i}
                                    className="w-8 h-8 rounded-full border-2 border-white ring-1 ring-gray-200" 
                                    src={mentor.profile_url || `https://ui-avatars.com/api/?name=${mentor.name}`} 
                                    alt={mentor.name} 
                                />
                            ))}
                        </div>
                        <div className="font-vt323 text-2xl font-bold text-blue-600">
                            {course.is_premium ? formatRupiah(course.price) : "FREE"}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
