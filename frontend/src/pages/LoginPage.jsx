import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuth.js';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 0%, #1a0f0a 0%, #0d0d0d 60%)',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.03,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, #c9a84c 40px, #c9a84c 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, #c9a84c 40px, #c9a84c 41px)'
      }} />

      <div style={{ width: '100%', maxWidth: 400, padding: '0 20px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>⚔</div>
          <h1 style={{
            fontFamily: 'Cinzel, serif', fontSize: 32, color: '#c9a84c',
            letterSpacing: '0.15em', marginBottom: 4
          }}>TRPG SHEET</h1>
          <p style={{ color: '#555', fontFamily: 'Crimson Text, serif', fontSize: 16, letterSpacing: '0.2em' }}>
            ENTER THE REALM
          </p>
        </div>

        {/* Login form */}
        <div style={{
          background: '#161616', border: '1px solid #2a2a2a', borderRadius: 8, padding: 32,
          boxShadow: '0 0 40px rgba(201,168,76,0.05)'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label>Username</label>
              <input
                type="text" value={username} onChange={e => setUsername(e.target.value)}
                placeholder="Enter your username" required autoFocus
              />
            </div>
            <div style={{ marginBottom: 28 }}>
              <label>Password</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required
              />
            </div>
            <button
              type="submit" className="btn-primary w-full"
              disabled={loading}
              style={{ width: '100%', padding: '12px', fontSize: 14 }}
            >
              {loading ? 'Entering...' : 'Enter'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: '#333', fontSize: 13, marginTop: 20, fontFamily: 'Cinzel, serif', letterSpacing: '0.05em' }}>
          Access by invitation only
        </p>
      </div>
    </div>
  );
}
