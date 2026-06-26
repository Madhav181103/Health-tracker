import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 64px;
          background: var(--bg-card);
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 2rem;
          z-index: 1000;
        }
        .nav-logo {
          color: var(--accent-green);
          font-size: 1.5rem;
          font-weight: 800;
          text-decoration: none;
        }
        .nav-links {
          display: flex;
          gap: 1.5rem;
        }
        .nav-item {
          text-decoration: none;
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 0.95rem;
          padding: 0.4rem 0.1rem;
          border-bottom: 2px solid transparent;
          transition: color 0.2s, border-bottom-color 0.2s;
        }
        .nav-item:hover {
          color: var(--text-primary);
        }
        .nav-item.active {
          color: var(--accent-green);
          border-bottom-color: var(--accent-green);
        }
        .nav-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .nav-user {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .nav-user-name {
          font-weight: 600;
          color: var(--text-primary);
        }
        .btn-logout {
          background: transparent;
          border: 1px solid var(--accent-red);
          color: var(--accent-red);
          border-radius: 6px;
          padding: 0.4rem 0.8rem;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .btn-logout:hover {
          background: var(--accent-red);
          color: #fff;
        }
      `}</style>
      <NavLink to="/" className="nav-logo">
        ⚡ FitAI
      </NavLink>
      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          Dashboard
        </NavLink>
        <NavLink to="/log" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          Log
        </NavLink>
        <NavLink to="/plan" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          Weekly Plan
        </NavLink>
        <NavLink to="/chat" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          Nutritionist
        </NavLink>
      </div>
      <div className="nav-right">
        {user && (
          <span className="nav-user">
            Hello, <span className="nav-user-name">{user.name}</span>
          </span>
        )}
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>
    </nav>
  );
}
