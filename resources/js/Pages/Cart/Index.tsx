import { Head, Link, useForm } from "@inertiajs/react";
import { Trash, ShoppingCart, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { PageProps } from "@/types";
import { toast } from "sonner";
import Navbar from "@/Components/Landing/Navbar";
import Footer from "@/Components/Landing/Footer";

interface CartItem {
    id: number;
    course: {
        id: string;
        title: string;
        price: number;
        discount_price: number | null;
        course_images: { image_url: string }[];
    };
}

interface CartProps extends PageProps {
    cartItems: CartItem[];
}

export default function CartIndex({ auth, cartItems }: CartProps) {
    const { delete: destroy } = useForm();

    const removeItem = (id: number) => {
        destroy(route('cart.remove', id), {
            onSuccess: () => toast.success("Item removed from cart"),
            onError: () => toast.error("Failed to remove item")
        });
    };

    const formatRupiah = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);
    };

    const subtotal = cartItems.reduce((acc, item) => {
        const price = item.course.discount_price ?? item.course.price;
        return acc + Number(price);
    }, 0);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 font-sans selection:bg-orange-500 selection:text-white flex flex-col">
            <Navbar />
            
            <Head title="Shopping Cart" />

            <div className="flex-grow pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 mb-8">
                         <h1 className="text-4xl font-bold font-vt323 text-gray-900 dark:text-white">Shopping Cart</h1>
                         <span className="text-lg text-gray-500 font-vt323 mt-2">({cartItems.length} Items)</span>
                    </div>

                    {cartItems.length === 0 ? (
                        <div className="bg-white dark:bg-gray-900 overflow-hidden shadow-sm p-12 text-center border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
                            <ShoppingCart className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-700 mb-6" />
                            <h3 className="text-3xl font-bold font-vt323 text-gray-900 dark:text-white mb-3">Your cart is empty</h3>
                            <p className="text-gray-500 mb-8 text-lg">Looks like you haven't found the right course yet.</p>
                            <Link href="/">
                                <Button className="font-vt323 text-xl px-8 py-6 h-auto border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all bg-yellow-400 hover:bg-yellow-500 text-black">
                                    Start Browsing
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Cart Items List - Marketplace Style */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Select All Header (Mockup) */}
                                <div className="bg-white dark:bg-gray-900 p-4 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex items-center gap-3">
                                    <div className="w-5 h-5 border-2 border-black dark:border-white bg-blue-500 flex items-center justify-center">
                                        <div className="w-3 h-3 bg-white" />
                                    </div>
                                    <span className="font-bold font-vt323 text-lg">Select All ({cartItems.length})</span>
                                </div>

                                {cartItems.map((item) => (
                                    <div key={item.id} className="bg-white dark:bg-gray-900 p-4 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex gap-6 items-start group hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
                                        {/* Checkbox */}
                                        <div className="pt-8">
                                            <div className="w-5 h-5 border-2 border-black dark:border-white bg-blue-500 flex items-center justify-center cursor-pointer">
                                                <div className="w-3 h-3 bg-white" />
                                            </div>
                                        </div>
                                        
                                        {/* Product Image */}
                                        <div className="w-32 h-24 bg-gray-100 dark:bg-gray-800 border-2 border-black dark:border-white flex-shrink-0 relative overflow-hidden">
                                            {item.course.course_images?.[0] ? (
                                                <img 
                                                    src={item.course.course_images[0].image_url.startsWith('http') ? item.course.course_images[0].image_url : `/storage/${item.course.course_images[0].image_url}`} 
                                                    alt={item.course.title}
                                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    No Image
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 min-w-0 py-1">
                                            <Link href={`/course/${item.course.id}`} className="block">
                                                <h3 className="font-bold font-vt323 text-2xl text-gray-900 dark:text-white line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-2">
                                                    {item.course.title}
                                                </h3>
                                            </Link>
                                            
                                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-2">
                                                <div>
                                                    {item.course.discount_price ? (
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="bg-red-100 text-red-600 text-xs font-bold px-1.5 py-0.5 border border-red-200">
                                                                    {Math.round(((item.course.price - item.course.discount_price) / item.course.price) * 100)}%
                                                                </span>
                                                                <span className="text-sm text-gray-500 line-through decoration-gray-400">
                                                                    {formatRupiah(item.course.price)}
                                                                </span>
                                                            </div>
                                                            <span className="font-bold text-2xl text-gray-900 dark:text-white block">
                                                                {formatRupiah(item.course.discount_price)}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="font-bold text-2xl text-gray-900 dark:text-white">
                                                            {formatRupiah(item.course.price)}
                                                        </span>
                                                    )}
                                                </div>

                                                <button 
                                                    onClick={() => removeItem(item.id)}
                                                    className="flex items-center gap-2 text-gray-500 hover:text-red-600 font-vt323 text-lg transition-colors group/delete"
                                                >
                                                    <Trash className="w-5 h-5 group-hover/delete:stroke-red-600" />
                                                    <span>Remove</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                
                                <Link href="/" className="inline-flex items-center gap-2 text-blue-600 font-vt323 text-xl hover:underline mt-4">
                                    <ArrowLeft className="w-5 h-5" /> Continue Shopping
                                </Link>
                            </div>

                            {/* Sticky Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white dark:bg-gray-900 p-6 border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] sticky top-28">
                                    <h3 className="font-vt323 text-2xl font-bold mb-6 border-b-2 border-gray-100 dark:border-gray-800 pb-4">Shopping Summary</h3>
                                    
                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between font-vt323 text-xl text-gray-600 dark:text-gray-400">
                                            <span>Total Price ({cartItems.length} items)</span>
                                            <span>{formatRupiah(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between font-vt323 text-xl text-green-600">
                                            <span>Total Discount</span>
                                            <span>-</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-4 border-t-2 border-black dark:border-white border-dashed">
                                            <span className="font-bold font-vt323 text-xl">Grand Total</span>
                                            <span className="font-bold text-3xl text-blue-600 dark:text-blue-400">{formatRupiah(subtotal)}</span>
                                        </div>
                                    </div>

                                    <Link href={route('checkout.index')} className="block">
                                        <Button className="w-full font-vt323 text-2xl h-14 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all bg-yellow-400 hover:bg-yellow-500 text-black">
                                            Checkout ({cartItems.length})
                                        </Button>
                                    </Link>
                                    
                                    <p className="text-center text-xs text-gray-500 mt-4 font-mono">
                                        Secure Checkout powered by Stripe
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <Footer />
        </div>
    );
}
