import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import {
    History,
    User,
    Activity,
    ShieldCheck,
    Calendar,
    Clock,
    ChevronRight,
    TrendingDown
} from 'lucide-react';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/audit/all`);
            setLogs(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight italic">System Audit Trail</h2>
                    <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-[10px] font-bold">Immutable Records of All Administrative Actions</p>
                </div>
            </div>

            <div className="glass-card p-0 overflow-hidden shadow-2xl relative">
                <div className="p-8 border-b border-white/5 bg-gradient-to-r from-blue-900/10 to-transparent flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                            <History size={20} />
                        </div>
                        <h3 className="text-lg font-black text-white px-2">Compliance Ledger</h3>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#020617]/40">
                            <tr className="text-[10px] font-black uppercase text-slate-500 tracking-[0.25em] border-b border-white/5">
                                <th className="px-10 py-6">Administrator Identification</th>
                                <th className="px-10 py-6">Action Performed</th>
                                <th className="px-10 py-6">Precise Timestamp</th>
                                <th className="px-10 py-6 text-right">Data Snapshot</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 relative">
                            {logs.length === 0 ? (
                                <tr><td colSpan="4" className="py-24 text-center text-slate-500 font-bold italic opacity-60">System initialized. No actions have been logged yet.</td></tr>
                            ) : logs.map((log, i) => (
                                <tr key={i} className="hover:bg-white/2 transition-all group">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-11 h-11 rounded-3xl bg-slate-500/10 flex items-center justify-center text-slate-300 font-black border border-white/5 shadow-inner">
                                                {log.adminId?.name?.[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{log.adminId?.name}</p>
                                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">{log.adminId?.registerNumber}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
                                            <p className="text-sm font-bold text-slate-200 tracking-wide">{log.action}</p>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                                <Calendar size={12} className="text-blue-500/50" />
                                                <span>{new Date(log.timestamp).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                                <Clock size={10} />
                                                <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="p-3 rounded-lg bg-[#020617]/60 border border-white/5 inline-block text-[10px] font-mono font-bold text-blue-300 max-w-xs truncate overflow-hidden">
                                            {JSON.stringify(log.details)}
                                        </div>
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

export default AuditLogs;
