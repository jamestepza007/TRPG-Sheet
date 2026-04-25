import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api.js';
import { handleBgmSync } from '../components/AudioSettings.jsx';
import { getSystem } from '../utils/systems.js';
import DiceRoller from '../components/DiceRoller.jsx';
import toast from 'react-hot-toast';
import FontSizeControl from '../components/FontSizeControl.jsx';

// ── Portrait Crop Modal ─────────────────────────────────────────
// Preview matches actual display ratio: 130w × 150h
function PortraitCropModal({ imageUrl, onConfirm, onCancel }) {
  const canvasRef = useRef();
  const [drag, setDrag] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [scaleMin, setScaleMin] = useState(0.1);
  const [scaleMax, setScaleMax] = useState(5);
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });
  const startRef = useRef(null);
  const PW = 260;
  const PH = Math.round(PW * 150 / 130); // keep 130:150 ratio ≈ 300px

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const ratio = Math.max(PW / img.width, PH / img.height);
      const mn = Math.max(PW / img.width, PH / img.height) * 0.9;
      setScaleMin(mn);
      setScaleMax(mn * 7);
      setScale(ratio);
      setPos({ x: (PW - img.width * ratio) / 2, y: (PH - img.height * ratio) / 2 });
      setImgSize({ w: img.width, h: img.height });
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imgSize.w) return;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, PW, PH);
      ctx.drawImage(img, pos.x, pos.y, imgSize.w * scale, imgSize.h * scale);
    };
    img.src = imageUrl;
  }, [pos, scale, imgSize, imageUrl]);

  useEffect(() => { draw(); }, [draw]);

  const onMouseDown = (e) => {
    setDrag(true);
    startRef.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y };
  };
  const onMouseMove = (e) => {
    if (!drag || !startRef.current) return;
    setPos({ x: startRef.current.px + (e.clientX - startRef.current.mx), y: startRef.current.py + (e.clientY - startRef.current.my) });
  };
  const onMouseUp = () => setDrag(false);

  const handleConfirm = () => {
    const OUT_W = 400;
    const OUT_H = Math.round(OUT_W * 150 / 130);
    const canvas = document.createElement('canvas');
    canvas.width = OUT_W; canvas.height = OUT_H;
    const ctx = canvas.getContext('2d');
    const rw = OUT_W / PW, rh = OUT_H / PH;
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, pos.x * rw, pos.y * rh, imgSize.w * scale * rw, imgSize.h * scale * rh);
      onConfirm(canvas.toDataURL('image/jpeg', 0.78));
    };
    img.src = imageUrl;
  };

  const acc = '#c9a84c';
  const zoomPct = scaleMax > scaleMin ? Math.round(((scale - scaleMin) / (scaleMax - scaleMin)) * 100) : 50;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#161616', border: '1px solid #3d2510', borderRadius: 10, padding: 28, width: PW + 56, boxShadow: '0 0 60px rgba(201,168,76,0.12)' }}>
        <div style={{ fontFamily: 'Cinzel, serif', fontSize: 16, color: acc, marginBottom: 4 }}>🖼 Crop Portrait</div>
        <div style={{ color: '#555', fontSize: 12, marginBottom: 14 }}>Drag to reposition · Use slider to zoom</div>

        {/* Canvas — same ratio as portrait display */}
        <div style={{ position: 'relative', width: PW, height: PH, overflow: 'hidden', borderRadius: 8, border: `2px solid ${acc}44`, cursor: drag ? 'grabbing' : 'grab', margin: '0 auto', userSelect: 'none' }}
          onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}>
          <canvas ref={canvasRef} width={PW} height={PH} style={{ display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)`,
            backgroundSize: `${PW/3}px ${PH/3}px` }} />
        </div>

        {/* Zoom slider */}
        <div style={{ margin: '14px 0 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>🔍</span>
          <input type="range" min={scaleMin} max={scaleMax} step={0.001} value={scale}
            onChange={e => setScale(parseFloat(e.target.value))}
            style={{ flex: 1, accentColor: acc, cursor: 'pointer' }} />
          <span style={{ fontSize: 11, color: '#666', fontFamily: 'Share Tech Mono, monospace', minWidth: 36, textAlign: 'right' }}>{zoomPct}%</span>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleConfirm}
            style={{ flex: 1, background: acc, color: '#000', border: 'none', borderRadius: 6, padding: '11px', fontFamily: 'Cinzel, serif', fontSize: 13, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.08em' }}>
            ✓ Use this
          </button>
          <button onClick={onCancel}
            style={{ flex: 1, background: 'transparent', border: '1px solid #2a2a2a', color: '#666', borderRadius: 6, padding: '11px', fontFamily: 'Cinzel, serif', fontSize: 13, cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      </div>
    <FontSizeControl dark={true} />
    </div>
  );
}
// ── Vitals Bar (redesigned) ──────────────────────────────────────
function VitalsBar({ label, current, max, color, step = 1, onChangeCurrent, onChangeMax }) {
  const pct = Math.max(0, Math.min(100, ((current || 0) / (max || 1)) * 100));
  const acc = color;

  // Round to avoid floating point drift e.g. 0.1+0.2 = 0.30000000000000004
  const round = (v) => Math.round(v * 100) / 100;

  const decrease = () => onChangeCurrent(round(Math.max(0, (current || 0) - step)));
  const increase = () => onChangeCurrent(round(Math.min(max || 999, (current || 0) + step)));

  // Display: show decimal only when step is 0.5
  const displayVal = step < 1 ? (current ?? 0).toFixed(1) : (current ?? 0);

  return (
    <div style={{ marginBottom: 20, background: '#0d0d0d', border: `1px solid ${color}22`, borderRadius: 8, padding: '12px 14px' }}>
      {/* Label row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14, color: acc, fontFamily: 'Cinzel, serif', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>{label}</span>
          {step < 1 && (
            <span style={{ fontSize: 9, color: '#444', fontFamily: 'Share Tech Mono, monospace', background: '#1a1a1a', border: `1px solid ${color}22`, borderRadius: 4, padding: '1px 6px' }}>±{step}</span>
          )}
        </div>
        <span style={{ fontFamily: 'Cinzel, serif', fontSize: 13, color: pct <= 25 ? '#f87171' : pct <= 50 ? '#facc15' : acc }}>
          {Math.round(pct)}%
        </span>
      </div>

      {/* Bar */}
      <div style={{ background: '#1a1a1a', borderRadius: 6, height: 10, overflow: 'hidden', marginBottom: 12 }}>
        <div style={{ height: '100%', background: pct <= 25 ? '#f87171' : pct <= 50 ? '#facc15' : color, width: `${pct}%`, transition: 'width 0.3s, background 0.3s', borderRadius: 6 }} />
      </div>

      {/* Controls row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Current */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: '#777', fontFamily: 'Cinzel, serif', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Current</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button onClick={decrease}
              style={{ background: '#1a1a1a', border: `1px solid ${color}44`, color: acc, width: 32, height: 32, borderRadius: 6, cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = color + '33'}
              onMouseLeave={e => e.currentTarget.style.background = '#1a1a1a'}>−</button>
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: 24, color: acc, minWidth: 44, textAlign: 'center', fontWeight: 700 }}>
              {displayVal}
            </div>
            <button onClick={increase}
              style={{ background: '#1a1a1a', border: `1px solid ${color}44`, color: acc, width: 32, height: 32, borderRadius: 6, cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = color + '33'}
              onMouseLeave={e => e.currentTarget.style.background = '#1a1a1a'}>+</button>
          </div>
        </div>

        <div style={{ color: '#2a2a2a', fontSize: 20, fontWeight: 300 }}>│</div>

        {/* Max */}
        <div style={{ flex: '0 0 80px' }}>
          <div style={{ fontSize: 12, color: '#777', fontFamily: 'Cinzel, serif', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Max</div>
          <input type="number" value={max ?? 0}
            step={step}
            onChange={e => onChangeMax(parseFloat(e.target.value) || 0)}
            style={{ width: '100%', textAlign: 'center', fontFamily: 'Cinzel, serif', fontSize: 16, color: '#666', padding: '6px 4px', background: '#161616', border: '1px solid #2a2a2a', borderRadius: 6, outline: 'none' }} />
        </div>
      </div>
    <FontSizeControl dark={true} />
    </div>
  );
}

// ── XP Row ──────────────────────────────────────────────────────
function XPRow({ level, xp, maxXP, onXPChange, onLevelChange, onLevelUp }) {
  const pct = Math.max(0, Math.min(100, ((xp || 0) / (maxXP || 1)) * 100));
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
      <div style={{ flex: '0 0 64px', textAlign: 'center' }}>
        <div style={{ fontSize: 10, color: '#888', fontFamily: 'Cinzel, serif', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Level</div>
        <input type="number" value={level || 1} min={1} max={99}
          onChange={e => onLevelChange(parseInt(e.target.value) || 1)}
          style={{ width: '100%', background: '#1a1200', border: '2px solid #c9a84c44', borderRadius: 6, textAlign: 'center', fontFamily: 'Cinzel, serif', fontSize: 26, color: '#c9a84c', padding: '6px 0', outline: 'none' }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: '#666', fontFamily: 'Cinzel, serif', textTransform: 'uppercase', letterSpacing: '0.08em' }}>XP</span>
          <span style={{ fontFamily: 'Cinzel, serif', fontSize: 12, color: xp >= maxXP ? '#ffd700' : '#c9a84c' }}>{xp || 0} / {maxXP}</span>
        </div>
        <div style={{ background: '#1a1a1a', borderRadius: 6, height: 16, overflow: 'hidden', position: 'relative' }}>
          <div style={{ height: '100%', background: 'linear-gradient(90deg, #c9a84c, #ffd700)', width: `${pct}%`, transition: 'width 0.4s', borderRadius: 6 }} />
          <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontFamily: 'Cinzel, serif', color: 'rgba(255,255,255,0.8)' }}>{Math.round(pct)}%</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
        {xp >= maxXP ? (
          <button onClick={onLevelUp} style={{ background: 'linear-gradient(90deg, #c9a84c, #ffd700)', color: '#000', border: 'none', borderRadius: 6, padding: '4px 10px', fontFamily: 'Cinzel, serif', fontSize: 11, cursor: 'pointer', fontWeight: 700, whiteSpace: 'nowrap' }}>✦ LEVEL UP</button>
        ) : <div style={{ height: 22 }} />}
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={() => onXPChange(Math.max(0, (xp || 0) - 1))} style={{ background: '#1f1f1f', border: '1px solid #333', color: '#aaa', width: 30, height: 30, borderRadius: 6, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
          <button onClick={() => onXPChange((xp || 0) + 1)} style={{ background: '#1f1f1f', border: '1px solid #c9a84c44', color: '#c9a84c', width: 30, height: 30, borderRadius: 6, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
        </div>
      </div>
    <FontSizeControl dark={true} />
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
        style={{ marginTop: 8, background: '#1a1a1a', border: '1px solid #3d2510', color: acc, borderRadius: 4, padding: '3px 10px', fontSize: 11, cursor: 'pointer', fontFamily: 'Cinzel, serif', letterSpacing: '0.06em', transition: 'background 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.background = '#3d2510'}
        onMouseLeave={e => e.currentTarget.style.background = '#1a1a1a'}>
        🎲 {statKey}
      </button>
    <FontSizeControl dark={true} />
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
  const [saveStatus, setSaveStatus] = useState('saved');
  const [diceExpr, setDiceExpr] = useState('2d6');
  const [rollTrigger, setRollTrigger] = useState(0);
  const [cropSrc, setCropSrc] = useState(null); // portrait crop modal
  const [partyData, setPartyData] = useState(null);
  const [editingName, setEditingName] = useState(false);
  const [nameVal, setNameVal] = useState('');
  const sseRef = useRef(null);
  const [activeTab, setActiveTab] = useState('sheet'); // 'sheet' | 'notes'
  const autoSaveTimer = useRef(null);
  const sheetRef = useRef({});
  const charRef = useRef(null);

  useEffect(() => {
    fetchChar();
    fetchParty();
    return () => { sseRef.current?.close(); };
  }, [id]);

  const fetchParty = async () => {
    try {
      const res = await api.get('/parties/mine');
      const myParty = res.data.find(m => m.party?.members?.some(mb => mb.character?.id === id));
      if (myParty) {
        setPartyData(myParty.party);
        startSSE(myParty.party.id);
      }
    } catch {}
  };

  const startSSE = (partyId) => {
    if (sseRef.current) sseRef.current.close();
    const token = localStorage.getItem('token');
    const baseUrl = import.meta.env.VITE_API_URL || '/api';
    const es = new EventSource(`${baseUrl}/sse/party/${partyId}?token=${token}`);
    sseRef.current = es;
    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === 'bgm_sync') {
          handleBgmSync(data);
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

  const fetchChar = async () => {
    try {
      const res = await api.get(`/characters/${id}`);
      // Route CAIN characters to their own page
      if (res.data.system === 'CAIN') {
        navigate(`/characters/cain/${id}`, { replace: true });
        return;
      }
      charRef.current = res.data;
      setCharacter(res.data);
      const defaults = { level: 1, xp: 0, maxHP: 10, currentHP: 10, maxStamina: 10, currentStamina: 10, maxMana: 10, currentMana: 10, armor: 0, class: '', race: '', moves: '', gear: '', bonds: '', notes: '', portrait: '' };
      const merged = { ...defaults, ...res.data.sheetData };
      sheetRef.current = merged;
      setSheet(merged);
      setSystem(getSystem(res.data.system));
    } catch { toast.error('Character not found'); navigate('/'); }
  };

  const doSave = useCallback(async (data, char) => {
    if (!char) return;
    setSaveStatus('saving');
    try {
      await api.put(`/characters/${char.id}`, { name: char.name, sheetData: data });
      setSaveStatus('saved');
    } catch { setSaveStatus('error'); }
  }, []);

  const update = useCallback((key, value) => {
    setSheet(prev => {
      const next = { ...prev, [key]: value };
      sheetRef.current = next;
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(() => doSave(sheetRef.current, charRef.current), 1500);
      return next;
    });
    setSaveStatus('dirty');
  }, [doSave]);

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
    toast.success(`🎉 Level ${newLevel}!`, { duration: 3000 });
  };

  // Portrait — open file picker, then show crop modal
  const handlePortraitClick = () => document.getElementById('portrait-input').click();
  const handlePortraitFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCropSrc(url);
    e.target.value = '';
  };
  const handleCropConfirm = (dataUrl) => {
    update('portrait', dataUrl);
    URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
  };
  const handleCropCancel = () => {
    URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
  };

  const rollStat = (statKey) => {
    if (!system) return;
    const mod = system.getModifier(sheet[statKey] || 10);
    const expr = mod === 0 ? '2d6' : mod > 0 ? `2d6+${mod}` : `2d6${mod}`;
    setDiceExpr(expr);
    setRollTrigger(t => t + 1);
  };

  if (!character || !system) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
      <div style={{ color: '#555', fontFamily: 'Cinzel, serif', letterSpacing: '0.1em' }}>Loading…</div>
    </div>
  );

  const acc = system.accentColor;
  const maxXP = system.getMaxXP(sheet.level || 1);
  const statusColor = { saved: '#4ade80', saving: '#c9a84c', dirty: '#888', error: '#f87171' }[saveStatus];
  const statusLabel = { saved: '✓ Saved', saving: '⟳ Saving…', dirty: '● Unsaved', error: '✕ Error' }[saveStatus];

  return (
    <div className="theme-fantasy" style={{ minHeight: '100vh' }}>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}
        input[type=number]::-webkit-inner-spin-button{opacity:0.3}
      `}</style>

      {/* Portrait crop modal */}
      {cropSrc && <PortraitCropModal imageUrl={cropSrc} onConfirm={handleCropConfirm} onCancel={handleCropCancel} />}
      <input id="portrait-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePortraitFile} />

      <div className="page">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, paddingBottom: 16, borderBottom: `1px solid ${acc}33` }}>
          <div>
            {editingName ? (
              <input autoFocus value={nameVal}
                onChange={e => setNameVal(e.target.value)}
                onBlur={async () => {
                  if (nameVal.trim() && nameVal !== character.name) {
                    await api.put(`/characters/${id}`, { name: nameVal.trim() });
                    setCharacter(c => ({ ...c, name: nameVal.trim() }));
                  }
                  setEditingName(false);
                }}
                onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); if (e.key === 'Escape') { setEditingName(false); } }}
                style={{ fontFamily: 'Cinzel, serif', fontSize: 24, color: acc, background: 'transparent', border: 'none', borderBottom: `2px solid ${acc}`, outline: 'none', width: '100%' }} />
            ) : (
              <div onClick={() => { setEditingName(true); setNameVal(character.name); }}
                title="Click to rename"
                style={{ fontFamily: 'Cinzel, serif', fontSize: 24, color: acc, cursor: 'pointer' }}>
                {character.name} <span style={{ fontSize: 12, opacity: 0.4 }}>✎</span>
              </div>
            )}
            <div style={{ color: '#555', fontSize: 13 }}>{system.name}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, fontFamily: 'Cinzel, serif', color: statusColor, transition: 'color 0.3s' }}>{statusLabel}</span>
            <button className="btn-ghost btn-sm" onClick={() => navigate('/')}>← Back</button>
            <button className="btn-danger btn-sm" onClick={deleteChar}>Delete</button>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: `2px solid ${acc}33` }}>
          {[['sheet','⚔ Character Sheet'], ['notes','📝 Notes']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)}
              style={{ background: 'transparent', border: 'none', borderBottom: activeTab === key ? `2px solid ${acc}` : '2px solid transparent', marginBottom: -2, color: activeTab === key ? acc : '#555', fontFamily: 'Cinzel, serif', fontSize: 12, padding: '8px 20px', cursor: 'pointer', letterSpacing: '0.08em' }}>
              {label}
            </button>
          ))}
        </div>

        {/* Notes Page */}
        {activeTab === 'notes' && (
          <div className="card" style={{ minHeight: '70vh' }}>
            <textarea value={sheet.notes || ''} onChange={e => update('notes', e.target.value)}
              placeholder="Notes..."
              style={{ width: '100%', height: '70vh', resize: 'vertical' }} />
          </div>
        )}

        {/* Character Sheet */}
        {activeTab === 'sheet' && (<>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
          {/* LEFT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Info header */}
            <div style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${acc}22`, borderRadius: 8, padding: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: 20, alignItems: 'start' }}>
                {/* Portrait */}
                <div style={{ cursor: 'pointer', position: 'relative' }} onClick={handlePortraitClick}
                  title="คลิกเพื่อเปลี่ยนรูป">
                  <div style={{ width: 130, height: 150, background: '#0d0d0d', border: `2px solid ${acc}44`, borderRadius: 8, overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {sheet.portrait
                      ? <img src={sheet.portrait} alt="portrait" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ textAlign: 'center', color: '#333' }}><div style={{ fontSize: 36 }}>🧙</div><div style={{ fontSize: 10, fontFamily: 'Cinzel, serif', marginTop: 4, color: '#444' }}>Upload</div></div>
                    }
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s', fontSize: 11, color: '#fff', fontFamily: 'Cinzel, serif' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0)'}>
                      {sheet.portrait ? '✏ แก้ไข' : ''}
                    </div>
                  </div>
                </div>

                {/* Class / Race / XP */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div><label>Class</label><input value={sheet.class || ''} onChange={e => update('class', e.target.value)} placeholder="e.g. Fighter" /></div>
                    <div><label>Race</label><input value={sheet.race || ''} onChange={e => update('race', e.target.value)} placeholder="e.g. Elf" /></div>
                  </div>
                  <XPRow level={sheet.level || 1} xp={sheet.xp || 0} maxXP={maxXP}
                    onXPChange={v => update('xp', Math.max(0, v))}
                    onLevelChange={v => update('level', v)}
                    onLevelUp={handleLevelUp} />
                </div>
              </div>
            </div>

            {/* Ability Scores */}
            <div style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${acc}22`, borderRadius: 8, padding: 20 }}>
              <div className="section-title" style={{ color: acc }}>⚔ Ability Scores</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {system.stats.map(stat => (
                  <StatBox key={stat.key} statKey={stat.key} label={stat.label}
                    value={sheet[stat.key] ?? 10} min={stat.min} max={stat.max}
                    getModifier={system.getModifier}
                    onChange={v => update(stat.key, v)}
                    onRoll={() => rollStat(stat.key)} />
                ))}
              </div>
            </div>

            {/* Vitals */}
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
              <VitalsBar label="Stamina" current={sheet.currentStamina} max={sheet.maxStamina} color="#fb923c" step={0.5}
                onChangeCurrent={v => update('currentStamina', v)} onChangeMax={v => update('maxStamina', v)} />
              <VitalsBar label="Mana" current={sheet.currentMana} max={sheet.maxMana} color="#a78bfa" step={0.5}
                onChangeCurrent={v => update('currentMana', v)} onChangeMax={v => update('maxMana', v)} />
            </div>

            {/* Details */}
            <div style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${acc}22`, borderRadius: 8, padding: 20 }}>
              <div className="section-title" style={{ color: acc }}>📜 Details</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[{ key: 'moves', label: 'Moves', rows: 4 }, { key: 'gear', label: 'Gear', rows: 3 }, { key: 'bonds', label: 'Bonds', rows: 3 }, { key: 'notes', label: 'Notes', rows: 3 }].map(f => (
                  <div key={f.key}><label>{f.label}</label><textarea value={sheet[f.key] || ''} onChange={e => update(f.key, e.target.value)} rows={f.rows} /></div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT sticky */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ position: 'sticky', top: 80, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <DiceRoller system={character.system} stats={sheet} getModifier={system.getModifier}
                externalExpr={diceExpr} rollTrigger={rollTrigger} characterName={character.name} />

            </div>
          </div>
        </div>
        </>)}
      </div>
      <FontSizeControl dark={true} />
    </div>
  );
}

{/* Party mini panel */}
              {partyData && (
                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div className="section-title" style={{ color: acc, margin: 0 }}>⚔ {partyData.campaign?.name || 'Party'}</div>
                    <span style={{ fontSize: 9, color: '#555' }}>{partyData.members?.length} members</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {partyData.members?.map(m => {
                      const sd = m.character?.sheetData || {};
                      const isMe = m.character?.id === id;
                      const hp = sd.maxHP ? Math.max(0, Math.min(100, (sd.currentHP / sd.maxHP) * 100)) : null;
                      const st = sd.maxStamina ? Math.max(0, Math.min(100, (sd.currentStamina / sd.maxStamina) * 100)) : null;
                      const mn = sd.maxMana ? Math.max(0, Math.min(100, (sd.currentMana / sd.maxMana) * 100)) : null;
                      return (
                        <div key={m.id} style={{ background: isMe ? `rgba(201,168,76,0.08)` : 'rgba(0,0,0,0.3)', border: `1px solid ${isMe ? acc+'44' : '#2a2a2a'}`, borderRadius: 6, padding: '8px 10px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <div>
                              <span style={{ fontFamily: 'Cinzel, serif', fontSize: 12, color: isMe ? acc : '#ccc' }}>{m.character?.name}</span>
                              {isMe && <span style={{ fontSize: 9, color: acc, marginLeft: 4 }}>★ you</span>}
                              <div style={{ fontSize: 9, color: '#555', marginTop: 1 }}>{sd.class || '—'} · Lv.{sd.level || 1}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: 9, color: '#555' }}>{m.user?.username}</div>
                              <div style={{ fontSize: 9, color: '#4a7a4a', marginTop: 1 }}>ARM {sd.armor ?? 0}</div>
                              {(sd.injuries || 0) > 0 && (
                                <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
                                  {Array.from({ length: 5 }, (_, i) => (
                                    <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', border: '1px solid #f87171', background: i < (sd.injuries || 0) ? '#f87171' : 'transparent' }} />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          {hp !== null && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                              {[
                                { label: 'HP', pct: hp, cur: sd.currentHP, max: sd.maxHP, color: '#4ade80' },
                                ...(st !== null ? [{ label: 'ST', pct: st, cur: sd.currentStamina, max: sd.maxStamina, color: '#fb923c' }] : []),
                                ...(mn !== null ? [{ label: 'MP', pct: mn, cur: sd.currentMana, max: sd.maxMana, color: '#a78bfa' }] : []),
                              ].map(bar => (
                                <div key={bar.label}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                                    <span style={{ fontSize: 8, color: '#555' }}>{bar.label}</span>
                                    <span style={{ fontSize: 8, color: bar.pct <= 25 ? '#f87171' : '#555', fontFamily: 'Share Tech Mono, monospace' }}>{bar.cur}/{bar.max}</span>
                                  </div>
                                  <div style={{ background: '#1a1a1a', borderRadius: 2, height: 4, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', background: bar.pct <= 25 ? '#f87171' : bar.pct <= 50 ? '#facc15' : bar.color, width: bar.pct + '%', transition: 'width 0.3s' }} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

