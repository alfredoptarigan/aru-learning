import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { cn } from '@/lib/utils';
import { Home, BookOpen, Settings, LayoutGrid } from 'lucide-react';

interface SidebarProps {
    className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
    const { url } = usePage();

    const links = [
        { name: 'Dashboard', href: route('dashboard'), icon: Home },
        // Placeholder links for now
        // { name: 'My Courses', href: '#', icon: BookOpen },
        // { name: 'All Courses', href: '#', icon: LayoutGrid },
        // { name: 'Settings', href: route('profile.edit'), icon: Settings },
    ];

    return (
        <aside className={cn("flex h-full w-64 flex-col border-r-2 border-black bg-[#FDFBF7] font-vt323 transition-all duration-300", className)}>
            {/* Logo Area */}
            <div className="flex h-16 items-center justify-center border-b-2 border-black px-4">
                <Link href="/" className="flex items-center gap-2">
                    <ApplicationLogo className="h-8 w-8 fill-current text-primary" />
                    <span className="text-2xl font-bold tracking-widest text-black">PIXEL.EDU</span>
                </Link>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 space-y-2 p-4">
                {links.map((link) => {
                    const isActive = url.startsWith(link.href) && link.href !== '#' ? true : false;
                    
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 border-2 border-transparent px-4 py-3 text-xl transition-all duration-200",
                                isActive 
                                    ? "border-black bg-primary text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
                                    : "text-gray-600 hover:border-black hover:text-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                            )}
                        >
                            <link.icon className="h-6 w-6" />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / Info Area */}
            <div className="border-t-2 border-black p-4 text-center text-sm text-gray-500">
                <p>&copy; 2026 Pixel Edu</p>
            </div>
        </aside>
    );
}
