import { useState, PropsWithChildren, ReactNode, useEffect } from "react";
import Sidebar from "@/Components/Sidebar";
import Navbar from "@/Components/Navbar";
import { cn } from "@/lib/utils";
import { Head, usePage } from "@inertiajs/react";
import { useSidebarStore } from "@/hooks/useSidebarStore";
import { Toaster } from "@/Components/ui/sonner";
import { toast } from "sonner";

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile toggle state (doesn't need persistence usually)
    const { isCollapsed, toggleCollapse } = useSidebarStore(); // Global persisted state
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
        if (flash?.warning) {
            toast.warning(flash.warning);
        }
        if (flash?.info) {
            toast.info(flash.info);
        }
    }, [flash]);

    return (
        <div className="flex h-screen w-full bg-[#FDFBF7] font-vt323">
            <Toaster />
            {/* Sidebar - Desktop (Always visible) & Mobile (Toggleable) */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full",
                    // When collapsed on desktop, width changes
                    isCollapsed ? "lg:w-20" : "lg:w-64",
                )}
            >
                <Sidebar
                    isCollapsed={isCollapsed}
                    toggleCollapse={toggleCollapse}
                />
            </div>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

                <main className="flex-1 overflow-y-auto p-6">
                    {header && (
                        <header className="mb-6 border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            {header}
                        </header>
                    )}

                    {children}
                </main>
            </div>
        </div>
    );
}
