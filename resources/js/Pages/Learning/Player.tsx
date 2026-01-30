import { Head, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import Confetti from "react-confetti";
import axios from "axios";
import { toast } from "sonner";
import {
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    PlayCircle,
    Menu,
    Trophy,
    Shield,
    Star,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Progress } from "@/Components/ui/progress";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import { Sheet, SheetContent, SheetTrigger } from "@/Components/ui/sheet";
import { cn } from "@/lib/utils";

export default function Player({
    course,
    currentVideo,
    nextVideo,
    prevVideo,
    progress: initialProgress,
    userStats,
}: any) {
    const [progress, setProgress] = useState(initialProgress);
    const [stats, setStats] = useState(userStats);
    const [showConfetti, setShowConfetti] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
    const [hasWindow, setHasWindow] = useState(false);

    useEffect(() => {
        setHasWindow(true);
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }, []);

    // Handle Window Resize for Confetti
    useEffect(() => {
        const handleResize = () =>
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleVideoComplete = async () => {
        // Optimistic Update
        if (progress[currentVideo.id]?.is_completed) return;

        try {
            const res = await axios.post(route("learning.complete"), {
                video_id: currentVideo.id,
            });

            if (res.data.success) {
                setProgress((prev: any) => ({
                    ...prev,
                    [currentVideo.id]: {
                        is_completed: true,
                        completed_at: new Date(),
                    },
                }));

                // Update Stats
                if (res.data.leveled_up) {
                    setShowConfetti(true);
                    toast.success(
                        `LEVEL UP! You reached Level ${res.data.current_level}`,
                        {
                            duration: 5000,
                            icon: (
                                <Trophy className="w-6 h-6 text-yellow-500" />
                            ),
                        },
                    );
                    setTimeout(() => setShowConfetti(false), 8000);
                } else {
                    toast.success(`+${res.data.exp_gained} EXP Gained!`, {
                        icon: <Star className="w-4 h-4 text-yellow-400" />,
                    });
                }

                setStats((prev: any) => ({
                    ...prev,
                    total_exp: res.data.total_exp,
                    level: res.data.current_level,
                }));

                if (nextVideo) {
                    setTimeout(() => {
                        window.location.href = route("learning.show", [course.id, nextVideo.id]);
                    }, 2000);
                }
            }
        } catch (err) {
            toast.error("Failed to save progress");
        }
    };

    const isVideoCompleted = (id: number) => progress[id]?.is_completed;

    return (
        <div className="h-screen flex flex-col bg-gray-950 text-white font-sans overflow-hidden">
            <Head title={`${currentVideo.title} - ${course.title}`} />

            {showConfetti && (
                <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    recycle={false}
                    numberOfPieces={500}
                />
            )}

            {/* Top Bar */}
            <header className="h-16 border-b border-gray-800 bg-gray-900 flex items-center justify-between px-4 z-20">
                <div className="flex items-center gap-4">
                    <Link
                        href={route("course.show", course.id)}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="font-vt323 text-xl font-bold truncate max-w-[200px] sm:max-w-md">
                            {course.title}
                        </h1>
                        <p className="text-xs text-gray-400 truncate">
                            {currentVideo.title}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {/* Gamification HUD */}
                    <div className="hidden sm:flex items-center gap-3 bg-gray-800 rounded-full px-4 py-1.5 border border-gray-700">
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-blue-400" />
                            <span className="font-vt323 text-lg text-blue-400">
                                Lvl {stats.level}
                            </span>
                        </div>
                        <div className="w-px h-4 bg-gray-700"></div>
                        <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="font-vt323 text-lg text-yellow-400">
                                {stats.total_exp} EXP
                            </span>
                        </div>
                    </div>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden text-gray-400"
                            >
                                <Menu className="w-6 h-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="left"
                            className="w-80 bg-gray-900 border-r-gray-800 text-white p-0"
                        >
                            <SidebarContent
                                course={course}
                                currentVideo={currentVideo}
                                progress={progress}
                            />
                        </SheetContent>
                    </Sheet>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar (Desktop) */}
                <aside className="hidden lg:flex w-80 bg-gray-900 border-r border-gray-800 flex-col">
                    <SidebarContent
                        course={course}
                        currentVideo={currentVideo}
                        progress={progress}
                    />
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col relative bg-black">
                    <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
                        <div className="w-full max-w-5xl aspect-video bg-gray-800 rounded-lg overflow-hidden shadow-2xl border-2 border-gray-800 relative group">
                            {hasWindow && (
                                <ReactPlayer
                                    src={currentVideo.video_url}
                                    width="100%"
                                    height="100%"
                                    controls
                                    onEnded={handleVideoComplete}
                                    playing={false}
                                    onError={(e) => {
                                        console.error("Video error:", e);
                                        toast.error(
                                            "Could not load video. Check URL.",
                                        );
                                    }}
                                    config={{
                                        youtube: {},
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Bottom Control Bar */}
                    <div className="h-20 bg-gray-900 border-t border-gray-800 px-8 flex items-center justify-between">
                        <div className="flex gap-4">
                            {prevVideo ? (
                                <Link
                                    href={route("learning.show", [
                                        course.id,
                                        prevVideo.id,
                                    ])}
                                >
                                    <Button
                                        variant="outline"
                                        className="font-vt323 text-lg border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                                    >
                                        <ChevronLeft className="w-5 h-5 mr-1" />{" "}
                                        Previous
                                    </Button>
                                </Link>
                            ) : (
                                <Button
                                    disabled
                                    variant="outline"
                                    className="font-vt323 text-lg border-gray-700 text-gray-600 opacity-50"
                                >
                                    <ChevronLeft className="w-5 h-5 mr-1" />{" "}
                                    Previous
                                </Button>
                            )}
                        </div>

                        <Button
                            onClick={handleVideoComplete}
                            disabled={isVideoCompleted(currentVideo.id)}
                            className={cn(
                                "font-vt323 text-xl px-8 h-12 transition-all transform hover:scale-105 active:scale-95 border-2",
                                isVideoCompleted(currentVideo.id)
                                    ? "bg-green-600 hover:bg-green-700 border-green-400 text-white"
                                    : "bg-blue-600 hover:bg-blue-700 border-blue-400 text-white",
                            )}
                        >
                            {isVideoCompleted(currentVideo.id) ? (
                                <>
                                    <CheckCircle className="w-5 h-5 mr-2" />{" "}
                                    Completed
                                </>
                            ) : (
                                "Mark as Complete"
                            )}
                        </Button>

                        <div className="flex gap-4">
                            {nextVideo ? (
                                <Link
                                    href={route("learning.show", [
                                        course.id,
                                        nextVideo.id,
                                    ])}
                                >
                                    <Button
                                        variant="outline"
                                        className="font-vt323 text-lg border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                                    >
                                        Next{" "}
                                        <ChevronRight className="w-5 h-5 ml-1" />
                                    </Button>
                                </Link>
                            ) : (
                                <Link href={route("course.show", course.id)}>
                                    <Button className="font-vt323 text-lg bg-yellow-500 hover:bg-yellow-600 text-black border-2 border-yellow-300">
                                        Finish Course{" "}
                                        <Trophy className="w-5 h-5 ml-2" />
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

// Sidebar Component
const SidebarContent = ({ course, currentVideo, progress }: any) => {
    // Calculate total progress
    const totalVideos = course.sub_courses.reduce(
        (acc: number, sub: any) => acc + sub.sub_course_videos.length,
        0,
    );
    const completedVideos = Object.values(progress).filter(
        (p: any) => p.is_completed,
    ).length;
    const percentage = Math.round((completedVideos / totalVideos) * 100);

    return (
        <div className="h-full flex flex-col">
            <div className="p-6 border-b border-gray-800">
                <h2 className="font-vt323 text-2xl font-bold mb-2">
                    Course Content
                </h2>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-400 font-mono">
                        <span>{percentage}% Completed</span>
                        <span>
                            {completedVideos}/{totalVideos}
                        </span>
                    </div>
                    <Progress value={percentage} className="h-2 bg-gray-800" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <Accordion
                    type="multiple"
                    defaultValue={course.sub_courses.map(
                        (s: any) => `item-${s.id}`,
                    )}
                    className="w-full"
                >
                    {course.sub_courses.map((subCourse: any, index: number) => (
                        <AccordionItem
                            key={subCourse.id}
                            value={`item-${subCourse.id}`}
                            className="border-b border-gray-800"
                        >
                            <AccordionTrigger className="px-6 py-4 hover:bg-gray-800/50 hover:no-underline font-vt323 text-lg">
                                <span className="text-left flex-1">
                                    Section {index + 1}: {subCourse.title}
                                </span>
                            </AccordionTrigger>
                            <AccordionContent className="p-0">
                                {subCourse.sub_course_videos.map(
                                    (video: any) => {
                                        const isCompleted =
                                            progress[video.id]?.is_completed;
                                        const isActive =
                                            currentVideo.id === video.id;

                                        return (
                                            <Link
                                                key={video.id}
                                                href={route("learning.show", [
                                                    course.id,
                                                    video.id,
                                                ])}
                                                className={cn(
                                                    "flex items-center gap-3 px-6 py-3 transition-colors border-l-4",
                                                    isActive
                                                        ? "bg-gray-800/80 border-blue-500 text-white"
                                                        : "hover:bg-gray-800/30 border-transparent text-gray-400 hover:text-gray-200",
                                                )}
                                            >
                                                <div className="flex-shrink-0 mt-0.5">
                                                    {isCompleted ? (
                                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                                    ) : isActive ? (
                                                        <PlayCircle className="w-5 h-5 text-blue-500" />
                                                    ) : (
                                                        <div className="w-5 h-5 rounded-full border-2 border-gray-600" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">
                                                        {video.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        {Math.floor(
                                                            video.duration / 60,
                                                        )}{" "}
                                                        min
                                                    </p>
                                                </div>
                                            </Link>
                                        );
                                    },
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    );
};
