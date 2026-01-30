import { Head, Link } from "@inertiajs/react";
import { CheckCircle, ArrowRight, Download, BookOpen } from "lucide-react";
import { Button } from "@/Components/ui/button";
import Navbar from "@/Components/Landing/Navbar";
import Footer from "@/Components/Landing/Footer";

export default function Success() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 font-sans selection:bg-orange-500 selection:text-white flex flex-col">
            <Navbar />
            <Head title="Payment Successful" />

            <div className="flex-grow flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl w-full text-center space-y-8">
                    
                    {/* Success Icon Animation */}
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-75"></div>
                        <div className="relative bg-green-100 rounded-full p-6 border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
                            <CheckCircle className="w-20 h-20 text-green-600" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-5xl font-bold font-vt323 text-gray-900 dark:text-white">
                            Payment Successful!
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 font-mono">
                            Thank you for your purchase. Your order has been confirmed and your courses are now available.
                        </p>
                    </div>

                    {/* Receipt Card */}
                    <div className="bg-white dark:bg-gray-900 border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] p-8 text-left max-w-lg mx-auto transform rotate-1 hover:rotate-0 transition-transform duration-300">
                        <div className="flex justify-between items-center border-b-2 border-dashed border-gray-200 dark:border-gray-700 pb-4 mb-4">
                            <span className="font-vt323 text-xl text-gray-500">Status</span>
                            <span className="font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full border border-green-200 text-sm uppercase tracking-wider">Paid</span>
                        </div>
                        <div className="space-y-4">
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                You will receive an email confirmation shortly with your order details.
                            </p>
                            <div className="flex gap-3">
                                <Link href="/dashboard" className="flex-1">
                                    <Button className="w-full h-12 text-lg font-vt323 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] bg-yellow-400 hover:bg-yellow-500 text-black">
                                        <BookOpen className="w-5 h-5 mr-2" /> Start Learning
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8">
                        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-black dark:hover:text-white font-vt323 text-xl hover:underline">
                            Return to Home <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
