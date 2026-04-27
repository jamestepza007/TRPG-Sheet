import { useState, useRef, useCallback, useEffect } from 'react';

// ── StickerLayer ─────────────────────────────────────────────────
// Floating sticker overlay for character sheets.
// Stickers can be dragged, resized, and deleted.
// Supports PNG, JPG, WebP, GIF (via URL or file upload).

const MIN_SIZE = 40;
const MAX_SIZE = 600;

function Sticker({ sticker, onUpdate, onDelete, isSelected, onSelect }) {
  const dragRef = useRef(null);
  const resizeRef = useRef(null);

  const startDrag = useCallback((e) => {
    if (e.target.closest('.sticker-handle')) return;
    e.preventDefault();
    onSelect();
    const startX = e.clientX - sticker.x;
    const startY = e.clientY - sticker.y;
    const onMove = (ev) => {
      onUpdate({ x: ev.clientX - startX, y: ev.clientY - startY });
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [sticker.x, sticker.y, onUpdate, onSelect]);

  const startResize = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startW = sticker.width;
    const onMove = (ev) => {
      const newW = Math.min(MAX_SIZE, Math.max(MIN_SIZE, startW + (ev.clientX - startX)));
      onUpdate({ width: newW });
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [sticker.width, onUpdate]);

  return (
    <div
      onMouseDown={startDrag}
      onClick={onSelect}
      style={{
        position: 'absolute',
        left: sticker.x,
        top: sticker.y,
        width: sticker.width,
        userSelect: 'none',
        cursor: 'grab',
        zIndex: isSelected ? 50 : 10,
        filter: isSelected ? 'drop-shadow(0 0 6px rgba(0,0,0,0.4))' : 'none',
      }}
    >
      <img
        src={sticker.src}
        alt=""
        draggable={false}
        style={{ width: '100%', display: 'block', pointerEvents: 'none' }}
      />

      {/* Controls — only show when selected */}
      {isSelected && (
        <>
          {/* Delete button */}
          <button
            className="sticker-handle"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            style={{
              position: 'absolute', top: -10, right: -10,
              width: 22, height: 22, borderRadius: 0,
              background: '#cc2222', color: '#fff', border: 'none',
              fontSize: 11, lineHeight: '22px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, zIndex: 10,
            }}>×</button>

          {/* Resize handle — bottom-right */}
          <div
            className="sticker-handle"
            onMouseDown={startResize}
            style={{
              position: 'absolute', bottom: -8, right: -8,
              width: 18, height: 18, borderRadius: '50%',
              background: '#fff', border: '2px solid #333',
              cursor: 'se-resize', zIndex: 10,
              boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
            }}
          />

          {/* Outline */}
          <div style={{
            position: 'absolute', inset: -2,
            border: '2px dashed rgba(100,140,255,0.7)',
            borderRadius: 3, pointerEvents: 'none',
          }} />
        </>
      )}
    </div>
  );
}

export default function StickerLayer({ stickers = [], onChange, containerRef }) {
  const [selectedId, setSelectedId] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [urlError, setUrlError] = useState('');
  const fileRef = useRef(null);

  // Deselect when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('.sticker-item') && !e.target.closest('.sticker-panel')) {
        setSelectedId(null);
      }
    };
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, []);

  const addSticker = useCallback((src) => {
    const id = Date.now() + Math.random();
    const rect = containerRef?.current?.getBoundingClientRect();
    const x = rect ? Math.random() * Math.max(0, rect.width - 150) : 100;
    const y = rect ? Math.random() * Math.max(0, rect.height - 150) : 100;
    const newSticker = { id, src, x, y, width: 120 };
    onChange([...stickers, newSticker]);
    setSelectedId(id);
    setShowPanel(false);
    setUrlInput('');
    setUrlError('');
  }, [stickers, onChange, containerRef]);

  const handleFile = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setUrlError('ไฟล์ใหญ่เกิน 5MB กรุณาใช้ URL แทน');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => addSticker(ev.target.result);
    reader.readAsDataURL(file);
  }, [addSticker]);

  const handleUrl = useCallback(() => {
    const url = urlInput.trim();
    if (!url) return;
    // Basic URL check
    if (!url.startsWith('http') && !url.startsWith('data:')) {
      setUrlError('URL ไม่ถูกต้อง');
      return;
    }
    // Test image loads
    const img = new Image();
    img.onload = () => addSticker(url);
    img.onerror = () => setUrlError('โหลดรูปไม่ได้ ลองใช้ URL อื่น');
    img.src = url;
  }, [urlInput, addSticker]);

  const updateSticker = useCallback((id, patch) => {
    onChange(stickers.map(s => s.id === id ? { ...s, ...patch } : s));
  }, [stickers, onChange]);

  const deleteSticker = useCallback((id) => {
    onChange(stickers.filter(s => s.id !== id));
    setSelectedId(null);
  }, [stickers, onChange]);

  return (
    <>
      {/* Sticker items */}
      {stickers.map(s => (
        <div key={s.id} className="sticker-item" style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0 }}>
          <Sticker
            sticker={s}
            isSelected={selectedId === s.id}
            onSelect={() => setSelectedId(s.id)}
            onUpdate={(patch) => updateSticker(s.id, patch)}
            onDelete={() => deleteSticker(s.id)}
          />
        </div>
      ))}

      {/* Add sticker button */}
      <div className="sticker-panel" style={{ position: 'fixed', bottom: 80, right: 20, zIndex: 200 }}>
        <button
          onClick={() => setShowPanel(p => !p)}
          title="เพิ่ม Sticker"
          style={{
            background: showPanel ? '#1a1a1a' : 'rgba(26,26,26,0.85)',
            border: '1px solid #444',
            borderRadius: '50%',
            width: 40, height: 40,
            fontSize: 18, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
            color: '#fff',
            backdropFilter: 'blur(4px)',
          }}>
          🌟
        </button>

        {showPanel && (
          <div style={{
            position: 'fixed', bottom: 128, right: 20,
            background: '#fff', border: '1px solid #ddd',
            borderRadius: 10, padding: 14, width: 240,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            fontFamily: 'sans-serif', fontSize: 12,
          }}>
            <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 11, letterSpacing: '0.08em', color: '#333' }}>
              🌟 เพิ่ม STICKER
            </div>

            {/* URL input */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ color: '#666', marginBottom: 4, fontSize: 10 }}>วาง URL รูป หรือ GIF:</div>
              <div style={{ display: 'flex', gap: 4 }}>
                <input
                  value={urlInput}
                  onChange={e => { setUrlInput(e.target.value); setUrlError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleUrl()}
                  placeholder="https://..."
                  style={{
                    flex: 1, padding: '5px 8px', border: '1px solid #555',
                    borderRadius: 6, fontSize: 11, outline: 'none',
                    background: '#2a2a2a', color: '#f0f0f0',
                  }}
                />
                <button onClick={handleUrl}
                  style={{
                    padding: '5px 10px', background: '#333', color: '#fff',
                    border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 11,
                  }}>OK</button>
              </div>
              {urlError && <div style={{ color: '#cc2222', fontSize: 10, marginTop: 4 }}>{urlError}</div>}
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '10px 0' }}>
              <div style={{ flex: 1, height: 1, background: '#eee' }} />
              <span style={{ color: '#aaa', fontSize: 10 }}>หรือ</span>
              <div style={{ flex: 1, height: 1, background: '#eee' }} />
            </div>

            {/* File upload */}
            <button
              onClick={() => fileRef.current?.click()}
              style={{
                width: '100%', padding: '8px', border: '2px dashed #ddd',
                borderRadius: 8, background: '#fafafa', cursor: 'pointer',
                color: '#666', fontSize: 11, textAlign: 'center',
              }}>
              📁 อัพโหลดรูป / GIF (ไม่เกิน 5MB)
            </button>
            <input
              ref={fileRef} type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleFile}
              style={{ display: 'none' }}
            />

            {stickers.length > 0 && (
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #eee' }}>
                <div style={{ color: '#999', fontSize: 10, marginBottom: 6 }}>
                  {stickers.length} sticker{stickers.length > 1 ? 's' : ''} — คลิกเลือก แล้วกด × ลบ
                </div>
                <button
                  onClick={() => { onChange([]); setSelectedId(null); }}
                  style={{
                    width: '100%', padding: '5px', border: '1px solid #ffcccc',
                    borderRadius: 6, background: '#fff5f5', color: '#cc4444',
                    cursor: 'pointer', fontSize: 10,
                  }}>
                  🗑 ลบทั้งหมด
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
