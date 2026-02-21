import React, { useState, useEffect } from 'react';
import { DollarSign, Users, GraduationCap, TrendingUp } from 'lucide-react';
import { api } from '../../api';

interface Stats {
    totalStudents: number;
    totalTeachers: number;
    totalUsers: number;
}

interface FeesSummary {
    totalRevenue: number;
    pendingFees: number;
    overdueFees: number;
}

const StatCard: React.FC<{ title: string; value: string; sub?: string; icon: React.ElementType; colorClass: string }> = ({ title, value, sub, icon: Icon, colorClass }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
            <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={`p-3 rounded-lg ${colorClass}`}>
            <Icon className="h-6 w-6" />
        </div>
    </div>
);

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [fees, setFees] = useState<FeesSummary | null>(null);

    useEffect(() => {
        api.get('/stats').then(setStats).catch(console.error);
        api.get('/fees/summary').then(setFees).catch(console.error);
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Students"
                    value={stats ? stats.totalStudents.toLocaleString() : '—'}
                    icon={GraduationCap}
                    colorClass="bg-blue-50 text-blue-500"
                />
                <StatCard
                    title="Teachers"
                    value={stats ? stats.totalTeachers.toLocaleString() : '—'}
                    icon={Users}
                    colorClass="bg-green-50 text-green-500"
                />
                <StatCard
                    title="Revenue (YTD)"
                    value={fees ? `$${fees.totalRevenue.toLocaleString()}` : '—'}
                    sub={fees ? `${fees.pendingFees} pending fees` : ''}
                    icon={DollarSign}
                    colorClass="bg-yellow-50 text-yellow-500"
                />
                <StatCard
                    title="Total Users"
                    value={stats ? stats.totalUsers.toLocaleString() : '—'}
                    sub={fees ? `${fees.overdueFees} overdue fees` : ''}
                    icon={TrendingUp}
                    colorClass="bg-purple-50 text-purple-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4">Fee Status Summary</h3>
                    <div className="space-y-3">
                        {[
                            { label: 'Total Revenue (USD)', value: fees ? `$${fees.totalRevenue.toLocaleString()}` : '—', color: 'text-green-600' },
                            { label: 'Pending / Partial Fees', value: fees ? fees.pendingFees : '—', color: 'text-yellow-600' },
                            { label: 'Overdue Fees', value: fees ? fees.overdueFees : '—', color: 'text-red-600' },
                        ].map(({ label, value, color }) => (
                            <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                <p className="text-sm text-gray-700">{label}</p>
                                <p className={`text-sm font-bold ${color}`}>{value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: 'Manage Users', href: '/admin/users', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
                            { label: 'Manage Classes', href: '/admin/classes', color: 'bg-green-50 text-green-700 hover:bg-green-100' },
                            { label: 'Finance & Fees', href: '/admin/finance', color: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' },
                            { label: 'View Reports', href: '#', color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
                        ].map(({ label, href, color }) => (
                            <a key={label} href={href} className={`p-4 rounded-lg font-medium transition-colors text-center text-sm ${color}`}>{label}</a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
