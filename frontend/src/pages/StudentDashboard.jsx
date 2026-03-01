import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import {
    CheckCircle,
    XCircle,
    CreditCard,
    Calendar,
    AlertCircle,
    Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [attendance, setAttendance] = useState({ percentage: 0, totalDays: 0, presentDays: 0 });
    const [dailyAttendance, setDailyAttendance] = useState([]);
    const [fines, setFines] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [attRes, dailyRes, fineRes, leaveRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/attendance/percentage/${user.id}`),
                axios.get(`${API_BASE_URL}/attendance/my-attendance`),
                axios.get(`${API_BASE_URL}/fine/my-fines`),
                axios.get(`${API_BASE_URL}/leave/my-leaves`)
            ]);
            setAttendance(attRes.data);
            setDailyAttendance(dailyRes.data);
            setFines(fineRes.data);
            setLeaves(leaveRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const statusColor = (status) => {
        switch (status) {
            case 'Approved': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case 'Pending': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
            case 'Rejected': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
            default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Welcome, {user.name}</h2>
                <p className="text-slate-500 font-medium mt-1">Reg No: {user.registerNumber} • Information Technology Dept</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card p-6 border-l-4 border-l-blue-500">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                            <Calendar size={20} />
                        </div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Attendance Rate</p>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">{attendance.percentage.toFixed(1)}%</h3>
                    <p className="text-[11px] text-slate-500 font-medium italic">Requirement: 75% for Exam Eligibility</p>
                </div>

                <div className="glass-card p-6 border-l-4 border-l-rose-500">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                            <AlertCircle size={20} />
                        </div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Fines</p>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">₹{fines.reduce((sum, f) => sum + f.amount, 0)}</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Clear fines to avoid registration blocks</p>
                </div>

                <div className="glass-card p-6 border-l-4 border-l-amber-500">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                            <Clock size={20} />
                        </div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending Requests</p>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">{leaves.filter(l => l.status === 'Pending').length}</h3>
                    <p className="text-[11px] text-slate-500 font-medium italic">Leave & OD Status</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card p-8">
                    <h3 className="text-lg font-bold text-white mb-6">My Attendance Log</h3>
                    <div className="overflow-x-auto max-h-80 overflow-y-auto">
                        <table className="w-full text-left">
                            <thead className="text-[10px] uppercase text-slate-500 tracking-widest sticky top-0 bg-slate-900 z-10">
                                <tr className="border-b border-white/5">
                                    <th className="pb-4 font-bold">Date</th>
                                    <th className="pb-4 font-bold text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {dailyAttendance.length === 0 ? (
                                    <tr><td colSpan="2" className="py-10 text-center text-slate-500 italic text-sm">No attendance records yet.</td></tr>
                                ) : dailyAttendance.map((rec, i) => (
                                    <tr key={i} className="group hover:bg-white/5 transition-colors">
                                        <td className="py-4 text-sm font-medium text-slate-300">
                                            {new Date(rec.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="py-4 text-center">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${rec.status === 'Present'
                                                ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                                                : 'border-rose-500/20 bg-rose-500/10 text-rose-400'
                                                }`}>
                                                {rec.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="glass-card p-8">
                    <h3 className="text-lg font-bold text-white mb-6">Recent Fine History</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-xs uppercase text-slate-500 tracking-wider">
                                <tr className="border-b border-white/5 pb-4">
                                    <th className="pb-4 font-bold">Reason</th>
                                    <th className="pb-4 font-bold">Date</th>
                                    <th className="pb-4 font-bold text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {fines.length === 0 ? (
                                    <tr><td colSpan="3" className="py-10 text-center text-slate-500 italic">No fines found. Keep it up!</td></tr>
                                ) : fines.map((fine, i) => (
                                    <tr key={i} className="group hover:bg-white/5 transition-colors">
                                        <td className="py-4 text-sm font-medium text-slate-300">
                                            <div className="flex items-center gap-2">
                                                {fine.autoGenerated && <AlertCircle size={14} className="text-rose-400" />}
                                                {fine.reason}
                                            </div>
                                        </td>
                                        <td className="py-4 text-sm text-slate-500">{new Date(fine.date).toLocaleDateString()}</td>
                                        <td className="py-4 text-sm font-bold text-white text-right">₹{fine.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="glass-card p-8">
                    <h3 className="text-lg font-bold text-white mb-6">Leave & OD Status</h3>
                    <div className="space-y-4">
                        {leaves.length === 0 ? (
                            <p className="text-slate-500 italic text-center py-6">No leave applications found.</p>
                        ) : leaves.map((leave, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${leave.type === 'Leave' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-orange-500/10 text-orange-400'}`}>
                                        {leave.type === 'Leave' ? <Calendar size={18} /> : <CheckCircle size={18} />}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white">{leave.type} - {leave.reason}</h4>
                                        <p className="text-xs text-slate-500">{new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase border ${statusColor(leave.status)}`}>
                                    {leave.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
