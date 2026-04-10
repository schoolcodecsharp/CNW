import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import NongDanDashboard from './pages/nongdan/NongDanDashboard';
import DaiLyDashboard from './pages/daily/DaiLyDashboard';
import SieuThiDashboard from './pages/sieuthi/SieuThiDashboard';
import TestApiPage from './pages/TestApiPage';
import './App.css';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Đang tải...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.loaiTaiKhoan)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

// Public Route Component (redirect if logged in)
interface PublicRouteProps {
  children: React.ReactNode;
}

function PublicRoute({ children }: PublicRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Đang tải...</div>;
  }

  if (user) {
    // Redirect based on user role
    const redirectMap: Record<string, string> = {
      'admin': '/admin',
      'nongdan': '/nongdan',
      'daily': '/daily',
      'sieuthi': '/sieuthi'
    };
    return <Navigate to={redirectMap[user.loaiTaiKhoan] || '/'} />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
      <Route path="/test-api" element={<TestApiPage />} />

      {/* Protected Routes */}
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/nongdan/*" element={
        <ProtectedRoute allowedRoles={['nongdan']}>
          <NongDanDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/daily/*" element={
        <ProtectedRoute allowedRoles={['daily']}>
          <DaiLyDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/sieuthi/*" element={
        <ProtectedRoute allowedRoles={['sieuthi']}>
          <SieuThiDashboard />
        </ProtectedRoute>
      } />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
