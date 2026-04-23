import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api.js';
import { getSystem } from '../utils/systems.js';
import CainDiceRoller from '../components/CainDiceRoller.jsx';
import toast from 'react-hot-toast';

// ── CAIN style tokens ────────────────────────────────────────────
const C = {
  bg: '#f2ede3',
  paper: '#e8e2d4',
  dark: '#1a1a1a',
  mid: '#444',
  muted: '#888',
  border: '#999',
  borderDark: '#444',
  red: '#8b0000',
  stamp: '#8b0000',
  font: "'Courier New', 'Courier', monospace",
  fontSans: "'Arial Narrow', Arial, sans-serif",
};

const label = (text, style = {}) => (
  <div style={{ fontFamily: C.fontSans, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.mid, marginBottom: 2, ...style }}>{text}</div>
);

// ── Dot row (skill level 0-3) ─────────────────────────────────────
function DotRow({ value, max = 3, onChange, color = C.dark }) {
  return (
    <div style={{ display: 'flex', gap: 5 }}>
      {Array.from({ length: max }, (_, i) => (
        <div key={i} onClick={() => onChange(value === i + 1 ? 0 : i + 1)}
          style={{ width: 14, height: 14, borderRadius: '50%', border: `2px solid ${color}`, background: i < value ? color : 'transparent', cursor: 'pointer', transition: 'background 0.15s' }} />
      ))}
    </div>
  );
}

// ── Circle row (injuries, XP etc) ────────────────────────────────
function CircleRow({ count, filled, onToggle, size = 16, color = C.dark, crossed = [] }) {
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} onClick={() => onToggle(i)}
          style={{ width: size, height: size, borderRadius: '50%', border: `2px solid ${color}`, background: i < filled ? color : 'transparent', cursor: 'pointer', position: 'relative', transition: 'background 0.15s' }}>
          {crossed.includes(i) && (
            <div style={{ position: 'absolute', inset: -2, display: 'flex', alignItems: 'center', justifyContent: 'center', color, fontSize: 12, fontWeight: 700 }}>✕</div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Hook row ─────────────────────────────────────────────────────
function HookRow({ hook, index, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, padding: '4px 8px', background: 'rgba(0,0,0,0.04)', border: `1px solid ${C.border}`, borderRadius: 2 }}>
      <div style={{ fontSize: 9, color: C.muted, minWidth: 14, fontFamily: C.font }}>{index + 1}.</div>
      <input value={hook.name} onChange={e => onChange({ ...hook, name: e.target.value })}
        placeholder="HOOK NAME"
        style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: C.font, fontSize: 12, color: C.dark, borderBottom: `1px solid ${C.border}` }} />
      <div style={{ display: 'flex', gap: 3 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} onClick={() => onChange({ ...hook, slashes: hook.slashes === i + 1 ? 0 : i + 1 })}
            style={{ width: 12, height: 16, borderRight: `2px solid ${i < hook.slashes ? C.dark : C.border}`, cursor: 'pointer' }} />
        ))}
      </div>
    </div>
  );
}

// ── Section box ──────────────────────────────────────────────────
function SectionBox({ title, children, style = {} }) {
  return (
    <div style={{ border: `1px solid ${C.borderDark}`, marginBottom: 10, ...style }}>
      <div style={{ background: C.dark, color: '#f2ede3', fontFamily: C.fontSans, fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', padding: '2px 8px', textTransform: 'uppercase' }}>{title}</div>
      <div style={{ padding: '8px 10px' }}>{children}</div>
    </div>
  );
}

// ── Execution bar ────────────────────────────────────────────────
function ExecutionBar({ max, injuries }) {
  const filled = max - injuries;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontFamily: C.fontSans, fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: C.dark }}>EXECUTION</span>
        <span style={{ fontFamily: C.font, fontSize: 10, color: filled <= 2 ? C.red : C.mid }}>{filled} / {max}</span>
      </div>
      <div style={{ display: 'flex', gap: 3 }}>
        {Array.from({ length: max }, (_, i) => (
          <div key={i} style={{ flex: 1, height: 16, border: `1px solid ${C.borderDark}`, background: i < filled ? C.dark : 'transparent', transition: 'background 0.2s' }} />
        ))}
      </div>
      <div style={{ fontFamily: C.font, fontSize: 8, color: C.muted, marginTop: 3 }}>Starts at 6. -1 per injury. If filled, gain an injury and roll over remainder of stress.</div>
    </div>
  );
}

// ── CAT display ──────────────────────────────────────────────────
function CATDisplay({ cat, missions, onChange, onMissionsChange }) {
  const levels = [
    { n: 1, label: 'I', threshold: 0 },
    { n: 2, label: 'II', threshold: 1 },
    { n: 3, label: 'III', threshold: 2 },
    { n: 4, label: 'IV', threshold: 4 },
    { n: 5, label: 'V', threshold: 7 },
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {levels.map(lv => (
        <div key={lv.n} onClick={() => onChange(lv.n)}
          style={{ width: 32, height: 32, border: `2px solid ${C.borderDark}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontFamily: C.fontSans, fontSize: 13, fontWeight: 700, background: cat >= lv.n ? C.dark : 'transparent', color: cat >= lv.n ? '#f2ede3' : C.dark, transition: 'all 0.15s', clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }}>
          {lv.label}
        </div>
      ))}
      <div style={{ marginLeft: 8 }}>
        <div style={{ fontFamily: C.font, fontSize: 9, color: C.muted, marginBottom: 4 }}>Missions survived:</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button onClick={() => onMissionsChange(Math.max(0, missions - 1))}
            style={{ width: 22, height: 22, border: `1px solid ${C.borderDark}`, background: 'transparent', fontFamily: C.font, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
          <div style={{ fontFamily: C.font, fontSize: 15, fontWeight: 700, minWidth: 22, textAlign: 'center', color: C.dark }}>{missions}</div>
          <button onClick={() => onMissionsChange(missions + 1)}
            style={{ width: 22, height: 22, border: `1px solid ${C.borderDark}`, background: 'transparent', fontFamily: C.font, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
        </div>
      </div>
    </div>
  );
}

// ── Sin boxes ────────────────────────────────────────────────────
function SinTrack({ sinBoxes, sinBoxesCrossed, onToggle }) {
  const total = 9;
  return (
    <div>
      <div style={{ fontFamily: C.fontSans, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', color: C.red, marginBottom: 6 }}>SIN OVERFLOW TRACK</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: 4, marginBottom: 8 }}>
        {Array.from({ length: total }, (_, i) => {
          const crossed = i < sinBoxesCrossed;
          const filled = !crossed && i < sinBoxes;
          return (
            <div key={i} onClick={() => !crossed && onToggle(i)}
              style={{ width: '100%', paddingBottom: '100%', position: 'relative', border: `2px solid ${C.red}`, background: filled ? C.red : 'transparent', cursor: crossed ? 'default' : 'pointer', opacity: crossed ? 0.4 : 1 }}>
              {crossed && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: C.red, fontWeight: 700 }}>✕</div>}
            </div>
          );
        })}
      </div>
      <div style={{ fontFamily: C.font, fontSize: 8, color: C.muted, lineHeight: 1.5 }}>
        Sin overflow: Resistance check (1D6 + sin marks). 7+ = keep control.<br />
        On fail: permanently cross out 2 boxes. Give up.
      </div>
    </div>
  );
}

// ── Portrait crop modal (minimal) ────────────────────────────────
function PortraitModal({ imageUrl, onConfirm, onCancel }) {
  const canvasRef = useRef();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [scaleMin, setScaleMin] = useState(0.1);
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });
  const drag = useRef(false);
  const startRef = useRef(null);
  const W = 160, H = 190;

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const r = Math.max(W / img.width, H / img.height);
      setScaleMin(r * 0.9); setScale(r);
      setPos({ x: (W - img.width * r) / 2, y: (H - img.height * r) / 2 });
      setImgSize({ w: img.width, h: img.height });
    };
    img.src = imageUrl;
  }, [imageUrl]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imgSize.w) return;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => { ctx.clearRect(0, 0, W, H); ctx.drawImage(img, pos.x, pos.y, imgSize.w * scale, imgSize.h * scale); };
    img.src = imageUrl;
  }, [pos, scale, imgSize, imageUrl]);

  const onMouseDown = e => { drag.current = true; startRef.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y }; };
  const onMouseMove = e => { if (!drag.current || !startRef.current) return; setPos({ x: startRef.current.px + (e.clientX - startRef.current.mx), y: startRef.current.py + (e.clientY - startRef.current.my) }); };
  const onMouseUp = () => { drag.current = false; };

  const confirm = () => {
    const canvas = document.createElement('canvas');
    const OW = 320, OH = 380; canvas.width = OW; canvas.height = OH;
    const ctx = canvas.getContext('2d');
    const rw = OW / W, rh = OH / H;
    const img = new Image();
    img.onload = () => { ctx.drawImage(img, pos.x * rw, pos.y * rh, imgSize.w * scale * rw, imgSize.h * scale * rh); onConfirm(canvas.toDataURL('image/jpeg', 0.78)); };
    img.src = imageUrl;
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: C.bg, border: `2px solid ${C.borderDark}`, padding: 20, width: W + 40 }}>
        <div style={{ fontFamily: C.fontSans, fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', marginBottom: 12, textTransform: 'uppercase' }}>AFFIX ID PHOTO</div>
        <div style={{ width: W, height: H, overflow: 'hidden', border: `1px solid ${C.borderDark}`, cursor: 'grab', margin: '0 auto 12px' }}
          onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}>
          <canvas ref={canvasRef} width={W} height={H} style={{ display: 'block' }} />
        </div>
        <input type="range" min={scaleMin} max={scaleMin * 6} step={0.001} value={scale}
          onChange={e => setScale(parseFloat(e.target.value))}
          style={{ width: '100%', marginBottom: 12, accentColor: C.dark }} />
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={confirm} style={{ flex: 1, background: C.dark, color: C.bg, border: 'none', fontFamily: C.fontSans, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', padding: '8px', cursor: 'pointer' }}>CONFIRM</button>
          <button onClick={onCancel} style={{ flex: 1, background: 'transparent', color: C.dark, border: `1px solid ${C.borderDark}`, fontFamily: C.fontSans, fontSize: 10, padding: '8px', cursor: 'pointer' }}>CANCEL</button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────
export default function CainCharacterPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [sheet, setSheet] = useState({});
  const [saveStatus, setSaveStatus] = useState('saved');
  const [cropSrc, setCropSrc] = useState(null);
  const autoSaveTimer = useRef(null);
  const sheetRef = useRef({});
  const charRef = useRef(null);
  const sys = getSystem('CAIN');

  useEffect(() => { fetchChar(); }, [id]);

  const fetchChar = async () => {
    try {
      const res = await api.get(`/characters/${id}`);
      charRef.current = res.data;
      setCharacter(res.data);
      const defaults = sys.getDefaultSheet();
      const merged = { ...defaults, ...res.data.sheetData };
      sheetRef.current = merged;
      setSheet(merged);
    } catch { toast.error('Character not found'); navigate('/'); }
  };

  const doSave = useCallback(async (data, char) => {
    if (!char) return;
    setSaveStatus('saving');
    try { await api.put(`/characters/${char.id}`, { name: char.name, sheetData: data }); setSaveStatus('saved'); }
    catch { setSaveStatus('error'); }
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

  useEffect(() => () => { if (autoSaveTimer.current) { clearTimeout(autoSaveTimer.current); doSave(sheetRef.current, charRef.current); } }, [doSave]);

  const deleteChar = async () => {
    if (!confirm('Delete this character?')) return;
    await api.delete(`/characters/${id}`);
    navigate('/');
  };

  const handlePortraitClick = () => document.getElementById('cain-portrait-input').click();
  const handlePortraitFile = e => { const f = e.target.files?.[0]; if (!f) return; setCropSrc(URL.createObjectURL(f)); e.target.value = ''; };
  const handleCropConfirm = dataUrl => { update('portrait', dataUrl); URL.revokeObjectURL(cropSrc); setCropSrc(null); };

  if (!character) return (
    <div style={{ background: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: C.font, color: C.mid }}>LOADING FILE...</div>
    </div>
  );

  const psyche = sys.getPsyche(sheet.cat || 1);
  const injuries = sheet.injuries || 0;
  const execMax = 6;

  const statusColor = { saved: '#2a5a2a', saving: '#5a4a00', dirty: '#888', error: '#8b0000' }[saveStatus];
  const statusLabel = { saved: '■ FILED', saving: '◌ FILING...', dirty: '○ UNSAVED', error: '✕ ERROR' }[saveStatus];

  return (
    <div style={{ background: '#d4cfc4', minHeight: '100vh', padding: '20px' }}>
      <style>{`
        input[type=number]::-webkit-inner-spin-button { opacity: 0.3; }
        textarea { resize: vertical; }
        * { box-sizing: border-box; }
      `}</style>

      {cropSrc && <PortraitModal imageUrl={cropSrc} onConfirm={handleCropConfirm} onCancel={() => { URL.revokeObjectURL(cropSrc); setCropSrc(null); }} />}
      <input id="cain-portrait-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePortraitFile} />

      {/* Document header bar */}
      <div style={{ maxWidth: 1200, margin: '0 auto 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: C.font, fontSize: 10, color: '#666' }}>
          DOCREF: {character.id?.slice(-8).toUpperCase()} &nbsp;|&nbsp; SYSTEM: CAIN 1.2 &nbsp;|&nbsp;
          <span style={{ color: statusColor }}>{statusLabel}</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => navigate('/')} style={{ background: 'transparent', border: `1px solid #666`, color: '#444', fontFamily: C.fontSans, fontSize: 9, padding: '4px 12px', cursor: 'pointer', letterSpacing: '0.1em' }}>← BACK</button>
          <button onClick={deleteChar} style={{ background: C.red, border: 'none', color: '#fff', fontFamily: C.fontSans, fontSize: 9, padding: '4px 12px', cursor: 'pointer', letterSpacing: '0.1em' }}>DELETE</button>
        </div>
      </div>

      {/* Main document */}
      <div style={{ maxWidth: 1200, margin: '0 auto', background: C.bg, border: `1px solid ${C.borderDark}`, boxShadow: '4px 4px 0 rgba(0,0,0,0.2)', padding: 20, fontFamily: C.font, color: C.dark }}>

        {/* Header stamp */}
        <div style={{ textAlign: 'center', borderBottom: `3px solid ${C.dark}`, paddingBottom: 8, marginBottom: 16 }}>
          <div style={{ fontFamily: C.fontSans, fontSize: 22, fontWeight: 900, letterSpacing: '0.3em', color: C.dark }}>CAIN</div>
          <div style={{ fontFamily: C.fontSans, fontSize: 8, letterSpacing: '0.4em', color: C.mid }}>REGISTERED EXORCIST — FIELD DOCUMENTATION — CASTLE DIVISION</div>
        </div>

        {/* ── Main 2-col: left=content, right=dice roller ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(0, 300px)', gap: 16, alignItems: 'start' }}>
        <div> {/* ── LEFT COLUMN ── */}

        {/* ── Row 1: ID Card + Skills ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 12 }}>

          {/* ID Card */}
          <SectionBox title="REGISTERED EXORCIST — ID CARD">
            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 12, alignItems: 'start' }}>
              {/* Portrait */}
              <div onClick={handlePortraitClick} style={{ cursor: 'pointer', position: 'relative' }}>
                <div style={{ width: 160, height: 190, background: '#ccc', border: `2px solid ${C.borderDark}`, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  {sheet.portrait
                    ? <img src={sheet.portrait} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ textAlign: 'center', color: '#888' }}><div style={{ fontSize: 10, fontFamily: C.fontSans, letterSpacing: '0.1em' }}>AFFIX ID PHOTO</div><div style={{ fontSize: 9, marginTop: 4 }}>click to upload</div></div>
                  }
                </div>
                <div style={{ fontFamily: C.font, fontSize: 8, color: C.muted, marginTop: 2, textAlign: 'center' }}>do not cover eyes when affixing photo</div>
              </div>

              {/* Identity fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[['NAME', 'name'], ['XID', 'xid'], ['AGND', 'agnd'], ['BLSPH', 'blsph']].map(([lbl, key]) => (
                  <div key={key}>
                    <div style={{ fontFamily: C.fontSans, fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', color: C.mid }}>{lbl}:</div>
                    <input value={sheet[key] || ''} onChange={e => update(key, e.target.value)}
                      style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid ${C.border}`, fontFamily: C.font, fontSize: 13, color: C.dark, outline: 'none', padding: '2px 0' }} />
                  </div>
                ))}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[['SX', 'sx'], ['HT', 'ht'], ['WT', 'wt'], ['HAIR', 'hair'], ['EYES', 'eyes']].map(([lbl, key]) => (
                    <div key={key}>
                      <div style={{ fontFamily: C.fontSans, fontSize: 8, fontWeight: 700, color: C.mid }}>{lbl}:</div>
                      <input value={sheet[key] || ''} onChange={e => update(key, e.target.value)}
                        style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid ${C.border}`, fontFamily: C.font, fontSize: 12, color: C.dark, outline: 'none' }} />
                    </div>
                  ))}
                </div>
                {/* CAT */}
                <div>
                  <div style={{ fontFamily: C.fontSans, fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', color: C.mid, marginBottom: 6 }}>CATEGORY RATING (CAT):</div>
                  <CATDisplay cat={sheet.cat || 1} missions={sheet.missionsSurvived || 0}
                    onChange={v => update('cat', v)} onMissionsChange={v => update('missionsSurvived', v)} />
                </div>
              </div>
            </div>
          </SectionBox>

          {/* Skills */}
          <SectionBox title="REGISTERED SKILLS">
            {sys.skills.map(skill => (
              <div key={skill.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0', borderBottom: `1px solid ${C.border}` }}>
                <div style={{ fontFamily: C.fontSans, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em' }}>{skill.label}</div>
                <DotRow value={sheet[skill.key] || 0} max={3} onChange={v => update(skill.key, v)} />
              </div>
            ))}
            <div style={{ marginTop: 8, fontFamily: C.font, fontSize: 9, color: C.muted }}>
              Spend 1 advance to improve. Two skills at 3 max.
            </div>
            <div style={{ marginTop: 6 }}>
              <div style={{ fontFamily: C.fontSans, fontSize: 9, fontWeight: 700, color: C.mid }}>IMPROVEMENTS:</div>
              <CircleRow count={7} filled={sheet.skillImprovements || 0} onToggle={i => update('skillImprovements', i < (sheet.skillImprovements || 0) ? i : i + 1)} size={14} />
            </div>
          </SectionBox>
        </div>

        {/* ── Row 2: Health + Psyche + Sin ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>

          {/* Health */}
          <SectionBox title="HEALTH EVALUATION">
            <ExecutionBar max={execMax} injuries={injuries} />
            <div style={{ marginTop: 12 }}>
              <div style={{ fontFamily: C.fontSans, fontSize: 9, fontWeight: 700, color: C.mid, marginBottom: 6 }}>INJURIES:</div>
              <div style={{ fontFamily: C.font, fontSize: 8, color: C.muted, marginBottom: 6 }}>Each gives -1 stress. Suffer an injury when execution fills up. Clear all stress when gaining an injury.</div>
              <CircleRow count={5} filled={injuries} onToggle={i => update('injuries', i < injuries ? i : i + 1)} size={18} color={C.red} />
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={{ fontFamily: C.fontSans, fontSize: 9, fontWeight: 700, color: C.mid, marginBottom: 4 }}>HOOKS:</div>
              <div style={{ fontFamily: C.font, fontSize: 8, color: C.muted, marginBottom: 6 }}>Gain hooks when bargaining with Admin, from powers, or when there's a delayed consequence.</div>
              {(sheet.hooks || [{ name: '', slashes: 0 }, { name: '', slashes: 0 }, { name: '', slashes: 0 }]).map((hook, i) => (
                <HookRow key={i} hook={hook} index={i} onChange={h => {
                  const hooks = [...(sheet.hooks || [])];
                  hooks[i] = h; update('hooks', hooks);
                }} />
              ))}
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={{ fontFamily: C.fontSans, fontSize: 9, fontWeight: 700, color: C.mid, marginBottom: 4 }}>AFFLICTIONS:</div>
              <div style={{ fontFamily: C.font, fontSize: 8, color: C.muted, marginBottom: 4 }}>Debrief after mission for decontamination.</div>
              <textarea value={sheet.afflictions || ''} onChange={e => update('afflictions', e.target.value)} rows={4}
                style={{ width: '100%', background: 'rgba(0,0,0,0.03)', border: `1px solid ${C.border}`, fontFamily: C.font, fontSize: 11, color: C.dark, padding: 4 }} />
            </div>
          </SectionBox>

          {/* Psyche + Action */}
          <div>
            <SectionBox title="PSYCHE + BURST">
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontFamily: C.fontSans, fontSize: 28, fontWeight: 900, letterSpacing: '0.1em', color: C.dark }}>PSYCHE</div>
                <div style={{ fontFamily: C.font, fontSize: 9, color: C.muted }}>½ CAT, rounded up. Use for your powers.</div>
                <div style={{ fontFamily: C.fontSans, fontSize: 36, fontWeight: 900, color: C.dark, marginTop: 4 }}>{psyche}</div>
              </div>
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 8 }}>
                <div style={{ fontFamily: C.fontSans, fontSize: 9, fontWeight: 700, color: C.mid, marginBottom: 6 }}>PSYCHE BURST:</div>
                <div style={{ fontFamily: C.font, fontSize: 8, color: C.muted, marginBottom: 8 }}>Use your powers or gain +1D. Then mark one, or gain 1D3 SIN instead.</div>
                <CircleRow count={3} filled={sheet.psycheBurst || 0} onToggle={i => update('psycheBurst', i < (sheet.psycheBurst || 0) ? i : i + 1)} size={22} color={C.dark} />
              </div>
            </SectionBox>

            <SectionBox title="ACTION ASSESSMENT METRIC">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 10 }}>
                <div style={{ background: C.dark, color: C.bg, textAlign: 'center', padding: '6px 4px' }}>
                  <div style={{ fontFamily: C.fontSans, fontSize: 16, fontWeight: 900 }}>4+</div>
                  <div style={{ fontFamily: C.fontSans, fontSize: 7, letterSpacing: '0.1em' }}>SUCCESS</div>
                </div>
                <div style={{ border: `1px solid ${C.borderDark}`, textAlign: 'center', padding: '6px 4px' }}>
                  <div style={{ fontFamily: C.fontSans, fontSize: 9, fontWeight: 700 }}>RISKY</div>
                  <div style={{ fontFamily: C.font, fontSize: 7, color: C.muted }}>Admin rolls the risk die</div>
                </div>
                <div style={{ border: `1px solid ${C.borderDark}`, textAlign: 'center', padding: '6px 4px' }}>
                  <div style={{ fontFamily: C.fontSans, fontSize: 9, fontWeight: 700 }}>HARD</div>
                  <div style={{ fontFamily: C.font, fontSize: 7, color: C.muted }}>Successes on a 6</div>
                </div>
              </div>
              <div style={{ fontFamily: C.font, fontSize: 8, color: C.muted, lineHeight: 1.7 }}>
                <div style={{ fontWeight: 700, color: C.dark, marginBottom: 2 }}>Gain bonus dice:</div>
                <div>- <b>Teamwork</b> (Combine highest bonuses)</div>
                <div>- <b>Setup</b> yourself or another: (+1D, -risk, or -hard)</div>
                <div>- Spend 1 <b>psyche burst</b> (+1D)</div>
                <div>- Use your <b>abilities</b></div>
                <div>- <b>Bargain</b> with the Admin</div>
                <div style={{ marginTop: 4, fontWeight: 700, color: C.dark }}>…+3 dice maximum</div>
              </div>
            </SectionBox>
          </div>

          {/* Sin */}
          <div>
            <SectionBox title="SIN TRACK">
              <SinTrack sinBoxes={sheet.sinBoxes || 0} sinBoxesCrossed={sheet.sinBoxesCrossed || 0}
                onToggle={i => {
                  const cur = sheet.sinBoxes || 0;
                  update('sinBoxes', i < cur ? i : i + 1);
                }} />
            </SectionBox>

            <SectionBox title="SIN MARKS">
              {[0, 1, 2].map(i => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div style={{ fontFamily: C.fontSans, fontSize: 8, fontWeight: 700, color: C.red }}>SIN MARK {i + 1}</div>
                  <textarea value={(sheet.sinMarks || [])[i] || ''} rows={3}
                    onChange={e => { const marks = [...(sheet.sinMarks || ['', '', ''])]; marks[i] = e.target.value; update('sinMarks', marks); }}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.03)', border: `1px solid ${C.border}`, fontFamily: C.font, fontSize: 10, padding: 4 }} />
                  <div style={{ fontFamily: C.font, fontSize: 7, color: C.muted }}>Evolve with an advance</div>
                </div>
              ))}
            </SectionBox>
          </div>
        </div>

        {/* ── Row 3: Kit + Advancement ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>

          {/* Kit */}
          <SectionBox title="REGISTERED KIT">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ fontFamily: C.fontSans, fontSize: 10, fontWeight: 700 }}>KIT POINTS:</div>
              <CircleRow count={9} filled={sheet.kitPoints || 0} onToggle={i => update('kitPoints', i < (sheet.kitPoints || 0) ? i : i + 1)} size={14} />
            </div>
            <div style={{ fontFamily: C.font, fontSize: 9, color: C.muted, marginBottom: 6 }}>Spend KP to pull out the following items any time:</div>
            <textarea value={sheet.kitDescription || ''} onChange={e => update('kitDescription', e.target.value)} rows={6}
              style={{ width: '100%', background: 'rgba(0,0,0,0.03)', border: `1px solid ${C.border}`, fontFamily: C.font, fontSize: 10, padding: 6 }} />
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ fontFamily: C.fontSans, fontSize: 11, fontWeight: 700 }}>■ $ ■ SCRIP:</div>
              <input type="number" value={sheet.scrip || 0} onChange={e => update('scrip', parseInt(e.target.value) || 0)}
                style={{ width: 60, fontFamily: C.font, fontSize: 14, fontWeight: 700, background: 'transparent', border: 'none', borderBottom: `1px solid ${C.border}`, outline: 'none', textAlign: 'center' }} />
            </div>
            <div style={{ fontFamily: C.font, fontSize: 8, color: C.muted }}>Paid out per mission (5: success, 3: spare, -1: failure, +3 advance)</div>
          </SectionBox>

          {/* Advancement */}
          <div>
            <SectionBox title="ADVANCEMENT">
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 10 }}>
                <div>
                  <div style={{ fontFamily: C.fontSans, fontSize: 11, fontWeight: 700 }}>XP:</div>
                  <CircleRow count={10} filled={sheet.xp || 0} onToggle={i => update('xp', i < (sheet.xp || 0) ? i : i + 1)} size={16} />
                </div>
                <div>
                  <div style={{ fontFamily: C.fontSans, fontSize: 11, fontWeight: 700 }}>ADVANCES:</div>
                  <CircleRow count={3} filled={sheet.advances || 0} onToggle={i => update('advances', i < (sheet.advances || 0) ? i : i + 1)} size={20} />
                </div>
              </div>
              <div style={{ fontFamily: C.font, fontSize: 8, color: C.muted, marginBottom: 6 }}>At the end of each session, answer each question, then mark xp. Cash an advance when filled.</div>
              {['Did you survive?', 'Did you follow your first agenda item?', 'Did you follow at least one bolded agenda item?', 'Did you take an injury or affliction?'].map((q, i) => (
                <div key={i} style={{ fontFamily: C.font, fontSize: 9, color: C.mid, paddingLeft: 12, marginBottom: 2 }}>• {q}</div>
              ))}
            </SectionBox>

            <SectionBox title="DIVINE AGONY — PATHOS">
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: C.font, fontSize: 8, color: C.muted, lineHeight: 1.6 }}>
                    When you take no successes on a roll, gain an affliction, fill out a hook, gain an injury, or an exorcist dies or suffers sin overflow, store a pathos.<br />
                    Once a session, burn all pathos to add one extra die per pathos burned.
                  </div>
                </div>
                <div style={{ textAlign: 'center', minWidth: 80 }}>
                  <div style={{ fontFamily: C.fontSans, fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 6 }}>PATHOS</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                    <button onClick={() => update('pathos', Math.max(0, (sheet.pathos || 0) - 1))}
                      style={{ width: 28, height: 28, border: `1px solid ${C.borderDark}`, background: 'transparent', fontFamily: C.font, fontSize: 18, cursor: 'pointer', color: C.dark, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                    <div style={{ fontFamily: C.fontSans, fontSize: 28, fontWeight: 900, minWidth: 28, textAlign: 'center', color: C.dark }}>{sheet.pathos || 0}</div>
                    <button onClick={() => update('pathos', (sheet.pathos || 0) + 1)}
                      style={{ width: 28, height: 28, border: `1px solid ${C.borderDark}`, background: 'transparent', fontFamily: C.font, fontSize: 18, cursor: 'pointer', color: C.dark, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                  </div>
                  <div style={{ fontFamily: C.font, fontSize: 7, color: C.muted, marginTop: 4 }}>Clear after session end</div>
                </div>
              </div>
            </SectionBox>
          </div>
        </div>

        {/* ── Row 4: Agenda + Blasphemy ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>

          <SectionBox title="REGISTERED ABILITIES — AGENDA">
            <div style={{ fontFamily: C.font, fontSize: 9, color: C.muted, marginBottom: 6 }}>Describe registered agenda here. Swap agendas between missions. Keep any bolded items.</div>
            <textarea value={sheet.agendaDescription || ''} onChange={e => update('agendaDescription', e.target.value)} rows={4} placeholder="Agenda description..."
              style={{ width: '100%', background: 'rgba(0,0,0,0.03)', border: `1px solid ${C.border}`, fontFamily: C.font, fontSize: 10, padding: 4, marginBottom: 8 }} />
            <div style={{ fontFamily: C.fontSans, fontSize: 9, fontWeight: 700, color: C.mid, marginBottom: 4 }}>AGENDA ITEMS:</div>
            <textarea value={sheet.agendaItems || ''} onChange={e => update('agendaItems', e.target.value)} rows={4} placeholder="Agenda items..."
              style={{ width: '100%', background: 'rgba(0,0,0,0.03)', border: `1px solid ${C.border}`, fontFamily: C.font, fontSize: 10, padding: 4 }} />
            <div style={{ fontFamily: C.fontSans, fontSize: 9, fontWeight: 700, color: C.mid, marginTop: 8, marginBottom: 4 }}>AGENDA ABILITIES (spend advance, 5 max):</div>
            <textarea value={sheet.agendaAbilities || ''} onChange={e => update('agendaAbilities', e.target.value)} rows={4}
              style={{ width: '100%', background: 'rgba(0,0,0,0.03)', border: `1px solid ${C.border}`, fontFamily: C.font, fontSize: 10, padding: 4 }} />
          </SectionBox>

          <div>
            <SectionBox title="BLASPHEMY">
              <div style={{ fontFamily: C.font, fontSize: 9, color: C.muted, marginBottom: 6 }}>Describe registered psychic phenomena. Keep sticker attached at all times.</div>
              <textarea value={sheet.blasphemyDescription || ''} onChange={e => update('blasphemyDescription', e.target.value)} rows={4} placeholder="Blasphemy description..."
                style={{ width: '100%', background: 'rgba(0,0,0,0.03)', border: `1px solid ${C.border}`, fontFamily: C.font, fontSize: 10, padding: 4, marginBottom: 8 }} />
              <div style={{ fontFamily: C.fontSans, fontSize: 8, fontWeight: 700, color: C.mid, marginBottom: 4 }}>PASSIVE:</div>
              <textarea value={sheet.blasphemyPassive || ''} onChange={e => update('blasphemyPassive', e.target.value)} rows={3}
                style={{ width: '100%', background: 'rgba(0,0,0,0.03)', border: `1px solid ${C.border}`, fontFamily: C.font, fontSize: 10, padding: 4 }} />
              <div style={{ fontFamily: C.fontSans, fontSize: 9, fontWeight: 700, color: C.mid, marginTop: 8, marginBottom: 4 }}>OBSERVED POWERS (spend advance for each):</div>
              {(sheet.observedPowers || ['', '', '', '']).map((p, i) => (
                <div key={i} style={{ marginBottom: 6 }}>
                  <div style={{ fontFamily: C.fontSans, fontSize: 7, color: C.muted, borderLeft: `3px solid ${C.border}`, paddingLeft: 6 }}>OBSERVED POWER {i + 1}</div>
                  <textarea value={p} rows={2} onChange={e => { const ops = [...(sheet.observedPowers || ['', '', '', ''])]; ops[i] = e.target.value; update('observedPowers', ops); }}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.03)', border: `1px solid ${C.border}`, fontFamily: C.font, fontSize: 10, padding: 4, marginTop: 2 }} />
                </div>
              ))}
            </SectionBox>
          </div>
        </div>

        </div> {/* end LEFT COLUMN */}

        {/* ── RIGHT COLUMN: Dice Roller (sticky) ── */}
        <div style={{ position: 'sticky', top: 12, alignSelf: 'flex-start' }}>
          <div style={{ border: `1px solid ${C.borderDark}`, marginBottom: 10 }}>
            <div style={{ background: C.dark, color: '#f2ede3', fontFamily: C.fontSans, fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', padding: '2px 8px', textTransform: 'uppercase' }}>DICE ROLLER</div>
            <div style={{ padding: '10px' }}>
              <CainDiceRoller sheet={sheet} system="CAIN" characterName={character.name} />
            </div>
          </div>
        </div>

        </div> {/* end 2-col grid */}

        {/* Footer stamp */}
        <div style={{ marginTop: 12, textAlign: 'center', fontFamily: C.font, fontSize: 8, color: C.muted, borderTop: `1px solid ${C.border}`, paddingTop: 6 }}>
          Report all changes to dormitory supervisor (see code C664) &nbsp;|&nbsp; If you suspect you are cursed, call 994 immediately &nbsp;|&nbsp; As above, so below &nbsp;|&nbsp; CASTLE
        </div>
      </div>
    </div>
  );
}
