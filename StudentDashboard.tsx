import React, { useState, useEffect } from 'react';
import { GraduationCap, Calendar, DollarSign } from 'lucide-react';
import { useAuth } from '../../AuthContext';
import { api } from '../../api';

const StudentDashboard: React.FC = () => {
    const { user } = useAuth();
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            api.get(`/students/by-user/${user.id}`)
                .then(d => setStudent(d.student))
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [user]);

    if (loading) return <div className="p-10 text-center text-gray-400">Loading…</div>;
    if (!student) return <div className="p-10 text-center text-gray-400">No student profile found.</div>;

    // Attendance summary
    const attendanceRecords = student.attendance || [];
    const presentCount = attendanceRecords.filter((a: any) => a.status === 'PRESENT').length;
    const attendancePct = attendanceRecords.length ? Math.round((presentCount / attendanceRecords.length) * 100) : null;

    // GPA estimate
    const grades = student.grades || [];
    const avgScore = grades.length
        ? Math.round(grades.reduce((sum: number, g: any) => sum + (g.score / g.maxScore) * 100, 0) / grades.length)
        : null;

    // Outstanding fees
    const outstandingFees = (student.fees || []).filter((f: any) => f.status !== 'PAID');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.fullName}</h1>
                <p className="text-gray-500 text-sm">{student.class?.name || 'No class assigned'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg"><GraduationCap className="h-6 w-6 text-blue-600" /></div>
                    <div>
                        <p className="text-sm text-gray-500">Avg Score</p>
                        <p className="text-2xl font-bold text-gray-900">{avgScore !== null ? `${avgScore}%` : '—'}</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-green-50 p-3 rounded-lg"><Calendar className="h-6 w-6 text-green-600" /></div>
                    <div>
                        <p className="text-sm text-gray-500">Attendance</p>
                        <p className="text-2xl font-bold text-gray-900">{attendancePct !== null ? `${attendancePct}%` : '—'}</p>
                        <p className="text-xs text-gray-400">{attendanceRecords.length} days recorded</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${outstandingFees.length ? 'bg-red-50' : 'bg-green-50'}`}>
                        <DollarSign className={`h-6 w-6 ${outstandingFees.length ? 'text-red-600' : 'text-green-600'}`} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Outstanding Fees</p>
                        <p className="text-2xl font-bold text-gray-900">{outstandingFees.length}</p>
                    </div>
                </div>
            </div>

            {grades.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-bold text-gray-800 mb-4">Recent Grades</h2>
                    <div className="space-y-2">
                        {grades.slice(0, 5).map((g: any) => {
                            const pct = Math.round((g.score / g.maxScore) * 100);
                            return (
                                <div key={g.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{g.subject?.name}</p>
                                        <p className="text-xs text-gray-400">{g.type} · {g.term}</p>
                                    </div>
                                    <span className={`text-sm font-bold px-2 py-1 rounded-full ${pct >= 70 ? 'text-green-700 bg-green-100' : pct >= 50 ? 'text-yellow-700 bg-yellow-100' : 'text-red-700 bg-red-100'}`}>
                                        {g.score}/{g.maxScore}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
