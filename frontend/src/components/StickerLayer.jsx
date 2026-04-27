import { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

const MAX_SIZE = 800;
const MIN_SIZE = 40;

// ── Helpers ───────────────────────────────────────────────────────
function Sep() {
  return <div style={{ width: 1, height: 20, background: '#444', margin: '0 2px', flexShrink: 0 }} />;
}
function Btn({ onClick, children, active, style = {}, title }) {
  return (
    <button onMouseDown={e => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onClick?.(e); }} title={title}
      style={{ background: active ? '#555' : 'transparent', color: '#ddd', border: 'none', borderRadius: 6, width: 30, height: 30, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...style }}>
      {children}
    </button>
  );
}

// ── Fixed Toolbar (rendered in portal, never rotates) ─────────────
function TextToolbar({ sticker, onUpdate, onDelete }) {
  const fs = sticker.fontSize || 14;
  const rot = Math.round(sticker.rotation || 0);

  const toolbar = (
    <div
      onMouseDown={e => e.stopPropagation()}
      style={{
        position: 'fixed', top: 68, left: '50%', transform: 'translateX(-50%)',
        background: '#222', borderRadius: 10, boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', gap: 2, padding: '4px 8px',
        zIndex: 9999, border: '1px solid #3a3a3a',
      }}>
      {/* Font size */}
      <Btn onClick={() => onUpdate({ fontSize: Math.max(8, fs - 2) })}>−</Btn>
      <span style={{ color: '#aaa', fontSize: 11, minWidth: 24, textAlign: 'center', userSelect: 'none' }}>{fs}</span>
      <Btn onClick={() => onUpdate({ fontSize: Math.min(72, fs + 2) })}>+</Btn>
      <Sep />
      {/* Bold / Italic */}
      <Btn active={sticker.bold} onClick={() => onUpdate({ bold: !sticker.bold })}
        style={{ fontWeight: 700 }}>B</Btn>
      <Btn active={sticker.italic} onClick={() => onUpdate({ italic: !sticker.italic })}
        style={{ fontStyle: 'italic' }}>I</Btn>
      <Sep />
      {/* Rotation */}
      <Btn onClick={() => onUpdate({ rotation: rot - 15 })} title="หมุนซ้าย">◁</Btn>
      <span style={{ color: '#666', fontSize: 10, minWidth: 26, textAlign: 'center', userSelect: 'none' }}>{rot}°</span>
      <Btn onClick={() => onUpdate({ rotation: rot + 15 })} title="หมุนขวา">▷</Btn>
      <Btn onClick={() => onUpdate({ rotation: 0 })} title="reset">↺</Btn>
      <Sep />
      {/* Delete */}
      <Btn onClick={onDelete} style={{ background: '#6a1a1a', color: '#ff8888' }}>✕</Btn>
    </div>
  );
  return createPortal(toolbar, document.body);
}

function ImageToolbar({ sticker, onUpdate, onDelete }) {
  const rot = Math.round(sticker.rotation || 0);
  const toolbar = (
    <div
      onMouseDown={e => e.stopPropagation()}
      style={{
        position: 'fixed', top: 68, left: '50%', transform: 'translateX(-50%)',
        background: '#222', borderRadius: 10, boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', gap: 2, padding: '4px 8px',
        zIndex: 9999, border: '1px solid #3a3a3a', color: '#888', fontSize: 11,
      }}>
      <span style={{ padding: '0 6px', userSelect: 'none' }}>↔ resize มุมขวาล่าง</span>
      <Sep />
      <Btn onClick={() => onUpdate({ rotation: rot - 15 })}>◁</Btn>
      <span style={{ color: '#666', fontSize: 10, minWidth: 26, textAlign: 'center', userSelect: 'none' }}>{rot}°</span>
      <Btn onClick={() => onUpdate({ rotation: rot + 15 })}>▷</Btn>
      <Btn onClick={() => onUpdate({ rotation: 0 })}>↺</Btn>
      <Sep />
      <Btn onClick={onDelete} style={{ background: '#6a1a1a', color: '#ff8888' }}>✕</Btn>
    </div>
  );
  return createPortal(toolbar, document.body);
}

// ── Image Sticker ─────────────────────────────────────────────────
function Sticker({ sticker, onUpdate, onDelete, isSelected, onSelect }) {
  const wrapRef = useRef(null);
  const { x, y, width = 120, rotation = 0 } = sticker;

  const onMouseDown = (e) => {
    if (e.target.dataset.ctrl) return;
    onSelect(); e.preventDefault();
    const ox = x, oy = y, sx = e.clientX, sy = e.clientY;
    const move = ev => onUpdate({ x: ox + ev.clientX - sx, y: oy + ev.clientY - sy });
    const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
    window.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
  };

  const onResize = (e) => {
    e.preventDefault(); e.stopPropagation();
    const sw = width, sx = e.clientX;
    const move = ev => onUpdate({ width: Math.min(MAX_SIZE, Math.max(MIN_SIZE, sw + ev.clientX - sx)) });
    const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
    window.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
  };

  return (
    <>
      {isSelected && <ImageToolbar sticker={sticker} onUpdate={onUpdate} onDelete={onDelete} />}
      <div ref={wrapRef} onMouseDown={onMouseDown} onClick={onSelect}
        style={{ position: 'absolute', left: x, top: y, width, transform: `rotate(${rotation}deg)`, transformOrigin: 'center', userSelect: 'none', cursor: 'grab', zIndex: isSelected ? 50 : 10 }}>
        <img src={sticker.src} alt="" draggable={false} style={{ width: '100%', display: 'block', pointerEvents: 'none' }} />
        {isSelected && <>
          <div data-ctrl="1" onMouseDown={onResize}
            style={{ position: 'absolute', bottom: -8, right: -8, width: 16, height: 16, background: '#fff', border: '2px solid #4a90e2', borderRadius: '50%', cursor: 'se-resize', zIndex: 10 }} />
          <div style={{ position: 'absolute', inset: -2, border: '2px dashed rgba(74,144,226,0.7)', pointerEvents: 'none' }} />
        </>}
      </div>
    </>
  );
}

// ── Text Sticker ──────────────────────────────────────────────────
function TextSticker({ sticker, onUpdate, onDelete, isSelected, onSelect }) {
  const { x, y, rotation = 0 } = sticker;
  const fs = sticker.fontSize || 14;
  const bg = sticker.bg ?? 'rgba(255,250,200,0.92)';
  const col = sticker.color ?? '#1a1a1a';

  const onMouseDown = (e) => {
    if (e.target.tagName === 'TEXTAREA' && isSelected) return;
    onSelect(); e.preventDefault();
    const ox = x, oy = y, sx = e.clientX, sy = e.clientY;
    const move = ev => onUpdate({ x: ox + ev.clientX - sx, y: oy + ev.clientY - sy });
    const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
    window.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
  };

  return (
    <>
      {isSelected && <TextToolbar sticker={sticker} onUpdate={onUpdate} onDelete={onDelete} />}
      <div onMouseDown={onMouseDown} onClick={onSelect}
        style={{ position: 'absolute', left: x, top: y, transform: `rotate(${rotation}deg)`, transformOrigin: 'center', userSelect: 'none', cursor: 'move', zIndex: isSelected ? 50 : 10, minWidth: 80 }}>
        <textarea
          className="sticker-textarea"
          value={sticker.text || ''}
          onChange={e => onUpdate({ text: e.target.value })}
          style={{
            background: bg,
            border: isSelected ? '2px dashed rgba(74,144,226,0.6)' : '2px solid transparent',
            borderRadius: 4, padding: '6px 10px', minWidth: 80, minHeight: 36,
            fontFamily: "'Courier New', monospace",
            fontSize: fs,
            color: col,
            fontWeight: sticker.bold ? 700 : 400,
            fontStyle: sticker.italic ? 'italic' : 'normal',
            resize: 'both', outline: 'none',
            cursor: isSelected ? 'text' : 'move',
            boxShadow: '2px 3px 10px rgba(0,0,0,0.18)',
            lineHeight: 1.5, display: 'block',
          }}
        />
      </div>
    </>
  );
}

// ── Main StickerLayer ─────────────────────────────────────────────
export default function StickerLayer({ stickers = [], onChange, containerRef }) {
  const [selectedId, setSelectedId] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [urlError, setUrlError] = useState('');
  const fileRef = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (!e.target.closest('.sticker-item') && !e.target.closest('.sticker-panel') && !e.target.closest('[data-sticker-toolbar]'))
        setSelectedId(null);
    };
    window.addEventListener('mousedown', h);
    return () => window.removeEventListener('mousedown', h);
  }, []);

  const getSpawn = useCallback(() => {
    const r = containerRef?.current?.getBoundingClientRect();
    return r
      ? { x: Math.max(20, window.innerWidth / 2 - r.left - 60), y: Math.max(20, window.scrollY + window.innerHeight / 2 - r.top - 40) }
      : { x: 100, y: 100 };
  }, [containerRef]);

  const addImage = useCallback((src) => {
    const id = Date.now() + Math.random();
    const { x, y } = getSpawn();
    onChange([...stickers, { id, type: 'image', src, x, y, width: 120, rotation: 0 }]);
    setSelectedId(id); setShowPanel(false); setUrlInput(''); setUrlError('');
  }, [stickers, onChange, getSpawn]);

  const addText = useCallback(() => {
    const id = Date.now() + Math.random();
    const { x, y } = getSpawn();
    onChange([...stickers, { id, type: 'text', text: 'พิมพ์ที่นี่...', x, y, rotation: 0, fontSize: 14, bold: false, italic: false, bg: 'rgba(255,250,200,0.92)', color: '#1a1a1a' }]);
    setSelectedId(id); setShowPanel(false);
  }, [stickers, onChange, getSpawn]);

  const handleFile = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setUrlError('ไฟล์ใหญ่เกิน 5MB'); return; }
    const reader = new FileReader();
    reader.onload = ev => addImage(ev.target.result);
    reader.readAsDataURL(file); e.target.value = '';
  };

  const handleUrl = () => {
    const url = urlInput.trim();
    if (!url || !url.startsWith('http')) { setUrlError('URL ไม่ถูกต้อง'); return; }
    const img = new Image();
    img.onload = () => addImage(url);
    img.onerror = () => setUrlError('โหลดรูปไม่ได้');
    img.src = url;
  };

  const update = (id, patch) => onChange(stickers.map(s => s.id === id ? { ...s, ...patch } : s));
  const remove = (id) => { onChange(stickers.filter(s => s.id !== id)); setSelectedId(null); };

  return (
    <>
      {stickers.map(s => (
        <div key={s.id} className="sticker-item" style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0 }}>
          <div style={{ pointerEvents: 'all' }}>
            {s.type === 'text'
              ? <TextSticker sticker={s} isSelected={selectedId === s.id} onSelect={() => setSelectedId(s.id)} onUpdate={p => update(s.id, p)} onDelete={() => remove(s.id)} />
              : <Sticker sticker={s} isSelected={selectedId === s.id} onSelect={() => setSelectedId(s.id)} onUpdate={p => update(s.id, p)} onDelete={() => remove(s.id)} />
            }
          </div>
        </div>
      ))}

      {/* Add panel */}
      <div className="sticker-panel" style={{ position: 'fixed', bottom: 80, right: 20, zIndex: 200 }}>
        <button onClick={() => setShowPanel(p => !p)}
          style={{ background: '#1a1a1acc', border: '1px solid #555', borderRadius: '50%', width: 42, height: 42, fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
          🌟
        </button>
        {showPanel && (
          <div style={{ position: 'fixed', bottom: 132, right: 20, background: '#1e1e1e', border: '1px solid #333', borderRadius: 14, padding: 16, width: 220, boxShadow: '0 8px 32px rgba(0,0,0,0.6)', zIndex: 201, fontFamily: 'sans-serif' }}>
            <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 12, color: '#ccc' }}>🌟 เพิ่ม Sticker</div>
            <button onClick={addText}
              style={{ width: '100%', padding: '9px', border: '1px solid #444', borderRadius: 8, background: '#2a2a2a', cursor: 'pointer', color: '#ddd', fontSize: 12, marginBottom: 10 }}>
              ✍ Text
            </button>
            <div style={{ color: '#666', marginBottom: 5, fontSize: 10 }}>URL รูป / GIF:</div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
              <input value={urlInput} onChange={e => { setUrlInput(e.target.value); setUrlError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleUrl()} placeholder="https://..."
                style={{ flex: 1, padding: '6px 8px', border: '1px solid #3a3a3a', borderRadius: 8, fontSize: 11, outline: 'none', background: '#2a2a2a', color: '#eee' }} />
              <button onClick={handleUrl}
                style={{ padding: '6px 12px', background: '#3a3a3a', color: '#ddd', border: '1px solid #555', borderRadius: 8, cursor: 'pointer', fontSize: 11 }}>OK</button>
            </div>
            {urlError && <div style={{ color: '#e06060', fontSize: 10, marginBottom: 6 }}>{urlError}</div>}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '10px 0' }}>
              <div style={{ flex: 1, height: 1, background: '#333' }} />
              <span style={{ color: '#444', fontSize: 10 }}>หรือ</span>
              <div style={{ flex: 1, height: 1, background: '#333' }} />
            </div>
            <button onClick={() => fileRef.current?.click()}
              style={{ width: '100%', padding: '9px', border: '1px dashed #3a3a3a', borderRadius: 8, background: '#2a2a2a', cursor: 'pointer', color: '#888', fontSize: 11 }}>
              📁 อัพโหลดไฟล์ (≤5MB)
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
            {stickers.length > 0 && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #2a2a2a' }}>
                <button onClick={() => { onChange([]); setSelectedId(null); }}
                  style={{ width: '100%', padding: '6px', border: '1px solid #4a2020', borderRadius: 8, background: '#2a1a1a', color: '#cc5555', cursor: 'pointer', fontSize: 11 }}>
                  🗑 ลบทั้งหมด ({stickers.length})
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
