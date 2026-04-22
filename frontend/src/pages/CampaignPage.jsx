import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api.js';
import { getSystem } from '../utils/systems.js';
import DiceRoller from '../components/DiceRoller.jsx';
import toast from 'react-hot-toast';

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
  const [campaign, setCampaign] = useState(null);
  const [system, setSystem] = useState(null);

  useEffect(() => {
    if (id === 'new') return;
    fetchCampaign();
  }, [id]);

  // Auto-refresh every 30s for near-realtime vitals
  useEffect(() => {
    if (!id || id === 'new') return;
    const interval = setInterval(fetchCampaign, 30000);
    return () => clearInterval(interval);
  }, [id]);

  const fetchCampaign = async () => {
    try {
      const res = await api.get(`/campaigns/${id}`);
      setCampaign(res.data);
      setSystem(getSystem(res.data.system));
    } catch { toast.error('Campaign not found'); navigate('/'); }
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
            <div style={{ color: '#555', fontSize: 13 }}>{system.name} · {members.length} Players</div>
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
          <p style={{ color: '#444', fontSize: 12, marginTop: 8, fontFamily: 'Cinzel, serif' }}>Share with players to join · Auto-refreshes every 30s</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
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
                    <div key={member.id} style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${acc}22`, borderRadius: 8, padding: 18 }}>
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
