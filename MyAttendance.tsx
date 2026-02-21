import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { api } from '../../api';

const STATUS_STYLES: Record<string, string> = {
    PRESENT: 'bg-green-500',
    ABSENT: 'bg-red-500',
    LATE: 'bg-yellow-500',
    EXCUSED: 'bg-blue-500',
};

const MyAttendance: React.FC = () => {
    const { user } = useAuth();
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.id) return;
        api.get(`/students/by-user/${user.id}`)
            .then(d => api.get(`/attendance/student/${d.student?.id}`))
            .then(d => setRecords(d.records || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [user]);

    if (loading) return <div className="p-10 text-center text-gray-400">Loading…</div>;

    const counts = records.reduce((acc: Record<string, number>, r: any) => {
        acc[r.status] = (acc[r.status] || 0) + 1;
        return acc;
    }, {});
    const pct = records.length ? Math.round(((counts.PRESENT || 0) / records.length) * 100) : null;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">My Attendance</h1>

            {/* Summary pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Object.entries({ PRESENT: 'green', ABSENT: 'red', LATE: 'yellow', EXCUSED: 'blue' }).map(([status, color]) => (
                    <div key={status} className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center`}>
                        <p className="text-2xl font-bold text-gray-900">{counts[status] || 0}</p>
                        <p className={`text-xs font-medium mt-1 text-${color}-600`}>{status}</p>
                    </div>
                ))}
            </div>

            {pct !== null && (
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Attendance Rate</span>
                        <span className={`text-sm font-bold ${pct >= 80 ? 'text-green-600' : pct >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>{pct}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full">
                        <div className={`h-2.5 rounded-full transition-all ${pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${pct}%` }} />
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <h2 className="font-bold text-gray-800">Attendance History</h2>
                </div>
                {records.length === 0 ? (
                    <div className="p-10 text-center text-gray-400">No attendance records yet.</div>
                ) : (
                    <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                        {records.map((r: any) => (
                            <div key={r.id} className="flex items-center justify-between px-6 py-3">
                                <p className="text-sm text-gray-700">{new Date(r.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-white ${STATUS_STYLES[r.status] || 'bg-gray-400'}`}>
                                    {r.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyAttendance;
