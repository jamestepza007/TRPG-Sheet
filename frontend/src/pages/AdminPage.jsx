import { useState, useEffect } from 'react';
import api from '../utils/api.js';
import toast from 'react-hot-toast';

const ROLES = ['PLAYER', 'GM', 'ADMIN'];

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [webhooks, setWebhooks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ username: '', password: '', role: 'PLAYER' });
  const [newWh, setNewWh] = useState({ label: '', url: '' });
  const [tab, setTab] = useState('users'); // 'users' | 'webhooks' | 'bgm'
  const [bgmTracks, setBgmTracks] = useState([]);
  const [newBgm, setNewBgm] = useState({ label: '', youtubeId: '' });
  const [editBgm, setEditBgm] = useState(null); // {id, label, youtubeId}

  useEffect(() => { fetchUsers(); fetchWebhooks(); fetchBgm(); }, []);

  const fetchUsers = async () => {
    const res = await api.get('/users');
    setUsers(res.data);
  };

  const fetchWebhooks = async () => {
    const res = await api.get('/webhooks');
    setWebhooks(res.data);
  };

  const fetchBgm = async () => {
    const res = await api.get('/bgm');
    setBgmTracks(res.data || []);
  };

  const addBgmTrack = async (e) => {
    e.preventDefault();
    // Extract YouTube ID from URL or use directly
    let youtubeId = newBgm.youtubeId.trim();
    const match = youtubeId.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (match) youtubeId = match[1];
    if (!youtubeId || youtubeId.length !== 11) return toast.error('Invalid YouTube URL or ID');
    try {
      await api.post('/bgm', { label: newBgm.label, youtubeId });
      toast.success('Track added!');
      setNewBgm({ label: '', youtubeId: '' });
      fetchBgm();
    } catch { toast.error('Failed to add track'); }
  };

  const saveBgmEdit = async () => {
    if (!editBgm) return;
    try {
      await api.put(`/bgm/${editBgm.id}`, { label: editBgm.label, youtubeId: editBgm.youtubeId });
      toast.success('Track updated!');
      setEditBgm(null);
      fetchBgm();
    } catch { toast.error('Failed to update'); }
  };

  const deleteBgmTrack = async (id) => {
    if (!confirm('Delete this track?')) return;
    await api.delete(`/bgm/${id}`);
    toast.success('Deleted');
    fetchBgm();
  };

  const openCreate = () => { setEditUser(null); setForm({ username: '', password: '', role: 'PLAYER' }); setShowForm(true); };
  const openEdit = (u) => { setEditUser(u); setForm({ username: u.username, password: '', role: u.role }); setShowForm(true); };

  const submitUser = async (e) => {
    e.preventDefault();
    try {
      if (editUser) {
        const data = { username: form.username, role: form.role };
        if (form.password) data.password = form.password;
        await api.put(`/users/${editUser.id}`, data);
        toast.success('User updated!');
      } else {
        await api.post('/users', form);
        toast.success('User created!');
      }
      setShowForm(false);
      fetchUsers();
    } catch (err) { toast.error(err.response?.data?.error || 'Error'); }
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    await api.delete(`/users/${id}`);
    toast.success('Deleted');
    fetchUsers();
  };

  const addWebhook = async (e) => {
    e.preventDefault();
    if (!newWh.url.trim().startsWith('https://discord.com/api/webhooks/'))
      return toast.error('Invalid Discord webhook URL');
    try {
      await api.post('/webhooks', newWh);
      toast.success('Webhook added!');
      setNewWh({ label: '', url: '' });
      fetchWebhooks();
    } catch { toast.error('Failed to add webhook'); }
  };

  const deleteWebhook = async (id) => {
    if (!confirm('Delete this webhook?')) return;
    await api.delete(`/webhooks/${id}`);
    toast.success('Deleted');
    fetchWebhooks();
  };

  const acc = '#c9a84c';
  const roleBadge = (role) => <span className={`badge badge-${role.toLowerCase()}`}>{role}</span>;

  return (
    <div className="page">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 className="title">Admin Panel</h1>
          <p className="text-muted">Manage users, access & global Discord webhooks</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid #2a2a2a', paddingBottom: 0 }}>
        {[['users','👥 Users'], ['webhooks','🔔 Discord Webhooks'], ['bgm','🎵 BGM Tracks']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            style={{ background: 'none', border: 'none', borderBottom: tab === key ? `2px solid ${acc}` : '2px solid transparent', color: tab === key ? acc : '#555', fontFamily: 'Cinzel, serif', fontSize: 13, letterSpacing: '0.08em', padding: '10px 16px', cursor: 'pointer', marginBottom: -1, transition: 'color 0.2s' }}>
            {label}
          </button>
        ))}
      </div>

      {/* ── Users tab ── */}
      {tab === 'users' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button className="btn-primary" onClick={openCreate}>+ Create User</button>
          </div>

          {showForm && (
            <div className="card" style={{ marginBottom: 24, borderColor: '#3a3a3a' }}>
              <div className="section-title">{editUser ? 'Edit User' : 'New User'}</div>
              <form onSubmit={submitUser}>
                <div className="grid-2 gap-4">
                  <div><label>Username</label><input value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} required /></div>
                <div><label>Password {editUser && '(leave blank to keep)'}</label><input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} {...(!editUser && { required: true })} /></div>
                  <div><label>Role</label>
                    <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button type="submit" className="btn-primary btn-sm">{editUser ? 'Update' : 'Create'}</button>
                  <button type="button" className="btn-ghost btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
                  {['Username','Role','Joined','Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, color: '#555', fontFamily: 'Cinzel, serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                    <td style={{ padding: '12px 16px', fontFamily: 'Cinzel, serif', fontSize: 14 }}>{u.username}</td>
<td style={{ padding: '12px 16px' }}>{roleBadge(u.role)}</td>
                    <td style={{ padding: '12px 16px', color: '#555', fontSize: 13 }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div className="flex gap-2">
                        <button className="btn-ghost btn-sm" onClick={() => openEdit(u)}>Edit</button>
                        <button className="btn-danger btn-sm" onClick={() => deleteUser(u.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── BGM tab ── */}
      {tab === 'bgm' && (
        <>
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="section-title" style={{ color: acc }}>Add BGM Track</div>
            <p style={{ color: '#555', fontSize: 13, marginBottom: 16 }}>
              Paste a YouTube URL or video ID. Players can select tracks in Audio Settings.
            </p>
            <form onSubmit={addBgmTrack}>
              <div className="grid-2 gap-4">
                <div>
                  <label>Track Name</label>
                  <input value={newBgm.label} onChange={e => setNewBgm(p => ({ ...p, label: e.target.value }))} required placeholder="e.g. Dungeon Ambience" />
                </div>
                <div>
                  <label>YouTube URL or Video ID</label>
                  <input value={newBgm.youtubeId} onChange={e => setNewBgm(p => ({ ...p, youtubeId: e.target.value }))} required placeholder="https://youtube.com/watch?v=... or ID" style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 13 }} />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button type="submit" className="btn-primary btn-sm">+ Add Track</button>
              </div>
            </form>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {bgmTracks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#444', fontFamily: 'Cinzel, serif', fontSize: 14 }}>
                No BGM tracks yet.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
                    {['Track Name', 'YouTube ID', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, color: '#555', fontFamily: 'Cinzel, serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bgmTracks.map(t => (
                    <tr key={t.id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                      <td style={{ padding: '10px 16px' }}>
                        {editBgm?.id === t.id
                          ? <input value={editBgm.label} onChange={e => setEditBgm(p => ({ ...p, label: e.target.value }))} style={{ fontFamily: 'Cinzel, serif', fontSize: 13, background: '#1a1a1a', border: '1px solid #3a3a3a', color: '#e8e8e8', padding: '4px 8px', borderRadius: 4 }} />
                          : <span style={{ fontFamily: 'Cinzel, serif', fontSize: 14, color: acc }}>🎵 {t.label}</span>
                        }
                      </td>
                      <td style={{ padding: '10px 16px' }}>
                        {editBgm?.id === t.id
                          ? <input value={editBgm.youtubeId} onChange={e => setEditBgm(p => ({ ...p, youtubeId: e.target.value }))} style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, background: '#1a1a1a', border: '1px solid #3a3a3a', color: '#888', padding: '4px 8px', borderRadius: 4, width: 120 }} />
                          : <a href={`https://youtube.com/watch?v=${t.youtubeId}`} target="_blank" rel="noreferrer" style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color: '#555' }}>{t.youtubeId}</a>
                        }
                      </td>
                      <td style={{ padding: '10px 16px' }}>
                        <div className="flex gap-2">
                          {editBgm?.id === t.id ? (
                            <>
                              <button className="btn-primary btn-sm" onClick={saveBgmEdit}>Save</button>
                              <button className="btn-ghost btn-sm" onClick={() => setEditBgm(null)}>Cancel</button>
                            </>
                          ) : (
                            <>
                              <button className="btn-ghost btn-sm" onClick={() => setEditBgm({ ...t })}>Edit</button>
                              <button className="btn-danger btn-sm" onClick={() => deleteBgmTrack(t.id)}>Delete</button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* ── Webhooks tab ── */}
      {tab === 'webhooks' && (
        <>
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="section-title" style={{ color: acc }}>Add Global Discord Webhook</div>
            <p style={{ color: '#555', fontSize: 13, marginBottom: 16 }}>
              Global webhooks are available to ALL users when sending dice rolls to Discord.
              Get the URL from Discord channel settings → Integrations → Webhooks.
            </p>
            <form onSubmit={addWebhook}>
              <div className="grid-2 gap-4">
                <div>
                  <label>Channel Name</label>
                  <input value={newWh.label} onChange={e => setNewWh(p => ({ ...p, label: e.target.value }))} required placeholder="e.g. #dice-rolls" />
                </div>
                <div>
                  <label>Webhook URL</label>
                  <input value={newWh.url} onChange={e => setNewWh(p => ({ ...p, url: e.target.value }))} required placeholder="https://discord.com/api/webhooks/..." style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 13 }} />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button type="submit" className="btn-primary btn-sm">+ Add Webhook</button>
              </div>
            </form>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {webhooks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#444', fontFamily: 'Cinzel, serif', fontSize: 14 }}>
                No global webhooks yet.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
                    {['Channel','URL','Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, color: '#555', fontFamily: 'Cinzel, serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {webhooks.map(w => (
                    <tr key={w.id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                      <td style={{ padding: '12px 16px', fontFamily: 'Cinzel, serif', fontSize: 14, color: acc }}>{w.label}</td>
                      <td style={{ padding: '12px 16px', color: '#555', fontSize: 12, fontFamily: 'Share Tech Mono, monospace', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.url}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <button className="btn-danger btn-sm" onClick={() => deleteWebhook(w.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
