import { Head, Link } from "@inertiajs/react";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { toast } from "sonner";
import { Loader2, ArrowLeft, ShieldCheck, CreditCard } from "lucide-react";

// Simple Header for Checkout
const CheckoutHeader = () => (
    <header className="fixed top-0 w-full bg-white dark:bg-gray-900 border-b-2 border-black dark:border-white z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-400 border-2 border-black flex items-center justify-center font-bold text-xl font-vt323 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    AL
                </div>
                <span className="font-vt323 text-2xl font-bold tracking-tighter">
                    ARU Learning
                </span>
            </Link>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                <span>Secure Checkout</span>
            </div>
        </div>
    </header>
);

// Payment Form Component
const PaymentForm = ({
    onSuccess,
    amount,
}: {
    onSuccess: () => void;
    amount: string;
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: "if_required",
        });

        if (error) {
            setMessage(error.message || "An unexpected error occurred.");
            setIsLoading(false);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            toast.success("Payment successful!");
            onSuccess();
        } else {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <PaymentElement options={{ layout: "tabs" }} />
            </div>

            <Button
                disabled={isLoading || !stripe || !elements}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-vt323 text-xl h-14 border-2 border-transparent hover:border-black dark:hover:border-white shadow-md active:shadow-none transition-all"
            >
                {isLoading ? (
                    <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin w-5 h-5" />{" "}
                        Processing...
                    </div>
                ) : (
                    `Pay ${amount}`
                )}
            </Button>

            {message && (
                <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded text-sm flex items-center gap-2">
                    <span className="font-bold">Error:</span> {message}
                </div>
            )}

            <p className="text-center text-xs text-gray-500 mt-4">
                Your payment is processed securely by Stripe. We do not store
                your card details.
            </p>
        </form>
    );
};

export default function CheckoutIndex({ cartItems, subtotal, stripeKey }: any) {
    const [promoCode, setPromoCode] = useState("");
    const [appliedPromo, setAppliedPromo] = useState<any>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [loadingSecret, setLoadingSecret] = useState(false);

    const calculateTotal = () => {
        if (!appliedPromo) return subtotal;
        if (appliedPromo.type === "fixed")
            return Math.max(0, subtotal - appliedPromo.value);
        if (appliedPromo.type === "percentage")
            return Math.max(
                0,
                subtotal - subtotal * (appliedPromo.value / 100),
            );
        return subtotal;
    };

    const handleApplyPromo = async () => {
        try {
            const res = await axios.post(route("checkout.promo"), {
                code: promoCode,
            });
            setAppliedPromo(res.data.promo);
            toast.success("Promo applied!");
            // setClientSecret(null); // REMOVED: Do NOT clear client secret immediately to prevent UI flash/remount
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Invalid promo code");
            setAppliedPromo(null);
        }
    };

    const fetchPaymentIntent = async () => {
        setLoadingSecret(true);
        try {
            const res = await axios.post(route("checkout.payment-intent"), {
                promo_id: appliedPromo?.id,
            });
            // Only update clientSecret if it changed (which means new intent was created)
            // If API returns null clientSecret (meaning update success), we keep the old one
            if (res.data.clientSecret) {
                setClientSecret(res.data.clientSecret);
            } else if (res.data.message === "Order updated") {
                // If updated, we might not need to do anything as the Elements component
                // will automatically pick up the amount change if we didn't unmount it?
                // Actually, for amount updates to reflect in Elements, we often need to
                // fetch the update or rely on the same clientSecret but stripe.js handling it.
                // But Elements usually needs a remount or key change if secret changes.
                // If secret is SAME, Elements might not auto-refresh amount unless we force it.
                // But since we returned null secret, state doesn't change, no remount.
                // However, we want to ensure amount display in Payment Button updates (it does via calculateTotal).
                toast.success("Order total updated!");
            }
        } catch (err) {
            toast.error("Failed to initialize payment");
        } finally {
            setLoadingSecret(false);
        }
    };

    useEffect(() => {
        // Debounce or simple check to avoid double calling on initial render if appliedPromo is null initially
        fetchPaymentIntent();
    }, [appliedPromo]); // Only re-run when promo changes

    const formatRupiah = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);
    };

    // Load stripe only once using the key from props
    const [stripePromise] = useState(() => loadStripe(stripeKey));

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 font-sans selection:bg-orange-500 selection:text-white">
            <Head title="Checkout" />
            <CheckoutHeader />

            <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link
                    href={route("cart.index")}
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-black dark:hover:text-white mb-8 transition-colors font-vt323 text-lg"
                >
                    <ArrowLeft className="w-5 h-5" /> Back to Cart
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
                    {/* Left Column: Order Summary (5 cols) */}
                    <div className="lg:col-span-5 space-y-8 order-2 lg:order-1 sticky top-24">
                        <div className="bg-white dark:bg-gray-900 border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] p-8">
                            <h2 className="font-vt323 text-3xl font-bold mb-6 flex items-center gap-2">
                                <div className="w-2 h-8 bg-yellow-400"></div>
                                Order Summary
                            </h2>

                            <div className="space-y-6 mb-8">
                                {cartItems.map((item: any) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded border border-gray-200 overflow-hidden flex-shrink-0">
                                            {item.course.course_images?.[0] ? (
                                                <img
                                                    src={
                                                        item.course.course_images[0].image_url.startsWith(
                                                            "http",
                                                        )
                                                            ? item.course
                                                                  .course_images[0]
                                                                  .image_url
                                                            : `/storage/${item.course.course_images[0].image_url}`
                                                    }
                                                    alt={item.course.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-xs">
                                                    No Img
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight mb-1">
                                                {item.course.title}
                                            </h4>
                                            <p className="text-gray-500 font-mono text-sm">
                                                {formatRupiah(
                                                    item.course
                                                        .discount_price ??
                                                        item.course.price,
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t-2 border-dashed border-gray-200 dark:border-gray-700 pt-6 space-y-3">
                                <div className="flex justify-between text-gray-600 dark:text-gray-400 font-vt323 text-xl">
                                    <span>Subtotal</span>
                                    <span>{formatRupiah(subtotal)}</span>
                                </div>
                                {appliedPromo && (
                                    <div className="flex justify-between text-green-600 font-bold font-vt323 text-xl">
                                        <span>
                                            Discount ({appliedPromo.code})
                                        </span>
                                        <span>
                                            -{" "}
                                            {formatRupiah(
                                                subtotal - calculateTotal(),
                                            )}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center pt-4 border-t-2 border-black dark:border-white">
                                    <span className="font-bold font-vt323 text-2xl">
                                        Total
                                    </span>
                                    <span className="font-bold text-4xl text-blue-600 dark:text-blue-400">
                                        {formatRupiah(calculateTotal())}
                                    </span>
                                </div>
                            </div>

                            {/* Promo Code Input */}
                            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                                <label className="block text-sm font-medium mb-2 font-vt323 text-xl">
                                    Have a promo code?
                                </label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="ENTER CODE"
                                        value={promoCode}
                                        onChange={(e) =>
                                            setPromoCode(
                                                e.target.value.toUpperCase(),
                                            )
                                        }
                                        className="font-mono bg-gray-50 dark:bg-gray-800 uppercase"
                                    />
                                    <Button
                                        onClick={handleApplyPromo}
                                        disabled={!promoCode || appliedPromo}
                                        className="border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] bg-white text-black hover:bg-gray-50"
                                    >
                                        {appliedPromo ? "Applied" : "Apply"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Payment Details (7 cols) */}
                    <div className="lg:col-span-7 order-1 lg:order-2">
                        <div className="mb-8 mt-1">
                            <h1 className="font-vt323 text-5xl font-bold mb-4">
                                Checkout
                            </h1>
                            <p className="text-gray-500 text-lg">
                                Complete your purchase securely. You'll get
                                instant access to your courses.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-900 border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] p-8 lg:p-12">
                            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <CreditCard className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-vt323 text-2xl font-bold">
                                        Payment Method
                                    </h3>
                                    <p className="text-gray-500 text-sm">
                                        Encrypted and secured by Stripe
                                    </p>
                                </div>
                            </div>

                            {clientSecret && stripeKey ? (
                                <Elements
                                    stripe={stripePromise}
                                    options={{
                                        clientSecret,
                                        appearance: {
                                            theme: "stripe",
                                            variables: {
                                                colorPrimary: "#2563eb",
                                                fontFamily:
                                                    "Space Mono, monospace",
                                            },
                                        },
                                    }}
                                >
                                    <PaymentForm
                                        onSuccess={() =>
                                            (window.location.href =
                                                route("checkout.success"))
                                        }
                                        amount={formatRupiah(calculateTotal())}
                                    />
                                </Elements>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                    <Loader2 className="w-12 h-12 animate-spin text-gray-300" />
                                    <p className="text-gray-400 font-mono text-sm">
                                        Initializing secure payment...
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 grid grid-cols-3 gap-4 text-center text-gray-400 text-sm font-mono">
                            <div className="flex flex-col items-center gap-2">
                                <ShieldCheck className="w-6 h-6" />
                                <span>SSL Encrypted</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <CreditCard className="w-6 h-6" />
                                <span>Secure Payment</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <span className="font-bold text-xl">24/7</span>
                                <span>Support</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
