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
  const [tab, setTab] = useState('users'); // 'users' | 'webhooks' | 'bgm' | 'invites'
  const [invites, setInvites] = useState([]);
  const [newInvite, setNewInvite] = useState({ maxUses: 1, note: '' });
  const [whPopupUser, setWhPopupUser] = useState(null); // user object for webhook popup
  const [whSearch, setWhSearch] = useState('');
  const [bgmTracks, setBgmTracks] = useState([]);
  const [newBgm, setNewBgm] = useState({ label: '', youtubeId: '' });
  const [editBgm, setEditBgm] = useState(null); // {id, label, youtubeId}

  useEffect(() => { fetchUsers(); fetchWebhooks(); fetchBgm(); fetchInvites(); }, []);

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

  const fetchInvites = async () => {
    try {
      const res = await api.get('/invites');
      setInvites(res.data);
    } catch {}
  };

  const createInvite = async () => {
    try {
      const res = await api.post('/invites', { maxUses: parseInt(newInvite.maxUses) || 1, note: newInvite.note });
      setInvites(p => [res.data, ...p]);
      setNewInvite({ maxUses: 1, note: '' });
      toast.success('Invite code created!');
    } catch { toast.error('Failed'); }
  };

  const deleteInvite = async (id) => {
    await api.delete(`/invites/${id}`).catch(() => {});
    setInvites(p => p.filter(i => i.id !== id));
    toast.success('Deleted');
  };

  const copyInviteLink = (code) => {
    const url = `${window.location.origin}/register?code=${code}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied!');
  };

  const updateWebhookPerms = async (webhookId, allowedUsers) => {
    try {
      await api.put(`/webhooks/${webhookId}/permissions`, { allowedUsers });
      fetchWebhooks();
      toast.success('Permissions updated!');
    } catch { toast.error('Failed'); }
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

  // ── Webhook Permission Popup ──────────────────────────────────────
  const WebhookPopup = () => {
    if (!whPopupUser) return null;
    const filtered = webhooks.filter(w =>
      !whSearch.trim() || w.label.toLowerCase().includes(whSearch.toLowerCase())
    );
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onClick={() => { setWhPopupUser(null); setWhSearch(''); }}>
        <div style={{ background: '#111', border: '1px solid #333', borderRadius: 12, maxWidth: 500, width: '92%', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
          onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #222' }}>
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: 14, color: acc, marginBottom: 4 }}>
              🔔 Webhook — {whPopupUser.username}
            </div>
            <input
              autoFocus
              value={whSearch}
              onChange={e => setWhSearch(e.target.value)}
              placeholder="ค้นหา webhook..."
              style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: 6, padding: '7px 12px', color: '#eee', fontSize: 12, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          {/* Webhook list */}
          <div style={{ overflowY: 'auto', padding: '8px 0', flex: 1 }}>
            {filtered.length === 0 && <div style={{ color: '#555', padding: '20px', textAlign: 'center', fontSize: 12 }}>ไม่พบ webhook</div>}
            {filtered.map(w => {
              const allowed = Array.isArray(w.allowedUsers) ? w.allowedUsers.includes(whPopupUser.id) : true;
              const isOpenAll = !w.allowedUsers; // null = all
              const cur = Array.isArray(w.allowedUsers) ? w.allowedUsers : [];
              return (
                <div key={w.id}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', borderBottom: '1px solid #1a1a1a', cursor: 'pointer', background: allowed ? 'rgba(201,168,76,0.05)' : 'transparent' }}
                  onClick={() => {
                    if (isOpenAll) {
                      // Convert to specific list excluding this user
                      const allExcept = users.filter(u => u.id !== whPopupUser.id).map(u => u.id);
                      updateWebhookPerms(w.id, allExcept);
                    } else {
                      const next = allowed ? cur.filter(id => id !== whPopupUser.id) : [...cur, whPopupUser.id];
                      updateWebhookPerms(w.id, next.length === 0 ? [] : next);
                    }
                  }}>
                  {/* Toggle */}
                  <div style={{ width: 32, height: 18, borderRadius: 9, background: allowed ? acc : '#333', position: 'relative', flexShrink: 0, transition: 'background 0.2s', cursor: 'pointer' }}>
                    <div style={{ position: 'absolute', top: 2, left: allowed ? 15 : 2, width: 14, height: 14, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: allowed ? '#eee' : '#555', fontSize: 13, fontFamily: 'Cinzel, serif' }}>{w.label}</div>
                    <div style={{ color: '#333', fontSize: 10, fontFamily: 'monospace' }}>{w.url.slice(0, 50)}...</div>
                  </div>
                  <div style={{ fontSize: 10, color: isOpenAll ? '#4ade80' : allowed ? acc : '#444' }}>
                    {isOpenAll ? '🌐 ทุกคน' : allowed ? '✓ เข้าถึงได้' : '✕ ไม่มีสิทธิ์'}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Footer */}
          <div style={{ padding: '12px 20px', borderTop: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={() => { updateWebhookPerms(null, null); /* reset all */ }}
              style={{ fontSize: 11, color: '#555', background: 'transparent', border: 'none', cursor: 'pointer' }}>
            </button>
            <button onClick={() => { setWhPopupUser(null); setWhSearch(''); }}
              style={{ padding: '6px 20px', background: '#1a1a1a', border: '1px solid #333', borderRadius: 6, color: '#aaa', cursor: 'pointer', fontSize: 12, fontFamily: 'Cinzel, serif' }}>
              CLOSE
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="page">
      <WebhookPopup />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 className="title">Admin Panel</h1>
          <p className="text-muted">Manage users, access & global Discord webhooks</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid #2a2a2a', paddingBottom: 0 }}>
        {[['users','👥 Users'], ['invites','🔑 Invite Codes'], ['webhooks','🔔 Discord Webhooks'], ['bgm','🎵 BGM Tracks']].map(([key, label]) => (
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
                        <button className="btn-ghost btn-sm" onClick={() => { setWhPopupUser(u); setWhSearch(''); }}
                          style={{ borderColor: '#c9a84c44', color: '#c9a84c' }}>🔔 Webhook</button>
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
      {/* ── Invites tab ── */}
      {tab === 'invites' && (
        <div>
          {/* Create new invite */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="section-title" style={{ color: acc, marginBottom: 12 }}>🔑 สร้าง Invite Code ใหม่</div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div>
                <label>จำนวนครั้งที่ใช้ได้</label>
                <input type="number" min="1" max="100" value={newInvite.maxUses}
                  onChange={e => setNewInvite(p => ({ ...p, maxUses: e.target.value }))}
                  style={{ width: 80 }} />
              </div>
              <div style={{ flex: 1 }}>
                <label>Note (optional)</label>
                <input value={newInvite.note} onChange={e => setNewInvite(p => ({ ...p, note: e.target.value }))}
                  placeholder="เช่น สำหรับ session 3..." />
              </div>
              <button className="btn-primary" onClick={createInvite}>+ สร้าง Code</button>
            </div>
          </div>

          {/* Invite list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {invites.length === 0 && <div className="text-muted">ยังไม่มี invite code</div>}
            {invites.map(inv => (
              <div key={inv.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 700, color: acc, letterSpacing: '0.2em', minWidth: 100 }}>{inv.code}</div>
                <div style={{ flex: 1 }}>
                  {inv.note && <div style={{ fontSize: 12, color: '#aaa', marginBottom: 2 }}>{inv.note}</div>}
                  <div style={{ fontSize: 11, color: inv.usedCount >= inv.maxUses ? '#f87171' : '#4ade80' }}>
                    ใช้แล้ว {inv.usedCount} / {inv.maxUses} {inv.usedCount >= inv.maxUses ? '— เต็มแล้ว' : ''}
                  </div>
                </div>
                <button onClick={() => copyInviteLink(inv.code)}
                  style={{ padding: '6px 14px', background: '#1a1a1a', border: `1px solid ${acc}`, color: acc, borderRadius: 6, cursor: 'pointer', fontSize: 11, fontFamily: 'Cinzel, serif' }}>
                  📋 Copy Link
                </button>
                <button onClick={() => deleteInvite(inv.id)}
                  style={{ padding: '6px 12px', background: '#1a1a1a', border: '1px solid #f87171', color: '#f87171', borderRadius: 6, cursor: 'pointer', fontSize: 11 }}>
                  ลบ
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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
                      <td style={{ padding: '12px 16px', color: '#555', fontSize: 12, fontFamily: 'Share Tech Mono, monospace', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.url}</td>
                      <td style={{ padding: '12px 16px' }}>
                        {/* Permission toggles per user */}
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>
                          <button onClick={() => updateWebhookPerms(w.id, null)}
                            style={{ padding: '2px 8px', fontSize: 10, borderRadius: 4, cursor: 'pointer', border: '1px solid #444', background: !w.allowedUsers ? acc : 'transparent', color: !w.allowedUsers ? '#000' : '#666' }}>
                            🌐 ทุกคน
                          </button>
                          {users.map(u => {
                            const allowed = Array.isArray(w.allowedUsers) && w.allowedUsers.includes(u.id);
                            const cur = Array.isArray(w.allowedUsers) ? w.allowedUsers : [];
                            return (
                              <button key={u.id}
                                onClick={() => updateWebhookPerms(w.id, allowed ? cur.filter(id => id !== u.id) : [...cur, u.id])}
                                style={{ padding: '2px 8px', fontSize: 10, borderRadius: 4, cursor: 'pointer', border: `1px solid ${allowed ? acc : '#333'}`, background: allowed ? acc + '22' : 'transparent', color: allowed ? acc : '#555' }}>
                                {allowed ? '✓' : '+'} {u.username}
                              </button>
                            );
                          })}
                        </div>
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
