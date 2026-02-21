import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle, Save } from 'lucide-react';
import { useAuth } from '../../AuthContext';
import { api } from '../../api';

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

const STATUS_CONFIG: Record<AttendanceStatus, { label: string; icon: React.ElementType; color: string; activeColor: string }> = {
    PRESENT: { label: 'Present', icon: CheckCircle, color: 'text-gray-400 hover:text-green-500', activeColor: 'text-green-600 bg-green-50' },
    ABSENT: { label: 'Absent', icon: XCircle, color: 'text-gray-400 hover:text-red-500', activeColor: 'text-red-600 bg-red-50' },
    LATE: { label: 'Late', icon: Clock, color: 'text-gray-400 hover:text-yellow-500', activeColor: 'text-yellow-600 bg-yellow-50' },
    EXCUSED: { label: 'Excused', icon: AlertCircle, color: 'text-gray-400 hover:text-blue-500', activeColor: 'text-blue-600 bg-blue-50' },
};

const AttendancePage: React.FC = () => {
    const { user } = useAuth();
    const [classes, setClasses] = useState<any[]>([]);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [students, setStudents] = useState<any[]>([]);
    const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
    const [existingRecords, setExistingRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (user?.id) {
            api.get(`/teachers/by-user/${user.id}`)
                .then(d => setClasses(d.teacher?.classes || []))
                .catch(console.error);
        }
    }, [user]);

    useEffect(() => {
        if (!selectedClassId) return;
        setLoading(true);
        setSaved(false);
        api.get(`/attendance/class/${selectedClassId}?date=${date}`)
            .then(d => {
                setStudents(d.students || []);
                setExistingRecords(d.attendanceRecords || []);
                const init: Record<string, AttendanceStatus> = {};
                d.students?.forEach((s: any) => {
                    const rec = d.attendanceRecords?.find((r: any) => r.studentId === s.id);
                    init[s.id] = rec ? rec.status : 'PRESENT';
                });
                setAttendance(init);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [selectedClassId, date]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const records = students.map(s => ({ studentId: s.id, date, status: attendance[s.id] || 'PRESENT' }));
            await api.post('/attendance/bulk', { records });
            setSaved(true);
        } catch (e) { console.error(e); } finally { setSaving(false); }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Mark Attendance</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Class</label>
                        <select value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Choose a class…</option>
                            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>
            </div>

            {selectedClassId && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="p-10 text-center text-gray-400">Loading students…</div>
                    ) : students.length === 0 ? (
                        <div className="p-10 text-center text-gray-400">No students in this class.</div>
                    ) : (
                        <>
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-700">{students.length} students</p>
                                <div className="flex gap-3">
                                    <button onClick={() => { const a: Record<string, AttendanceStatus> = {}; students.forEach(s => a[s.id] = 'PRESENT'); setAttendance(a); }}
                                        className="text-xs text-green-600 hover:underline font-medium">Mark All Present</button>
                                    <button onClick={() => { const a: Record<string, AttendanceStatus> = {}; students.forEach(s => a[s.id] = 'ABSENT'); setAttendance(a); }}
                                        className="text-xs text-red-600 hover:underline font-medium">Mark All Absent</button>
                                </div>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {students.map((s, i) => {
                                    const status = attendance[s.id] || 'PRESENT';
                                    return (
                                        <div key={s.id} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm text-gray-400 w-6">{i + 1}.</span>
                                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                                                    {s.user?.fullName?.charAt(0).toUpperCase()}
                                                </div>
                                                <p className="text-sm font-medium text-gray-900">{s.user?.fullName}</p>
                                            </div>
                                            <div className="flex gap-1">
                                                {(Object.keys(STATUS_CONFIG) as AttendanceStatus[]).map(st => {
                                                    const cfg = STATUS_CONFIG[st];
                                                    const Icon = cfg.icon;
                                                    const active = status === st;
                                                    return (
                                                        <button key={st} title={cfg.label} onClick={() => setAttendance(a => ({ ...a, [s.id]: st }))}
                                                            className={`p-2 rounded-lg transition-colors ${active ? cfg.activeColor : cfg.color}`}>
                                                            <Icon size={18} />
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="p-4 border-t border-gray-100 flex justify-end">
                                <button onClick={handleSave} disabled={saving}
                                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${saved ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'} disabled:opacity-60`}>
                                    <Save size={18} />
                                    {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Attendance'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default AttendancePage;
