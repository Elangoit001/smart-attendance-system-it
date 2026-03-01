import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';
import {
    Users,
    CalendarCheck,
    CheckCircle,
    XCircle,
    Save,
    ArrowRight,
    Filter,
    Search,
    AlertCircle
} from 'lucide-react';

const MarkAttendance = () => {
    const { year } = useParams();
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({}); // { studentId: 'Present' | 'Absent' }
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedDate, setSelectedDate] = useState(() => {
        const queryParams = new URLSearchParams(window.location.search);
        return queryParams.get('date') || new Date().toISOString().split('T')[0];
    });
    const [status, setStatus] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchStudents();
    }, [selectedDate, year]);

    const fetchStudents = async () => {
        setStudents([]);
        setLoading(true);
        setStatus({ type: '', text: '' });
        try {
            const [studentRes, existingRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/attendance/student-list?year=${year}&_t=${Date.now()}`),
                axios.get(`${API_BASE_URL}/attendance/by-date/${selectedDate}?_t=${Date.now()}`)
            ]);

            setStudents(studentRes.data);

            // Map existing attendance or default to 'Present'
            const initialAttendance = {};
            studentRes.data.forEach(s => {
                const existing = existingRes.data.find(r => r.studentId === s._id);
                initialAttendance[s._id] = existing ? existing.status : 'Present';
            });
            setAttendance(initialAttendance);

            if (studentRes.data.length === 0) {
                setStatus({ type: 'error', text: 'No students found with role "student" in the database.' });
            }
        } catch (error) {
            console.error('Fetch Students Error:', error);
            setStatus({
                type: 'error',
                text: `Failed to load student list: ${error.response?.data?.message || error.message}`
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAttendanceChange = (studentId, status) => {
        setAttendance({ ...attendance, [studentId]: status });
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setStatus({ type: '', text: '' });

        try {
            const records = Object.keys(attendance).map(id => ({
                studentId: id,
                status: attendance[id],
                date: selectedDate
            }));

            console.log('--- SUBMITTING ATTENDANCE ---', records);
            await axios.post(`${API_BASE_URL}/attendance/mark`, { records });
            setStatus({ type: 'success', text: 'Attendance marked and Fines auto-calculated!' });
            // Scroll to top to show success message
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            setStatus({ type: 'error', text: 'Failed to submit attendance records.' });
        } finally {
            setSubmitting(false);
        }
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.registerNumber.toLowerCase().includes(search.toLowerCase())
    );

    const stats = {
        present: Object.values(attendance).filter(v => v === 'Present').length,
        absent: Object.values(attendance).filter(v => v === 'Absent').length
    };

    const setToday = () => setSelectedDate(new Date().toISOString().split('T')[0]);
    const setYesterday = () => {
        const yest = new Date();
        yest.setDate(yest.getDate() - 1);
        setSelectedDate(yest.toISOString().split('T')[0]);
    };

    const handleYearChange = (newYear) => {
        navigate(`/admin/mark/${newYear}`);
    };

    if (loading && students.length === 0) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end gap-6 flex-wrap">
                <div className="flex-1 min-w-[300px]">
                    <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${year === '3' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                            }`}>
                            Class Year: {year}{year === '2' ? 'nd' : 'rd'}
                        </span>
                        <div className="h-1 w-1 rounded-full bg-slate-700"></div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            Total {students.length} Students
                        </span>
                    </div>
                    <h2 className="text-4xl font-black text-white tracking-tighter italic uppercase">
                        {year === '3' ? 'Graduating Batch' : 'Sophomore Batch'}
                    </h2>
                    <div className="flex items-center gap-6 mt-4 p-2 bg-white/5 rounded-2xl border border-white/5 w-fit">
                        <div className="flex items-center gap-2">
                            <button onClick={setToday} className="px-4 py-1.5 rounded-xl bg-blue-600/20 text-blue-400 text-[10px] font-black uppercase hover:bg-blue-600 hover:text-white transition-all">Today</button>
                            <button onClick={setYesterday} className="px-4 py-1.5 rounded-xl bg-slate-600/20 text-slate-400 text-[10px] font-black uppercase hover:bg-slate-600 hover:text-white transition-all">Yesterday</button>
                        </div>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-blue-400 font-bold outline-none focus:border-blue-500 transition-all text-xs"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="flex gap-4">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Marked Present</p>
                            <p className="text-3xl font-black text-emerald-500 tabular-nums">{stats.present}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Marked Absent</p>
                            <p className="text-3xl font-black text-rose-500 tabular-nums">{stats.absent}</p>
                        </div>
                    </div>

                    <div className="h-12 w-[1px] bg-white/10 mx-2"></div>

                    <div className="flex flex-col gap-1">
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1 text-center">Switch Batch</p>
                        <select
                            value={year}
                            onChange={(e) => handleYearChange(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-blue-500 transition-all text-xs"
                        >
                            <option value="2" className="bg-[#020617]">2nd Year Class</option>
                            <option value="3" className="bg-[#020617]">3rd Year Class</option>
                        </select>
                    </div>

                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Find student..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-[48px] pl-10 pr-6 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none text-white transition-all w-56 text-sm font-medium"
                        />
                    </div>
                </div>
            </div>

            {status.text && (
                <div className={`p-4 rounded-xl shadow-xl flex items-center justify-between border ${status.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                    }`}>
                    <div className="flex items-center gap-3">
                        {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        <span className="font-bold text-sm tracking-wide">{status.text}</span>
                    </div>
                </div>
            )}

            <div className="glass-card overflow-hidden">
                <div className="p-0 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#020617]/50 border-b border-white/5">
                            <tr className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">
                                <th className="px-8 py-6">Student Credentials</th>
                                <th className="px-8 py-6 text-center">Status Toggle</th>
                                <th className="px-8 py-6 text-right">Quick Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredStudents.length === 0 ? (
                                <tr><td colSpan="3" className="py-20 text-center text-slate-500 italic">No matching students found in the department.</td></tr>
                            ) : filteredStudents.map((s) => (
                                <tr key={s._id} className="hover:bg-white/2 transition-all">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center text-blue-400 font-bold border border-white/5">
                                                {s.name[0]}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-200">{s.name}</h4>
                                                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{s.registerNumber}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-center gap-3 p-1 rounded-2xl bg-white/5 w-fit mx-auto border border-white/5">
                                            <button
                                                onClick={() => handleAttendanceChange(s._id, 'Present')}
                                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${attendance[s._id] === 'Present'
                                                    ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20 text-white'
                                                    : 'text-slate-500 hover:text-slate-300'
                                                    }`}
                                            >
                                                <CheckCircle size={16} />
                                                Present
                                            </button>
                                            <button
                                                onClick={() => handleAttendanceChange(s._id, 'Absent')}
                                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${attendance[s._id] === 'Absent'
                                                    ? 'bg-rose-500 shadow-lg shadow-rose-500/20 text-white'
                                                    : 'text-slate-500 hover:text-slate-300'
                                                    }`}
                                            >
                                                <XCircle size={16} />
                                                Absent
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <p className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border w-fit ml-auto ${attendance[s._id] === 'Present'
                                            ? 'text-emerald-500 border-emerald-500/10 bg-emerald-500/5'
                                            : 'text-rose-500 border-rose-500/10 bg-rose-500/5 pulse-subtle'
                                            }`}>
                                            {attendance[s._id] === 'Present' ? 'Clear' : 'Penalty Pending'}
                                        </p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex items-center gap-3 px-10 py-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-600/30 active:scale-95 transition-all disabled:opacity-50"
                >
                    {submitting ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Submitting...</span>
                        </>
                    ) : (
                        <>
                            <Save size={20} />
                            <span>Commit Roll Call Record</span>
                            <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default MarkAttendance;
