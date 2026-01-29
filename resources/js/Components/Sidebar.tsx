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
    Shield,
    Lock,
    Folder,
    ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { usePermission } from "@/hooks/usePermission";

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
    const [isAccessControlOpen, setIsAccessControlOpen] = useState(true);

    const links = [
        { name: "Dashboard", href: route("dashboard"), icon: Home },
        { name: "Courses", href: route("course.index"), icon: BookOpen },
        { name: "Tiers", href: route("tier.index"), icon: SwordIcon },
        {
            name: "User Management",
            href: route("user.index"),
            icon: UserIcon,
        },
    ];

    const accessControlLinks = [
        { name: "Roles", href: route("role.index"), icon: Shield },
        { name: "Permissions", href: route("permission.index"), icon: Lock },
        { name: "Groups", href: route("permission-group.index"), icon: Folder },
    ];

    return (
        <aside
            className={cn(
                "flex h-full flex-col border-r-2 border-black dark:border-white bg-[#FDFBF7] dark:bg-gray-900 font-vt323 transition-all duration-300",
                isCollapsed ? "w-20" : "w-64",
                className,
            )}
        >
            {/* Logo Area */}
            <div
                className={cn(
                    "flex h-16 items-center border-b-2 border-black dark:border-white px-4",
                    isCollapsed ? "justify-center" : "justify-between",
                )}
            >
                {!isCollapsed && (
                    <Link
                        href="/"
                        className="flex items-center gap-2 overflow-hidden"
                    >
                        <ApplicationLogo className="h-8 w-8 shrink-0 fill-current text-primary" />
                        <span className="whitespace-nowrap text-2xl font-bold tracking-widest text-black dark:text-white">
                            PIXEL.EDU
                        </span>
                    </Link>
                )}
                {isCollapsed && (
                    <Link href="/" className="flex items-center justify-center">
                        <ApplicationLogo className="h-8 w-8 shrink-0 fill-current text-primary" />
                    </Link>
                )}
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
                {links.map((link) => {
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
                                    ? "border-black dark:border-white bg-primary dark:bg-blue-600 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                                    : "text-gray-600 dark:text-gray-400 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
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

                {/* Divider */}
                <div
                    className={cn(
                        "border-t-2 border-dashed border-gray-300 dark:border-gray-600 my-2",
                        isCollapsed ? "mx-2" : "mx-4",
                    )}
                />

                {/* Access Control Group */}
                {!isCollapsed ? (
                    <div className="space-y-1">
                        <button
                            onClick={() =>
                                setIsAccessControlOpen(!isAccessControlOpen)
                            }
                            className="flex w-full items-center justify-between px-4 py-2 text-sm text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider hover:text-black dark:hover:text-white transition-colors"
                        >
                            <span>Access Control</span>
                            <ChevronDown
                                className={cn(
                                    "h-4 w-4 transition-transform duration-200",
                                    isAccessControlOpen ? "rotate-180" : "",
                                )}
                            />
                        </button>

                        {isAccessControlOpen && (
                            <div className="space-y-1 pl-4 border-l-2 border-gray-200 dark:border-gray-700 ml-4">
                                {accessControlLinks.map((link) => {
                                    const currentPath = url.startsWith("/")
                                        ? url.substring(1)
                                        : url;
                                    const linkPath = new URL(
                                        link.href,
                                    ).pathname.substring(1);
                                    const isActive =
                                        currentPath === linkPath ||
                                        (currentPath.startsWith(linkPath) &&
                                            linkPath !== "");

                                    return (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className={cn(
                                                "flex items-center gap-3 border-2 border-transparent py-2 px-3 text-lg transition-all duration-200",
                                                isActive
                                                    ? "bg-gray-100 dark:bg-gray-800 font-bold text-black dark:text-white border-l-4 border-l-black dark:border-l-white border-y-0 border-r-0"
                                                    : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800",
                                            )}
                                        >
                                            <link.icon className="h-5 w-5 shrink-0" />
                                            <span className="whitespace-nowrap">
                                                {link.name}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ) : (
                    // Collapsed State: Just show icons
                    <div className="space-y-2">
                        {accessControlLinks.map((link) => {
                            const currentPath = url.startsWith("/")
                                ? url.substring(1)
                                : url;
                            const linkPath = new URL(
                                link.href,
                            ).pathname.substring(1);
                            const isActive =
                                currentPath === linkPath ||
                                (currentPath.startsWith(linkPath) &&
                                    linkPath !== "");

                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={cn(
                                        "flex items-center justify-center gap-3 border-2 border-transparent py-3 text-xl transition-all duration-200",
                                        isActive
                                            ? "border-black dark:border-white bg-primary dark:bg-blue-600 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                                            : "text-gray-600 dark:text-gray-400 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
                                    )}
                                    title={link.name}
                                >
                                    <link.icon className="h-6 w-6 shrink-0" />
                                </Link>
                            );
                        })}
                    </div>
                )}
            </nav>

            {/* Collapse Toggle Button (Desktop Only) */}
            <div
                className={cn(
                    "hidden border-t-2 border-black dark:border-white p-4 lg:block",
                    isCollapsed ? "px-2" : "p-4",
                )}
            >
                <button
                    onClick={toggleCollapse}
                    className={cn(
                        "flex w-full items-center justify-center gap-2 border-2 border-black dark:border-white bg-white dark:bg-gray-800 text-black dark:text-white py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all hover:bg-gray-50 dark:hover:bg-gray-700 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
                        isCollapsed && "px-0",
                    )}
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
                <div className="border-t-2 border-black dark:border-white p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>&copy; 2026 Pixel Edu</p>
                </div>
            )}
        </aside>
    );
}
