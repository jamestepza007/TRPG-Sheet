import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuth.js';
import api from '../utils/api.js';
import { systemList } from '../utils/systems.js';
import toast from 'react-hot-toast';

// ── Modal ────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={onClose}>
      <div style={{ background: '#161616', border: '1px solid #3d2510', borderRadius: 10, padding: 32, width: '100%', maxWidth: 480, boxShadow: '0 0 60px rgba(201,168,76,0.07)' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 18, color: '#c9a84c', letterSpacing: '0.1em' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#444', fontSize: 20, cursor: 'pointer' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Image upload helper (resize + compress) ──────────────────────
function useImageUpload(onResult) {
  const ref = useRef();
  const trigger = () => ref.current?.click();
  const input = (
    <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }}
      onChange={e => {
        const file = e.target.files?.[0];
        if (!file) return;
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const size = Math.min(img.width, img.height, 480);
          canvas.width = size; canvas.height = size;
          const ctx = canvas.getContext('2d');
          const sx = (img.width - size) / 2, sy = (img.height - size) / 2;
          ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size);
          onResult(canvas.toDataURL('image/jpeg', 0.72));
          URL.revokeObjectURL(url);
          e.target.value = '';
        };
        img.src = url;
      }} />
  );
  return { trigger, input };
}

// ── Campaign card with cover image upload (GM only) ──────────────
function CampaignCard({ camp, onNavigate, onImageUpload }) {
  const acc = '#c9a84c';
  return (
    <div style={{ background: '#161616', border: '1px solid #3d2510', borderRadius: 8, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s, box-shadow 0.2s', position: 'relative' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = acc; e.currentTarget.style.boxShadow = '0 0 20px rgba(201,168,76,0.07)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#3d2510'; e.currentTarget.style.boxShadow = 'none'; }}>

      {/* Cover image */}
      <div style={{ height: 90, background: '#0d0d0d', overflow: 'hidden', position: 'relative' }}
        onClick={() => onNavigate(camp.id)}>
        {camp.coverImage
          ? <img src={camp.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 32, color: '#1a1a1a' }}>📜</div>
        }
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
      </div>

      {/* Upload button (top-right corner) */}
      <button
        onClick={e => { e.stopPropagation(); onImageUpload(camp.id); }}
        style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.65)', border: `1px solid ${acc}55`, color: acc, borderRadius: 5, padding: '3px 8px', fontSize: 10, cursor: 'pointer', fontFamily: 'Cinzel, serif', letterSpacing: '0.06em', zIndex: 2 }}
        title="Upload cover image">
        🖼
      </button>

      {/* Info */}
      <div style={{ padding: '12px 14px' }} onClick={() => onNavigate(camp.id)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ fontFamily: 'Cinzel, serif', fontSize: 15, color: acc }}>{camp.name}</span>
          <span className="badge badge-fantasy" style={{ fontSize: 9 }}>{camp.system.replace('_', ' ')}</span>
        </div>
        <div style={{ color: '#555', fontSize: 12 }}>
          {camp.party?.members?.length || 0} players · <code style={{ fontSize: 10 }}>{camp.inviteCode?.slice(0, 8)}…</code>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [characters, setCharacters] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [myParties, setMyParties] = useState([]);
  const [modal, setModal] = useState(null);
  const [newChar, setNewChar] = useState({ name: '', system: 'DUNGEON_WORLD' });
  const [inviteCode, setInviteCode] = useState('');
  const [selectedCharId, setSelectedCharId] = useState('');
  const [newCampaign, setNewCampaign] = useState({ name: '', system: 'DUNGEON_WORLD', description: '' });
  const [editingCharId, setEditingCharId] = useState(null);
  const [editingCharName, setEditingCharName] = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [charRes, partyRes] = await Promise.all([api.get('/characters'), api.get('/parties/mine')]);
      setCharacters(Array.isArray(charRes.data) ? charRes.data : []);
      setMyParties(Array.isArray(partyRes.data) ? partyRes.data : []);
      if (user?.role === 'GM' || user?.role === 'ADMIN') {
        const campRes = await api.get('/campaigns');
        setCampaigns(campRes.data);
      }
    } catch {}
  };

  const closeModal = () => setModal(null);

  const renameChar = async (charId, newName) => {
    if (!newName.trim()) return;
    try {
      await api.put(`/characters/${charId}`, { name: newName.trim() });
      setCharacters(prev => prev.map(c => c.id === charId ? { ...c, name: newName.trim() } : c));
      toast.success('Renamed!');
    } catch { toast.error('Failed to rename'); }
    setEditingCharId(null);
  };

  const createCharacter = async (e) => {
    e.preventDefault();
    try {
      const sys = systemList.find(s => s.id === newChar.system);
      // Use system's own default sheet if available, otherwise DW defaults
      let defaultData;
      if (sys?.getDefaultSheet) {
        defaultData = sys.getDefaultSheet();
      } else {
        defaultData = { level: 1, xp: 0, maxHP: 10, currentHP: 10, maxStamina: 10, currentStamina: 10, maxMana: 10, currentMana: 10, armor: 0, class: '', race: '', moves: '', gear: '', bonds: '', notes: '', portrait: '' };
        sys?.stats.forEach(s => { defaultData[s.key] = 10; });
      }
      const res = await api.post('/characters', { ...newChar, sheetData: defaultData });
      toast.success('Character created!');
      closeModal();
      // Route to correct page based on system
      if (newChar.system === 'CAIN') {
        navigate(`/characters/cain/${res.data.id}`);
      } else {
        navigate(`/characters/${res.data.id}`);
      }
    } catch { toast.error('Failed to create character'); }
  };

  const joinParty = async (e) => {
    e.preventDefault();
    try {
      await api.post('/parties/join', { inviteCode, characterId: selectedCharId });
      toast.success('Joined party!');
      closeModal();
      fetchAll();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to join'); }
  };

  const createCampaign = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/campaigns', newCampaign);
      toast.success('Campaign created!');
      closeModal();
      setCampaigns(p => [...p, res.data]);
    } catch { toast.error('Failed to create campaign'); }
  };

  // Campaign cover image upload
  const uploadCoverImageFor = useRef(null);
  const { trigger: triggerCover, input: coverInput } = useImageUpload(async (dataUrl) => {
    const campId = uploadCoverImageFor.current;
    if (!campId) return;
    try {
      await api.put(`/campaigns/${campId}`, { coverImage: dataUrl });
      setCampaigns(prev => prev.map(c => c.id === campId ? { ...c, coverImage: dataUrl } : c));
      toast.success('Cover updated!');
    } catch { toast.error('Upload failed'); }
  });

  const handleCampaignImageUpload = (campId) => {
    uploadCoverImageFor.current = campId;
    triggerCover();
  };

  const acc = '#c9a84c';

  return (
    <div className="page">
      {coverInput}

      {/* Welcome */}
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: 30, color: acc, letterSpacing: '0.05em' }}>🎲 Welcome, {user?.username}</h1>
        <p style={{ color: '#555', marginTop: 4, fontSize: 16 }}>Your adventure awaits.</p>
      </div>

      {/* ── Characters ── */}
      <section style={{ marginBottom: 44 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>My Characters</h2>
          <button className="btn-primary btn-sm" onClick={() => setModal('newChar')}>+ New Character</button>
        </div>
        {characters.length === 0 ? (
          <div style={{ background: '#161616', border: '1px solid #2a2a2a', borderRadius: 8, textAlign: 'center', padding: 48, color: '#333' }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>⚔</div>
            <p style={{ fontFamily: 'Cinzel, serif', fontSize: 14 }}>No characters yet. Forge your first hero!</p>
          </div>
        ) : (
          <div className="grid-3">
            {characters.map(char => (
              <div key={char.id} onClick={() => { if (editingCharId === char.id) return; navigate(char.system === 'CAIN' ? `/characters/cain/${char.id}` : `/characters/${char.id}`); }}
                style={{ background: '#161616', border: '1px solid #3d2510', borderRadius: 8, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s, box-shadow 0.2s', position: 'relative', minHeight: 200 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = acc; e.currentTarget.style.boxShadow = `0 0 24px rgba(201,168,76,0.12)`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#3d2510'; e.currentTarget.style.boxShadow = 'none'; }}>

                {/* Full portrait background */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                  {char.sheetData?.portrait
                    ? <img src={char.sheetData.portrait} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                    : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 48, color: '#1a1a1a', background: '#0d0d0d' }}>🧙</div>
                  }
                  {/* Dark gradient overlay for readability */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,6,2,0.97) 0%, rgba(10,6,2,0.6) 45%, rgba(10,6,2,0.1) 100%)' }} />
                </div>

                {/* DW badge top-right */}
                <span className="badge badge-fantasy" style={{ position: 'absolute', top: 8, right: 8, fontSize: 9, zIndex: 2 }}>{char.system === 'CAIN' ? 'CAIN' : 'DW'}</span>

                {/* Info overlaid at bottom */}
                <div style={{ position: 'relative', zIndex: 1, padding: '100px 14px 14px' }}>
                  {editingCharId === char.id ? (
                    <input
                      autoFocus
                      value={editingCharName}
                      onChange={e => setEditingCharName(e.target.value)}
                      onBlur={() => renameChar(char.id, editingCharName)}
                      onKeyDown={e => { if (e.key === 'Enter') renameChar(char.id, editingCharName); if (e.key === 'Escape') setEditingCharId(null); }}
                      onClick={e => e.stopPropagation()}
                      style={{ fontFamily: 'Cinzel, serif', fontSize: 15, color: acc, background: 'rgba(0,0,0,0.6)', border: `1px solid ${acc}`, borderRadius: 4, padding: '2px 6px', width: '100%', marginBottom: 2 }}
                    />
                  ) : (
                    <div
                      onDoubleClick={e => { e.stopPropagation(); setEditingCharId(char.id); setEditingCharName(char.name); }}
                      title="Double-click to rename"
                      style={{ fontFamily: 'Cinzel, serif', fontSize: 17, color: acc, marginBottom: 2, textShadow: '0 2px 8px rgba(0,0,0,0.8)', cursor: 'text' }}>{char.name} <span style={{ fontSize: 9, opacity: 0.4 }}>✎</span></div>
                  )}
                  <div style={{ color: '#888', fontSize: 12, textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>{char.system === 'CAIN'
                        ? `CAT ${['I','II','III','IV','V'][(char.sheetData?.cat || 1) - 1] || 'I'}`
                        : `${char.sheetData?.class || '—'} · Lv.${char.sheetData?.level || 1}`
                      }</div>
                  {char.system === 'CAIN' ? (
                    <div style={{ marginTop: 8 }}>
                      {(() => {
                        const sd = char.sheetData || {};
                        const inj = sd.injuries || 0;
                        const eMax = sd.resilientAgenda ? 6 : Math.max(1, 6 - inj);
                        const str = sd.stress || 0;
                        return (
                          <>
                            <div style={{ display: 'flex', gap: 1, marginBottom: 3 }}>
                              {Array.from({ length: eMax }, (_, i) => (
                                <div key={i} style={{ flex: 1, height: 5, background: i < str ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)', borderRadius: 1 }} />
                              ))}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ fontSize: 9, color: '#aaa', textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>EXEC {eMax - str}/{eMax}</div>
                              {inj > 0 && (
                                <div style={{ display: 'flex', gap: 2 }}>
                                  {Array.from({ length: 5 }, (_, i) => (
                                    <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: i < inj ? '#f87171' : 'rgba(255,255,255,0.2)' }} />
                                  ))}
                                </div>
                              )}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  ) : char.sheetData?.currentHP !== undefined && (
                    <div style={{ marginTop: 10 }}>
                      <div style={{ background: 'rgba(0,0,0,0.5)', borderRadius: 4, height: 5, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: '#4ade80', borderRadius: 4, width: `${Math.max(0, Math.min(100, (char.sheetData.currentHP / (char.sheetData.maxHP || 1)) * 100))}%`, transition: 'width 0.3s' }} />
                      </div>
                      <div style={{ color: '#666', fontSize: 11, marginTop: 3, textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>{char.sheetData.currentHP} / {char.sheetData.maxHP} HP</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Parties ── */}
      <section style={{ marginBottom: 44 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>My Parties</h2>
          <button className="btn-primary btn-sm" onClick={() => setModal('joinParty')}>+ Join Party</button>
        </div>
        {myParties.length === 0 ? (
          <div style={{ background: '#161616', border: '1px solid #2a2a2a', borderRadius: 8, textAlign: 'center', padding: 48, color: '#333' }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🛡</div>
            <p style={{ fontFamily: 'Cinzel, serif', fontSize: 14 }}>Not in any party yet.</p>
          </div>
        ) : (
          <div className="grid-2">
            {myParties.map(member => {
              const campCover = member.party.campaign.coverImage;
              return (
                <div key={member.id} onClick={() => navigate(`/party/${member.party.id}`)}
                  style={{ background: '#161616', border: '1px solid #3d2510', borderRadius: 8, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = acc}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#3d2510'}>

                  {/* Cover */}
                  <div style={{ height: 70, background: '#0d0d0d', overflow: 'hidden', position: 'relative' }}>
                    {campCover
                      ? <img src={campCover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 28, color: '#1a1a1a' }}>🛡</div>
                    }
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(22,22,22,0.85) 0%, transparent 60%)' }} />
                  </div>

                  <div style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontFamily: 'Cinzel, serif', fontSize: 15, color: acc }}>{member.party.campaign.name}</span>
                      <span style={{ color: '#555', fontSize: 11 }}>GM: {member.party.campaign.gm.username}</span>
                    </div>
                    <div style={{ color: '#666', fontSize: 12 }}>
                      Playing as: <span style={{ color: '#aaa' }}>{member.character.name}</span> · {member.party.members.length} members
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Campaigns (GM/Admin) ── */}
      {(user?.role === 'GM' || user?.role === 'ADMIN') && (
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>My Campaigns</h2>
            <button className="btn-primary btn-sm" onClick={() => setModal('newCampaign')}>+ New Campaign</button>
          </div>
          {campaigns.length === 0 ? (
            <div style={{ background: '#161616', border: '1px solid #2a2a2a', borderRadius: 8, textAlign: 'center', padding: 48, color: '#333' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>📜</div>
              <p style={{ fontFamily: 'Cinzel, serif', fontSize: 14 }}>No campaigns yet.</p>
            </div>
          ) : (
            <div className="grid-3">
              {campaigns.map(camp => (
                <CampaignCard key={camp.id} camp={camp}
                  onNavigate={(id) => navigate(`/campaigns/${id}`)}
                  onImageUpload={handleCampaignImageUpload}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── Modals ── */}
      {modal === 'newChar' && (
        <Modal title="⚔ Create New Character" onClose={closeModal}>
          <form onSubmit={createCharacter}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div><label>Character Name</label><input value={newChar.name} onChange={e => setNewChar(p => ({ ...p, name: e.target.value }))} required placeholder="Enter name…" autoFocus /></div>
              <div><label>System</label>
                <select value={newChar.system} onChange={e => setNewChar(p => ({ ...p, system: e.target.value }))}>
                  {systemList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button type="submit" className="btn-primary" style={{ flex: 1 }}>Create</button>
              <button type="button" className="btn-ghost" onClick={closeModal} style={{ flex: 1 }}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'joinParty' && (
        <Modal title="🛡 Join a Party" onClose={closeModal}>
          <form onSubmit={joinParty}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div><label>Invite Code</label><input value={inviteCode} onChange={e => setInviteCode(e.target.value)} required placeholder="Paste invite code…" autoFocus /></div>
              <div><label>Select Character</label>
                <select value={selectedCharId} onChange={e => setSelectedCharId(e.target.value)} required>
                  <option value="">Choose a character…</option>
                  {characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button type="submit" className="btn-primary" style={{ flex: 1 }}>Join</button>
              <button type="button" className="btn-ghost" onClick={closeModal} style={{ flex: 1 }}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'newCampaign' && (
        <Modal title="📜 New Campaign" onClose={closeModal}>
          <form onSubmit={createCampaign}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div><label>Campaign Name</label><input value={newCampaign.name} onChange={e => setNewCampaign(p => ({ ...p, name: e.target.value }))} required placeholder="Enter name…" autoFocus /></div>
              <div><label>System</label>
                <select value={newCampaign.system} onChange={e => setNewCampaign(p => ({ ...p, system: e.target.value }))}>
                  {systemList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div><label>Description (optional)</label><textarea value={newCampaign.description} onChange={e => setNewCampaign(p => ({ ...p, description: e.target.value }))} rows={2} placeholder="Campaign description…" /></div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button type="submit" className="btn-primary" style={{ flex: 1 }}>Create</button>
              <button type="button" className="btn-ghost" onClick={closeModal} style={{ flex: 1 }}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
