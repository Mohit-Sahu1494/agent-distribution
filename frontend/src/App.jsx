import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import AppLayout from './components/AppLayout';
import PageLoader from './components/PageLoader';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Agents from './pages/Agents';
import Upload from './pages/Upload';
import Tasks from './pages/Tasks';

const AppContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes wrapped in AppLayout with Sidebar */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/tasks" element={<Tasks />} />
          </Route>
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#13161d',
            color: '#f1f5f9',
            border: '1px solid #252a38',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.875rem',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#13161d' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#13161d' } },
        }}
      />
    </AuthProvider>
  );
}

export default App;
