import React, { useState, useEffect } from 'react';
import { BookOpen, Users, ClipboardList } from 'lucide-react';
import { useAuth } from '../../AuthContext';
import { api } from '../../api';

const TeacherDashboard: React.FC = () => {
    const { user } = useAuth();
    const [teacher, setTeacher] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            api.get(`/teachers/by-user/${user.id}`)
                .then(d => setTeacher(d.teacher))
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [user]);

    if (loading) return <div className="p-10 text-center text-gray-400">Loading...</div>;

    const totalStudents = teacher?.classes?.reduce((sum: number, c: any) => sum + (c.students?.length || 0), 0) ?? 0;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.fullName}</h1>
                <p className="text-gray-500 text-sm">Here's your teaching overview</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg"><BookOpen className="h-6 w-6 text-blue-600" /></div>
                    <div>
                        <p className="text-sm text-gray-500">My Classes</p>
                        <p className="text-2xl font-bold text-gray-900">{teacher?.classes?.length ?? 0}</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-green-50 p-3 rounded-lg"><Users className="h-6 w-6 text-green-600" /></div>
                    <div>
                        <p className="text-sm text-gray-500">Total Students</p>
                        <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-purple-50 p-3 rounded-lg"><ClipboardList className="h-6 w-6 text-purple-600" /></div>
                    <div>
                        <p className="text-sm text-gray-500">Subjects</p>
                        <p className="text-2xl font-bold text-gray-900">{teacher?.subjects?.length ?? 0}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-bold text-gray-800 mb-4">My Classes</h2>
                {!teacher?.classes?.length ? (
                    <p className="text-gray-400 text-sm">No classes assigned yet.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {teacher.classes.map((c: any) => (
                            <div key={c.id} className="border border-gray-100 rounded-lg p-4 hover:border-blue-200 transition-colors">
                                <h3 className="font-semibold text-gray-900">{c.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">{c.students?.length ?? 0} students enrolled</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherDashboard;
