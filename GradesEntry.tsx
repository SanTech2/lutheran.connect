import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useAuth } from '../../AuthContext';
import { api } from '../../api';

const TERMS = ['Term 1', 'Term 2', 'Term 3'];
const TYPES = ['Homework', 'Quiz', 'Midterm', 'Final', 'Project'];

const GradesEntry: React.FC = () => {
    const { user } = useAuth();
    const [teacher, setTeacher] = useState<any>(null);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [term, setTerm] = useState('Term 1');
    const [type, setType] = useState('Quiz');
    const [maxScore, setMaxScore] = useState('100');
    const [students, setStudents] = useState<any[]>([]);
    const [scores, setScores] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user?.id) {
            api.get(`/teachers/by-user/${user.id}`)
                .then(d => setTeacher(d.teacher))
                .catch(console.error);
        }
    }, [user]);

    useEffect(() => {
        if (!selectedClassId) { setStudents([]); setScores({}); return; }
        setLoading(true);
        api.get(`/classes/${selectedClassId}/students`)
            .then(d => {
                setStudents(d.students || []);
                const init: Record<string, string> = {};
                d.students?.forEach((s: any) => { init[s.id] = ''; });
                setScores(init);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [selectedClassId]);

    const handleSave = async () => {
        const filled = students.filter(s => scores[s.id] !== '' && scores[s.id] !== undefined);
        if (!filled.length) { setError('Enter at least one score.'); return; }
        if (!selectedSubjectId) { setError('Please select a subject.'); return; }
        setError('');
        setSaving(true);
        try {
            await Promise.all(filled.map(s =>
                api.post('/grades', {
                    studentId: s.id,
                    subjectId: selectedSubjectId,
                    score: parseFloat(scores[s.id]),
                    maxScore: parseFloat(maxScore),
                    term,
                    type,
                })
            ));
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (e: any) { setError(e.message); } finally { setSaving(false); }
    };

    const classes = teacher?.classes || [];
    const subjects = teacher?.subjects || [];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Grade Entry</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                        <select value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Select class…</option>
                            {classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                        <select value={selectedSubjectId} onChange={e => setSelectedSubjectId(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Select subject…</option>
                            {subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Term</label>
                        <select value={term} onChange={e => setTerm(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            {TERMS.map(t => <option key={t}>{t}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select value={type} onChange={e => setType(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            {TYPES.map(t => <option key={t}>{t}</option>)}
                        </select>
                    </div>
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Score</label>
                    <input type="number" value={maxScore} onChange={e => setMaxScore(e.target.value)}
                        className="w-32 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">#</th>
                                        <th className="px-6 py-4 font-medium">Student</th>
                                        <th className="px-6 py-4 font-medium">Score (out of {maxScore})</th>
                                        <th className="px-6 py-4 font-medium">%</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {students.map((s, i) => {
                                        const pct = scores[s.id] && maxScore ? Math.round((parseFloat(scores[s.id]) / parseFloat(maxScore)) * 100) : null;
                                        return (
                                            <tr key={s.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-3 text-sm text-gray-400">{i + 1}</td>
                                                <td className="px-6 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold">
                                                            {s.user?.fullName?.charAt(0)}
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-900">{s.user?.fullName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3">
                                                    <input
                                                        type="number" min="0" max={maxScore}
                                                        value={scores[s.id] ?? ''}
                                                        onChange={e => setScores(sc => ({ ...sc, [s.id]: e.target.value }))}
                                                        placeholder="—"
                                                        className="w-24 border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="px-6 py-3 text-sm font-medium">
                                                    {pct !== null ? (
                                                        <span className={pct >= 70 ? 'text-green-600' : pct >= 50 ? 'text-yellow-600' : 'text-red-600'}>{pct}%</span>
                                                    ) : <span className="text-gray-300">—</span>}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {error && <p className="text-sm text-red-600 px-6 py-2">{error}</p>}
                            <div className="p-4 border-t border-gray-100 flex justify-end">
                                <button onClick={handleSave} disabled={saving}
                                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${saved ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'} disabled:opacity-60`}>
                                    <Save size={18} />
                                    {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Grades'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default GradesEntry;
