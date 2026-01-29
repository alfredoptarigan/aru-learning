import { Link } from "@inertiajs/react";
import { Gamepad2, Heart, Instagram, Twitter, Youtube, Github } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white border-t-4 border-black pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-blue-500 border-2 border-white shadow-[2px_2px_0px_0px_#ffffff] flex items-center justify-center text-white">
                                <Gamepad2 className="w-6 h-6" />
                            </div>
                            <span className="font-vt323 text-3xl font-bold tracking-wider text-white">
                                ARU<span className="text-blue-400">Learning</span>
                            </span>
                        </Link>
                        <p className="font-vt323 text-lg text-gray-400 leading-relaxed">
                            Upgrade your skills with a retro-futuristic learning experience. Build your dream career today.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-vt323 text-2xl font-bold mb-6 text-yellow-400">Start Learning</h4>
                        <ul className="space-y-3 font-vt323 text-xl text-gray-400">
                            <li><Link href="#" className="hover:text-white hover:underline decoration-blue-500">Web Development</Link></li>
                            <li><Link href="#" className="hover:text-white hover:underline decoration-blue-500">UI/UX Design</Link></li>
                            <li><Link href="#" className="hover:text-white hover:underline decoration-blue-500">Game Dev</Link></li>
                            <li><Link href="#" className="hover:text-white hover:underline decoration-blue-500">Data Science</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-vt323 text-2xl font-bold mb-6 text-green-400">Resources</h4>
                        <ul className="space-y-3 font-vt323 text-xl text-gray-400">
                            <li><Link href="#" className="hover:text-white hover:underline decoration-blue-500">Flash Sale</Link></li>
                            <li><Link href="#" className="hover:text-white hover:underline decoration-blue-500">Success Stories</Link></li>
                            <li><Link href="#" className="hover:text-white hover:underline decoration-blue-500">Career Handbook</Link></li>
                            <li><Link href="#" className="hover:text-white hover:underline decoration-blue-500">Become a Mentor</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-vt323 text-2xl font-bold mb-6 text-pink-400">Stay Updated</h4>
                        <p className="font-vt323 text-lg text-gray-400 mb-4">
                            Get the latest updates and promo codes directly to your inbox.
                        </p>
                        <div className="flex gap-2">
                            <input 
                                type="email" 
                                placeholder="Email Address" 
                                className="w-full bg-gray-800 border-2 border-gray-600 px-3 py-2 font-vt323 text-lg focus:outline-none focus:border-blue-500 text-white"
                            />
                            <button className="bg-blue-600 border-2 border-white text-white px-4 font-vt323 text-xl hover:bg-blue-700">
                                JOIN
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="font-vt323 text-lg text-gray-500">
                        &copy; 2024 ARU Learning. Made with <Heart className="w-4 h-4 text-red-500 inline fill-red-500" /> in Indonesia.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-gray-400 hover:text-white"><Instagram className="w-6 h-6" /></a>
                        <a href="#" className="text-gray-400 hover:text-white"><Twitter className="w-6 h-6" /></a>
                        <a href="#" className="text-gray-400 hover:text-white"><Youtube className="w-6 h-6" /></a>
                        <a href="#" className="text-gray-400 hover:text-white"><Github className="w-6 h-6" /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
