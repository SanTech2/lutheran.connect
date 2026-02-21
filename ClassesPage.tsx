import React, { useState, useEffect } from 'react';
import { Plus, X, Users } from 'lucide-react';
import { api } from '../../api';

interface Teacher {
    id: string;
    user: { fullName: string };
}

interface SchoolClass {
    id: string;
    name: string;
    teacher?: { user: { fullName: string } };
    _count: { students: number };
}

const ClassesPage: React.FC = () => {
    const [classes, setClasses] = useState<SchoolClass[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editClass, setEditClass] = useState<SchoolClass | null>(null);
    const [form, setForm] = useState({ name: '', teacherId: '' });
    const [formError, setFormError] = useState('');

    const fetchClasses = async () => {
        setLoading(true);
        try { const data = await api.get('/classes'); setClasses(data.classes); }
        catch (e) { console.error(e); } finally { setLoading(false); }
    };

    useEffect(() => { fetchClasses(); }, []);

    const openAdd = async () => {
        if (!teachers.length) {
            api.get('/teachers').then(d => setTeachers(d.teachers)).catch(() => {});
        }
        setEditClass(null);
        setForm({ name: '', teacherId: '' });
        setFormError('');
        setShowModal(true);
    };

    const openEdit = (c: SchoolClass) => {
        if (!teachers.length) {
            api.get('/teachers').then(d => setTeachers(d.teachers)).catch(() => {});
        }
        setEditClass(c);
        setForm({ name: c.name, teacherId: '' });
        setFormError('');
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        try {
            if (editClass) {
                await api.put(`/classes/${editClass.id}`, form);
            } else {
                await api.post('/classes', form);
            }
            setShowModal(false);
            fetchClasses();
        } catch (err: any) { setFormError(err.message); }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Classes</h1>
                <button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <Plus size={20} /> Add Class
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-400">Loading…</div>
            ) : classes.length === 0 ? (
                <div className="text-center py-12 text-gray-400">No classes yet. Add one to get started.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {classes.map(c => (
                        <div key={c.id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-gray-900 text-lg">{c.name}</h3>
                                <button onClick={() => openEdit(c)} className="text-xs text-blue-600 hover:underline">Edit</button>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                    <Users size={14} />
                                    {c._count.students} student{c._count.students !== 1 ? 's' : ''}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Teacher: <span className="font-medium text-gray-700">{c.teacher?.user?.fullName || 'Unassigned'}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-lg font-bold text-gray-800">{editClass ? 'Edit Class' : 'Add Class'}</h2>
                            <button onClick={() => setShowModal(false)}><X size={20} className="text-gray-400" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {formError && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{formError}</p>}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
                                <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="e.g. Grade 10A"
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Assign Teacher (optional)</label>
                                <select value={form.teacherId} onChange={e => setForm(f => ({ ...f, teacherId: e.target.value }))}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">— None —</option>
                                    {teachers.map(t => <option key={t.id} value={t.id}>{t.user.fullName}</option>)}
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{editClass ? 'Save' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassesPage;
