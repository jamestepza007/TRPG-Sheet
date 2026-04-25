import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api.js';
import { getSystem } from '../utils/systems.js';
import DiceRoller from '../components/DiceRoller.jsx';
import toast from 'react-hot-toast';
import { handleBgmSync } from '../components/AudioSettings.jsx';

function VitalMini({ label, current, max, color }) {
  const pct = Math.max(0, Math.min(100, ((current || 0) / (max || 1)) * 100));
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontSize: 10, color: '#555', fontFamily: 'Cinzel, serif', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
        <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color }}>{current ?? '?'} / {max ?? '?'}</span>
      </div>
      <div style={{ background: '#1a1a1a', borderRadius: 4, height: 8, overflow: 'hidden', position: 'relative' }}>
        <div style={{ height: '100%', background: color, width: `${pct}%`, transition: 'width 0.3s', borderRadius: 4 }} />
        <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: 'rgba(255,255,255,0.6)', fontFamily: 'Cinzel, serif' }}>
          {Math.round(pct)}%
        </span>
      </div>
    </div>
  );
}

export default function CampaignPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bgmUrl, setBgmUrl] = useState('');
  const [bgmLabel, setBgmLabel] = useState('');
  const [bgmQueue, setBgmQueue] = useState([]);
  const [bgmPlaying, setBgmPlaying] = useState(null);
  const [campaign, setCampaign] = useState(null);
  const [system, setSystem] = useState(null);
  const [connected, setConnected] = useState(false);
  const sseRef = useRef(null);

  useEffect(() => {
    if (id === 'new') return;
    fetchCampaign();
    return () => { sseRef.current?.close(); };
  }, [id]);

  const fetchCampaign = async () => {
    try {
      const res = await api.get(`/campaigns/${id}`);
      // Route CAIN campaigns to GM sheet
      if (res.data.system === 'CAIN') {
        navigate(`/campaigns/cain/${id}`, { replace: true });
        return;
      }
      setCampaign(res.data);
      if (res.data.gmSheetData?.bgmPlaylist) setBgmQueue(res.data.gmSheetData.bgmPlaylist);
      setSystem(getSystem(res.data.system));
      if (res.data.party?.id) startSSE(res.data.party.id);
    } catch { toast.error('Campaign not found'); navigate('/'); }
  };

  const startSSE = (partyId) => {
    if (sseRef.current) sseRef.current.close();
    const token = localStorage.getItem('token');
    const baseUrl = import.meta.env.VITE_API_URL || '/api';
    const es = new EventSource(`${baseUrl}/sse/party/${partyId}?token=${token}`);
    sseRef.current = es;
    es.onopen = () => setConnected(true);
    es.onerror = () => { setConnected(false); setTimeout(() => startSSE(partyId), 5000); };
    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === 'character_updated') {
          setCampaign(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              party: {
                ...prev.party,
                members: prev.party.members.map(m =>
                  m.character.id === data.characterId
                    ? { ...m, character: { ...m.character, sheetData: data.sheetData, name: data.name } }
                    : m
                )
              }
            };
          });
        }
      } catch {}
    };
  };

  const kickPlayer = async (userId) => {
    if (!confirm('Remove this player?')) return;
    await api.delete(`/parties/${campaign.party.id}/members/${userId}`);
    toast.success('Player removed');
    fetchCampaign();
  };

  const deleteCampaign = async () => {
    if (!confirm('Delete this campaign?')) return;
    await api.delete(`/campaigns/${id}`);
    navigate('/');
  };

  if (!campaign || !system) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
      <div style={{ color: '#555', fontFamily: 'Cinzel, serif' }}>Loading…</div>
    </div>
  );

  const acc = system.accentColor;
  const members = campaign.party?.members || [];

  return (
    <div className="theme-fantasy" style={{ minHeight: '100vh' }}>
      <div className="page">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, paddingBottom: 18, borderBottom: `1px solid ${acc}33` }}>
          <div>
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: 26, color: acc }}>{campaign.name}</div>
            <div style={{ color: '#555', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
              {system.name} · {members.length} Players
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: connected ? '#4ade80' : '#f87171', display: 'inline-block', boxShadow: connected ? '0 0 6px #4ade80' : 'none' }} />
                <span style={{ color: connected ? '#4ade80' : '#f87171' }}>{connected ? 'Live' : 'Offline'}</span>
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-ghost btn-sm" onClick={() => navigate('/')}>← Back</button>
            <button className="btn-danger btn-sm" onClick={deleteCampaign}>Delete</button>
          </div>
        </div>

        {/* Invite code */}
        <div style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${acc}22`, borderRadius: 8, padding: 16, marginBottom: 24 }}>
          <div className="section-title" style={{ color: acc }}>📋 Invite Code</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <code style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 15, color: acc, background: 'rgba(0,0,0,0.4)', padding: '8px 16px', borderRadius: 6, flex: 1 }}>
              {campaign.inviteCode}
            </code>
            <button className="btn-ghost btn-sm" onClick={() => { navigator.clipboard.writeText(campaign.inviteCode); toast.success('Copied!'); }}>Copy</button>
          </div>
          <p style={{ color: '#444', fontSize: 12, marginTop: 8, fontFamily: 'Cinzel, serif' }}>Share with players to join · Updates are live</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
          {/* BGM Sync */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div className="section-title" style={{ color: acc, margin: 0 }}>🎵 BGM Sync</div>
              <span style={{ fontSize: 10, color: '#555' }}>Syncs to all players in party</span>
            </div>

            {/* Add to queue */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={bgmLabel} onChange={e => setBgmLabel(e.target.value)}
                  placeholder="Song name..."
                  style={{ width: 140, fontFamily: 'Cinzel, serif', fontSize: 11, flexShrink: 0 }} />
                <input value={bgmUrl} onChange={e => setBgmUrl(e.target.value)}
                  placeholder="YouTube URL..."
                  style={{ flex: 1, fontFamily: 'Share Tech Mono, monospace', fontSize: 11 }} />
                <button onClick={() => {
                  if (!bgmUrl.trim()) return;
                  const match = bgmUrl.match(/[?&]v=([a-zA-Z0-9_-]{11})|youtu\.be\/([a-zA-Z0-9_-]{11})/);
                  const ytId = match ? (match[1] || match[2]) : null;
                  if (!ytId) return toast.error('Invalid YouTube URL');
                  const newQ = [...bgmQueue, { id: ytId, url: bgmUrl, label: bgmLabel || bgmUrl }];
                  setBgmQueue(newQ);
                  savePlaylist(newQ);
                  setBgmUrl(''); setBgmLabel('');
                  toast.success('Added to playlist');
                }} className="btn-ghost btn-sm">+ Add</button>
              </div>
            </div>

            {/* Queue */}
            {bgmQueue.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
                {bgmQueue.map((item, i) => (
                  <div key={i}
                    onClick={() => {
                      if (campaign?.party?.id) {
                        api.post(`/parties/${campaign.party.id}/bgm-sync`, { trackId: item.id, enabled: true });
                        handleBgmSync({ enabled: true, trackId: item.id });
                        setBgmPlaying(item.id);
                        toast.success(`▶ ${item.label || 'Playing'}`);
                      }
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, background: bgmPlaying === item.id ? `${acc}18` : 'rgba(0,0,0,0.2)', border: `1px solid ${bgmPlaying === item.id ? acc+'66' : '#2a2a2a'}`, borderRadius: 4, padding: '8px 12px', cursor: 'pointer', transition: 'all 0.15s' }}>
                    <span style={{ color: bgmPlaying === item.id ? acc : '#666', fontSize: 14, flexShrink: 0 }}>
                      {bgmPlaying === item.id ? '▶' : '○'}
                    </span>
                    <span style={{ flex: 1, fontFamily: 'Cinzel, serif', fontSize: 11, color: bgmPlaying === item.id ? acc : '#aaa' }}>
                      {item.label || item.url}
                    </span>
                    <button onClick={e => {
                      e.stopPropagation();
                      const newQ = bgmQueue.filter((_, j) => j !== i);
                      setBgmQueue(newQ);
                      savePlaylist(newQ);
                    }} style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 12, padding: 0, flexShrink: 0 }}>✕</button>
                  </div>
                ))}
              </div>
            )}

            {/* Stop */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 10, color: '#555' }}>Players with BGM Sync enabled will auto-play</span>
              <button onClick={() => {
                if (campaign?.party?.id) {
                  api.post(`/parties/${campaign.party.id}/bgm-sync`, { enabled: false });
                  handleBgmSync({ enabled: false });
                  setBgmPlaying(null);
                  toast.success('■ BGM stopped');
                }
              }} className="btn-ghost btn-sm" style={{ color: '#f87171', borderColor: '#f8717144' }}>■ Stop All</button>
            </div>
          </div>

          {/* Party members */}
          <div>
            <div className="section-title" style={{ color: acc }}>⚔ Party Members</div>
            {members.length === 0 ? (
              <div style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${acc}11`, borderRadius: 8, textAlign: 'center', padding: 48, color: '#444' }}>
                <p style={{ fontFamily: 'Cinzel, serif', fontSize: 14 }}>No players yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {members.map(member => {
                  const sd = member.character.sheetData || {};
                  const mod = system.getModifier;
                  return (
                    <div key={member.id} style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${acc}22`, borderRadius: 8, padding: 18, position: 'relative' }}>
                      <button onClick={() => navigate(member.character.system === 'CAIN' ? `/characters/cain/${member.character.id}` : `/characters/${member.character.id}`)}
                        style={{ position: 'absolute', top: 10, right: 10, background: 'transparent', border: `1px solid ${acc}44`, color: acc, fontFamily: 'Cinzel, serif', fontSize: 10, padding: '3px 8px', cursor: 'pointer', borderRadius: 4 }}>
                        View Sheet
                      </button>
                      {/* Name + kick */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <div>
                          <div style={{ fontFamily: 'Cinzel, serif', fontSize: 18, color: acc }}>{member.character.name}</div>
                          <div style={{ color: '#555', fontSize: 12 }}>{member.user.username} · {sd.class || sd.role || '—'} · Lv.{sd.level || 1}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {/* Armor badge */}
                          <div style={{ textAlign: 'center', background: '#0d0d1a', border: '1px solid #60a5fa33', borderRadius: 6, padding: '4px 10px' }}>
                            <div style={{ fontSize: 9, color: '#60a5fa', fontFamily: 'Cinzel, serif', textTransform: 'uppercase' }}>Armor</div>
                            <div style={{ fontFamily: 'Cinzel, serif', fontSize: 18, color: '#60a5fa' }}>{sd.armor ?? 0}</div>
                          </div>
                          <button className="btn-ghost btn-sm" onClick={() => kickPlayer(member.userId)}
                            style={{ color: '#f87171', borderColor: '#f8717144', fontSize: 11 }}>Kick</button>
                        </div>
                      </div>

                      {/* Stats */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6, marginBottom: 14 }}>
                        {system.stats.map(stat => (
                          <div key={stat.key} style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${acc}11`, borderRadius: 6, padding: '5px 2px', textAlign: 'center' }}>
                            <div style={{ fontSize: 9, color: '#444', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{stat.key}</div>
                            <div style={{ fontFamily: 'Cinzel, serif', fontSize: 16, color: acc }}>{sd[stat.key] ?? '—'}</div>
                            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#555' }}>
                              {sd[stat.key] != null ? (() => { const m = mod(sd[stat.key]); return `${m>=0?'+':''}${m}`; })() : ''}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* All vitals */}
                      <VitalMini label="HP" current={sd.currentHP} max={sd.maxHP} color="#4ade80" />
                      <VitalMini label="Stamina" current={sd.currentStamina} max={sd.maxStamina} color="#fb923c" />
                      <VitalMini label="Mana" current={sd.currentMana} max={sd.maxMana} color="#a78bfa" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* GM Dice roller */}
          <div style={{ position: 'sticky', top: 80 }}>
            <DiceRoller system={campaign.system} campaignId={campaign.id} stats={{}} getModifier={system.getModifier} />
          </div>
        </div>
      </div>
    </div>
  );
}
