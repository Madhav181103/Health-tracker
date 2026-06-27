import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await api.post('/auth/login', { email, password });
      
      // Save auth session
      login(response.data.user, response.data.token);
      
      // Redirect to homepage
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary, #0f172a)',
        padding: '1.5rem',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '2.5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)'
        }}
      >
        {/* Brand Logo Heading */}
        <div style={{ textAlign: 'center' }}>
          <h1
            style={{
              fontSize: '2.25rem',
              fontWeight: '800',
              color: 'var(--accent-green, #22c55e)',
              marginBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.25rem',
              letterSpacing: '-0.025em'
            }}
          >
            <span>⚡</span> FitAI
          </h1>
          <p
            style={{
              fontSize: '0.95rem',
              color: 'var(--text-secondary, #94a3b8)',
              fontWeight: '500'
            }}
          >
            Welcome back
          </p>
        </div>

        {/* Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Email input field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label
              style={{
                fontSize: '0.85rem',
                fontWeight: '600',
                color: 'var(--text-secondary, #94a3b8)',
                letterSpacing: '0.025em'
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="name@example.com"
              style={{
                width: '100%',
                backgroundColor: 'var(--bg-primary, #0f172a)',
                border: '1px solid var(--border, #334155)',
                color: 'var(--text-primary, #f1f5f9)',
                padding: '0.75rem',
                borderRadius: '8px',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent-green, #22c55e)';
                e.target.style.boxShadow = '0 0 0 2px rgba(34, 197, 94, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border, #334155)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Password input field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label
              style={{
                fontSize: '0.85rem',
                fontWeight: '600',
                color: 'var(--text-secondary, #94a3b8)',
                letterSpacing: '0.025em'
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="••••••••"
              style={{
                width: '100%',
                backgroundColor: 'var(--bg-primary, #0f172a)',
                border: '1px solid var(--border, #334155)',
                color: 'var(--text-primary, #f1f5f9)',
                padding: '0.75rem',
                borderRadius: '8px',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent-green, #22c55e)';
                e.target.style.boxShadow = '0 0 0 2px rgba(34, 197, 94, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border, #334155)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        {/* Submit Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button
            onClick={handleLogin}
            disabled={loading}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '0.95rem',
              fontWeight: '700',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          {/* Error Message */}
          {error && (
            <div
              style={{
                color: 'var(--accent-red, #ef4444)',
                fontSize: '0.85rem',
                fontWeight: '600',
                textAlign: 'center',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                marginTop: '0.25rem',
                animation: 'shake 0.2s ease-in-out'
              }}
            >
              <style>{`
                @keyframes shake {
                  0%, 100% { transform: translateX(0); }
                  25% { transform: translateX(-4px); }
                  75% { transform: translateX(4px); }
                }
              `}</style>
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Redirect Register Link */}
        <div
          style={{
            textAlign: 'center',
            fontSize: '0.875rem',
            color: 'var(--text-secondary, #94a3b8)',
            marginTop: '0.5rem'
          }}
        >
          Don't have an account?{' '}
          <Link
            to="/register"
            style={{
              color: 'var(--accent-green, #22c55e)',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = '#15803d'}
            onMouseLeave={(e) => e.target.style.color = 'var(--accent-green, #22c55e)'}
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
