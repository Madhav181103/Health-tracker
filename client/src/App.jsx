import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider, { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Log from './pages/Log';
import Plan from './pages/Plan';
import Chat from './pages/Chat';

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  if (token) {
    return children;
  }
  return <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/log" element={<ProtectedRoute><Log /></ProtectedRoute>} />
          <Route path="/plan" element={<ProtectedRoute><Plan /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />

          {/* Catch-all Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
