import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api.js';
import { handleBgmSync } from '../components/AudioSettings.jsx';
import { getSystem } from '../utils/systems.js';
import toast from 'react-hot-toast';

// ── DW Card ──────────────────────────────────────────────────────
function VitalMini({ label, current, max, color }) {
  const pct = Math.max(0, Math.min(100, ((current || 0) / (max || 1)) * 100));
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontSize: 10, color: '#555', fontFamily: 'Cinzel, serif', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
        <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color }}>{current ?? '?'} / {max ?? '?'}</span>
      </div>
      <div style={{ background: '#1a1a1a', borderRadius: 4, height: 8, overflow: 'hidden', position: 'relative' }}>
        <div style={{ height: '100%', background: pct <= 25 ? '#f87171' : pct <= 50 ? '#facc15' : color, width: `${pct}%`, transition: 'width 0.4s', borderRadius: 4 }} />
      </div>
    </div>
  );
}

function DWMemberCard({ member, system }) {
  const acc = system.accentColor;
  const sd = member.character.sheetData || {};
  return (
    <div style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${acc}22`, borderRadius: 8, padding: 18 }}>
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
        <div style={{ textAlign: 'center', background: '#0d0d1a', border: '1px solid #60a5fa33', borderRadius: 6, padding: '4px 8px', flexShrink: 0 }}>
          <div style={{ fontSize: 9, color: '#60a5fa', fontFamily: 'Cinzel, serif' }}>ARM</div>
          <div style={{ fontFamily: 'Cinzel, serif', fontSize: 20, color: '#60a5fa' }}>{sd.armor ?? 0}</div>
        </div>
      </div>
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
      <VitalMini label="HP" current={sd.currentHP} max={sd.maxHP} color="#4ade80" />
      <VitalMini label="Stamina" current={sd.currentStamina} max={sd.maxStamina} color="#fb923c" />
      <VitalMini label="Mana" current={sd.currentMana} max={sd.maxMana} color="#a78bfa" />
    </div>
  );
}

// ── CAIN Card ─────────────────────────────────────────────────────
const C = {
  bg: '#f2ede3', dark: '#1a1a1a', mid: '#444', muted: '#888',
  border: '#999', borderDark: '#444', red: '#8b0000',
  font: "'Courier New', monospace", fontSans: "'Arial Narrow', Arial, sans-serif",
};

const SKILLS = ['FORCE','CONDITIONING','COORDINATION','COVERT','INTERFACING','INVESTIGATION','SURVEILLANCE','NEGOTIATION','AUTHORITY','CONNECTION'];
const SKILL_SHORT = { FORCE:'FOR', CONDITIONING:'CON', COORDINATION:'COR', COVERT:'CVT', INTERFACING:'INT', INVESTIGATION:'INV', SURVEILLANCE:'SRV', NEGOTIATION:'NEG', AUTHORITY:'ATH', CONNECTION:'CNN' };
const CAT_LABELS = ['I','II','III','IV','V'];

function CainDot({ filled, dashed }) {
  return (
    <div style={{ width: 10, height: 10, borderRadius: '50%', border: `1.5px ${dashed ? 'dashed' : 'solid'} ${C.dark}`, background: filled ? C.dark : 'transparent', display: 'inline-block', marginRight: 2 }} />
  );
}

function CainExecBar({ stress, execMax }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: execMax }, (_, i) => (
        <div key={i} style={{ flex: 1, height: 10, border: `1px solid ${C.borderDark}`, background: i < stress ? C.dark : 'transparent' }} />
      ))}
    </div>
  );
}

function CainMemberCard({ member }) {
  const sd = member.character.sheetData || {};
  const cat = sd.cat || 1;
  const injuries = sd.injuries || 0;
  const execMax = Math.max(1, 6 - injuries);
  const stress = sd.stress || 0;
  const psyche = Math.ceil(cat / 2);
  const sinBoxes = sd.sinBoxes || 0;

  return (
    <div style={{ background: C.bg, border: `1px solid ${C.borderDark}`, fontFamily: C.font, color: C.dark }}>
      {/* Header */}
      <div style={{ background: C.dark, color: C.bg, padding: '4px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: C.fontSans, fontSize: 12, fontWeight: 700, letterSpacing: '0.15em' }}>
          {member.character.name || 'UNNAMED'}
        </div>
        <div style={{ fontFamily: C.fontSans, fontSize: 8, opacity: 0.6 }}>{member.user.username}</div>
      </div>

      <div style={{ padding: '10px 12px' }}>
        {/* Portrait + ID info */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          {sd.portrait && (
            <div style={{ width: 48, height: 58, border: `1px solid ${C.border}`, overflow: 'hidden', flexShrink: 0 }}>
              <img src={sd.portrait} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 8, color: C.muted, fontFamily: C.fontSans }}>XID: {sd.xid || '—'}</div>
            <div style={{ marginTop: 4, display: 'flex', gap: 4 }}>
              {CAT_LABELS.map((l, i) => (
                <div key={i} style={{ width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', clipPath: 'polygon(50% 0%,100% 100%,0% 100%)', background: cat > i ? C.dark : 'transparent', border: cat > i ? 'none' : `1px solid ${C.border}`, fontFamily: C.fontSans, fontSize: 7, fontWeight: 700, color: cat > i ? C.bg : C.muted }}>
                  {l}
                </div>
              ))}
              <div style={{ fontFamily: C.fontSans, fontSize: 8, color: C.mid, marginLeft: 4, alignSelf: 'center' }}>PSYCHE: {psyche}</div>
            </div>
          </div>
        </div>

        {/* Execution */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
            <div style={{ fontFamily: C.fontSans, fontSize: 7, fontWeight: 700, letterSpacing: '0.1em', color: C.mid }}>EXECUTION</div>
            <div style={{ fontFamily: C.font, fontSize: 8, color: stress >= execMax - 1 ? C.red : C.mid }}>{execMax - stress}/{execMax}</div>
          </div>
          <CainExecBar stress={stress} execMax={execMax} />
        </div>

        {/* Injuries + Sin */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: C.fontSans, fontSize: 7, fontWeight: 700, color: C.red, marginBottom: 3 }}>INJURIES</div>
            <div>
              {Array.from({ length: 5 }, (_, i) => (
                <CainDot key={i} filled={i < injuries} dashed={i >= 3} />
              ))}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: C.fontSans, fontSize: 7, fontWeight: 700, color: C.red, marginBottom: 3 }}>SIN</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {Array.from({ length: 9 }, (_, i) => (
                <div key={i} style={{ width: 9, height: 9, border: `1px solid ${C.red}`, background: i < sinBoxes ? C.red : 'transparent' }} />
              ))}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: C.fontSans, fontSize: 7, fontWeight: 700, color: C.mid, marginBottom: 2 }}>PATHOS</div>
            <div style={{ fontFamily: C.fontSans, fontSize: 18, fontWeight: 900 }}>{sd.pathos || 0}</div>
          </div>
        </div>

        {/* Skills */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 3 }}>
          {SKILLS.map(sk => {
            const val = sd[sk] || 0;
            return (
              <div key={sk} style={{ textAlign: 'center', padding: '2px 0', borderBottom: `1px solid ${C.border}` }}>
                <div style={{ fontFamily: C.fontSans, fontSize: 6, color: C.muted, letterSpacing: '0.05em' }}>{SKILL_SHORT[sk]}</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 1, marginTop: 2 }}>
                  {[0,1,2].map(d => <CainDot key={d} filled={d < val} />)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Psyche burst */}
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ fontFamily: C.fontSans, fontSize: 7, fontWeight: 700, color: C.mid }}>BURST</div>
          {Array.from({ length: 3 }, (_, i) => (
            <CainDot key={i} filled={i < (sd.psycheBurst || 0)} />
          ))}
          {sd.afflictions && (
            <div style={{ fontFamily: C.font, fontSize: 8, color: C.red, marginLeft: 4, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              ⚠ {sd.afflictions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────
export default function PartyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [partyData, setPartyData] = useState(null);
  const [system, setSystem] = useState(null);
  const [connected, setConnected] = useState(false);
  const [inventory, setInventory] = useState('');
  const [invSaving, setInvSaving] = useState(false);
  const sseRef = useRef(null);

  useEffect(() => {
    fetchParty();
    return () => { sseRef.current?.close(); };
  }, [id]);

  const fetchParty = async () => {
    try {
      const res = await api.get('/parties/mine');
      const myParty = res.data.find(m => m.party.id === id);
      if (!myParty) { toast.error('Party not found'); return navigate('/'); }
      setPartyData(myParty.party);
      setSystem(getSystem(myParty.party.campaign.system));
      setInventory(myParty.party.inventory || '');
      startSSE(myParty.party);
    } catch { navigate('/'); }
  };

  const startSSE = (party) => {
    if (sseRef.current) sseRef.current.close();
    const token = localStorage.getItem('token');
    const baseUrl = import.meta.env.VITE_API_URL || '/api';
    const es = new EventSource(`${baseUrl}/sse/party/${party.id}?token=${token}`);
    sseRef.current = es;
    es.onopen = () => setConnected(true);
    es.onerror = () => { setConnected(false); setTimeout(() => startSSE(party), 5000); };
    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === 'bgm_sync') {
          handleBgmSync(data);
        }
        if (data.type === 'inventory_updated') {
          setInventory(data.inventory || '');
        }
        if (data.type === 'character_updated') {
          setPartyData(prev => !prev ? prev : {
            ...prev,
            members: prev.members.map(m =>
              m.character.id === data.characterId
                ? { ...m, character: { ...m.character, sheetData: data.sheetData, name: data.name } }
                : m
            )
          });
        }
      } catch {}
    };
  };

  const saveInventory = async (val) => {
    setInvSaving(true);
    try { await api.put(`/parties/${id}/inventory`, { inventory: val }); }
    catch {}
    setInvSaving(false);
  };

  const leaveParty = async () => {
    if (!confirm('Leave this party?')) return;
    sseRef.current?.close();
    await api.delete(`/parties/${id}/leave`);
    toast.success('Left party');
    navigate('/');
  };

  if (!partyData || !system) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
      <div style={{ color: '#555', fontFamily: 'Cinzel, serif' }}>Loading…</div>
    </div>
  );

  const isCain = system.id === 'CAIN';
  const acc = system.accentColor;

  // CAIN theme wrapper
  if (isCain) return (
    <div style={{ background: '#d4cfc4', minHeight: '100vh', padding: 20 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ background: C.bg, border: `1px solid ${C.borderDark}`, padding: '10px 16px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: C.fontSans, fontSize: 18, fontWeight: 900, letterSpacing: '0.2em', color: C.dark }}>{partyData.campaign.name}</div>
            <div style={{ fontFamily: C.font, fontSize: 9, color: C.muted, display: 'flex', gap: 12, marginTop: 2 }}>
              <span>GM: {partyData.campaign.gm.username}</span>
              <span>{partyData.members.length} Exorcists</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: connected ? '#2a7a2a' : C.red, display: 'inline-block' }} />
                {connected ? 'Live' : 'Reconnecting…'}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => navigate('/')} style={{ background: 'transparent', border: `1px solid ${C.border}`, fontFamily: C.fontSans, fontSize: 9, padding: '4px 12px', cursor: 'pointer', letterSpacing: '0.1em' }}>← BACK</button>
            <button onClick={leaveParty} style={{ background: C.red, border: 'none', color: '#fff', fontFamily: C.fontSans, fontSize: 9, padding: '4px 12px', cursor: 'pointer', letterSpacing: '0.1em' }}>LEAVE</button>
          </div>
        </div>

        {/* CAIN Party Inventory */}
        <div style={{ background: C.bg, border: `1px solid ${C.borderDark}`, marginBottom: 12, padding: '8px 12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div style={{ fontFamily: C.fontSans, fontSize: 8, fontWeight: 700, letterSpacing: '0.15em', color: C.mid }}>◈ UNIT INVENTORY / SHARED NOTES</div>
            <span style={{ fontFamily: C.font, fontSize: 7, color: C.muted }}>{invSaving ? 'filing...' : 'filed'}</span>
          </div>
          <textarea value={inventory} onChange={e => { setInventory(e.target.value); clearTimeout(window._invTimer); window._invTimer = setTimeout(() => saveInventory(e.target.value), 1500); }}
            placeholder="Shared equipment, mission notes..."
            rows={4} style={{ width: '100%', background: 'rgba(0,0,0,0.03)', border: `1px solid ${C.border}`, fontFamily: C.font, fontSize: 10, padding: 6, color: C.dark }} />
        </div>

        <div style={{ fontFamily: C.fontSans, fontSize: 8, fontWeight: 700, letterSpacing: '0.2em', color: C.mid, marginBottom: 10, textTransform: 'uppercase' }}>◈ Active Exorcists — Field Status</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {partyData.members.map(member => (
            <CainMemberCard key={member.id} member={member} />
          ))}
        </div>

        <div style={{ fontFamily: C.font, fontSize: 8, color: C.muted, textAlign: 'center', marginTop: 20 }}>
          As above, so below · CASTLE DIVISION · Updates are live
        </div>
      </div>
    </div>
  );

  // DW theme (original)
  return (
    <div className="theme-fantasy" style={{ minHeight: '100vh' }}>
      <div className="page">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, paddingBottom: 18, borderBottom: `1px solid ${acc}33` }}>
          <div>
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: 26, color: acc }}>{partyData.campaign.name}</div>
            <div style={{ color: '#555', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
              GM: {partyData.campaign.gm.username} · {partyData.members.length} Members
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: connected ? '#4ade80' : '#f87171', display: 'inline-block', boxShadow: connected ? '0 0 6px #4ade80' : 'none' }} />
                <span style={{ color: connected ? '#4ade80' : '#f87171' }}>{connected ? 'Live' : 'Reconnecting…'}</span>
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-ghost btn-sm" onClick={() => navigate('/')}>← Back</button>
            <button className="btn-ghost btn-sm" onClick={leaveParty} style={{ color: '#f87171', borderColor: '#f8717144' }}>Leave</button>
          </div>
        </div>
        <div className="section-title" style={{ color: acc }}>⚔ Party</div>
        {/* Party Inventory */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div className="section-title" style={{ color: acc, margin: 0 }}>🎒 Party Inventory</div>
            <span style={{ fontSize: 10, color: '#555' }}>{invSaving ? 'Saving…' : 'Auto-saved'}</span>
          </div>
          <textarea value={inventory} onChange={e => { setInventory(e.target.value); clearTimeout(window._invTimer); window._invTimer = setTimeout(() => saveInventory(e.target.value), 1500); }}
            placeholder="Shared party items, gold, notes..."
            rows={5} style={{ width: '100%', color: '#e8e8e8' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {partyData.members.map(member => (
            <DWMemberCard key={member.id} member={member} system={system} />
          ))}
        </div>
      </div>
    </div>
  );
}
