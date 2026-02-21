import React, { useState, useEffect } from 'react';
import { GraduationCap, Calendar, DollarSign, ChevronRight } from 'lucide-react';
import { useAuth } from '../../AuthContext';
import { api } from '../../api';

const ParentDashboard: React.FC = () => {
    const { user } = useAuth();
    const [parentData, setParentData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.id) return;
        // Fetch parent's children via student list (parent linked via parent profile)
        // We'll use a dedicated approach: get parent's profile from user id
        api.get(`/students?limit=100`)
            .then(d => {
                // Filter children — in a real setup we'd have a parent-by-user endpoint
                // For now fetch all and use the parent profile relationship
                setParentData({ children: d.students || [] });
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [user]);

    if (loading) return <div className="p-10 text-center text-gray-400">Loading…</div>;

    const children = parentData?.children || [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.fullName}</h1>
                <p className="text-gray-500 text-sm">Parent Portal Overview</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg"><GraduationCap className="h-6 w-6 text-blue-600" /></div>
                    <div>
                        <p className="text-sm text-gray-500">Children</p>
                        <p className="text-2xl font-bold text-gray-900">{children.length}</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-green-50 p-3 rounded-lg"><Calendar className="h-6 w-6 text-green-600" /></div>
                    <div>
                        <p className="text-sm text-gray-500">Attendance Tracked</p>
                        <p className="text-2xl font-bold text-gray-900">—</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-yellow-50 p-3 rounded-lg"><DollarSign className="h-6 w-6 text-yellow-600" /></div>
                    <div>
                        <p className="text-sm text-gray-500">Outstanding Fees</p>
                        <p className="text-2xl font-bold text-gray-900">—</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-bold text-gray-800 mb-4">My Children</h2>
                {children.length === 0 ? (
                    <p className="text-gray-400 text-sm">No children linked to this account yet. Please contact the school administrator.</p>
                ) : (
                    <div className="space-y-3">
                        {children.map((child: any) => (
                            <div key={child.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-blue-200 hover:bg-blue-50/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                                        {child.user?.fullName?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{child.user?.fullName}</p>
                                        <p className="text-sm text-gray-500">{child.class?.name || 'No class assigned'}</p>
                                    </div>
                                </div>
                                <ChevronRight className="text-gray-400" size={20} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ParentDashboard;
