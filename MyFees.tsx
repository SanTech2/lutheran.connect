import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertTriangle, CreditCard } from 'lucide-react';
import { useAuth } from '../../AuthContext';
import { api } from '../../api';

const STATUS_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
    PAID: { icon: CheckCircle, color: 'text-green-700', bg: 'bg-green-100' },
    PENDING: { icon: Clock, color: 'text-yellow-700', bg: 'bg-yellow-100' },
    PARTIAL: { icon: CreditCard, color: 'text-blue-700', bg: 'bg-blue-100' },
    OVERDUE: { icon: AlertTriangle, color: 'text-red-700', bg: 'bg-red-100' },
};

const MyFees: React.FC = () => {
    const { user } = useAuth();
    const [fees, setFees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.id) return;
        api.get(`/students/by-user/${user.id}`)
            .then(d => api.get(`/fees/student/${d.student?.id}`))
            .then(d => setFees(d.fees || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [user]);

    if (loading) return <div className="p-10 text-center text-gray-400">Loading…</div>;

    const outstanding = fees.filter(f => f.status !== 'PAID');
    const paid = fees.filter(f => f.status === 'PAID');

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">My Fees</h1>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
                    <p className="text-2xl font-bold text-red-600">{outstanding.length}</p>
                    <p className="text-sm text-gray-500 mt-1">Outstanding</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
                    <p className="text-2xl font-bold text-green-600">{paid.length}</p>
                    <p className="text-sm text-gray-500 mt-1">Paid</p>
                </div>
            </div>

            {fees.length === 0 ? (
                <div className="bg-white rounded-xl p-10 text-center text-gray-400 shadow-sm border border-gray-100">No fee records found.</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-4 font-medium">Description</th>
                                <th className="px-6 py-4 font-medium">Amount</th>
                                <th className="px-6 py-4 font-medium">Due Date</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {fees.map(fee => {
                                const cfg = STATUS_CONFIG[fee.status] || STATUS_CONFIG.PENDING;
                                const Icon = cfg.icon;
                                return (
                                    <tr key={fee.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{fee.description}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700 font-semibold">
                                            {fee.amount.toLocaleString()} {fee.currency}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(fee.dueDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>
                                                <Icon size={12} /> {fee.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyFees;
