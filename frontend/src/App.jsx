import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ApplyLeave from './pages/ApplyLeave';
import StudentFines from './pages/StudentFines';
import MarkAttendance from './pages/MarkAttendance';
import AttendanceHistory from './pages/AttendanceHistory';
import LeaveApproval from './pages/LeaveApproval';
import FineManagement from './pages/FineManagement';
import AuditLogs from './pages/AuditLogs';

const ProtectedRoute = ({ children, roles = [] }) => {
    const { user, loading } = useAuth();

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#020617]">
            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
    );

    if (!user) return <Navigate to="/login" replace />;
    if (roles.length && !roles.includes(user.role)) return <Navigate to="/" replace />;

    return children;
};

const Layout = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';

    return (
        <div className="flex min-h-screen bg-[#020617]">
            {!isLoginPage && user && <Sidebar />}
            <main className={`flex-1 transition-all duration-300 ${!isLoginPage && user ? 'ml-64' : ''}`}>
                {children}
            </main>
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <Layout>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    {/* Admin Routes */}
                    <Route path="/admin/dashboard" element={
                        <ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>
                    } />
                    <Route path="/admin/mark" element={<Navigate to="/admin/mark/3" replace />} />
                    <Route path="/admin/mark/:year" element={
                        <ProtectedRoute roles={['admin']}><MarkAttendance /></ProtectedRoute>
                    } />
                    <Route path="/admin/history" element={
                        <ProtectedRoute roles={['admin']}><AttendanceHistory /></ProtectedRoute>
                    } />
                    <Route path="/admin/leaves" element={
                        <ProtectedRoute roles={['admin']}><LeaveApproval /></ProtectedRoute>
                    } />
                    <Route path="/admin/fines" element={
                        <ProtectedRoute roles={['admin']}><FineManagement /></ProtectedRoute>
                    } />
                    <Route path="/admin/audit" element={
                        <ProtectedRoute roles={['admin']}><AuditLogs /></ProtectedRoute>
                    } />

                    {/* Student Routes */}
                    <Route path="/student/dashboard" element={
                        <ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>
                    } />
                    <Route path="/student/apply" element={
                        <ProtectedRoute roles={['student']}><ApplyLeave /></ProtectedRoute>
                    } />
                    <Route path="/student/fines" element={
                        <ProtectedRoute roles={['student']}><StudentFines /></ProtectedRoute>
                    } />

                    {/* Root Redirects */}
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Layout>
        </AuthProvider>
    );
}

export default App;
