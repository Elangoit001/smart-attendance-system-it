import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn, ShieldCheck, User as UserIcon, AlertCircle } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const user = await login(identifier, password);
            if (user.role === 'admin') navigate('/admin/dashboard');
            else navigate('/student/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials or connection error.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#020617] relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/10 blur-[100px] rounded-full"></div>

            <div className="w-full max-w-md glass-card p-10 relative z-10 border-white/10 hover:border-white/20 transition-all duration-500 shadow-2xl">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-6 shadow-xl rotate-3 hover:rotate-6 transition-transform">
                        <ShieldCheck size={36} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">System Login</h1>
                    <p className="text-slate-500 font-medium mt-2">Department of Information Technology</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-400 text-sm animate-in zoom-in-95">
                        <AlertCircle size={18} />
                        <p className="font-semibold">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">Register No / Email</label>
                        <div className="relative group">
                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                            <input
                                type="text"
                                required
                                className="w-full h-14 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none text-white transition-all text-lg placeholder-slate-700 font-medium"
                                placeholder="Ex: 22IT042"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">Secure Password</label>
                        <div className="relative group">
                            <LogIn className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                            <input
                                type="password"
                                required
                                className="w-full h-14 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none text-white transition-all text-lg placeholder-slate-700 font-medium"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg shadow-xl shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {loading ? (
                            <span className="animate-pulse">Authenticating...</span>
                        ) : (
                            <>
                                <LogIn size={22} />
                                <span>Enter Dashboard</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-white/5 text-center">
                    <p className="text-slate-600 text-sm font-medium">© 2026 Smart Attendance System</p>
                    <div className="flex justify-center gap-4 mt-4 text-xs font-bold text-slate-500 uppercase tracking-widest opacity-60">
                        <span>Security v2.4</span>
                        <span>•</span>
                        <span>MERN Application</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
