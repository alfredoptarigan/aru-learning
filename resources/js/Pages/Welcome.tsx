import { Head, Link } from "@inertiajs/react";
import Navbar from "@/Components/Landing/Navbar";
import Footer from "@/Components/Landing/Footer";
import CourseCard from "@/Components/Landing/CourseCard";
import { Button } from "@/Components/ui/button";
import { ArrowRight, Star, Users, CheckCircle } from "lucide-react";

interface WelcomeProps {
    auth: any;
    courses: any[];
}

export default function Welcome({ auth, courses }: WelcomeProps) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans antialiased text-gray-900 dark:text-gray-100 selection:bg-blue-500 selection:text-white transition-colors duration-300">
            <Head title="Welcome to ARU Learning" />
            
            <Navbar />

            <main className="pt-20">
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-white dark:bg-gray-900 border-b-4 border-black dark:border-white">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
                        <div className="text-center max-w-4xl mx-auto">
                            <div className="inline-block bg-yellow-300 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] px-4 py-1 mb-6 transform -rotate-2">
                                <span className="font-vt323 text-xl font-bold uppercase tracking-wider text-black">
                                    🚀 Level Up Your Career
                                </span>
                            </div>
                            <h1 className="font-vt323 text-5xl md:text-7xl lg:text-8xl font-bold leading-none mb-6 text-black dark:text-white">
                                Master Skills with <br/>
                                <span className="text-blue-600 dark:text-blue-400 relative inline-block">
                                    Pixel Perfect
                                    <svg className="absolute w-full h-3 -bottom-1 left-0 text-yellow-400 opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                                        <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                                    </svg>
                                </span> Style
                            </h1>
                            <p className="font-vt323 text-xl md:text-3xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                                Belajar coding, design, dan soft skills dengan pengalaman retro yang seru. 
                                Materi terupdate, mentor berpengalaman, dan komunitas yang solid.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <Button className="h-14 px-8 text-2xl font-vt323 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all bg-blue-600 hover:bg-blue-700 text-white rounded-none">
                                    Explore Courses <ArrowRight className="ml-2 w-6 h-6" />
                                </Button>
                                <Button variant="outline" className="h-14 px-8 text-2xl font-vt323 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all bg-white dark:bg-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-none">
                                    View Roadmap
                                </Button>
                            </div>
                            
                            <div className="mt-12 flex items-center justify-center gap-8 text-gray-500 dark:text-gray-400 font-vt323 text-lg">
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-blue-500" />
                                    <span>900K+ Students</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 text-yellow-500" />
                                    <span>4.8/5 Ratings</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <span>Lifetime Access</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-yellow-50 dark:bg-yellow-900/10 border-b-4 border-black dark:border-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { title: "Materi Terupdate", desc: "Kurikulum disesuaikan dengan kebutuhan industri saat ini.", icon: "📚" },
                                { title: "Mentor Expert", desc: "Belajar langsung dari praktisi yang berpengalaman.", icon: "👨‍💻" },
                                { title: "Sertifikat Resmi", desc: "Validasi skill kamu untuk melamar pekerjaan impian.", icon: "🏆" }
                            ].map((feature, idx) => (
                                <div key={idx} className="bg-white dark:bg-gray-800 border-2 border-black dark:border-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-2 transition-transform">
                                    <div className="text-4xl mb-4">{feature.icon}</div>
                                    <h3 className="font-vt323 text-3xl font-bold mb-2 text-black dark:text-white">{feature.title}</h3>
                                    <p className="font-vt323 text-xl text-gray-600 dark:text-gray-300">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Course List Section */}
                <section className="py-24 bg-gray-50 dark:bg-gray-950">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <h2 className="font-vt323 text-5xl font-bold mb-2 text-black dark:text-white">Featured Courses</h2>
                                <p className="font-vt323 text-2xl text-gray-600 dark:text-gray-400">Upgrade skill kamu hari ini.</p>
                            </div>
                            <Link href="#" className="hidden md:block font-vt323 text-xl text-blue-600 dark:text-blue-400 hover:underline decoration-2 underline-offset-4 font-bold">
                                View All Courses &rarr;
                            </Link>
                        </div>

                        {courses && courses.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {courses.map((course) => (
                                    <CourseCard key={course.id} course={course} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
                                <p className="font-vt323 text-2xl text-gray-400 dark:text-gray-500">No courses available yet. Stay tuned!</p>
                            </div>
                        )}

                        <div className="mt-12 text-center md:hidden">
                            <Link href="#" className="font-vt323 text-xl text-blue-600 dark:text-blue-400 hover:underline decoration-2 underline-offset-4 font-bold">
                                View All Courses &rarr;
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-blue-600 border-t-4 border-black dark:border-white text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                    <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                        <h2 className="font-vt323 text-5xl md:text-6xl font-bold mb-6">
                            Ready to Start Your Journey?
                        </h2>
                        <p className="font-vt323 text-2xl md:text-3xl text-blue-100 mb-10">
                            Join thousands of developers and designers building their future with ARU Learning.
                        </p>
                        <Button className="h-16 px-10 text-3xl font-vt323 border-2 border-white text-blue-600 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all rounded-none">
                            Get Started for Free
                        </Button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
