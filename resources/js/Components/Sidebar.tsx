import { Link, usePage } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { cn } from "@/lib/utils";
import {
    Home,
    BookOpen,
    Settings,
    LayoutGrid,
    ChevronLeft,
    ChevronRight,
    SwordIcon,
    UserIcon,
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
    className?: string;
    isCollapsed: boolean;
    toggleCollapse: () => void;
}

export default function Sidebar({
    className,
    isCollapsed,
    toggleCollapse,
}: SidebarProps) {
    const { url } = usePage();

    const links = [
        { name: "Dashboard", href: route("dashboard"), icon: Home },
        { name: "Courses", href: route("course.index"), icon: BookOpen },
        { name: "Tiers", href: route("tier.index"), icon: SwordIcon },
        {
            name: "User Management",
            href: route("user.index"),
            icon: UserIcon,
        },

        // Placeholder links for now
        // { name: 'My Courses', href: '#', icon: BookOpen },
        // { name: 'All Courses', href: '#', icon: LayoutGrid },
        // { name: 'Settings', href: route('profile.edit'), icon: Settings },
    ];

    return (
        <aside
            className={cn(
                "flex h-full flex-col border-r-2 border-black bg-[#FDFBF7] font-vt323 transition-all duration-300",
                isCollapsed ? "w-20" : "w-64",
                className,
            )}
        >
            {/* Logo Area */}
            <div
                className={cn(
                    "flex h-16 items-center border-b-2 border-black px-4",
                    isCollapsed ? "justify-center" : "justify-between",
                )}
            >
                {!isCollapsed && (
                    <Link
                        href="/"
                        className="flex items-center gap-2 overflow-hidden"
                    >
                        <ApplicationLogo className="h-8 w-8 shrink-0 fill-current text-primary" />
                        <span className="whitespace-nowrap text-2xl font-bold tracking-widest text-black">
                            PIXEL.EDU
                        </span>
                    </Link>
                )}
                {isCollapsed && (
                    <Link href="/" className="flex items-center justify-center">
                        <ApplicationLogo className="h-8 w-8 shrink-0 fill-current text-primary" />
                    </Link>
                )}

                {/* Mobile Toggle (Hidden on Desktop, handled by parent/layout) */}
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 space-y-2 p-4">
                {links.map((link) => {
                    // Normalize URLs for comparison (remove leading slash)
                    const currentPath = url.startsWith("/")
                        ? url.substring(1)
                        : url;
                    const linkPath = new URL(link.href).pathname.substring(1);

                    const isActive =
                        currentPath === linkPath ||
                        (currentPath.startsWith(linkPath) && linkPath !== "");

                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 border-2 border-transparent py-3 text-xl transition-all duration-200",
                                isCollapsed ? "justify-center px-0" : "px-4",
                                isActive
                                    ? "border-black bg-primary text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                    : "text-gray-600 hover:border-black hover:text-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
                            )}
                            title={isCollapsed ? link.name : undefined}
                        >
                            <link.icon className="h-6 w-6 shrink-0" />
                            {!isCollapsed && (
                                <span className="whitespace-nowrap">
                                    {link.name}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Collapse Toggle Button (Desktop Only) */}
            <div className="hidden border-t-2 border-black p-4 lg:block">
                <button
                    onClick={toggleCollapse}
                    className="flex w-full items-center justify-center gap-2 border-2 border-black bg-white py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-gray-50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                    {isCollapsed ? (
                        <ChevronRight className="h-5 w-5" />
                    ) : (
                        <ChevronLeft className="h-5 w-5" />
                    )}
                    {!isCollapsed && <span>Collapse</span>}
                </button>
            </div>

            {/* Footer / Info Area */}
            {!isCollapsed && (
                <div className="border-t-2 border-black p-4 text-center text-sm text-gray-500">
                    <p>&copy; 2026 Pixel Edu</p>
                </div>
            )}
        </aside>
    );
}
