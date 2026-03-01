import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import {
    AlertCircle,
    CreditCard,
    History,
    CheckCircle,
    ArrowRight,
    TrendingUp,
    Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const StudentFines = () => {
    const { user } = useAuth();
    const [fines, setFines] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFines();
    }, []);

    const fetchFines = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/fine/my-fines`);
            setFines(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const totalFine = fines.reduce((sum, f) => sum + f.amount, 0);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight leading-8">My Penalty Wallet</h2>
                    <p className="text-slate-500 font-medium mt-1">Track your fine history and clear outstanding dues</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="glass-card p-8 border-l-4 border-l-rose-500 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <CreditCard size={100} />
                    </div>
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Total Outstanding</p>
                            <h3 className="text-4xl font-black text-rose-400 tracking-tight">₹{totalFine}</h3>
                        </div>
                        <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 group-hover:scale-110 transition-transform">
                            <AlertCircle size={32} />
                        </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-white/5">
                        <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                            Students with more than ₹500 outstanding will be blocked from Exam Registration.
                        </p>
                    </div>
                </div>

                <div className="glass-card p-8 border-l-4 border-l-blue-500 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp size={100} />
                    </div>
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Fine Events</p>
                            <h3 className="text-4xl font-black text-blue-400 tracking-tight">{fines.length}</h3>
                        </div>
                        <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                            <History size={32} />
                        </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-2 group cursor-pointer hover:text-white transition-colors">
                        <span className="text-xs font-bold text-slate-500 group-hover:text-white">Review Full Report</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>

            <div className="glass-card p-0 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/5 text-slate-400">
                        <Clock size={18} />
                    </div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Transaction History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-[10px] uppercase text-slate-500 tracking-widest bg-white/2">
                            <tr className="border-b border-white/5">
                                <th className="px-8 py-5 font-bold">Penalty Reason</th>
                                <th className="px-8 py-5 font-bold">Status Type</th>
                                <th className="px-8 py-5 font-bold">Issue Date</th>
                                <th className="px-8 py-5 font-bold text-right">Penalty Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {fines.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-60">
                                            <CheckCircle size={48} className="text-emerald-500" />
                                            <p className="text-slate-400 font-medium italic">Wallet is clear. No active penalties found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : fines.map((fine, i) => (
                                <tr key={i} className="hover:bg-white/5 transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-1.5 rounded-md ${fine.autoGenerated ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                                <AlertCircle size={14} />
                                            </div>
                                            <span className="text-sm font-bold text-slate-200">{fine.reason}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase border ${fine.autoGenerated
                                            ? 'border-rose-500/20 bg-rose-500/10 text-rose-400'
                                            : 'border-amber-500/20 bg-amber-500/10 text-amber-400'
                                            }`}>
                                            {fine.autoGenerated ? 'System Defined' : 'Adhoc Penalty'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-slate-500 font-medium">
                                        {new Date(fine.date).toLocaleDateString(undefined, {
                                            month: 'short',
                                            day: '2-digit',
                                            year: 'numeric'
                                        })}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <span className="text-lg font-black text-rose-400 tracking-tighter">₹{fine.amount}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentFines;
