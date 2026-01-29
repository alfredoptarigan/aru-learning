import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Step1CourseDetails from "./Step1CourseDetails";
import Step2SubCourses from "./Step2SubCourses";
import Step3Review from "./Step3Review";
import { toast } from "sonner";

import { PageProps } from "@/types";

interface Mentor {
    id: string;
    name: string;
    email: string;
    profile_url?: string;
}

type WizardPageProps = PageProps & {
    availableMentors: Mentor[];
};

export default function CreateCourse() {
    const { availableMentors } = usePage<WizardPageProps>().props;
    const { auth } = usePage<WizardPageProps>().props;

    // Global Form State
    const { data, setData, post, processing, errors, setError, clearErrors } =
        useForm({
            // Step 1 Data
            title: "",
            description: "",
            price: "",
            status: "draft",
            images: [] as File[],
            mentors: [auth.user.id], // Default: current user

            // Step 2 Data
            subcourses: [] as any[],
        });

    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState(0);

    // 1. Handle Refresh Prevention
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (data.title || data.description || data.subcourses.length > 0) {
                e.preventDefault();
                e.returnValue = "";
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () =>
            window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [data]);

    // 2. Load from LocalStorage (Text data only)
    useEffect(() => {
        const savedData = localStorage.getItem("create_course_draft");
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                setData((prev) => ({
                    ...prev,
                    ...parsed,
                    images: [], // Images cannot be restored from local storage
                }));
                if (parsed.images_count > 0) {
                    toast.info("Draft restored. Please re-upload your images.");
                } else {
                    toast.success("Draft restored from previous session.");
                }
            } catch (e) {
                console.error("Failed to restore draft", e);
            }
        }
    }, []);

    // 3. Save to LocalStorage (Text data only)
    useEffect(() => {
        const dataToSave = {
            title: data.title,
            description: data.description,
            price: data.price,
            status: data.status,
            subcourses: data.subcourses,
            images_count: data.images.length,
            mentors: data.mentors,
        };
        localStorage.setItem("create_course_draft", JSON.stringify(dataToSave));
    }, [
        data.title,
        data.description,
        data.price,
        data.status,
        data.subcourses,
        data.mentors,
    ]);

    const changeStep = (newStep: number) => {
        setDirection(newStep > step ? 1 : -1);
        setStep(newStep);
        window.scrollTo(0, 0);
    };

    const submitFinal = () => {
        post(route("course.store"), {
            onError: (err) => {
                if (err.error) {
                    toast.error(err.error);
                } else {
                    toast.error("Please check the form for errors.");
                }
                console.log(err);
            },
            onSuccess: () => {
                localStorage.removeItem("create_course_draft");
                toast.success("Course published successfully!");
            },
        });
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 500 : -500,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 500 : -500,
            opacity: 0,
        }),
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link href={route("course.index")}>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-10 w-10 bg-white dark:bg-gray-800 border-2 border-black dark:border-white text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                    </Link>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 font-vt323">
                        Create Course (Wizard)
                    </h2>
                </div>
            }
        >
            <Head title="Create New Course" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Stepper */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between relative">
                            <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 -z-10" />
                            {[1, 2, 3].map((s) => (
                                <div
                                    key={s}
                                    className={`flex items-center justify-center w-10 h-10 rounded-full font-vt323 text-xl transition-colors duration-300 border-2 border-black dark:border-white ${
                                        step >= s
                                            ? "bg-primary dark:bg-blue-600 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                                            : "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                                    }`}
                                >
                                    {s}
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-2 font-vt323 text-lg text-gray-600 dark:text-gray-400">
                            <span>Course Details</span>
                            <span>Sub Courses</span>
                            <span>Review</span>
                        </div>
                    </div>

                    <div className="relative overflow-hidden min-h-[600px]">
                        <AnimatePresence
                            initial={false}
                            custom={direction}
                            mode="wait"
                        >
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: {
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 30,
                                        },
                                        opacity: { duration: 0.2 },
                                    }}
                                    className="w-full"
                                >
                                    <Step1CourseDetails
                                        data={data}
                                        setData={setData}
                                        errors={errors}
                                        onNext={() => changeStep(2)}
                                        setError={setError}
                                        clearErrors={clearErrors}
                                        availableMentors={availableMentors}
                                        currentUserId={auth.user.id}
                                    />
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: {
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 30,
                                        },
                                        opacity: { duration: 0.2 },
                                    }}
                                    className="w-full"
                                >
                                    <Step2SubCourses
                                        data={data}
                                        setData={setData}
                                        onBack={() => changeStep(1)}
                                        onNext={() => changeStep(3)}
                                    />
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: {
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 30,
                                        },
                                        opacity: { duration: 0.2 },
                                    }}
                                    className="w-full"
                                >
                                    <Step3Review
                                        data={data}
                                        onBack={() => changeStep(2)}
                                        onSubmit={submitFinal}
                                        processing={processing}
                                        availableMentors={availableMentors}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
