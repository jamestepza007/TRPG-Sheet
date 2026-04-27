import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../utils/api.js';
import { useAuthStore } from '../hooks/useAuth.js';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [inviteCode, setInviteCode] = useState(params.get('code') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeInfo, setCodeInfo] = useState(null); // { valid, remaining, note }
  const [codeError, setCodeError] = useState('');

  // Validate code on load if present in URL
  useEffect(() => {
    if (params.get('code')) validateCode(params.get('code'));
  }, []);

  const validateCode = async (code) => {
    if (!code.trim()) return;
    setCodeError('');
    try {
      const res = await api.get(`/auth/invite-validate/${code.trim().toUpperCase()}`);
      setCodeInfo(res.data);
    } catch (err) {
      setCodeError(err.response?.data?.error || 'Invalid code');
      setCodeInfo(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) return toast.error('กรุณาใส่ invite code');
    if (!username.trim()) return toast.error('กรุณาใส่ username');
    if (password.length < 6) return toast.error('Password ต้องมีอย่างน้อย 6 ตัว');
    if (password !== confirm) return toast.error('Password ไม่ตรงกัน');

    setLoading(true);
    try {
      const res = await api.post('/auth/register', {
        username: username.trim(),
        password,
        inviteCode: inviteCode.trim().toUpperCase(),
      });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      setAuth(user, token);
      toast.success(`ยินดีต้อนรับ ${user.username}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontFamily: 'Cinzel, serif', fontSize: 28, color: '#c9a84c', letterSpacing: '0.15em', marginBottom: 8 }}>✕ TRPG SHEET</div>
          <div style={{ color: '#555', fontSize: 13 }}>สมัครสมาชิก — ต้องใช้ Invite Code</div>
        </div>

        <form onSubmit={handleSubmit} style={{ background: '#111', border: '1px solid #222', borderRadius: 12, padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Invite Code */}
          <div>
            <label style={{ display: 'block', fontSize: 11, color: '#666', letterSpacing: '0.1em', marginBottom: 6, textTransform: 'uppercase' }}>Invite Code</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={inviteCode}
                onChange={e => { setInviteCode(e.target.value.toUpperCase()); setCodeInfo(null); setCodeError(''); }}
                placeholder="XXXXXX"
                style={{ flex: 1, background: '#1a1a1a', border: `1px solid ${codeInfo ? '#4ade80' : codeError ? '#f87171' : '#333'}`, borderRadius: 8, padding: '10px 14px', color: '#eee', fontFamily: 'monospace', fontSize: 16, letterSpacing: '0.2em', outline: 'none', textTransform: 'uppercase' }}
              />
              <button type="button" onClick={() => validateCode(inviteCode)}
                style={{ padding: '10px 16px', background: '#1a1a1a', border: '1px solid #444', borderRadius: 8, color: '#c9a84c', cursor: 'pointer', fontSize: 12, fontFamily: 'Cinzel, serif', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                CHECK
              </button>
            </div>
            {codeInfo && (
              <div style={{ marginTop: 6, fontSize: 11, color: '#4ade80' }}>
                ✓ Valid — เหลือ {codeInfo.remaining} slot{codeInfo.remaining > 1 ? 's' : ''}
                {codeInfo.note && <span style={{ color: '#888', marginLeft: 8 }}>({codeInfo.note})</span>}
              </div>
            )}
            {codeError && <div style={{ marginTop: 6, fontSize: 11, color: '#f87171' }}>✕ {codeError}</div>}
          </div>

          {/* Username */}
          <div>
            <label style={{ display: 'block', fontSize: 11, color: '#666', letterSpacing: '0.1em', marginBottom: 6, textTransform: 'uppercase' }}>Username</label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="ชื่อที่ใช้ในระบบ"
              style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, padding: '10px 14px', color: '#eee', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: 11, color: '#666', letterSpacing: '0.1em', marginBottom: 6, textTransform: 'uppercase' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="อย่างน้อย 6 ตัวอักษร"
              style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, padding: '10px 14px', color: '#eee', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* Confirm */}
          <div>
            <label style={{ display: 'block', fontSize: 11, color: '#666', letterSpacing: '0.1em', marginBottom: 6, textTransform: 'uppercase' }}>Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="ยืนยัน password"
              style={{ width: '100%', background: '#1a1a1a', border: `1px solid ${confirm && password !== confirm ? '#f87171' : '#333'}`, borderRadius: 8, padding: '10px 14px', color: '#eee', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '12px', background: '#c9a84c', border: 'none', borderRadius: 8, color: '#000', fontFamily: 'Cinzel, serif', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
          </button>

          <div style={{ textAlign: 'center', fontSize: 12, color: '#444' }}>
            มีบัญชีแล้ว? <Link to="/login" style={{ color: '#c9a84c', textDecoration: 'none' }}>เข้าสู่ระบบ</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
