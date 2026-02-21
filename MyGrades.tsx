import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { api } from '../../api';

const MyGrades: React.FC = () => {
    const { user } = useAuth();
    const [grades, setGrades] = useState<any[]>([]);
    const [studentId, setStudentId] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedTerm, setSelectedTerm] = useState('ALL');

    useEffect(() => {
        if (!user?.id) return;
        api.get(`/students/by-user/${user.id}`)
            .then(d => {
                const sid = d.student?.id;
                setStudentId(sid);
                return api.get(`/grades/student/${sid}`);
            })
            .then(d => setGrades(d.grades || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [user]);

    // Group by subject
    const terms = ['ALL', ...Array.from(new Set(grades.map((g: any) => g.term)))];
    const filtered = selectedTerm === 'ALL' ? grades : grades.filter(g => g.term === selectedTerm);

    const bySubject = filtered.reduce((acc: Record<string, any[]>, g: any) => {
        const subj = g.subject?.name || 'Unknown';
        if (!acc[subj]) acc[subj] = [];
        acc[subj].push(g);
        return acc;
    }, {});

    if (loading) return <div className="p-10 text-center text-gray-400">Loading…</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">My Grades</h1>
                <div className="flex gap-2 flex-wrap">
                    {terms.map(t => (
                        <button key={t} onClick={() => setSelectedTerm(t)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${selectedTerm === t ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {Object.keys(bySubject).length === 0 ? (
                <div className="bg-white rounded-xl p-10 text-center text-gray-400 shadow-sm border border-gray-100">No grades recorded yet.</div>
            ) : (
                Object.entries(bySubject).map(([subject, subjectGrades]) => {
                    const avg = Math.round(subjectGrades.reduce((s, g) => s + (g.score / g.maxScore) * 100, 0) / subjectGrades.length);
                    return (
                        <div key={subject} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                <h3 className="font-bold text-gray-800">{subject}</h3>
                                <span className={`text-sm font-bold px-3 py-1 rounded-full ${avg >= 70 ? 'bg-green-100 text-green-700' : avg >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                    Avg: {avg}%
                                </span>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">Type</th>
                                        <th className="px-6 py-3 font-medium">Term</th>
                                        <th className="px-6 py-3 font-medium">Score</th>
                                        <th className="px-6 py-3 font-medium">%</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {subjectGrades.map((g: any) => {
                                        const pct = Math.round((g.score / g.maxScore) * 100);
                                        return (
                                            <tr key={g.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-3 text-sm text-gray-700">{g.type}</td>
                                                <td className="px-6 py-3 text-sm text-gray-500">{g.term}</td>
                                                <td className="px-6 py-3 text-sm font-medium text-gray-900">{g.score}/{g.maxScore}</td>
                                                <td className="px-6 py-3 text-sm font-bold">
                                                    <span className={pct >= 70 ? 'text-green-600' : pct >= 50 ? 'text-yellow-600' : 'text-red-600'}>{pct}%</span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default MyGrades;
