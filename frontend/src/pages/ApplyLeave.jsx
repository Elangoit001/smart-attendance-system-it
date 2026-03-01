import axios from 'axios';
import API_BASE_URL from '../config';
import {
    FileText,
    Calendar,
    Send,
    Upload,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ApplyLeave = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        type: 'Leave',
        reason: '',
        startDate: '',
        endDate: ''
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', text: '' });

        const data = new FormData();
        data.append('type', formData.type);
        data.append('reason', formData.reason);
        data.append('startDate', formData.startDate);
        data.append('endDate', formData.endDate);
        if (file) data.append('proof', file);

        try {
            await axios.post(`${API_BASE_URL}/leave/apply`, data);
            setStatus({ type: 'success', text: 'Application submitted successfully! HOD will review it.' });
            setFormData({ type: 'Leave', reason: '', startDate: '', endDate: '' });
            setFile(null);
        } catch (err) {
            setStatus({ type: 'error', text: err.response?.data?.message || 'Failed to submit application.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto animate-in slide-in-from-bottom-5 duration-500">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-white tracking-tight">Apply for Leave / OD</h2>
                <p className="text-slate-500 mt-2">Submit your request with proof for department approval</p>
            </div>

            <div className="glass-card p-10">
                {status.text && (
                    <div className={`mb-8 p-4 rounded-xl flex items-center gap-3 animate-in fade-in zoom-in-95 ${status.type === 'success'
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                        }`}>
                        {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        <p className="font-semibold text-sm">{status.text}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Application Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none text-white transition-all appearance-none cursor-pointer"
                            >
                                <option value="Leave" className="bg-[#020617]">Personal Leave</option>
                                <option value="OD" className="bg-[#020617]">On Duty (OD)</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Proof (Optional)</label>
                            <div className="relative">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 border-dashed hover:border-blue-500 transition-all flex items-center gap-2 text-slate-400 cursor-pointer overflow-hidden"
                                >
                                    <Upload size={16} />
                                    <span className="text-xs truncate">{file ? file.name : 'Upload Document'}</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Start Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type="date"
                                    name="startDate"
                                    required
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none text-white transition-all text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">End Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type="date"
                                    name="endDate"
                                    required
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none text-white transition-all text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Detailed Reason</label>
                        <textarea
                            name="reason"
                            required
                            rows="4"
                            value={formData.reason}
                            onChange={handleChange}
                            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none text-white transition-all text-sm resize-none"
                            placeholder="Please explain the reason for your absence..."
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg shadow-xl shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
                    >
                        {loading ? (
                            <span className="animate-pulse">Submitting...</span>
                        ) : (
                            <>
                                <Send size={20} />
                                <span>Submit Application</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ApplyLeave;
