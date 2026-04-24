import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api.js';
import toast from 'react-hot-toast';
import FontSizeControl from '../components/FontSizeControl.jsx';

const C = {
  bg: '#f2ede3', paper: '#e8e2d4', dark: '#1a1a1a', mid: '#444', muted: '#888',
  border: '#999', borderDark: '#444', red: '#8b0000',
  font: "'Courier New', monospace", fontSans: "'Arial Narrow', Arial, sans-serif",
};

function SectionBox({ title, children, style = {}, titleBg = C.dark, titleColor = '#f2ede3' }) {
  return (
    <div style={{ border: `1px solid ${C.borderDark}`, marginBottom: 10, ...style }}>
      <div style={{ background: titleBg, color: titleColor, fontFamily: C.fontSans, fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', padding: '2px 8px', textTransform: 'uppercase' }}>{title}</div>
      <div style={{ padding: '8px 10px' }}>{children}</div>
    <FontSizeControl />
    </div>
  );
}

function SlashTrack({ value, max, onChange, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {label && <div style={{ fontFamily: C.fontSans, fontSize: 9, fontWeight: 700, minWidth: 60 }}>{label}</div>}
      <div style={{ display: 'flex', gap: 3 }}>
        {Array.from({ length: max }, (_, i) => (
          <div key={i} onClick={() => onChange(i < value ? i : i + 1)}
            style={{ width: 16, height: 22, borderRight: `2px solid ${i < value ? C.dark : C.border}`, cursor: 'pointer', transition: 'border-color 0.1s' }} />
        ))}
      </div>
      <div style={{ fontFamily: C.font, fontSize: 10, color: C.mid }}>{value} / {max}</div>
    <FontSizeControl />
    </div>
  );
}

function CATSelector({ value, onChange }) {
  const levels = ['I','II','III','IV','V','VI','VII'];
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {levels.map((l, i) => (
        <div key={i} onClick={() => onChange(i)}
          style={{ width: 28, height: 28, border: `1px solid ${C.borderDark}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontFamily: C.fontSans, fontSize: 10, fontWeight: 700, background: value === i ? C.dark : 'transparent', color: value === i ? '#f2ede3' : C.dark, clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }}>
          {l}
        </div>
      ))}
    <FontSizeControl />
    </div>
  );
}

const defaultSin = () => ({
  name: '', host: '', type: '', form: 1, cat: 0, deceased: false,
  traumas: ['', '', ''],
  executionSlashes: 0,
  domains: ['', '', ''],
  sinMarks: ['', ''],
  notes: '',
});

const defaultMission = () => ({
  phase: 1,
  tension: 0, tensionMax: 3,
  pressure: 0, pressureMax: 6,
  talismans: [
    { name: '', length: 3, slashes: 0 },
    { name: '', length: 3, slashes: 0 },
    { name: '', length: 3, slashes: 0 },
  ],
  notes: '',
});

export default function CainGMSheet() {
  const { id } = useParams(); // campaign id
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [gmData, setGmData] = useState({ sins: [defaultSin()], mission: defaultMission(), notes: '' });
  const [saveStatus, setSaveStatus] = useState('saved');
  const [activeTab, setActiveTab] = useState(0); // which sin is active
  const autoSaveTimer = useRef(null);
  const gmRef = useRef(gmData);

  useEffect(() => { fetchCampaign(); }, [id]);

  const fetchCampaign = async () => {
    try {
      const res = await api.get(`/campaigns/${id}`);
      setCampaign(res.data);
      if (res.data.gmSheetData) {
        const d = { sins: [defaultSin()], mission: defaultMission(), notes: '', ...res.data.gmSheetData };
        setGmData(d);
        gmRef.current = d;
      }
    } catch { toast.error('Campaign not found'); navigate('/'); }
  };

  const doSave = useCallback(async (data) => {
    setSaveStatus('saving');
    try {
      await api.put(`/campaigns/${id}`, { gmSheetData: data });
      setSaveStatus('saved');
    } catch { setSaveStatus('error'); }
  }, [id]);

  const update = useCallback((updater) => {
    setGmData(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      gmRef.current = next;
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(() => doSave(gmRef.current), 1500);
      return next;
    });
    setSaveStatus('dirty');
  }, [doSave]);

  useEffect(() => () => { if (autoSaveTimer.current) { clearTimeout(autoSaveTimer.current); doSave(gmRef.current); } }, [doSave]);

  const updateSin = (i, key, value) => {
    update(prev => {
      const sins = [...prev.sins];
      sins[i] = { ...sins[i], [key]: value };
      return { ...prev, sins };
    });
  };

  const updateMission = (key, value) => {
    update(prev => ({ ...prev, mission: { ...prev.mission, [key]: value } }));
  };

  const addSin = () => {
    update(prev => ({ ...prev, sins: [...prev.sins, defaultSin()] }));
    setActiveTab(gmData.sins.length);
  };

  const removeSin = (i) => {
    if (!confirm('Remove this sin record?')) return;
    update(prev => ({ ...prev, sins: prev.sins.filter((_, idx) => idx !== i) }));
    setActiveTab(Math.max(0, activeTab - 1));
  };

  if (!campaign) return (
    <div style={{ background: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: C.font }}>LOADING FILE...</div>
    </div>
  );

  const sin = gmData.sins[activeTab] || defaultSin();
  const mission = gmData.mission;
  const statusColor = { saved: '#2a5a2a', saving: '#5a4a00', dirty: '#888', error: '#8b0000' }[saveStatus];
  const statusLabel = { saved: '■ FILED', saving: '◌ FILING...', dirty: '○ UNSAVED', error: '✕ ERROR' }[saveStatus];
  const phaseLabels = ['BRIEFING','ARRIVAL','TRACK','INVESTIGATE','PREPARE','CONFRONT','EXECUTE'];
  const execNeeded = 7 + (mission.pressure || 0) + (sin.cat || 0);

  return (
    <div style={{ background: '#d4cfc4', minHeight: '100vh', padding: 20 }}>
      <style>{`* { box-sizing: border-box; } textarea, input, select { color: #1a1a1a !important; font-family: 'Courier New', monospace; } textarea::placeholder, input::placeholder { color: #999 !important; } .tension-bg { background: rgba(0,0,0,0.03); } `}</style>

      {/* Top bar */}
      <div style={{ maxWidth: 1100, margin: '0 auto 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: C.font, fontSize: 10, color: '#666' }}>
          GM SHEET: {campaign.name?.toUpperCase()} &nbsp;|&nbsp; CAIN 1.2 &nbsp;|&nbsp;
          <span style={{ color: statusColor }}>{statusLabel}</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => navigate('/')} style={{ background: 'transparent', border: `1px solid #666`, color: '#444', fontFamily: C.fontSans, fontSize: 9, padding: '4px 12px', cursor: 'pointer', letterSpacing: '0.1em' }}>← BACK</button>
          <button onClick={async () => {
            if (!confirm('Delete this campaign? This cannot be undone.')) return;
            try { await api.delete(`/campaigns/${id}`); toast.success('Campaign deleted'); navigate('/'); }
            catch { toast.error('Failed to delete'); }
          }} style={{ background: C.red, border: 'none', color: '#fff', fontFamily: C.fontSans, fontSize: 9, fontWeight: 700, padding: '4px 12px', cursor: 'pointer', letterSpacing: '0.1em' }}>DELETE</button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', background: C.bg, border: `1px solid ${C.borderDark}`, boxShadow: '4px 4px 0 rgba(0,0,0,0.2)', padding: 20 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', borderBottom: `3px solid ${C.dark}`, paddingBottom: 8, marginBottom: 16 }}>
          <div style={{ fontFamily: C.fontSans, fontSize: 20, fontWeight: 900, letterSpacing: '0.3em', color: C.dark }}>CAIN — ADMIN FIELD DOCUMENTATION</div>
          <div style={{ fontFamily: C.fontSans, fontSize: 8, letterSpacing: '0.3em', color: C.mid }}>RESTRICTED — CASTLE DIVISION INTERNAL USE ONLY</div>
        </div>

        {/* ── Invite Code ── */}
        <div style={{ border: `1px solid ${C.borderDark}`, marginBottom: 16 }}>
          <div style={{ background: C.dark, color: '#f2ede3', fontFamily: C.fontSans, fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', padding: '2px 8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
            📋 INVITE CODE
          </div>
          <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 15, fontWeight: 700, color: C.dark, letterSpacing: '0.05em', flex: 1 }}>
              {campaign.inviteCode || '—'}
            </div>
            <button onClick={() => { navigator.clipboard.writeText(campaign.inviteCode || ''); }}
              style={{ background: C.dark, color: '#f2ede3', border: 'none', fontFamily: C.fontSans, fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', padding: '5px 14px', cursor: 'pointer', textTransform: 'uppercase' }}>
              COPY
            </button>
          </div>
          <div style={{ padding: '0 12px 8px', fontFamily: C.font, fontSize: 8, color: C.muted }}>
            Share with players to join · Updates are live
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

          {/* ── LEFT: The Hunt / Mission ── */}
          <div>
            <SectionBox title="THE HUNT — MISSION FLOW">
              {/* Phase tracker */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontFamily: C.fontSans, fontSize: 9, fontWeight: 700, color: C.mid, marginBottom: 6 }}>CURRENT PHASE:</div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {phaseLabels.map((ph, i) => (
                    <button key={i} onClick={() => updateMission('phase', i + 1)}
                      style={{ flex: 1, padding: '5px 2px', border: `1px solid ${C.borderDark}`, background: mission.phase === i + 1 ? C.dark : 'transparent', color: mission.phase === i + 1 ? '#f2ede3' : C.dark, fontFamily: C.fontSans, fontSize: 7, fontWeight: 700, cursor: 'pointer', textAlign: 'center', letterSpacing: '0.05em' }}>
                      {i + 1}. {ph}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tension */}
              <div style={{ marginBottom: 12, padding: 10, border: `1px solid ${C.borderDark}`, background: 'rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ fontFamily: C.fontSans, fontSize: 14, fontWeight: 900, letterSpacing: '0.2em', color: C.dark }}>TENSION</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ fontFamily: C.font, fontSize: 9, color: C.muted }}>Max:</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <button onClick={() => updateMission('tensionMax', Math.max(1, (mission.tensionMax||3)-1))} style={{ width:20,height:20,border:`1px solid ${C.border}`,background:'transparent',cursor:'pointer',fontFamily:C.font,fontSize:13,color:C.dark }}>−</button>
                      <span style={{ fontFamily:C.font,fontSize:13,fontWeight:700,minWidth:18,textAlign:'center',color:C.dark }}>{mission.tensionMax||3}</span>
                      <button onClick={() => updateMission('tensionMax', (mission.tensionMax||3)+1)} style={{ width:20,height:20,border:`1px solid ${C.border}`,background:'transparent',cursor:'pointer',fontFamily:C.font,fontSize:13,color:C.dark }}>+</button>
                    </div>
                  </div>
                </div>
                <SlashTrack value={mission.tension || 0} max={mission.tensionMax || 3}
                  onChange={v => updateMission('tension', v)} />
                <div style={{ fontFamily: C.font, fontSize: 8, color: C.muted, marginTop: 4 }}>Slash when a scene passes, or a '1' is rolled on risk (once per scene only).</div>
              </div>

              {/* Pressure */}
              <div style={{ marginBottom: 12, padding: 10, border: `2px solid ${C.dark}`, background: 'rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ fontFamily: C.fontSans, fontSize: 14, fontWeight: 900, letterSpacing: '0.2em', color: C.dark }}>PRESSURE</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ fontFamily: C.font, fontSize: 9, color: C.muted }}>Max:</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <button onClick={() => updateMission('pressureMax', Math.max(1, (mission.pressureMax||6)-1))} style={{ width:20,height:20,border:`1px solid ${C.border}`,background:'transparent',cursor:'pointer',fontFamily:C.font,fontSize:13,color:C.dark }}>−</button>
                      <span style={{ fontFamily:C.font,fontSize:13,fontWeight:700,minWidth:18,textAlign:'center',color:C.dark }}>{mission.pressureMax||6}</span>
                      <button onClick={() => updateMission('pressureMax', (mission.pressureMax||6)+1)} style={{ width:20,height:20,border:`1px solid ${C.border}`,background:'transparent',cursor:'pointer',fontFamily:C.font,fontSize:13,color:C.dark }}>+</button>
                    </div>
                  </div>
                </div>
                <SlashTrack value={mission.pressure || 0} max={mission.pressureMax || 6}
                  onChange={v => updateMission('pressure', v)} />
                <div style={{ fontFamily: C.font, fontSize: 8, color: C.red, marginTop: 4, fontWeight: 700 }}>
                  ⚠ If filled: Sin CAT increases by +1, things get worse.
                </div>
              </div>

              {/* Talisman workspace */}
              <SectionBox title="TALISMAN WORKSPACE" style={{ marginBottom: 0 }}>
                <div style={{ fontFamily: C.font, fontSize: 8, color: C.muted, marginBottom: 8 }}>
                  Write what each talisman represents, write length in circle (2=short, 3-5=medium, 6-8=long), slash 1 for each success when acting.
                </div>
                {(mission.talismans || []).map((t, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8, padding: 6, border: `1px solid ${C.border}` }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', border: `2px solid ${C.borderDark}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <input type="number" value={t.length || 3} min={2} max={8}
                        onChange={e => {
                          const ts = [...(mission.talismans || [])];
                          ts[i] = { ...ts[i], length: parseInt(e.target.value) || 3 };
                          updateMission('talismans', ts);
                        }}
                        style={{ width: 28, textAlign: 'center', background: 'transparent', border: 'none', fontFamily: C.font, fontSize: 11, fontWeight: 700, outline: 'none' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <input value={t.name || ''} placeholder="Talisman description..."
                        onChange={e => { const ts = [...(mission.talismans || [])]; ts[i] = { ...ts[i], name: e.target.value }; updateMission('talismans', ts); }}
                        style={{ width: '100%', fontFamily: C.font, fontSize: 10, background: 'transparent', border: 'none', borderBottom: `1px solid ${C.border}`, outline: 'none', marginBottom: 4 }} />
                      <SlashTrack value={t.slashes || 0} max={t.length || 3}
                        onChange={v => { const ts = [...(mission.talismans || [])]; ts[i] = { ...ts[i], slashes: v }; updateMission('talismans', ts); }} />
                    </div>
                  </div>
                ))}
                <button onClick={() => updateMission('talismans', [...(mission.talismans || []), { name: '', length: 3, slashes: 0 }])}
                  style={{ fontFamily: C.fontSans, fontSize: 8, padding: '4px 10px', border: `1px solid ${C.border}`, background: 'transparent', cursor: 'pointer', letterSpacing: '0.1em' }}>
                  + ADD TALISMAN
                </button>
              </SectionBox>
            </SectionBox>

            {/* GM Notes */}
            <SectionBox title="ADMIN NOTES">
              <textarea value={gmData.notes || ''} onChange={e => update({ notes: e.target.value })} rows={6}
                style={{ width: '100%', fontFamily: C.font, fontSize: 10, background: 'rgba(0,0,0,0.03)', border: `1px solid ${C.border}`, padding: 6 }}
                placeholder="Admin notes, NPCs, locations..." />
            </SectionBox>
          </div>

          {/* ── RIGHT: Sin sheets ── */}
          <div>
            {/* Sin tabs */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 0, flexWrap: 'wrap' }}>
              {gmData.sins.map((s, i) => (
                <button key={i} onClick={() => setActiveTab(i)}
                  style={{ padding: '4px 10px', border: `1px solid ${C.borderDark}`, borderBottom: activeTab === i ? 'none' : `1px solid ${C.borderDark}`, background: activeTab === i ? C.bg : '#d4cfc4', fontFamily: C.fontSans, fontSize: 8, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.1em', position: 'relative', zIndex: activeTab === i ? 2 : 1 }}>
                  SIN {i + 1}{s.name ? `: ${s.name.slice(0, 8).toUpperCase()}` : ''}
                </button>
              ))}
              <button onClick={addSin}
                style={{ padding: '4px 10px', border: `1px dashed ${C.border}`, background: 'transparent', fontFamily: C.fontSans, fontSize: 8, cursor: 'pointer', letterSpacing: '0.1em', color: C.mid }}>
                + ADD SIN
              </button>
            </div>

            <div style={{ border: `1px solid ${C.borderDark}`, padding: 14, background: C.bg }}>

              {/* Sin header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ fontFamily: C.fontSans, fontSize: 20, fontWeight: 900, letterSpacing: '0.3em', color: C.dark }}>SIN</div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <div style={{ fontFamily: C.font, fontSize: 8, color: C.muted }}>DECEASED?</div>
                  <input type="checkbox" checked={sin.deceased || false} onChange={e => updateSin(activeTab, 'deceased', e.target.checked)} style={{ width: 14, height: 14 }} />
                  {gmData.sins.length > 1 && (
                    <button onClick={() => removeSin(activeTab)}
                      style={{ fontFamily: C.fontSans, fontSize: 7, padding: '2px 6px', border: `1px solid ${C.red}`, color: C.red, background: 'transparent', cursor: 'pointer' }}>REMOVE</button>
                  )}
                </div>
              </div>

              {/* Vital info */}
              <div style={{ border: `1px solid ${C.borderDark}`, padding: 10, marginBottom: 12, fontFamily: C.font }}>
                <div style={{ fontFamily: C.fontSans, fontSize: 8, fontWeight: 700, letterSpacing: '0.15em', marginBottom: 8, color: C.mid }}>VITAL INFORMATION CARD</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[['NAME', 'name'], ['HOST', 'host'], ['TYPE', 'type']].map(([lbl, key]) => (
                    <div key={key}>
                      <div style={{ fontFamily: C.fontSans, fontSize: 8, fontWeight: 700, fontStyle: 'italic', color: C.mid }}>{lbl}:</div>
                      <input value={sin[key] || ''} onChange={e => updateSin(activeTab, key, e.target.value)}
                        style={{ width: '100%', fontFamily: C.font, fontSize: 12, background: 'transparent', border: 'none', borderBottom: `1px solid ${C.border}`, outline: 'none' }} />
                    </div>
                  ))}
                  <div>
                    <div style={{ fontFamily: C.fontSans, fontSize: 8, fontWeight: 700, fontStyle: 'italic', color: C.mid }}>FORM (Circle):</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {[1, 2, 3].map(f => (
                        <div key={f} onClick={() => updateSin(activeTab, 'form', f)}
                          style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${C.borderDark}`, background: sin.form === f ? C.dark : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: C.fontSans, fontSize: 9, fontWeight: 700, color: sin.form === f ? '#f2ede3' : C.dark }}>
                          {['I','II','III'][f - 1]}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 10 }}>
                  <div style={{ fontFamily: C.fontSans, fontSize: 8, fontWeight: 700, fontStyle: 'italic', color: C.mid, marginBottom: 4 }}>CATEGORY (MARK CLEARLY):</div>
                  <CATSelector value={sin.cat || 0} onChange={v => updateSin(activeTab, 'cat', v)} />
                </div>
              </div>

              {/* Traumas */}
              <SectionBox title="RECORDED TRAUMAS">
                <div style={{ fontFamily: C.font, fontSize: 8, color: C.muted, marginBottom: 6 }}>
                  Traumas counter a sin's reaction: reduce stress by 1D3, inflict 1D3 slashes on the sin.
                </div>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'center' }}>
                    <div style={{ fontFamily: C.fontSans, fontSize: 9, fontWeight: 700, color: C.mid, minWidth: 14 }}>{i + 1}.</div>
                    <input value={(sin.traumas || [])[i] || ''} onChange={e => { const t = [...(sin.traumas || ['', '', ''])]; t[i] = e.target.value; updateSin(activeTab, 'traumas', t); }}
                      placeholder="Trauma description..."
                      style={{ flex: 1, fontFamily: C.font, fontSize: 11, background: 'transparent', border: 'none', borderBottom: `1px solid ${C.border}`, outline: 'none', padding: '2px 0' }} />
                  </div>
                ))}
              </SectionBox>

              {/* Execution talisman */}
              <SectionBox title="EXECUTION TALISMAN" style={{ border: `2px solid ${C.dark}` }}>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ fontFamily: C.fontSans, fontSize: 9, fontWeight: 700 }}>SLASHES (harm taken):</div>
                    <div style={{ fontFamily: C.font, fontSize: 10, color: C.red, fontWeight: 700 }}>
                      Needs: 7 + {mission.pressure || 0} (pressure) + {sin.cat || 0} (CAT) = {execNeeded}
                    </div>
                  </div>
                  <SlashTrack value={sin.executionSlashes || 0} max={execNeeded}
                    onChange={v => updateSin(activeTab, 'executionSlashes', v)} />
                  <div style={{ fontFamily: C.font, fontSize: 8, color: C.muted, marginTop: 4 }}>
                    After 4 slashes, must retreat to palace. Cannot retreat inside palace.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[['EXECUTE', C.dark], ['FAIL', C.red], ['SPARE', C.mid]].map(([lbl, col]) => (
                    <button key={lbl} onClick={() => updateSin(activeTab, 'outcome', lbl)}
                      style={{ flex: 1, padding: '6px', border: `2px solid ${sin.outcome === lbl ? col : C.border}`, background: sin.outcome === lbl ? col : 'transparent', color: sin.outcome === lbl ? '#f2ede3' : C.dark, fontFamily: C.fontSans, fontSize: 9, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.1em' }}>
                      {lbl}
                    </button>
                  ))}
                </div>
              </SectionBox>

              {/* Domains */}
              <SectionBox title="DOMAINS">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ border: `1px solid ${C.border}`, padding: 6 }}>
                      <div style={{ fontFamily: C.fontSans, fontSize: 7, fontWeight: 700, color: C.mid, marginBottom: 4 }}>DOMAIN {i + 1}</div>
                      <textarea value={(sin.domains || [])[i] || ''} rows={4}
                        onChange={e => { const d = [...(sin.domains || ['', '', ''])]; d[i] = e.target.value; updateSin(activeTab, 'domains', d); }}
                        style={{ width: '100%', fontFamily: C.font, fontSize: 9, background: 'transparent', border: 'none', outline: 'none', color: C.dark }} />
                    </div>
                  ))}
                </div>
              </SectionBox>

              {/* Sin notes */}
              <div>
                <div style={{ fontFamily: C.fontSans, fontSize: 9, fontWeight: 700, color: C.mid, marginBottom: 4 }}>SIN NOTES / SEVERE ATTACK / COMPLICATIONS:</div>
                <textarea value={sin.notes || ''} onChange={e => updateSin(activeTab, 'notes', e.target.value)} rows={5}
                  style={{ width: '100%', fontFamily: C.font, fontSize: 10, background: 'rgba(0,0,0,0.03)', border: `1px solid ${C.border}`, padding: 6 }}
                  placeholder="Severe attack details, complications, threats, special rules..." />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 12, textAlign: 'center', fontFamily: C.font, fontSize: 8, color: C.muted, borderTop: `1px solid ${C.border}`, paddingTop: 6 }}>
          REFER TO DOCTRINE TM451 IN CASE OF CATEGORY 5+ EVENT &nbsp;|&nbsp; As above, so below &nbsp;|&nbsp; CASTLE DIVISION
        </div>
      </div>
    <FontSizeControl />
    </div>
  );
}
