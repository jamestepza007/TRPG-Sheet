import { useState, useEffect } from 'react';

const STORAGE_KEY = 'trpg_textarea_fontsize';
const MIN = 8;
const MAX = 18;
const DEFAULT = 11;

function getSize() {
  try { return parseInt(localStorage.getItem(STORAGE_KEY)) || DEFAULT; }
  catch { return DEFAULT; }
}

function applySize(size) {
  let style = document.getElementById('trpg-fontsize-style');
  if (!style) {
    style = document.createElement('style');
    style.id = 'trpg-fontsize-style';
    document.head.appendChild(style);
  }
  style.textContent = `textarea:not(.sticker-textarea) { font-size: ${size}px !important; }`;
}

export default function FontSizeControl({ dark = false }) {
  const [size, setSize] = useState(getSize);

  useEffect(() => { applySize(size); }, [size]);

  const change = (delta) => {
    setSize(prev => {
      const next = Math.min(MAX, Math.max(MIN, prev + delta));
      try { localStorage.setItem(STORAGE_KEY, next); } catch {}
      return next;
    });
  };

  const bg = dark ? 'rgba(20,14,4,0.92)' : 'rgba(242,237,227,0.95)';
  const border = dark ? '#3a2a10' : '#999';
  const color = dark ? '#c9a84c' : '#1a1a1a';
  const btnBg = dark ? '#1a1208' : '#e8e2d4';

  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20, zIndex: 500,
      display: 'flex', alignItems: 'center', gap: 6,
      background: bg, border: `1px solid ${border}`,
      padding: '5px 10px', borderRadius: 4,
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      userSelect: 'none',
    }}>
      <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color, opacity: 0.7 }}>A</span>
      <button onClick={() => change(-1)}
        style={{ width: 22, height: 22, border: `1px solid ${border}`, background: btnBg, color, cursor: 'pointer', fontFamily: "'Courier New', monospace", fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>−</button>
      <span style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color, minWidth: 22, textAlign: 'center' }}>{size}</span>
      <button onClick={() => change(1)}
        style={{ width: 22, height: 22, border: `1px solid ${border}`, background: btnBg, color, cursor: 'pointer', fontFamily: "'Courier New', monospace", fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>+</button>
      <span style={{ fontFamily: "'Courier New', monospace", fontSize: 12, color, opacity: 0.7 }}>A</span>
    </div>
  );
}
