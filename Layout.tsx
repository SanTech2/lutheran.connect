import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Menu, X, GraduationCap, Phone, BookOpen, User } from 'lucide-react';

const Layout: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen font-sans text-gray-800">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="bg-blue-900 p-2 rounded-lg group-hover:bg-blue-800 transition-colors">
                                <GraduationCap className="h-8 w-8 text-yellow-400" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-xl text-blue-900 leading-tight">LISS</span>
                                <span className="text-xs text-blue-600 font-medium tracking-wide">LUTHERAN INTERNATIONAL SCHOOL SYSTEM</span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-8">
                            <Link to="/" className="text-gray-600 hover:text-blue-900 font-medium transition-colors">Home</Link>
                            <Link to="/about" className="text-gray-600 hover:text-blue-900 font-medium transition-colors">About</Link>
                            <Link to="/academics" className="text-gray-600 hover:text-blue-900 font-medium transition-colors">Academics</Link>
                            <Link to="/admissions" className="text-gray-600 hover:text-blue-900 font-medium transition-colors">Admissions</Link>
                            <Link to="/contact" className="text-gray-600 hover:text-blue-900 font-medium transition-colors">Contact</Link>

                            <Link
                                to="/login"
                                className="bg-blue-900 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/20 flex items-center gap-2"
                            >
                                <User size={18} />
                                Portal
                            </Link>
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-gray-600 hover:text-blue-900"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t">
                        <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                            <Link to="/" className="text-lg font-medium text-gray-800 py-2 border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>Home</Link>
                            <Link to="/about" className="text-lg font-medium text-gray-800 py-2 border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>About</Link>
                            <Link to="/academics" className="text-lg font-medium text-gray-800 py-2 border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>Academics</Link>
                            <Link to="/admissions" className="text-lg font-medium text-gray-800 py-2 border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>Admissions</Link>
                            <Link to="/contact" className="text-lg font-medium text-gray-800 py-2 border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                            <Link to="/login" className="text-lg font-medium text-blue-900 py-2" onClick={() => setIsMenuOpen(false)}>Portal Login</Link>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-grow">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white pt-16 pb-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-blue-800 p-2 rounded-lg">
                                    <GraduationCap className="h-6 w-6 text-yellow-400" />
                                </div>
                                <span className="font-bold text-lg text-white">LISS</span>
                            </div>
                            <p className="text-gray-400 leading-relaxed mb-6">
                                Empowering students with knowledge, faith, and character for a brighter future in Liberia and beyond.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-6 text-yellow-400">Quick Links</h3>
                            <ul className="space-y-4">
                                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">Our History</Link></li>
                                <li><Link to="/academics" className="text-gray-400 hover:text-white transition-colors">Curriculum</Link></li>
                                <li><Link to="/admissions" className="text-gray-400 hover:text-white transition-colors">Admissions</Link></li>
                                <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-6 text-yellow-400">Contact</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <Phone size={20} className="text-blue-400 mt-1" />
                                    <span className="text-gray-400">Monrovia, Liberia<br />(+231) 880-000-000</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <BookOpen size={20} className="text-blue-400 mt-1" />
                                    <span className="text-gray-400">Mon - Fri: 7:30 AM - 4:00 PM</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-6 text-yellow-400">Newsletter</h3>
                            <p className="text-gray-400 mb-4">Subscribe for school updates.</p>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    className="bg-gray-800 text-white px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-medium transition-colors">
                                    Go
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-500 text-sm">© 2025 Lutheran International School System. All rights reserved.</p>
                        <div className="flex gap-6">
                            <a href="#" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="text-gray-500 hover:text-white transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
