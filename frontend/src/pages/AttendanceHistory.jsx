import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import {
    History,
    Calendar,
    Users,
    CheckCircle,
    XCircle,
    ArrowRight,
    Search,
    GraduationCap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AttendanceHistory = () => {
    const [summaries, setSummaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchSummaries();
    }, []);

    const fetchSummaries = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/attendance/summaries`);
            setSummaries(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filtered = summaries.filter(s =>
        new Date(s.date).toLocaleDateString().includes(search)
    );

    // Grouping filtered results by date
    const grouped = filtered.reduce((acc, s) => {
        const d = s.date.split('T')[0];
        if (!acc[d]) acc[d] = [];
        acc[d].push(s);
        return acc;
    }, {});

    const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Attendance Archives</h2>
                    <p className="text-slate-500 font-bold mt-1 uppercase text-xs tracking-widest">Year-Wise Historical Records</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search date..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-12 pl-12 pr-6 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none text-white transition-all w-64 text-sm font-medium"
                    />
                </div>
            </div>

            {sortedDates.length === 0 ? (
                <div className="glass-card py-20 text-center flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-slate-500/10 flex items-center justify-center text-slate-500 opacity-60">
                        <History size={32} />
                    </div>
                    <p className="text-slate-400 font-bold italic tracking-wide">No attendance records found yet.</p>
                </div>
            ) : sortedDates.map((date) => (
                <div key={date} className="space-y-6">
                    <div className="flex items-center gap-4 px-2">
                        <div className="h-px flex-1 bg-white/5"></div>
                        <div className="flex items-center gap-3">
                            <Calendar size={16} className="text-blue-500" />
                            <span className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">
                                {new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                        </div>
                        <div className="h-px flex-1 bg-white/5"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {grouped[date].sort((a, b) => b.year - a.year).map((yrData, i) => (
                            <div key={i} className="glass-card group hover:border-blue-500/30 transition-all p-0 overflow-hidden relative">
                                <div className={`absolute top-0 right-0 p-4 font-black italic text-4xl opacity-5 group-hover:opacity-10 transition-opacity ${yrData.year === 3 ? 'text-indigo-500' : 'text-blue-500'}`}>
                                    {yrData.year}yr
                                </div>

                                <div className="p-6 border-b border-white/5 bg-white/2 flex justify-between items-center group-hover:bg-blue-600/5 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2.5 rounded-xl ${yrData.year === 3 ? 'bg-indigo-600/10 text-indigo-500' : 'bg-blue-600/10 text-blue-500'}`}>
                                            <GraduationCap size={18} />
                                        </div>
                                        <h3 className="font-black text-white text-lg tracking-tight uppercase">
                                            {yrData.year === 3 ? '3rd Year Batch (Final)' : '2nd Year Batch (Major)'}
                                        </h3>
                                    </div>
                                </div>

                                <div className="p-8 space-y-6">
                                    <div className="flex justify-between items-center bg-white/2 p-6 rounded-2xl border border-white/5">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Present</p>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle size={14} className="text-emerald-500" />
                                                <span className="text-2xl font-black text-white tabular-nums">{yrData.presentCount}</span>
                                            </div>
                                        </div>
                                        <div className="h-10 w-px bg-white/5"></div>
                                        <div className="text-right space-y-1">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Absent</p>
                                            <div className="flex items-center gap-2 justify-end">
                                                <span className="text-2xl font-black text-rose-500 tabular-nums">{yrData.absentCount}</span>
                                                <XCircle size={14} className="text-rose-500" />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            navigate(`/admin/mark/${yrData.year}?date=${date}`);
                                        }}
                                        className="w-full py-4 rounded-xl bg-white/5 group-hover:bg-blue-600 group-hover:text-white text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                                    >
                                        Inspect Attendance List <ArrowRight size={12} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AttendanceHistory;
