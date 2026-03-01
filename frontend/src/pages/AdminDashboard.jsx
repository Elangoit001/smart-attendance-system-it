import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';
import {
    Users,
    FileText,
    CreditCard,
    TrendingUp,
    AlertTriangle,
    ArrowRight,
    History
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalStudents: 0,
        pendingLeaveRequests: 0,
        totalFineAmount: 0,
        attendanceTrend: []
    });
    const [unauthorized, setUnauthorized] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
        fetchUnauthorized();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/attendance/stats`);
            setStats(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUnauthorized = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/attendance/unauthorized`);
            setUnauthorized(response.data.slice(0, 5)); // Just the top 5
        } catch (error) {
            console.error(error);
        }
    };

    const COLORS = ['#3b82f6', '#ef4444', '#f59e0b'];

    const chartData = (stats?.attendanceTrend || []).map(item => ({
        name: item._id,
        value: item.count
    }));

    const cardData = [
        { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'text-blue-500' },
        { label: 'Pending Leaves', value: stats.pendingLeaveRequests, icon: FileText, color: 'text-amber-500' },
        { label: 'Total Fine Revenue', value: `₹${stats.totalFineAmount}`, icon: CreditCard, color: 'text-rose-500' },
        { label: 'System Status', value: 'Active', icon: TrendingUp, color: 'text-emerald-500' },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Admin Command Center</h2>
                    <p className="text-slate-500 font-medium">Monitoring Information Technology Department Attendance and Fines</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cardData.map((card, i) => (
                    <div key={i} className="glass-card p-6 flex items-start gap-4 hover:scale-105 transition-transform">
                        <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${card.color}`}>
                            <card.icon size={24} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">{card.label}</p>
                            <h3 className="text-2xl font-bold text-white mt-1">{card.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <a href="/admin/mark/2" className="glass-card p-10 group hover:border-blue-500/50 transition-all border-dashed border-2 bg-blue-500/5 items-center flex justify-between">
                    <div>
                        <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Enter 2nd Year Attendance</h3>
                        <p className="text-slate-500 mt-2 font-bold">Manage 30 Registered Students</p>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xl">
                        <Users size={32} />
                    </div>
                </a>
                <a href="/admin/mark/3" className="glass-card p-10 group hover:border-indigo-500/50 transition-all border-dashed border-2 bg-indigo-500/5 items-center flex justify-between">
                    <div>
                        <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Enter 3rd Year Attendance</h3>
                        <p className="text-slate-500 mt-2 font-bold">Manage 28 Registered Students</p>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xl">
                        <Users size={32} />
                    </div>
                </a>
            </div>

            <div onClick={() => navigate('/admin/history')} className="glass-card mb-12 p-10 group hover:border-slate-500/50 transition-all border-dashed border-2 bg-slate-500/5 items-center flex justify-between cursor-pointer">
                <div className="flex items-center gap-8">
                    <div className="w-20 h-20 rounded-3xl bg-slate-600/20 flex items-center justify-center text-slate-500 group-hover:bg-slate-500 group-hover:text-white transition-all shadow-xl rotate-[-10deg] group-hover:rotate-0">
                        <History size={40} />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Attendance Archives</h3>
                        <p className="text-slate-500 mt-2 font-bold tracking-widest uppercase text-xs">Access daily roll call logs and historical data</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-slate-500 group-hover:text-white transition-colors">
                    <span className="font-black uppercase tracking-widest text-[10px]">Explorer Records</span>
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white transition-all">
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card p-8">
                    <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-3">
                        <TrendingUp size={20} className="text-blue-500" />
                        Attendance Distribution
                    </h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-3">
                            <AlertTriangle size={20} className="text-rose-500" />
                            Recent Alerts
                        </h3>
                        <button className="text-blue-400 text-sm font-semibold hover:text-blue-300 transition-colors flex items-center gap-1 group">
                            View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {!unauthorized || unauthorized.length === 0 ? (
                            <p className="text-slate-500 text-sm italic">No unauthorized absences reported.</p>
                        ) : unauthorized.map((fine, idx) => (
                            <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-rose-500/30 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-white font-semibold text-sm">{fine.studentId?.name || 'Unknown Student'}</p>
                                    <span className="text-[10px] bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full font-bold uppercase">Critical</span>
                                </div>
                                <p className="text-slate-500 text-xs line-clamp-1">{fine.reason}</p>
                                <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                                    <span className="text-slate-400 text-[10px]">{new Date(fine.date).toLocaleDateString()}</span>
                                    <span className="text-rose-400 font-bold text-sm">₹{fine.amount}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
