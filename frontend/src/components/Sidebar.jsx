import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    FileText,
    CreditCard,
    Clock,
    ClipboardList,
    History,
    CalendarCheck,
    AlertCircle,
    LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const adminLinks = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Mark [2nd Yr]', path: '/admin/mark/2', icon: CalendarCheck },
        { name: 'Mark [3rd Yr]', path: '/admin/mark/3', icon: ClipboardList },
        { name: 'Attendance History', path: '/admin/history', icon: History },
        { name: 'Leave Requests', path: '/admin/leaves', icon: FileText },
        { name: 'Fines & Penalties', path: '/admin/fines', icon: AlertCircle },
        { name: 'Audit Logs', path: '/admin/audit', icon: History },
    ];

    const studentLinks = [
        { name: 'My Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
        { name: 'Apply Leave/OD', path: '/student/apply', icon: FileText },
        { name: 'My Fines', path: '/student/fines', icon: AlertCircle },
    ];

    const links = user?.role === 'admin' ? adminLinks : studentLinks;

    return (
        <div className="w-64 min-h-screen glass-nav text-slate-300 p-4 flex flex-col fixed left-0 top-0">
            <div className="mb-10 px-4">
                <h1 className="text-xl font-bold text-white bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                    SMART DEPT
                </h1>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold">Management System</p>
            </div>

            <nav className="flex-1 space-y-2">
                {links.map((link) => (
                    <NavLink
                        key={link.name}
                        to={link.path}
                        className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive
                                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10'
                                : 'hover:bg-white/5 hover:text-white'}
            `}
                    >
                        <link.icon size={18} />
                        <span className="font-medium">{link.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="pt-6 mt-6 border-t border-white/10 space-y-4">
                <div className="px-4 py-2 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                        {user?.name?.[0]}
                    </div>
                    <div className="truncate">
                        <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">{user?.role}</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all text-slate-400 font-medium"
                >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
