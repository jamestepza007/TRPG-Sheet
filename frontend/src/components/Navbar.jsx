import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuth.js';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/login') return null;
  if (!user) return null;

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">⚔ TRPG Sheet</Link>
      <div className="navbar-nav">
        <Link to="/" className={isActive('/')}>Dashboard</Link>
        {user.role === 'ADMIN' && <Link to="/admin" className={isActive('/admin')}>Admin</Link>}
        <Link to="/profile" className={isActive('/profile')}>Profile</Link>
        <span style={{ color: '#333', fontSize: 12, padding: '0 4px' }}>|</span>
        <span className={`badge badge-${user?.role?.toLowerCase()}`} style={{ fontSize: 10 }}>{user?.role}</span>
        <span style={{ color: '#555', fontSize: 13, padding: '0 4px' }}>{user.username}</span>
        <button className="btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
