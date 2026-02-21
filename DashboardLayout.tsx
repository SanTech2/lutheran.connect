import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X, UserCircle } from 'lucide-react';
import { useAuth } from '../AuthContext';

interface SidebarItem {
    name: string;
    path: string;
    icon: React.ElementType;
}

const DashboardLayout: React.FC<{ items: SidebarItem[], title: string }> = ({ items, title }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 bg-blue-900 text-white w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out z-30`}>
                <div className="flex items-center justify-center h-16 border-b border-blue-800">
                    <span className="text-xl font-bold">{title}</span>
                </div>

                <div className="p-4">
                    <div className="mb-6 flex items-center gap-3 px-2">
                        <div className="bg-blue-800 p-2 rounded-full">
                            <UserCircle className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="font-bold text-sm truncate">{user?.fullName}</p>
                            <p className="text-xs text-blue-300 capitalize">{user?.role}</p>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        {items.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path ? 'bg-yellow-500 text-blue-900 font-bold shadow-lg' : 'text-blue-100 hover:bg-blue-800'}`}
                            >
                                <item.icon size={20} />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="absolute bottom-0 w-full p-4 border-t border-blue-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 text-blue-200 hover:text-white w-full px-4 py-3 transition-colors"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header (Mobile) */}
                <header className="bg-white shadow-sm md:hidden h-16 flex items-center justify-between px-4">
                    <span className="font-bold text-lg text-gray-800">{items.find(i => i.path === location.pathname)?.name || 'Dashboard'}</span>
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2">
                        {isSidebarOpen ? <X /> : <Menu />}
                    </button>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-8">
                    <Outlet />
                </main>
            </div>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default DashboardLayout;
