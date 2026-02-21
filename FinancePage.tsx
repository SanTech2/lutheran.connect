import React, { useState, useEffect } from 'react';
import { Plus, X, CreditCard, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { api } from '../../api';

interface Fee {
    id: string;
    amount: number;
    currency: string;
    description: string;
    dueDate: string;
    status: string;
    student: { user: { fullName: string; email: string } };
    payments: Array<{ id: string; amount: number; currency: string; method: string; paidAt: string }>;
}

interface Student {
    id: string;
    user: { fullName: string; email: string };
}

const statusIcon: Record<string, React.ReactNode> = {
    PAID: <CheckCircle size={14} className="text-green-500" />,
    PENDING: <Clock size={14} className="text-yellow-500" />,
    PARTIAL: <CreditCard size={14} className="text-blue-500" />,
    OVERDUE: <AlertTriangle size={14} className="text-red-500" />,
};

const statusColors: Record<string, string> = {
    PAID: 'bg-green-100 text-green-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    PARTIAL: 'bg-blue-100 text-blue-800',
    OVERDUE: 'bg-red-100 text-red-800',
};

const FinancePage: React.FC = () => {
    const [fees, setFees] = useState<Fee[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [page, setPage] = useState(1);
    const [showFeeModal, setShowFeeModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState<Fee | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [feeForm, setFeeForm] = useState({ studentId: '', amount: '', currency: 'USD', description: '', dueDate: '' });
    const [paymentForm, setPaymentForm] = useState({ amount: '', currency: 'USD', method: 'CASH', transactionId: '' });
    const [formError, setFormError] = useState('');
    const LIMIT = 10;

    const fetchFees = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
            if (statusFilter !== 'ALL') params.set('status', statusFilter);
            const data = await api.get(`/fees?${params}`);
            setFees(data.fees);
            setTotal(data.total);
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    useEffect(() => { fetchFees(); }, [page, statusFilter]);

    const openFeeModal = async () => {
        if (!students.length) {
            const data = await api.get('/students?limit=200').catch(() => ({ students: [] }));
            setStudents(data.students);
        }
        setFeeForm({ studentId: '', amount: '', currency: 'USD', description: '', dueDate: '' });
        setFormError('');
        setShowFeeModal(true);
    };

    const submitFee = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        try {
            await api.post('/fees', { ...feeForm, amount: parseFloat(feeForm.amount) });
            setShowFeeModal(false);
            fetchFees();
        } catch (err: any) { setFormError(err.message); }
    };

    const submitPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        try {
            await api.post(`/fees/${showPaymentModal!.id}/payments`, { ...paymentForm, amount: parseFloat(paymentForm.amount) });
            setShowPaymentModal(null);
            fetchFees();
        } catch (err: any) { setFormError(err.message); }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Finance & Fees</h1>
                <button onClick={openFeeModal} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <Plus size={20} /> Add Fee
                </button>
            </div>

            {/* Status Filters */}
            <div className="flex gap-2 flex-wrap">
                {['ALL', 'PENDING', 'PARTIAL', 'PAID', 'OVERDUE'].map(s => (
                    <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${statusFilter === s ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{s}</button>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-400">Loading...</div>
                ) : fees.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">No fees found</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Student</th>
                                    <th className="px-6 py-4 font-medium">Description</th>
                                    <th className="px-6 py-4 font-medium">Amount</th>
                                    <th className="px-6 py-4 font-medium">Due</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {fees.map(fee => (
                                    <tr key={fee.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-gray-900">{fee.student?.user?.fullName}</p>
                                            <p className="text-xs text-gray-400">{fee.student?.user?.email}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{fee.description}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                            {fee.amount.toLocaleString()} {fee.currency}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(fee.dueDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${statusColors[fee.status]}`}>
                                                {statusIcon[fee.status]} {fee.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {fee.status !== 'PAID' && (
                                                <button onClick={() => { setPaymentForm({ amount: '', currency: 'USD', method: 'CASH', transactionId: '' }); setFormError(''); setShowPaymentModal(fee); }}
                                                    className="text-xs text-blue-600 hover:text-blue-800 font-medium">Record Payment</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                    <p>Showing {fees.length} of {total} fees</p>
                    <div className="flex gap-2">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-40">Previous</button>
                        <button onClick={() => setPage(p => p + 1)} disabled={fees.length < LIMIT} className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-40">Next</button>
                    </div>
                </div>
            </div>

            {/* Add Fee Modal */}
            {showFeeModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-lg font-bold text-gray-800">Add Fee</h2>
                            <button onClick={() => setShowFeeModal(false)}><X size={20} className="text-gray-400" /></button>
                        </div>
                        <form onSubmit={submitFee} className="p-6 space-y-4">
                            {formError && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{formError}</p>}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                                <select required value={feeForm.studentId} onChange={e => setFeeForm(f => ({ ...f, studentId: e.target.value }))}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">Select student…</option>
                                    {students.map(s => <option key={s.id} value={s.id}>{s.user.fullName}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <input required value={feeForm.description} onChange={e => setFeeForm(f => ({ ...f, description: e.target.value }))}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                                    <input required type="number" step="0.01" value={feeForm.amount} onChange={e => setFeeForm(f => ({ ...f, amount: e.target.value }))}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                                    <select value={feeForm.currency} onChange={e => setFeeForm(f => ({ ...f, currency: e.target.value }))}
                                        className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option>USD</option><option>LRD</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                <input required type="date" value={feeForm.dueDate} onChange={e => setFeeForm(f => ({ ...f, dueDate: e.target.value }))}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowFeeModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Create Fee</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Record Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">Record Payment</h2>
                                <p className="text-sm text-gray-500">{showPaymentModal.student?.user?.fullName} — {showPaymentModal.description}</p>
                            </div>
                            <button onClick={() => setShowPaymentModal(null)}><X size={20} className="text-gray-400" /></button>
                        </div>
                        <form onSubmit={submitPayment} className="p-6 space-y-4">
                            {formError && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{formError}</p>}
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                                    <input required type="number" step="0.01" value={paymentForm.amount} onChange={e => setPaymentForm(f => ({ ...f, amount: e.target.value }))}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                                    <select value={paymentForm.currency} onChange={e => setPaymentForm(f => ({ ...f, currency: e.target.value }))}
                                        className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option>USD</option><option>LRD</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                                <select value={paymentForm.method} onChange={e => setPaymentForm(f => ({ ...f, method: e.target.value }))}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="CASH">Cash</option>
                                    <option value="ORANGE_MONEY">Orange Money</option>
                                    <option value="MTN_MOMO">MTN MoMo</option>
                                </select>
                            </div>
                            {paymentForm.method !== 'CASH' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID</label>
                                    <input value={paymentForm.transactionId} onChange={e => setPaymentForm(f => ({ ...f, transactionId: e.target.value }))}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            )}
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowPaymentModal(null)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Confirm Payment</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FinancePage;
