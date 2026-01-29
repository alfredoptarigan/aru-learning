import { Link, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, Gamepad2, User, LogOut, LayoutDashboard, Sun, Moon } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { useThemeStore } from "@/hooks/useThemeStore";

export default function Navbar() {
    const { auth } = usePage().props as any;
    const [hidden, setHidden] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { scrollY } = useScroll();
    const { theme, toggleTheme } = useThemeStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() || 0;
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    });

    return (
        <motion.nav
            variants={{
                visible: { y: 0 },
                hidden: { y: "-100%" },
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed top-0 w-full z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b-4 border-black dark:border-white shadow-sm transition-colors duration-300"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-blue-500 border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] flex items-center justify-center text-white">
                                <Gamepad2 className="w-6 h-6" />
                            </div>
                            <span className="font-vt323 text-3xl font-bold tracking-wider text-black dark:text-white">
                                ARU<span className="text-blue-600 dark:text-blue-400">Learning</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8 font-vt323 text-xl">
                        <Link href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline decoration-2 underline-offset-4">Flash Sale</Link>
                        <Link href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline decoration-2 underline-offset-4">Kelas</Link>
                        <Link href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline decoration-2 underline-offset-4">Alur Belajar</Link>
                        <Link href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline decoration-2 underline-offset-4">Mentors</Link>
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg border-2 border-transparent hover:border-black dark:hover:border-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                            aria-label="Toggle Theme"
                        >
                            {mounted && theme === 'dark' ? (
                                <Sun className="w-6 h-6 text-yellow-400 fill-current" />
                            ) : (
                                <Moon className="w-6 h-6 text-gray-700" />
                            )}
                        </button>

                        {auth.user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border-2 border-transparent hover:border-black dark:hover:border-white">
                                        <div className="text-right hidden lg:block text-black dark:text-white">
                                            <p className="font-vt323 text-xl font-bold leading-none">{auth.user.name}</p>
                                            <p className="font-mono text-xs text-gray-500 dark:text-gray-400">Student</p>
                                        </div>
                                        <img 
                                            src={auth.user.profile_url || `https://ui-avatars.com/api/?name=${auth.user.name}&background=random`} 
                                            alt={auth.user.name}
                                            className="w-10 h-10 rounded-full border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                                        />
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 font-vt323 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] rounded-none bg-white dark:bg-gray-900 text-black dark:text-white">
                                    <DropdownMenuLabel className="text-lg">My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                                    <DropdownMenuItem className="text-lg cursor-pointer focus:bg-blue-50 dark:focus:bg-blue-900/20 focus:text-blue-600 dark:focus:text-blue-400">
                                        <Link href={route('dashboard')} className="flex items-center w-full">
                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                            <span>Dashboard</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                                    <DropdownMenuItem className="text-lg text-red-600 dark:text-red-400 cursor-pointer focus:bg-red-50 dark:focus:bg-red-900/20 focus:text-red-700 dark:focus:text-red-300">
                                        <Link href={route('logout')} method="post" as="button" className="flex items-center w-full">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Log Out</span>
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
                                <Link href={route('login')}>
                                    <Button variant="ghost" className="font-vt323 text-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-black dark:text-white">
                                        Log In
                                    </Button>
                                </Link>
                                <Link href={route('register')}>
                                    <Button className="font-vt323 text-lg border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all bg-blue-600 hover:bg-blue-700 text-white">
                                        Sign Up
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                         {/* Theme Toggle Mobile */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg border-2 border-transparent hover:border-black dark:hover:border-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                        >
                             {mounted && theme === 'dark' ? (
                                <Sun className="w-6 h-6 text-yellow-400 fill-current" />
                            ) : (
                                <Moon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                            )}
                        </button>

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white focus:outline-none"
                        >
                            {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="md:hidden bg-white dark:bg-gray-900 border-t-2 border-black dark:border-white"
                >
                    <div className="px-4 pt-2 pb-6 space-y-2 font-vt323 text-xl text-black dark:text-white">
                        <Link href="#" className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">Flash Sale</Link>
                        <Link href="#" className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">Kelas</Link>
                        <Link href="#" className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">Alur Belajar</Link>
                        <div className="pt-4 flex flex-col gap-3">
                            {auth.user ? (
                                <>
                                    <div className="flex items-center gap-3 px-3 py-2 border-b border-gray-100 dark:border-gray-700 mb-2">
                                        <img 
                                            src={auth.user.profile_url || `https://ui-avatars.com/api/?name=${auth.user.name}&background=random`} 
                                            alt={auth.user.name}
                                            className="w-10 h-10 rounded-full border-2 border-black dark:border-white"
                                        />
                                        <div>
                                            <p className="font-bold">{auth.user.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Student</p>
                                        </div>
                                    </div>
                                    <Link href={route('dashboard')}>
                                        <Button className="w-full font-vt323 text-lg border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all bg-yellow-400 text-black">
                                            <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                                        </Button>
                                    </Link>
                                    <Link href={route('logout')} method="post" as="button" className="w-full">
                                        <Button variant="destructive" className="w-full font-vt323 text-lg border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
                                            <LogOut className="mr-2 h-4 w-4" /> Log Out
                                        </Button>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href={route('login')}>
                                        <Button variant="outline" className="w-full font-vt323 text-lg border-2 border-black dark:border-white dark:text-white dark:hover:bg-gray-800">
                                            Log In
                                        </Button>
                                    </Link>
                                    <Link href={route('register')}>
                                        <Button className="w-full font-vt323 text-lg border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all bg-blue-600 text-white">
                                            Sign Up
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
}
