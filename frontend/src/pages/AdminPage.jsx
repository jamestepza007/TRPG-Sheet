import { useState, useEffect } from 'react';
import api from '../utils/api.js';
import toast from 'react-hot-toast';

const ROLES = ['PLAYER', 'GM', 'ADMIN'];

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'PLAYER' });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    const res = await api.get('/users');
    setUsers(res.data);
  };

  const openCreate = () => { setEditUser(null); setForm({ username: '', email: '', password: '', role: 'PLAYER' }); setShowForm(true); };
  const openEdit = (u) => { setEditUser(u); setForm({ username: u.username, email: u.email, password: '', role: u.role }); setShowForm(true); };

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editUser) {
        const data = { username: form.username, email: form.email, role: form.role };
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

  const roleBadge = (role) => <span className={`badge badge-${role.toLowerCase()}`}>{role}</span>;

  return (
    <div className="page">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 className="title">Admin Panel</h1>
          <p className="text-muted">Manage users and access</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>+ Create User</button>
      </div>

      {/* Create/Edit form */}
      {showForm && (
        <div className="card" style={{ marginBottom: 24, borderColor: '#3a3a3a' }}>
          <div className="section-title">{editUser ? 'Edit User' : 'New User'}</div>
          <form onSubmit={submit}>
            <div className="grid-2 gap-4">
              <div>
                <label>Username</label>
                <input value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} required />
              </div>
              <div>
                <label>Email</label>
                <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
              </div>
              <div>
                <label>Password {editUser && '(leave blank to keep)'}</label>
                <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} {...(!editUser && { required: true })} />
              </div>
              <div>
                <label>Role</label>
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

      {/* Users table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
              {['Username', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, color: '#555', fontFamily: 'Cinzel, serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                <td style={{ padding: '12px 16px', fontFamily: 'Cinzel, serif', fontSize: 14 }}>{u.username}</td>
                <td style={{ padding: '12px 16px', color: '#777', fontSize: 14 }}>{u.email}</td>
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
    </div>
  );
}
