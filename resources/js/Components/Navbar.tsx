import { usePage } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';
import { cn } from '@/lib/utils';
import { ChevronDown, Menu, Sun, Moon } from 'lucide-react';
import { useThemeStore } from "@/hooks/useThemeStore";
import { useState, useEffect } from "react";

interface NavbarProps {
    className?: string;
    onMenuClick?: () => void;
}

export default function Navbar({ className, onMenuClick }: NavbarProps) {
    const user = usePage().props.auth.user;
    const { theme, toggleTheme } = useThemeStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header className={cn("flex h-16 w-full items-center justify-between border-b-2 border-black dark:border-white bg-[#FDFBF7] dark:bg-gray-900 px-6 font-vt323 transition-colors duration-300", className)}>
            {/* Mobile Menu Trigger */}
            <button 
                onClick={onMenuClick}
                className="flex items-center justify-center p-2 text-black dark:text-white transition-transform active:translate-y-[2px] lg:hidden"
            >
                <Menu className="h-6 w-6" />
            </button>

            {/* Right Side: User Profile & Theme Toggle */}
            <div className="ml-auto flex items-center gap-4">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg border-2 border-transparent hover:border-black dark:hover:border-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                    aria-label="Toggle Theme"
                >
                    {mounted && theme === 'dark' ? (
                        <Sun className="w-6 h-6 text-yellow-400 fill-current" />
                    ) : (
                        <Moon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                    )}
                </button>

                <Dropdown>
                    <Dropdown.Trigger>
                        <button className="flex items-center gap-3 border-2 border-transparent px-3 py-1 transition-all duration-200 hover:border-black dark:hover:border-white hover:bg-white dark:hover:bg-gray-800 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
                            {user.profile_url ? (
                                <img 
                                    src={user.profile_url} 
                                    alt={user.name} 
                                    className="h-8 w-8 border-2 border-black dark:border-white object-cover"
                                />
                            ) : (
                                <div className="flex h-8 w-8 items-center justify-center border-2 border-black dark:border-white bg-secondary text-white">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            
                            <span className="hidden text-xl text-black dark:text-white md:block">
                                {user.name}
                            </span>
                            
                            <ChevronDown className="h-4 w-4 text-black dark:text-white" />
                        </button>
                    </Dropdown.Trigger>

                    <Dropdown.Content>
                        <Dropdown.Link href={route('profile.edit')}>
                            Profile
                        </Dropdown.Link>
                        <Dropdown.Link href={route('logout')} method="post" as="button">
                            Log Out
                        </Dropdown.Link>
                    </Dropdown.Content>
                </Dropdown>
            </div>
        </header>
    );
}
