import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import {
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    ExternalLink,
    User,
    Calendar,
    Filter,
    ArrowRight,
    AlertCircle
} from 'lucide-react';

const LeaveApproval = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [filter, setFilter] = useState('Pending');
    const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/leave/all`);
            setLeaves(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (leaveId, status) => {
        setSubmitting(true);
        setStatusMsg({ type: '', text: '' });
        try {
            await axios.put(`${API_BASE_URL}/leave/update`, { leaveId, status });
            setStatusMsg({ type: 'success', text: `Leave request ${status.toLowerCase()} correctly!` });
            fetchLeaves();
        } catch (error) {
            setStatusMsg({ type: 'error', text: 'Error updating leave status.' });
        } finally {
            setSubmitting(false);
        }
    };

    const filteredLeaves = filter === 'All' ? leaves : leaves.filter(l => l.status === filter);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Leave Verification Portal</h2>
                    <p className="text-slate-500 font-medium mt-1">Review and validate student absence justifications</p>
                </div>
                <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                    {['Pending', 'Approved', 'Rejected', 'All'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-500 hover:text-white'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {statusMsg.text && (
                <div className={`p-4 rounded-xl flex items-center gap-3 animate-in zoom-in-95 ${statusMsg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                    }`}>
                    {statusMsg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    <span className="text-xs font-bold uppercase tracking-wider">{statusMsg.text}</span>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6">
                {filteredLeaves.length === 0 ? (
                    <div className="glass-card py-20 text-center flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-slate-500/10 flex items-center justify-center text-slate-500 opacity-60">
                            <FileText size={32} />
                        </div>
                        <p className="text-slate-400 font-bold italic tracking-wide">No {filter === 'All' ? '' : filter.toLowerCase()} leave requests found in the queue.</p>
                    </div>
                ) : filteredLeaves.map((leave, i) => (
                    <div key={i} className="glass-card p-0 overflow-hidden hover:border-blue-500/20 transition-all group">
                        <div className="p-8 flex items-start gap-8">
                            <div className="flex-1 space-y-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                                        <User size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-black text-white">{leave.studentId?.name}</h3>
                                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">{leave.studentId?.registerNumber}</p>
                                    </div>
                                    <div className={`ml-auto px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${leave.type === 'OD' ? 'text-amber-400 border-amber-400/20 bg-amber-400/5' : 'text-indigo-400 border-indigo-400/20 bg-indigo-400/5'
                                        }`}>
                                        {leave.type} REQUEST
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="p-4 rounded-2xl bg-[#020617]/50 border border-white/5 space-y-1">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Duration Period</p>
                                        <div className="flex items-center gap-2 text-white font-bold text-sm">
                                            <Calendar size={14} className="text-blue-500" />
                                            <span>{new Date(leave.startDate).toLocaleDateString()}</span>
                                            <ArrowRight size={12} className="text-slate-600" />
                                            <span>{new Date(leave.endDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-[#020617]/50 border border-white/5 space-y-1">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Absence Status</p>
                                        <div className="flex items-center gap-2 font-bold text-sm">
                                            <Clock size={14} className="text-amber-500" />
                                            <span className={leave.status === 'Pending' ? 'text-amber-400' : leave.status === 'Approved' ? 'text-emerald-400' : 'text-rose-400'}>
                                                {leave.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-[#020617]/50 border border-white/5 space-y-1 lg:col-span-1">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Proof Evidence</p>
                                        {leave.proofFile ? (
                                            <a href={`${API_BASE_URL.replace('/api', '')}/${leave.proofFile}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold text-sm transition-colors">
                                                <ExternalLink size={14} />
                                                <span>View Documents</span>
                                            </a>
                                        ) : (
                                            <p className="text-slate-600 text-sm font-bold italic">No File Provided</p>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6 rounded-2xl bg-white/2 border border-white/5">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Statement of Reason</p>
                                    <p className="text-slate-300 text-sm leading-relaxed font-medium">"{leave.reason}"</p>
                                </div>
                            </div>
                        </div>

                        {leave.status === 'Pending' && (
                            <div className="flex overflow-hidden">
                                <button
                                    onClick={() => handleUpdate(leave._id, 'Approved')}
                                    disabled={submitting}
                                    className="flex-1 h-14 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white font-black text-xs uppercase tracking-widest transition-all border-t border-emerald-500/20 active:scale-[0.99]"
                                >
                                    Approve & Validate Absence
                                </button>
                                <button
                                    onClick={() => handleUpdate(leave._id, 'Rejected')}
                                    disabled={submitting}
                                    className="flex-1 h-14 bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white font-black text-xs uppercase tracking-widest transition-all border-t border-rose-500/20 active:scale-[0.99]"
                                >
                                    Reject & Impose Penalties
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LeaveApproval;
