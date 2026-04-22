import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api.js';
import { getSystem } from '../utils/systems.js';
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

export default function PartyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [partyData, setPartyData] = useState(null);
  const [system, setSystem] = useState(null);

  useEffect(() => {
    fetchParty();
  }, [id]);

  // Auto-refresh every 15s for near-realtime vitals
  useEffect(() => {
    const interval = setInterval(fetchParty, 15000);
    return () => clearInterval(interval);
  }, [id]);

  const fetchParty = async () => {
    try {
      const res = await api.get('/parties/mine');
      const myParty = res.data.find(m => m.party.id === id);
      if (!myParty) { toast.error('Party not found'); return navigate('/'); }
      setPartyData(myParty.party);
      setSystem(getSystem(myParty.party.campaign.system));
    } catch { navigate('/'); }
  };

  const leaveParty = async () => {
    if (!confirm('Leave this party?')) return;
    await api.delete(`/parties/${id}/leave`);
    toast.success('Left party');
    navigate('/');
  };

  if (!partyData || !system) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
      <div style={{ color: '#555', fontFamily: 'Cinzel, serif' }}>Loading…</div>
    </div>
  );

  const acc = system.accentColor;

  return (
    <div className="theme-fantasy" style={{ minHeight: '100vh' }}>
      <div className="page">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, paddingBottom: 18, borderBottom: `1px solid ${acc}33` }}>
          <div>
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: 26, color: acc }}>{partyData.campaign.name}</div>
            <div style={{ color: '#555', fontSize: 13 }}>GM: {partyData.campaign.gm.username} · {partyData.members.length} Members · Updates every 15s</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-ghost btn-sm" onClick={() => navigate('/')}>← Back</button>
            <button className="btn-ghost btn-sm" onClick={leaveParty} style={{ color: '#f87171', borderColor: '#f8717144' }}>Leave</button>
          </div>
        </div>

        <div className="section-title" style={{ color: acc }}>⚔ Party</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {partyData.members.map(member => {
            const sd = member.character.sheetData || {};
            return (
              <div key={member.id} style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${acc}22`, borderRadius: 8, padding: 18 }}>
                {/* Portrait + name */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                  {sd.portrait && (
                    <div style={{ width: 52, height: 60, borderRadius: 6, overflow: 'hidden', flexShrink: 0, border: `1px solid ${acc}33` }}>
                      <img src={sd.portrait} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Cinzel, serif', fontSize: 18, color: acc }}>{member.character.name}</div>
                    <div style={{ color: '#555', fontSize: 12 }}>{member.user.username}</div>
                    <div style={{ color: '#666', fontSize: 12 }}>{sd.class || '—'} · Lv.{sd.level || 1}</div>
                  </div>
                  {/* Armor */}
                  <div style={{ textAlign: 'center', background: '#0d0d1a', border: '1px solid #60a5fa33', borderRadius: 6, padding: '4px 8px', flexShrink: 0 }}>
                    <div style={{ fontSize: 9, color: '#60a5fa', fontFamily: 'Cinzel, serif' }}>ARM</div>
                    <div style={{ fontFamily: 'Cinzel, serif', fontSize: 20, color: '#60a5fa' }}>{sd.armor ?? 0}</div>
                  </div>
                </div>

                {/* Stats grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 4, marginBottom: 12 }}>
                  {system.stats.map(stat => {
                    const v = sd[stat.key];
                    const m = v != null ? system.getModifier(v) : null;
                    return (
                      <div key={stat.key} style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${acc}11`, borderRadius: 5, padding: '4px 2px', textAlign: 'center' }}>
                        <div style={{ fontSize: 8, color: '#444', textTransform: 'uppercase' }}>{stat.key}</div>
                        <div style={{ fontFamily: 'Cinzel, serif', fontSize: 14, color: acc }}>{v ?? '—'}</div>
                        {m != null && <div style={{ fontSize: 8, color: '#555', fontFamily: 'Share Tech Mono, monospace' }}>{m >= 0 ? '+' : ''}{m}</div>}
                      </div>
                    );
                  })}
                </div>

                {/* Vitals */}
                <VitalMini label="HP" current={sd.currentHP} max={sd.maxHP} color="#4ade80" />
                <VitalMini label="Stamina" current={sd.currentStamina} max={sd.maxStamina} color="#fb923c" />
                <VitalMini label="Mana" current={sd.currentMana} max={sd.maxMana} color="#a78bfa" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
