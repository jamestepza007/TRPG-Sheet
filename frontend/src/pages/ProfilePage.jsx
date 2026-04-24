import { useState, useEffect } from 'react';
import api from '../utils/api.js';
import { useAuthStore } from '../hooks/useAuth.js';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [webhooks, setWebhooks] = useState([{ label: '', url: '' }]);
  const [saving, setSaving] = useState(false);
  // Account fields
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountSaving, setAccountSaving] = useState(false);

  useEffect(() => {
    api.get('/users/me/profile').then(res => {
      setUsername(res.data.username || '');
      const whs = res.data.discordWebhooks;
      if (Array.isArray(whs) && whs.length > 0) setWebhooks(whs);
    }).catch(() => {});
  }, []);

  const saveWebhooks = async () => {
    setSaving(true);
    try {
      const valid = webhooks.filter(w => w.url.trim());
      await api.put('/users/me/webhooks', { discordWebhooks: valid });
      toast.success('Webhooks saved!');
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const saveAccount = async () => {
    if (newPassword && newPassword !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setAccountSaving(true);
    try {
      const data = { username };
      if (newPassword) data.password = newPassword;
      await api.put(`/users/${user.id}`, data);
      toast.success('Account updated!');
      setNewPassword(''); setConfirmPassword('');
      // Update zustand store directly
      const store = useAuthStore.getState();
      if (store.setUser) store.setUser({ ...store.user, username });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update');
    } finally { setAccountSaving(false); }
  };

  const addWebhook = () => setWebhooks(p => [...p, { label: '', url: '' }]);
  const removeWebhook = (i) => setWebhooks(p => p.filter((_, idx) => idx !== i));
  const updateWebhook = (i, field, val) => setWebhooks(p => p.map((w, idx) => idx === i ? { ...w, [field]: val } : w));

  return (
    <div className="page">
      <h1 className="title">⚙ Profile</h1>
      <p className="text-muted" style={{ marginBottom: 32 }}>Manage your account and Discord webhook channels</p>

      {/* Account Settings */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="section-title" style={{ color: '#c9a84c' }}>👤 Account Settings</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label>Username</label>
            <input value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div>
            <label>Role</label>
            <input value={user?.role || ''} disabled style={{ opacity: 0.5, cursor: 'not-allowed' }} />
          </div>
          <div>
            <label>New Password <span style={{ color: '#555', fontSize: 11 }}>(leave blank to keep current)</span></label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password..." />
          </div>
          <div>
            <label>Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm new password..." />
          </div>
        </div>
        <button className="btn-primary btn-sm" onClick={saveAccount} disabled={accountSaving}>
          {accountSaving ? 'Saving…' : '✓ Save Account'}
        </button>
      </div>

      {/* Discord Webhooks */}
      <div className="card">
        <div className="section-title" style={{ color: '#c9a84c' }}>🔔 Discord Webhooks</div>
        <p style={{ color: '#555', fontSize: 13, marginBottom: 16 }}>
          Add webhooks for each Discord channel you want to receive dice rolls. Get the URL from Discord channel settings → Integrations → Webhooks.
        </p>
        {webhooks.map((wh, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center' }}>
            <input value={wh.label} onChange={e => updateWebhook(i, 'label', e.target.value)}
              placeholder="Channel name…" style={{ width: 160, flexShrink: 0 }} />
            <input value={wh.url} onChange={e => updateWebhook(i, 'url', e.target.value)}
              placeholder="https://discord.com/api/webhooks/…"
              style={{ flex: 1, fontFamily: 'Share Tech Mono, monospace', fontSize: 13 }} />
            <button onClick={() => removeWebhook(i)}
              style={{ background: 'transparent', border: '1px solid #f8717144', color: '#f87171', borderRadius: 6, padding: '6px 10px', cursor: 'pointer', fontSize: 14, flexShrink: 0 }}>✕</button>
          </div>
        ))}
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button className="btn-ghost btn-sm" onClick={addWebhook}>+ Add Webhook</button>
          <button className="btn-primary btn-sm" onClick={saveWebhooks} disabled={saving}>
            {saving ? 'Saving…' : '✓ Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
