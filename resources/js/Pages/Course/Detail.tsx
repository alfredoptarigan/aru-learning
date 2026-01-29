import { Head, Link } from "@inertiajs/react";
import Navbar from "@/Components/Landing/Navbar";
import Footer from "@/Components/Landing/Footer";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
    Star,
    PlayCircle,
    Clock,
    BarChart,
    CheckCircle,
    Shield,
    Share2,
    Award,
    ChevronDown,
    ChevronUp,
    Lock,
    Unlock,
    Users,
    ChevronLeft,
    ChevronRight,
    X,
} from "lucide-react";
import { useState } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogClose
} from "@/Components/ui/dialog";

interface DetailProps {
    course: any;
    auth: any;
}

export default function Detail({ course, auth }: DetailProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    const formatRupiah = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);
    };

    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const nextImage = () => {
        if (selectedImageIndex !== null && course.course_images) {
            setSelectedImageIndex((prev) => 
                prev === course.course_images.length - 1 ? 0 : (prev as number) + 1
            );
        }
    };

    const prevImage = () => {
        if (selectedImageIndex !== null && course.course_images) {
            setSelectedImageIndex((prev) => 
                prev === 0 ? course.course_images.length - 1 : (prev as number) - 1
            );
        }
    };

    const totalVideos =
        course.sub_courses?.reduce(
            (acc: number, curr: any) =>
                acc + (curr.sub_course_videos?.length || 0),
            0,
        ) || 0;

    const coverImage =
        course.course_images && course.course_images.length > 0
            ? course.course_images[0].image_url.startsWith("http")
                ? course.course_images[0].image_url
                : `/storage/${course.course_images[0].image_url}`
            : null;

    const getImageUrl = (img: any) => {
        return img.image_url.startsWith("http") 
            ? img.image_url 
            : `/storage/${img.image_url}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans antialiased">
            <Head title={course.title} />
            <Navbar />

            {/* Image Slider Dialog */}
            <Dialog open={selectedImageIndex !== null} onOpenChange={(open) => !open && setSelectedImageIndex(null)}>
                <DialogContent className="max-w-5xl bg-transparent border-none shadow-none p-0 flex items-center justify-center">
                    <DialogTitle className="sr-only">Image Gallery</DialogTitle>
                    <div className="relative w-full aspect-video flex items-center justify-center">
                        <button 
                            onClick={prevImage}
                            className="absolute left-4 z-50 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full border-2 border-white transition-all"
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </button>
                        
                        <div className="relative w-full h-full bg-black border-4 border-white shadow-[0px_0px_20px_rgba(0,0,0,0.5)] rounded-xl overflow-hidden">
                            {selectedImageIndex !== null && course.course_images && (
                                <img 
                                    src={getImageUrl(course.course_images[selectedImageIndex])}
                                    className="w-full h-full object-contain"
                                    alt={`Slide ${selectedImageIndex + 1}`}
                                />
                            )}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-1 rounded-full border border-white/30 text-white font-mono text-sm">
                                {selectedImageIndex !== null ? selectedImageIndex + 1 : 0} / {course.course_images?.length || 0}
                            </div>
                        </div>

                        <button 
                            onClick={nextImage}
                            className="absolute right-4 z-50 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full border-2 border-white transition-all"
                        >
                            <ChevronRight className="w-8 h-8" />
                        </button>

                        <button 
                            onClick={() => setSelectedImageIndex(null)}
                            className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300 transition-colors"
                        >
                            <X className="w-8 h-8" />
                            <span className="sr-only">Close</span>
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Video Player Dialog */}
            <Dialog open={selectedVideo !== null} onOpenChange={(open) => !open && setSelectedVideo(null)}>
                <DialogContent className="max-w-5xl bg-black p-1 border-4 border-gray-800 rounded-xl overflow-hidden">
                    <DialogTitle className="sr-only">Video Player</DialogTitle>
                    <div className="relative w-full aspect-video bg-black">
                        {selectedVideo && (
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${getYoutubeId(selectedVideo)}?autoplay=1`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        )}
                        <button 
                            onClick={() => setSelectedVideo(null)}
                            className="absolute -top-10 -right-2 p-2 text-white hover:text-gray-300 transition-colors"
                        >
                            <X className="w-6 h-6" />
                            <span className="sr-only">Close</span>
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Header / Hero Course */}
            <div className="pt-20 bg-gray-900 text-white border-b-4 border-black pb-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                {coverImage && (
                    <div
                        className="absolute inset-0 opacity-10 blur-xl bg-cover bg-center"
                        style={{ backgroundImage: `url(${coverImage})` }}
                    ></div>
                )}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Left: Info */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex flex-wrap gap-2">
                                <Badge
                                    variant="secondary"
                                    className="bg-yellow-400 text-black font-vt323 text-lg border-2 border-white"
                                >
                                    Development
                                </Badge>
                                <div className="flex items-center text-yellow-400 font-mono text-sm">
                                    <Star className="w-4 h-4 fill-current mr-1" />
                                    <span className="font-bold">4.8</span>
                                    <span className="text-gray-400 ml-1">
                                        (250 ratings)
                                    </span>
                                </div>
                            </div>

                            <h1 className="font-vt323 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                                {course.title}
                            </h1>

                            <p className="text-xl text-gray-300 font-vt323 leading-relaxed max-w-2xl">
                                {course.description
                                    ? course.description
                                          .replace(/<[^>]*>?/gm, "")
                                          .substring(0, 150) + "..."
                                    : "Learn the skills you need to succeed."}
                            </p>

                            <div className="flex flex-wrap gap-6 text-sm md:text-base font-vt323 text-gray-300 pt-4">
                                <div className="flex items-center gap-2">
                                    <img
                                        src={`https://ui-avatars.com/api/?name=Alfredo&background=random`}
                                        className="w-8 h-8 rounded-full border border-white"
                                        alt="Mentor"
                                    />
                                    <span>
                                        Created by{" "}
                                        <span className="text-blue-400 underline">
                                            Alfredo Patricius
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>
                                        Last updated{" "}
                                        {new Date(
                                            course.updated_at,
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BarChart className="w-4 h-4" />
                                    <span>Beginner Level</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content (Left) */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Video Preview Section */}
                        <div 
                            className="bg-black rounded-xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black aspect-video relative group cursor-pointer"
                            onClick={() => setSelectedImageIndex(0)}
                        >
                            {coverImage ? (
                                <img
                                    src={coverImage}
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                    alt="Course Preview"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                    <span className="font-vt323 text-gray-500 text-2xl">
                                        No Preview Image
                                    </span>
                                </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="bg-black/50 p-4 rounded-full border-2 border-white backdrop-blur-sm group-hover:scale-110 transition-transform">
                                    <span className="font-vt323 text-white text-xl">View Gallery</span>
                                </div>
                            </div>
                            {course.course_images && course.course_images.length > 1 && (
                                <div className="absolute bottom-4 right-4 bg-black/70 px-3 py-1 rounded border border-white/30 text-white font-mono text-sm">
                                    1 / {course.course_images.length}
                                </div>
                            )}
                        </div>

                        {/* About Course */}
                        <section className="bg-white border-2 border-black p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <h2 className="font-vt323 text-3xl font-bold mb-6 flex items-center gap-2">
                                <div className="w-2 h-8 bg-blue-600"></div>
                                About This Course
                            </h2>
                            <div
                                className="prose prose-lg max-w-none font-sans text-gray-600 leading-relaxed"
                                dangerouslySetInnerHTML={{
                                    __html: course.description,
                                }}
                            />
                        </section>

                        {/* Curriculum */}
                        <section>
                            <h2 className="font-vt323 text-3xl font-bold mb-6 flex items-center gap-2">
                                <div className="w-2 h-8 bg-yellow-400"></div>
                                Course Curriculum
                            </h2>
                            <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
                                <div className="flex justify-between items-center mb-6 border-b-2 border-gray-100 pb-4">
                                    <span className="font-bold font-vt323 text-xl">
                                        {course.sub_courses?.length || 0}{" "}
                                        Modules • {totalVideos} Videos
                                    </span>
                                    <span className="text-gray-500 font-vt323 text-lg">
                                        Total Duration: 12h 30m
                                    </span>
                                </div>

                                <Accordion
                                    type="single"
                                    collapsible
                                    className="w-full space-y-4"
                                >
                                    {course.sub_courses?.map(
                                        (sub: any, index: number) => (
                                            <AccordionItem
                                                key={sub.id}
                                                value={sub.id}
                                                className="border-2 border-gray-200 rounded-lg px-4"
                                            >
                                                <AccordionTrigger className="hover:no-underline py-4">
                                                    <div className="text-left">
                                                        <div className="font-vt323 text-xl font-bold text-gray-800">
                                                            Module {index + 1}:{" "}
                                                            {sub.title}
                                                        </div>
                                                        <div className="text-sm text-gray-500 font-mono mt-1">
                                                            {sub
                                                                .sub_course_videos
                                                                ?.length ||
                                                                0}{" "}
                                                            Lessons
                                                        </div>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="pt-2 pb-4 space-y-3">
                                                    {sub.sub_course_videos?.map((video: any, vIndex: number) => {
                                                    // Logic: 
                                                    // 1. If course is NOT premium -> Unlocked
                                                    // 2. If course IS premium -> 
                                                    //    - First video of first module is Unlocked (Preview)
                                                    //    - Rest are Locked
                                                    const isFirstVideo = index === 0 && vIndex === 0;
                                                    const isLocked = course.is_premium && !isFirstVideo;

                                                    return (
                                                        <div 
                                                            key={video.id} 
                                                            onClick={() => !isLocked && setSelectedVideo(video.video_url)}
                                                            className={`flex items-center justify-between p-3 rounded border border-gray-100 transition-colors group 
                                                                ${isLocked 
                                                                    ? "bg-gray-100 cursor-not-allowed opacity-75" 
                                                                    : "bg-gray-50 hover:bg-blue-50 cursor-pointer"
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono
                                                                    ${isLocked 
                                                                        ? "bg-gray-200 text-gray-500" 
                                                                        : "bg-blue-100 text-blue-600"
                                                                    }`}>
                                                                    {isLocked ? <Lock className="w-3 h-3" /> : (vIndex + 1)}
                                                                </div>
                                                                <span className={`font-medium ${isLocked ? "text-gray-500" : "text-gray-700 group-hover:text-blue-700"}`}>
                                                                    {video.title}
                                                                </span>
                                                                {isFirstVideo && course.is_premium && (
                                                                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0 h-5 border-green-200">
                                                                        Preview
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-xs text-gray-400 font-mono">10:00</span>
                                                                {isLocked ? (
                                                                    <Lock className="w-4 h-4 text-gray-400" />
                                                                ) : (
                                                                    <PlayCircle className="w-4 h-4 text-blue-500" />
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                                </AccordionContent>
                                            </AccordionItem>
                                        ),
                                    )}
                                </Accordion>
                            </div>
                        </section>

                        {/* Mentors */}
                        <section>
                            <h2 className="font-vt323 text-3xl font-bold mb-6 flex items-center gap-2">
                                <div className="w-2 h-8 bg-green-400"></div>
                                Meet Your Instructors
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {course.course_mentors?.map((cm: any) => (
                                    <div
                                        key={cm.id}
                                        className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4"
                                    >
                                        <img
                                            src={
                                                cm.user.profile_url ||
                                                `https://ui-avatars.com/api/?name=${cm.user.name}&background=random`
                                            }
                                            className="w-16 h-16 rounded-full border-2 border-gray-200"
                                            alt={cm.user.name}
                                        />
                                        <div>
                                            <h3 className="font-vt323 text-2xl font-bold">
                                                {cm.user.name}
                                            </h3>
                                            <p className="text-gray-500 font-vt323 text-lg">
                                                Senior Developer
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar (Right) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-8">
                            {/* Price Card */}
                            <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
                                <div className="absolute -top-4 -right-4 bg-red-500 text-white px-3 py-1 font-vt323 text-lg border-2 border-black transform rotate-6">
                                    BEST VALUE
                                </div>

                                <div className="mb-6">
                                    <p className="text-gray-500 font-vt323 text-xl line-through decoration-red-500 decoration-2">
                                        {course.is_premium
                                            ? formatRupiah(course.price * 1.5)
                                            : ""}
                                    </p>
                                    <h3 className="text-4xl font-bold font-vt323 text-blue-600">
                                        {course.is_premium
                                            ? formatRupiah(course.price)
                                            : "FREE"}
                                    </h3>
                                </div>

                                <Button className="w-full h-14 text-2xl font-vt323 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all bg-yellow-400 hover:bg-yellow-500 text-black mb-4">
                                    {course.is_premium
                                        ? "Buy This Course"
                                        : "Start Learning Now"}
                                </Button>

                                <div className="space-y-4 text-gray-600 font-vt323 text-lg border-t-2 border-gray-100 pt-4">
                                    <div className="flex items-center gap-3">
                                        <Award className="w-5 h-5 text-blue-500" />
                                        <span>Official Certificate</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Shield className="w-5 h-5 text-blue-500" />
                                        <span>Lifetime Access</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-blue-500" />
                                        <span>High Quality Video</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Users className="w-5 h-5 text-blue-500" />
                                        <span>Community Support</span>
                                    </div>
                                </div>
                            </div>

                            {/* Share */}
                            <div className="bg-gray-50 border-2 border-black p-4 flex items-center justify-between">
                                <span className="font-vt323 text-xl font-bold">
                                    Share this course
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:bg-gray-200"
                                >
                                    <Share2 className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
