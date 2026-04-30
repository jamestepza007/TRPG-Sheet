import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuth.js';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  if (location.pathname === '/login') return null;
  if (location.pathname === '/register') return null;
  if (!user) return null;

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';
  const close = () => setMenuOpen(false);

  const navLinks = (
    <>
      <Link to="/" className={isActive('/')} onClick={close}>Dashboard</Link>
      {user.role === 'ADMIN' && <Link to="/admin" className={isActive('/admin')} onClick={close}>Admin</Link>}
      <Link to="/profile" className={isActive('/profile')} onClick={close}>Profile</Link>
      <span style={{ color: '#333', fontSize: 12, padding: '0 4px' }} className="mobile-hide">|</span>
      <span className={`badge badge-${user?.role?.toLowerCase()}`} style={{ fontSize: 10 }}>{user?.role}</span>
      <span style={{ color: '#555', fontSize: 13, padding: '0 4px' }} className="mobile-hide">{user.username}</span>
      <button className="btn-ghost btn-sm" onClick={() => { handleLogout(); close(); }}>Logout</button>
    </>
  );

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">⚔ TRPG Sheet</Link>

      {/* Desktop nav */}
      <div className="navbar-nav navbar-nav-desktop" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {navLinks}
      </div>

      {/* Hamburger button — mobile only */}
      <button
        className="navbar-hamburger"
        onClick={() => setMenuOpen(o => !o)}
        aria-label="Toggle menu">
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          width: '100%', flexBasis: '100%',
          display: 'flex', flexDirection: 'column', gap: 2,
          padding: '8px 0', borderTop: '1px solid var(--border)',
        }}>
          <Link to="/" className={isActive('/')} onClick={close}
            style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', borderRadius: 0 }}>
            Dashboard
          </Link>
          {user.role === 'ADMIN' && (
            <Link to="/admin" className={isActive('/admin')} onClick={close}
              style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', borderRadius: 0 }}>
              Admin
            </Link>
          )}
          <Link to="/profile" className={isActive('/profile')} onClick={close}
            style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', borderRadius: 0 }}>
            Profile
          </Link>
          <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--border)' }}>
            <span className={`badge badge-${user?.role?.toLowerCase()}`} style={{ fontSize: 10 }}>{user?.role}</span>
            <span style={{ color: '#555', fontSize: 13 }}>{user.username}</span>
          </div>
          <div style={{ padding: '10px 14px' }}>
            <button className="btn-ghost btn-sm" onClick={() => { handleLogout(); close(); }}
              style={{ width: '100%' }}>Logout</button>
          </div>
        </div>
      )}
    </nav>
  );
}
