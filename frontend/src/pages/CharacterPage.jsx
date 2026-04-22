import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api.js';
import { getSystem } from '../utils/systems.js';
import DiceRoller from '../components/DiceRoller.jsx';
import toast from 'react-hot-toast';

// ── Vitals Bar ──────────────────────────────────────────────────
function VitalsBar({ label, current, max, color, onChangeCurrent, onChangeMax }) {
  const pct = Math.max(0, Math.min(100, ((current || 0) / (max || 1)) * 100));
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: '#888', fontFamily: 'Cinzel, serif', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button onClick={() => onChangeCurrent(Math.max(0, (current || 0) - 1))}
            style={{ background: '#1f1f1f', border: '1px solid #333', color: '#aaa', width: 30, height: 30, borderRadius: 6, cursor: 'pointer', fontSize: 18, lineHeight: 1, display:'flex', alignItems:'center', justifyContent:'center' }}>−</button>
          <input type="number" value={current ?? 0} onChange={e => onChangeCurrent(parseInt(e.target.value) || 0)}
            style={{ width: 50, textAlign: 'center', fontFamily: 'Cinzel, serif', fontSize: 16, color, padding: '3px 4px', background: '#0d0d0d', border: `1px solid ${color}44`, borderRadius: 4 }} />
          <button onClick={() => onChangeCurrent(Math.min(max || 999, (current || 0) + 1))}
            style={{ background: '#1f1f1f', border: '1px solid #333', color: '#aaa', width: 30, height: 30, borderRadius: 6, cursor: 'pointer', fontSize: 18, lineHeight: 1, display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
          <span style={{ color: '#444', fontSize: 13 }}>/</span>
          <input type="number" value={max ?? 0} onChange={e => onChangeMax(parseInt(e.target.value) || 0)}
            style={{ width: 50, textAlign: 'center', fontFamily: 'Cinzel, serif', fontSize: 14, color: '#666', padding: '3px 4px', background: '#0d0d0d', border: '1px solid #2a2a2a', borderRadius: 4 }} />
        </div>
      </div>
      <div style={{ background: '#1a1a1a', borderRadius: 6, height: 14, overflow: 'hidden', position: 'relative' }}>
        <div style={{ height: '100%', background: color, width: `${pct}%`, transition: 'width 0.3s', borderRadius: 6 }} />
        <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontFamily: 'Cinzel, serif', color: 'rgba(255,255,255,0.75)', letterSpacing: '0.05em' }}>
          {Math.round(pct)}%
        </span>
      </div>
    </div>
  );
}

// ── XP Row (image 2 style: level box | bar fills row | −/+ right) ──
function XPRow({ level, xp, maxXP, onXPChange, onLevelChange, onLevelUp }) {
  const pct = Math.max(0, Math.min(100, ((xp || 0) / (maxXP || 1)) * 100));
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
      {/* Level box */}
      <div style={{ flex: '0 0 64px', textAlign: 'center' }}>
        <div style={{ fontSize: 10, color: '#888', fontFamily: 'Cinzel, serif', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Level</div>
        <input type="number" value={level || 1} min={1} max={99}
          onChange={e => onLevelChange(parseInt(e.target.value) || 1)}
          style={{ width: '100%', background: '#1a1200', border: '2px solid #c9a84c44', borderRadius: 6, textAlign: 'center', fontFamily: 'Cinzel, serif', fontSize: 26, color: '#c9a84c', padding: '6px 0', outline: 'none' }} />
      </div>

      {/* XP bar fills remaining space */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: '#666', fontFamily: 'Cinzel, serif', textTransform: 'uppercase', letterSpacing: '0.08em' }}>XP</span>
          <span style={{ fontFamily: 'Cinzel, serif', fontSize: 12, color: xp >= maxXP ? '#ffd700' : '#c9a84c' }}>{xp || 0} / {maxXP}</span>
        </div>
        <div style={{ background: '#1a1a1a', borderRadius: 6, height: 16, overflow: 'hidden', position: 'relative' }}>
          <div style={{ height: '100%', background: 'linear-gradient(90deg, #c9a84c, #ffd700)', width: `${pct}%`, transition: 'width 0.4s', borderRadius: 6 }} />
          <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontFamily: 'Cinzel, serif', color: 'rgba(255,255,255,0.8)' }}>
            {Math.round(pct)}%
          </span>
        </div>
      </div>

      {/* −/+ buttons at right */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
        {xp >= maxXP ? (
          <button onClick={onLevelUp}
            style={{ background: 'linear-gradient(90deg, #c9a84c, #ffd700)', color: '#000', border: 'none', borderRadius: 6, padding: '4px 10px', fontFamily: 'Cinzel, serif', fontSize: 11, cursor: 'pointer', fontWeight: 700, whiteSpace: 'nowrap' }}>
            ✦ LEVEL UP
          </button>
        ) : (
          <div style={{ height: 22 }} />
        )}
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={() => onXPChange(Math.max(0, (xp || 0) - 1))}
            style={{ background: '#1f1f1f', border: '1px solid #333', color: '#aaa', width: 30, height: 30, borderRadius: 6, cursor: 'pointer', fontSize: 16, display:'flex',alignItems:'center',justifyContent:'center' }}>−</button>
          <button onClick={() => onXPChange((xp || 0) + 1)}
            style={{ background: '#1f1f1f', border: '1px solid #c9a84c44', color: '#c9a84c', width: 30, height: 30, borderRadius: 6, cursor: 'pointer', fontSize: 16, display:'flex',alignItems:'center',justifyContent:'center' }}>+</button>
        </div>
      </div>
    </div>
  );
}

// ── Stat Box ────────────────────────────────────────────────────
function StatBox({ statKey, label, value, min, max, getModifier, onChange, onRoll }) {
  const mod = getModifier(value);
  const acc = '#c9a84c';
  return (
    <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 8, padding: 12, textAlign: 'center', transition: 'border-color 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#3d2510'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a2a'}>
      <div style={{ fontSize: 10, color: '#555', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>{label}</div>
      <input type="number" value={value} min={min} max={max}
        onChange={e => onChange(Math.max(min, Math.min(max, parseInt(e.target.value) || min)))}
        style={{ background: 'transparent', border: 'none', textAlign: 'center', fontFamily: 'Cinzel, serif', fontSize: 28, color: acc, fontWeight: 700, padding: 0, width: '100%', outline: 'none' }} />
      <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 13, color: mod > 0 ? '#4ade80' : mod < 0 ? '#f87171' : '#888', marginTop: 2 }}>
        {mod >= 0 ? '+' : ''}{mod}
      </div>
      <button onClick={onRoll}
        style={{ marginTop: 8, background: '#1a1a1a', border: `1px solid #3d2510`, color: acc, borderRadius: 4, padding: '3px 10px', fontSize: 11, cursor: 'pointer', fontFamily: 'Cinzel, serif', letterSpacing: '0.06em', transition: 'background 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.background = '#3d2510'}
        onMouseLeave={e => e.currentTarget.style.background = '#1a1a1a'}>
        🎲 {statKey}
      </button>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────
export default function CharacterPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [sheet, setSheet] = useState({});
  const [system, setSystem] = useState(null);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving' | 'error'
  const [diceExpr, setDiceExpr] = useState('2d6');
  const [rollTrigger, setRollTrigger] = useState(0); // increment to trigger roll
  const autoSaveTimer = useRef(null);
  const sheetRef = useRef({});
  const charRef = useRef(null);

  useEffect(() => { fetchChar(); }, [id]);

  const fetchChar = async () => {
    try {
      const res = await api.get(`/characters/${id}`);
      charRef.current = res.data;
      setCharacter(res.data);
      const defaults = { level: 1, xp: 0, maxHP: 10, currentHP: 10, maxStamina: 10, currentStamina: 10, maxMana: 10, currentMana: 10, armor: 0, class: '', race: '', moves: '', gear: '', bonds: '', notes: '', portrait: '' };
      const merged = { ...defaults, ...res.data.sheetData };
      sheetRef.current = merged;
      setSheet(merged);
      setSystem(getSystem(res.data.system));
    } catch { toast.error('Character not found'); navigate('/'); }
  };

  // Auto-save: portrait stored separately to avoid request size issues
  const doSave = useCallback(async (data, char) => {
    if (!char) return;
    setSaveStatus('saving');
    try {
      // Separate portrait from sheet data — save portrait only when changed
      const { portrait, ...sheetWithoutPortrait } = data;

      // Save sheet without portrait first (fast)
      await api.put(`/characters/${char.id}`, {
        name: char.name,
        sheetData: { ...sheetWithoutPortrait, portrait: portrait || '' }
      });
      setSaveStatus('saved');
    } catch {
      setSaveStatus('error');
    }
  }, []);

  const update = useCallback((key, value) => {
    setSheet(prev => {
      const next = { ...prev, [key]: value };
      sheetRef.current = next;
      // Debounced auto-save
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(() => {
        doSave(sheetRef.current, charRef.current);
      }, 1500);
      return next;
    });
    setSaveStatus('dirty');
  }, [doSave]);

  // Cleanup timer on unmount — save immediately
  useEffect(() => {
    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
        doSave(sheetRef.current, charRef.current);
      }
    };
  }, [doSave]);

  const deleteChar = async () => {
    if (!confirm('Delete this character permanently?')) return;
    await api.delete(`/characters/${id}`);
    navigate('/');
  };

  const handleLevelUp = () => {
    const newLevel = (sheet.level || 1) + 1;
    update('level', newLevel);
    update('xp', 0);
    toast.success(`🎉 Level ${newLevel}! New max XP: ${system.getMaxXP(newLevel)}`, { duration: 3000 });
  };

  const handlePortraitUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Resize to max 400x400 to keep base64 small
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = Math.min(img.width, img.height, 400);
      canvas.width = size; canvas.height = size;
      const ctx = canvas.getContext('2d');
      const sx = (img.width - size) / 2, sy = (img.height - size) / 2;
      ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size);
      update('portrait', canvas.toDataURL('image/jpeg', 0.7));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  // Roll stat — set expr AND trigger immediate roll
  const rollStat = (statKey) => {
    if (!system) return;
    const mod = system.getModifier(sheet[statKey] || 10);
    const expr = mod === 0 ? '2d6' : mod > 0 ? `2d6+${mod}` : `2d6${mod}`;
    setDiceExpr(expr);
    setRollTrigger(t => t + 1); // triggers auto-roll in DiceRoller
  };

  if (!character || !system) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
      <div style={{ color: '#555', fontFamily: 'Cinzel, serif', letterSpacing: '0.1em' }}>Loading…</div>
    </div>
  );

  const acc = system.accentColor;
  const maxXP = system.getMaxXP(sheet.level || 1);

  const statusColor = saveStatus === 'saved' ? '#4ade80' : saveStatus === 'saving' ? '#c9a84c' : saveStatus === 'dirty' ? '#888' : '#f87171';
  const statusLabel = { saved: '✓ Saved', saving: '⟳ Saving…', dirty: '● Unsaved', error: '✕ Save error' }[saveStatus];

  return (
    <div className="theme-fantasy" style={{ minHeight: '100vh' }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
        @keyframes goldGlow { 0%,100%{box-shadow:0 0 8px rgba(201,168,76,0.15)} 50%{box-shadow:0 0 24px rgba(201,168,76,0.4)} }
        input[type=number]::-webkit-inner-spin-button { opacity: 0.3; }
      `}</style>
      <div className="page">

        {/* ── Top header ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, paddingBottom: 16, borderBottom: `1px solid ${acc}33` }}>
          <div>
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: 24, color: acc }}>{character.name}</div>
            <div style={{ color: '#555', fontSize: 13 }}>{system.name}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, fontFamily: 'Cinzel, serif', color: statusColor, transition: 'color 0.3s' }}>{statusLabel}</span>
            <button className="btn-ghost btn-sm" onClick={() => navigate('/')}>← Back</button>
            <button className="btn-danger btn-sm" onClick={deleteChar}>Delete</button>
          </div>
        </div>

        {/* ── Main layout ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>

          {/* ════ LEFT ════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* ── Info header card (image 2 layout) ── */}
            <div style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${acc}22`, borderRadius: 8, padding: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: 20, alignItems: 'start' }}>

                {/* Portrait */}
                <div style={{ cursor: 'pointer' }} onClick={() => document.getElementById('portrait-input').click()}>
                  <div style={{ width: 130, height: 150, background: '#0d0d0d', border: `2px solid ${acc}44`, borderRadius: 8, overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {sheet.portrait ? (
                      <img src={sheet.portrait} alt="portrait" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ textAlign: 'center', color: '#333', pointerEvents: 'none' }}>
                        <div style={{ fontSize: 36 }}>🧙</div>
                        <div style={{ fontSize: 10, fontFamily: 'Cinzel, serif', marginTop: 4, color: '#444' }}>Upload</div>
                      </div>
                    )}
                  </div>
                  <input id="portrait-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePortraitUpload} />
                </div>

                {/* Class / Race / XP row */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <label>Class</label>
                      <input value={sheet.class || ''} onChange={e => update('class', e.target.value)} placeholder="e.g. Fighter" />
                    </div>
                    <div>
                      <label>Race</label>
                      <input value={sheet.race || ''} onChange={e => update('race', e.target.value)} placeholder="e.g. Elf" />
                    </div>
                  </div>

                  {/* XP row — image 2 style */}
                  <XPRow
                    level={sheet.level || 1}
                    xp={sheet.xp || 0}
                    maxXP={maxXP}
                    onXPChange={v => update('xp', Math.max(0, v))}
                    onLevelChange={v => update('level', v)}
                    onLevelUp={handleLevelUp}
                  />
                </div>
              </div>
            </div>

            {/* ── Ability Scores ── */}
            <div style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${acc}22`, borderRadius: 8, padding: 20 }}>
              <div className="section-title" style={{ color: acc }}>⚔ Ability Scores</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {system.stats.map(stat => (
                  <StatBox key={stat.key}
                    statKey={stat.key} label={stat.label}
                    value={sheet[stat.key] ?? 10}
                    min={stat.min} max={stat.max}
                    getModifier={system.getModifier}
                    onChange={v => update(stat.key, v)}
                    onRoll={() => rollStat(stat.key)}
                  />
                ))}
              </div>
            </div>

            {/* ── Vitals ── */}
            <div style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${acc}22`, borderRadius: 8, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div className="section-title" style={{ color: acc, marginBottom: 0 }}>❤ Vitals</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: '#555', fontFamily: 'Cinzel, serif', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Armor</span>
                  <input type="number" value={sheet.armor ?? 0} onChange={e => update('armor', parseInt(e.target.value) || 0)}
                    style={{ width: 54, textAlign: 'center', fontFamily: 'Cinzel, serif', fontSize: 20, color: '#60a5fa', padding: '4px', background: '#0d0d0d', border: '1px solid #60a5fa44', borderRadius: 6 }} />
                </div>
              </div>
              <VitalsBar label="HP" current={sheet.currentHP} max={sheet.maxHP} color="#4ade80"
                onChangeCurrent={v => update('currentHP', v)} onChangeMax={v => update('maxHP', v)} />
              <VitalsBar label="Stamina" current={sheet.currentStamina} max={sheet.maxStamina} color="#fb923c"
                onChangeCurrent={v => update('currentStamina', v)} onChangeMax={v => update('maxStamina', v)} />
              <VitalsBar label="Mana" current={sheet.currentMana} max={sheet.maxMana} color="#a78bfa"
                onChangeCurrent={v => update('currentMana', v)} onChangeMax={v => update('maxMana', v)} />
            </div>

            {/* ── Details — Gear before Bonds ── */}
            <div style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${acc}22`, borderRadius: 8, padding: 20 }}>
              <div className="section-title" style={{ color: acc }}>📜 Details</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { key: 'moves', label: 'Moves', rows: 4 },
                  { key: 'gear',  label: 'Gear',  rows: 3 },
                  { key: 'bonds', label: 'Bonds', rows: 3 },
                  { key: 'notes', label: 'Notes', rows: 3 },
                ].map(f => (
                  <div key={f.key}>
                    <label>{f.label}</label>
                    <textarea value={sheet[f.key] || ''} onChange={e => update(f.key, e.target.value)} rows={f.rows} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ════ RIGHT (sticky) ════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ position: 'sticky', top: 80, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <DiceRoller
                system={character.system}
                stats={sheet}
                getModifier={system.getModifier}
                externalExpr={diceExpr}
                rollTrigger={rollTrigger}
                characterName={character.name}
              />

              {/* DW Quick Reference */}
              <div style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${acc}22`, borderRadius: 8, padding: 14 }}>
                <div className="section-title" style={{ color: acc }}>📖 Roll Results</div>
                <div style={{ fontFamily: 'Cinzel, serif', fontSize: 13, lineHeight: 2 }}>
                  <div style={{ color: '#4ade80' }}>10+ · Strong Hit</div>
                  <div style={{ color: '#facc15' }}>7–9 · Partial Hit</div>
                  <div style={{ color: '#f87171' }}>6– · Miss</div>
                </div>
              </div>

              {/* Modifier table */}
              <div style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${acc}22`, borderRadius: 8, padding: 14 }}>
                <div className="section-title" style={{ color: acc }}>📊 Modifiers</div>
                <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, lineHeight: 1.85 }}>
                  {[['1–3','-3','#f87171'],['4–5','-2','#f87171'],['6–8','-1','#f87171'],['9–12','0','#888'],['13–15','+1','#4ade80'],['16–17','+2','#4ade80'],['18–19','+3','#4ade80'],['20–21','+4','#4ade80'],['22–23','+5','#4ade80'],['24–25','+6','#4ade80'],['26–27','+7','#ffd700'],['28–29','+8','#ffd700'],['30','+9','#ffd700']].map(([r, m, c]) => (
                    <div key={r} style={{ display: 'flex', justifyContent: 'space-between', color: '#555' }}>
                      <span>{r}</span><span style={{ color: c }}>{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
