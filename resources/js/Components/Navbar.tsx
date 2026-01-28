import { usePage } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';
import { cn } from '@/lib/utils';
import { ChevronDown, Menu } from 'lucide-react';

interface NavbarProps {
    className?: string;
    onMenuClick?: () => void;
}

export default function Navbar({ className, onMenuClick }: NavbarProps) {
    const user = usePage().props.auth.user;

    return (
        <header className={cn("flex h-16 w-full items-center justify-between border-b-2 border-black bg-[#FDFBF7] px-6 font-vt323", className)}>
            {/* Mobile Menu Trigger */}
            <button 
                onClick={onMenuClick}
                className="flex items-center justify-center p-2 text-black transition-transform active:translate-y-[2px] lg:hidden"
            >
                <Menu className="h-6 w-6" />
            </button>

            {/* Right Side: User Profile */}
            <div className="ml-auto flex items-center">
                <Dropdown>
                    <Dropdown.Trigger>
                        <button className="flex items-center gap-3 border-2 border-transparent px-3 py-1 transition-all duration-200 hover:border-black hover:bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
                            {user.profile_url ? (
                                <img 
                                    src={user.profile_url} 
                                    alt={user.name} 
                                    className="h-8 w-8 border-2 border-black object-cover"
                                />
                            ) : (
                                <div className="flex h-8 w-8 items-center justify-center border-2 border-black bg-secondary text-white">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            
                            <span className="hidden text-xl text-black md:block">
                                {user.name}
                            </span>
                            
                            <ChevronDown className="h-4 w-4 text-black" />
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
